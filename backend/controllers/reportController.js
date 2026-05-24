const AnalysisResult = require("../models/AnalysisResult")
const AssessmentResponse = require("../models/AssessmentResponse")
const Insight = require("../models/Insight")
const aiQueue = require("../queues/aiQueue")

/*
  Helper: check if MH index changed enough to warrant new insights
  Only regenerates if: no insight exists, OR mhIndex changed by >=2 points
*/
const shouldRegenerateInsights = (latestInsight, currentMhIndex) => {
  if (!latestInsight) return true
  if (latestInsight.mhIndexAtGeneration === undefined) return true
  return Math.abs(latestInsight.mhIndexAtGeneration - currentMhIndex) >= 2
}

/*
  Helper: queue insight generation in background (non-blocking)
  Passes last 5 assessment reports for better context
*/
const queueInsightGeneration = async (userId, mhIndex, severity, trend, recentAssessments) => {
  try {
    // Mark old insights as stale
    await Insight.updateMany(
      { userId, status: "completed" },
      { status: "stale" }
    )

    const insight = await Insight.create({
      userId,
      status: "pending",
      mhIndexAtGeneration: mhIndex
    })

    await aiQueue.add("insight", {
      type: "insight",
      payload: {
        insightId: insight._id,
        mhIndex,
        severity,
        trend,
        recentAssessments: recentAssessments.map(a => ({
          type: a.assessmentType,
          score: a.totalScore,
          severity: a.severity,
          date: a.createdAt
        }))
      }
    })
  } catch (err) {
    console.error("Failed to queue insight generation:", err.message)
  }
}

/*
-----------------------------------------
GET /api/reports/dashboard
Returns immediately — no LLM wait
-----------------------------------------
*/
const getDashboardReport = async (req, res) => {
  try {
    const userId = req.user._id

    const [latestAnalysis, latestAssessment, recentAssessments, latestInsight] = await Promise.all([
      AnalysisResult.findOne({ userId }).sort({ createdAt: -1 }),
      AssessmentResponse.findOne({
        userId,
        assessmentType: { $in: ["PHQ9", "GAD7", "DASS21"] }
      }).sort({ createdAt: -1 }),
      // Last 5 assessments for insight context
      AssessmentResponse.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5),
      // Latest completed insight (served instantly from cache)
      Insight.findOne({ userId, status: "completed" }).sort({ createdAt: -1 })
    ])

    if (!latestAnalysis) {
      return res.json({
        mhIndex: null,
        severity: "Unknown",
        trend: "-",
        insights: [],
        insightStatus: "no_data",
        caseStatus: "None"
      })
    }

    const severity = latestAssessment?.severity || "Unknown"
    const trend = latestAnalysis.trend || "stable"
    const mhIndex = latestAnalysis.mhIndex

    // Serve cached insights immediately — no waiting
    const cachedInsights = latestInsight?.content
      ? (Array.isArray(latestInsight.content)
          ? latestInsight.content
          : latestInsight.content.split("\n").filter(Boolean))
      : []

    // Decide if we need to regenerate in the background
    if (shouldRegenerateInsights(latestInsight, mhIndex)) {
      // Fire and forget — does NOT block this response
      queueInsightGeneration(userId, mhIndex, severity, trend, recentAssessments)
    }

    res.json({
      mhIndex,
      severity,
      trend,
      insights: cachedInsights,
      insightStatus: latestInsight ? (shouldRegenerateInsights(latestInsight, mhIndex) ? "regenerating" : "ready") : "generating",
      caseStatus: latestAnalysis.anomalyDetected ? "Pending Review" : "Normal"
    })

  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

/*
-----------------------------------------
GET /api/reports/insights
Poll this separately to get latest insights
Returns instantly from cache, status tells frontend if still generating
-----------------------------------------
*/
const getInsights = async (req, res) => {
  try {
    const userId = req.user._id

    const latestInsight = await Insight.findOne({
      userId,
      status: { $in: ["completed", "pending"] }
    }).sort({ createdAt: -1 })

    if (!latestInsight) {
      return res.json({ status: "no_data", insights: [] })
    }

    if (latestInsight.status === "pending") {
      return res.json({ status: "generating", insights: [] })
    }

    const insights = Array.isArray(latestInsight.content)
      ? latestInsight.content
      : latestInsight.content.split("\n").filter(Boolean)

    res.json({ status: "ready", insights })

  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

/*
-----------------------------------------
GET /api/reports/history
-----------------------------------------
*/
const getHistory = async (req, res) => {
  try {
    const history = await AnalysisResult
      .find({ userId: req.user._id })
      .sort({ createdAt: 1 })

    const formatted = history.map(item => ({
      date: item.createdAt.toISOString().split("T")[0],
      mhIndex: item.mhIndex
    }))

    res.json(formatted)

  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getDashboardReport, getHistory, getInsights }