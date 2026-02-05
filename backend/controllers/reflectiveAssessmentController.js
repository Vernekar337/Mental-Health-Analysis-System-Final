const Assessment = require("../models/Assessment")
const ReflectiveAssessment = require("../models/ReflectiveAssessment")
const { generateReflectiveQuestions } = require("../services/llmService")
const { evaluateAlerts } = require("../services/alertService")

// GET /api/reflective-assessments/pending
const getPendingReflectiveAssessment = async (req, res) => {
  // Latest assessment
  const assessment = await Assessment.findOne({
    userId: req.user._id
  }).sort({ createdAt: -1 })

  if (!assessment) {
    return res.status(404).json({
      success: false,
      message: "No assessments found"
    })
  }

  // Check if reflective assessment already exists
  const existing = await ReflectiveAssessment.findOne({
    sourceAssessmentId: assessment._id
  })

  if (existing) {
    return res.json({
      questions: existing.generatedQuestions
    })
  }

  // Generate questions via LLM
  const generatedQuestions =
    await generateReflectiveQuestions({
      assessmentType: assessment.assessmentType,
      severityLevel: assessment.severityLevel,
      computedScores: assessment.computedScores
    })

  const reflective = await ReflectiveAssessment.create({
    userId: req.user._id,
    sourceAssessmentId: assessment._id,
    generatedQuestions
  })

  res.json({
    questions: reflective.generatedQuestions
  })
}

// POST /api/reflective-assessments/submit
const submitReflectiveAssessment = async (req, res) => {
  const { responses } = req.body

  if (!responses || !Array.isArray(responses)) {
    return res.status(400).json({
      success: false,
      message: "Invalid responses format"
    })
  }

  const reflective = await ReflectiveAssessment.findOne({
    userId: req.user._id
  }).sort({ createdAt: -1 })

  if (!reflective) {
    return res.status(404).json({
      success: false,
      message: "Reflective assessment not found"
    })
  }

  reflective.responses = responses
  await reflective.save()

  // Re-evaluate alerts using original assessment severity
  const assessment = await Assessment.findById(
    reflective.sourceAssessmentId
  )

  await evaluateAlerts(req.user, assessment.severityLevel)

  res.json({ success: true })
}

module.exports = {
  getPendingReflectiveAssessment,
  submitReflectiveAssessment
}
