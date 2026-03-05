const AssessmentResponse = require("../models/AssessmentResponse")
const AnalysisResult = require("../models/AnalysisResult")

const { computeScores } = require("../services/scoringService")
const { generateAnalysis } = require("../services/analysisService")
const { evaluateAlerts } = require("../services/alertService")

const assessmentConfig = require("../services/assessmentConfig")
const {
 computeCombinedMHIndex
} = require("../services/mhIndexService")

const createAssessment = async (req, res) => {

  try {

    const { assessmentType, responses } = req.body

    const rules = assessmentConfig[assessmentType]

    if (!rules) {
      return res.status(400).json({
        success: false,
        message: "Invalid assessment type"
      })
    }

    
    if (rules.type === "quantitative") {

      const { totalScore, severity } = computeScores(assessmentType,responses)

      const responseDoc = await AssessmentResponse.create({
        userId: req.user._id,
        assessmentType,
        responses,
        totalScore,
        severity,
        date: new Date()
      })
      await evaluateAlerts(req.user._id, severity)
      const combined = await computeCombinedMHIndex(req.user._id)

      const mhIndex =
      combined ? combined.mhIndex : null

      const analysisMetrics =
        await generateAnalysis(req.user._id, mhIndex)

      await AnalysisResult.create({

        userId: req.user._id,
        assessmentId: responseDoc._id,

        mhIndex,
        severity,

        trend: analysisMetrics.trend,
        anomalyDetected: analysisMetrics.anomalyDetected,
        clusterLabel: analysisMetrics.clusterLabel,
        predictedTrajectory: analysisMetrics.predictedTrajectory,

        mhIndexBreakdown: combined ? combined.breakdown : {}
      })

      

      return res.status(201).json({
        success: true,
        responseId: responseDoc._id,
        mhIndex,
        severity
      })

    }

  
    if (rules.type === "qualitative") {

      const responseDoc = await AssessmentResponse.create({

        userId: req.user._id,
        assessmentType,
        responses,
        totalScore: null,
        severity: "Reflection",
        date: new Date()

      })
      const combined = await computeCombinedMHIndex(req.user._id)

      const mhIndex = combined ? combined.mhIndex : null

      return res.status(201).json({
        success: true,
        message: "Reflection responses saved",
        responseId: responseDoc._id
      })

    }

  } catch (err) {

    console.error(err)

    res.status(500).json({
      success: false,
      message: err.message
    })

  }

}

module.exports = { createAssessment }