const Assessment = require("../models/Assessment")
const AnalysisResult = require("../models/AnalysisResult")
const { computeScores } = require("../services/scoringService")
const { generateAnalysis } = require("../services/analysisService")
const { evaluateAlerts } = require("../services/alertService")

// POST /api/assessments
const AssessmentResponse = require("../models/AssessmentResponse")


const createAssessment = async (req, res) => {
  try {
    const { assessmentType, responses } = req.body

    const { totalScore, severity, mhIndex } =
      computeScores(assessmentType, responses)

    // Save response
    const responseDoc = await AssessmentResponse.create({
      userId: req.user._id,
      assessmentType,
      responses,
      totalScore,
      severity,
      date: new Date()
    })

    // Save analysis (for dashboard/report)
    const analysis = await AnalysisResult.create({
      userId: req.user._id,
      assessmentId: responseDoc._id,
      mhIndex,
      severity,
      trend: "stable", // we update later
      anomalyDetected: false,
  clusterLabel: "normal",
  predictedTrajectory: "stable",
  mhIndexBreakdown: {
    anxiety: mhIndex,
    depression: mhIndex,
    stress: mhIndex
  }
    })

    // Alerts
    await evaluateAlerts(req.user, severity)

    res.status(201).json({
      success: true,
      responseId: responseDoc._id,
      mhIndex,
      severity
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { createAssessment }

