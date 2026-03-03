const AnalysisResult = require("../models/AnalysisResult")
const AssessmentResponse = require("../models/AssessmentResponse")
const { generateParentRecommendations } = require("../services/llmService")

const getParentRecommendations = async (req, res) => {
  try {
    const { childId } = req.params

    // Get child's latest analysis
    const latestAnalysis = await AnalysisResult.findOne({ userId: childId })
      .sort({ createdAt: -1 })

    const latestResponse = await AssessmentResponse.findOne({ userId: childId })
      .sort({ createdAt: -1 })

    if (!latestAnalysis) {
      return res.json({
        recommendation: "No data available for this child yet."
      })
    }

    const recommendation = await generateParentRecommendations({
      mhIndex: latestAnalysis.mhIndex,
      severity: latestResponse?.severity || "Mild",
      trend: "stable"
    })

    res.json({ recommendation })

  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getParentRecommendations }