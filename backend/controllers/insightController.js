const AnalysisResult = require("../models/AnalysisResult")
const AssessmentResponse = require("../models/AssessmentResponse")
const { generateInsights } = require("../services/llmService")

const getInsights = async (req, res) => {
  try {
    const userId = req.user._id

    const latestAnalysis = await AnalysisResult.findOne({ userId })
      .sort({ createdAt: -1 })

    const latestResponse = await AssessmentResponse.findOne({ userId })
      .sort({ createdAt: -1 })

    if (!latestAnalysis) {
      return res.json({ insight: "No data available yet." })
    }

    const insight = await generateInsights({
      mhIndex: latestAnalysis.mhIndex,
      severity: latestResponse?.severity || "Unknown",
      trend: "stable"
    })

    res.json({ insight })

  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getInsights }