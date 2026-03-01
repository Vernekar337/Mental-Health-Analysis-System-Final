const AnalysisResult = require("../models/AnalysisResult")
const AssessmentResponse = require("../models/AssessmentResponse")

const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user._id

    // get analysis records
    const analysisRecords = await AnalysisResult.find({ userId })
      .sort({ createdAt: 1 })

    // get response records (for severity)
    const responses = await AssessmentResponse.find({ userId })
      .sort({ createdAt: 1 })

    if (analysisRecords.length === 0) {
      return res.json({
        mhIndex: 100,
        severity: "No Data",
        trend: "stable",
        history: []
      })
    }

    const latestAnalysis = analysisRecords[analysisRecords.length - 1]
    const latestResponse = responses[responses.length - 1]

    // compute trend
    let trend = "stable"
    if (analysisRecords.length >= 2) {
      const last = analysisRecords[analysisRecords.length - 1].mhIndex
      const prev = analysisRecords[analysisRecords.length - 2].mhIndex

      if (last > prev) trend = "improving"
      else if (last < prev) trend = "worsening"
    }

    const history = analysisRecords.map(r => ({
      date: r.createdAt,
      mhIndex: r.mhIndex
    }))

    res.json({
      mhIndex: latestAnalysis.mhIndex,
      severity: latestResponse?.severity || "Unknown",
      trend,
      history
    })

  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getStudentDashboard }