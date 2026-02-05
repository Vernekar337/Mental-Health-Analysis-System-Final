const Assessment = require("../models/Assessment")
const AnalysisResult = require("../models/AnalysisResult")
const { computeScores } = require("../services/scoringService")
const { generateAnalysis } = require("../services/analysisService")
const { evaluateAlerts } = require("../services/alertService")

// POST /api/assessments
const createAssessment = async (req, res) => {
  const { assessmentType, rawResponses } = req.body

  if (!assessmentType || !rawResponses) {
    return res.status(400).json({
      success: false,
      message: "Missing assessment data"
    })
  }

  const { computedScores, severityLevel } =
    computeScores(assessmentType, rawResponses)

  const assessment = await Assessment.create({
    userId: req.user._id,
    assessmentType,
    rawResponses,
    computedScores,
    severityLevel
  })

  const analysisPayload = generateAnalysis(
    assessment,
    severityLevel
  )

  const analysis = await AnalysisResult.create({
    userId: req.user._id,
    assessmentId: assessment._id,
    ...analysisPayload
  })

  await evaluateAlerts(req.user, severityLevel)

  res.status(201).json({
    success: true,
    assessmentId: assessment._id,
    analysisId: analysis._id
  })
}

module.exports = { createAssessment }
