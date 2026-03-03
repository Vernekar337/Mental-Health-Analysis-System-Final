const AnalysisResult = require("../models/AnalysisResult")
const AssessmentResponse = require("../models/AssessmentResponse")
const { generateReflectionQuestions } = require("../services/llmService")

const getReflectionQuestions = async (req, res) => {
  try {
    const userId = req.user._id

    const latestAnalysis = await AnalysisResult.findOne({ userId })
      .sort({ createdAt: -1 })

    const latestResponse = await AssessmentResponse.findOne({ userId })
      .sort({ createdAt: -1 })

    if (!latestAnalysis) {
      return res.json({
        questions: [
          "How have you been feeling lately?",
          "What has impacted your mood recently?"
        ]
      })
    }

    const questions = await generateReflectionQuestions({
      mhIndex: latestAnalysis.mhIndex,
      severity: latestResponse?.severity || "Mild",
      trend: "stable"
    })

    res.json({ questions })

  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getReflectionQuestions }