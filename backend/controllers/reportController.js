const Assessment = require("../models/Assessment")
const AnalysisResult = require("../models/AnalysisResult")
const ReflectiveAssessment = require("../models/ReflectiveAssessment")
const CaseFile = require("../models/CaseFile")


const getStudentReport = async (req, res) => {
  
  const assessment = await Assessment.findOne({
    userId: req.user._id
  }).sort({ createdAt: -1 })

  if (!assessment) {
    return res.status(404).json({
      success: false,
      message: "No assessments found"
    })
  }


  const analysis = await AnalysisResult.findOne({
    assessmentId: assessment._id
  })

  if (!analysis) {
    return res.status(500).json({
      success: false,
      message: "Analysis result missing"
    })
  }

  
  const reflective = await ReflectiveAssessment.findOne({
    sourceAssessmentId: assessment._id
  })


  const caseFile = await CaseFile.findOne({
    userId: req.user._id
  }).sort({ createdAt: -1 })


  const report = {
    summary: {
      assessmentType: assessment.assessmentType,
      severityLevel: assessment.severityLevel,
      mhIndex: analysis.mhIndex,
      anomalyDetected: analysis.anomalyDetected
    },

    trends: {
      predictedTrajectory: analysis.predictedTrajectory,
      clusterLabel: analysis.clusterLabel
    },

    explainability: {
      mhIndexBreakdown: analysis.mhIndexBreakdown,
      reflectiveAssessmentCompleted: Boolean(reflective)
    },

    reviewStatus: caseFile
      ? caseFile.status
      : "Not Reviewed"
  }

  res.json(report)
}

module.exports = { getStudentReport }
