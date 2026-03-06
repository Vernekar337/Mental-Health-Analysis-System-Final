const AnalysisResult = require("../models/AnalysisResult")
const AssessmentResponse = require("../models/AssessmentResponse")
const axios = require("axios")

/*
-----------------------------------------
Generate Insights using LLM (Ollama)
-----------------------------------------
*/
const generateInsights = async ({ mhIndex, severity, trend }) => {

  try {

    const prompt = `
You are a supportive mental health assistant.

Student mental health summary:

Mental Health Index: ${mhIndex}
Severity Level: ${severity}
Trend: ${trend}

Provide 3 short supportive insights or coping suggestions.

Rules:
- Each insight must be one sentence.
- No explanations.
- No numbering.
- No markdown.
- Each sentence must end with a period.

Example format:

Insight text.
Insight text.
Insight text.
`

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "phi",
        prompt: prompt,
        stream: false
      }
    )

    const text = response.data.response || ""

    const insights = text
      .split("\n")
      .map(i => i.trim())
      .filter(Boolean)

    return insights.slice(0,3)

  }

  catch (err) {

    console.error("LLM Insight Error:", err.message)

    return []

  }

}

/*
-----------------------------------------
GET /api/reports/dashboard
Student Dashboard Summary
-----------------------------------------
*/
const getDashboardReport = async (req, res) => {

  try {

    const latestAnalysis = await AnalysisResult
      .findOne({ userId: req.user._id })
      .sort({ createdAt: -1 })

    const latestAssessment = await AssessmentResponse
      .findOne({ userId: req.user._id, assessmentType: { $in: ["PHQ9","GAD7","DASS21"] }})
      .sort({ createdAt: -1 })

    if (!latestAnalysis) {

      return res.json({
        mhIndex: null,
        severity: "Unknown",
        trend: "-",
        insights: [],
        caseStatus: "None"
      })

    }

    const severity = latestAssessment
      ? latestAssessment.severity
      : "Unknown"

    const trend = latestAnalysis.trend || "stable"

    const insights = await generateInsights({
      mhIndex: latestAnalysis.mhIndex,
      severity,
      trend
    })

    res.json({

      mhIndex: latestAnalysis.mhIndex,

      severity,

      trend,

      insights,

      caseStatus: latestAnalysis.anomalyDetected
        ? "Pending Review"
        : "Normal"

    })

  }

  catch (err) {

    res.status(500).json({
      success:false,
      message:err.message
    })

  }

}

/*
-----------------------------------------
GET /api/reports/insights
LLM Insights (slow endpoint)
-----------------------------------------
*/

const getInsights = async (req, res) => {

  try {

    const latestAnalysis = await AnalysisResult
      .findOne({ userId: req.user._id })
      .sort({ createdAt: -1 })

    const latestAssessment = await AssessmentResponse
      .findOne({ userId: req.user._id })
      .sort({ createdAt: -1 })

    if (!latestAnalysis) {
      return res.json([])
    }

    const severity = latestAssessment
      ? latestAssessment.severity
      : "Unknown"

    const trend = latestAnalysis.trend || "stable"

    const insights = await generateInsights({
      mhIndex: latestAnalysis.mhIndex,
      severity,
      trend
    })

    res.json(insights)

  }

  catch (err) {

    res.status(500).json({
      success:false,
      message:err.message
    })

  }

}

/*
-----------------------------------------
GET /api/reports/history
Chart Data for Dashboard
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

  }

  catch (err) {

    res.status(500).json({
      success:false,
      message:err.message
    })

  }

}

module.exports = {
  getDashboardReport,
  getHistory,
  getInsights
}