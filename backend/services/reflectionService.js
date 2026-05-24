const AssessmentResponse = require("../models/AssessmentResponse")
const AnalysisResult = require("../models/AnalysisResult")

const generateReflectionQuestions = async (userId) => {
  const latestAnalysis = await AnalysisResult
    .findOne({ userId })
    .sort({ createdAt: -1 })

  const recentAssessments = await AssessmentResponse
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(3)

  // Import here to avoid circular deps
  const { generateReflectionQuestions: llmGenerate } = require("./llmService")

  return await llmGenerate({ userId, latestAnalysis, recentAssessments })
}

module.exports = { generateReflectionQuestions }