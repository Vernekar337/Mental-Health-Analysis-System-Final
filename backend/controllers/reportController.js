const AnalysisResult = require("../models/AnalysisResult")
const AssessmentResponse = require("../models/AssessmentResponse")

/*
GET /api/reports/dashboard
Student dashboard summary
*/
const getDashboardReport = async (req, res) => {

  try {

    const latest = await AnalysisResult
      .findOne({ userId: req.user._id })
      .sort({ createdAt: -1 })

    if (!latest) {
      return res.json({
        mhIndex: null,
        severity: null,
        trend: "stable",
        insights: [],
        caseStatus: "None"
      })
    }

    res.json({
      mhIndex: latest.mhIndex,
      severity: latest.severity,
      trend: latest.trend,
      insights: latest.mhIndexBreakdown || [],
      caseStatus: latest.anomalyDetected ? "Pending Review" : "Normal"
    })

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    })

  }

}

/*
GET /api/reports/history
Trend chart data
*/
const getHistory = async (req, res) => {

  try {

    const history = await AnalysisResult
      .find({ userId: req.user._id })
      .sort({ createdAt: 1 })

    const formatted = history.map(item => ({
      date: item.createdAt.toISOString().split("T")[0],
      mhIndex: item.mhIndex
    }))

    res.json(formatted)

  } catch (err) {

    res.status(500).json({
      success:false,
      message:err.message
    })

  }

}

module.exports = {
  getDashboardReport,
  getHistory
}