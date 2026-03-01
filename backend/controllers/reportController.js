const AnalysisResult = require("../models/AnalysisResult")
const AssessmentResponse = require("../models/AssessmentResponse")
const User = require("../models/User")

const getLatestReport = async (req, res) => {
  try {
    const userId = req.user._id

    // student basic info
    const user = await User.findById(userId).select("name age")

    // latest analysis
    const analysisRecords = await AnalysisResult.find({ userId })
      .sort({ createdAt: -1 })

    if (analysisRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No report data found"
      })
    }

    const latestAnalysis = analysisRecords[0]

    // all responses
    const responses = await AssessmentResponse.find({ userId })
      .sort({ createdAt: -1 })

    const latestResponse = responses[0]

    // compute trend (same logic as dashboard)
    let trend = "stable"
    if (analysisRecords.length >= 2) {
      const last = analysisRecords[0].mhIndex
      const prev = analysisRecords[1].mhIndex

      if (last > prev) trend = "improving"
      else if (last < prev) trend = "worsening"
    }

    // format assessments
    const formattedAssessments = responses.map(r => ({
      type: r.assessmentType,
      score: r.totalScore,
      severity: r.severity,
      date: r.createdAt
    }))

    res.json({
      student: user,
      mhIndex: latestAnalysis.mhIndex,
      severity: latestResponse?.severity || "Unknown",
      trend,
      assessments: formattedAssessments,
      lastUpdated: latestAnalysis.createdAt
    })

  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getLatestReport }