const AssessmentResponse = require("../models/AssessmentResponse")
const { scoreAssessment } = require("../utils/assessmentScoring")


exports.submitAssessment = async (req, res) => {
  const { assessmentType, responses, date } = req.body

  if (!assessmentType || !responses || !date) {
    return res.status(400).json({
      message: "assessmentType, responses and date are required"
    })
  }

  try {
    const { totalScore, severity } = scoreAssessment(
      assessmentType,
      responses
    )

    const assessment = await AssessmentResponse.create({
      userId: req.user._id,
      assessmentType,
      responses,
      totalScore,
      severity,
      date
    })

    res.status(201).json(assessment)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}


exports.getAssessmentsByType = async (req, res) => {
  const assessments = await AssessmentResponse.find({
    userId: req.user._id,
    assessmentType: req.params.type
  }).sort({ date: -1 })

  res.json(assessments)
}
