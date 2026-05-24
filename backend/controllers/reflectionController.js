const ReflectionQuestion = require("../models/ReflectionQuestion")
const ReflectionAnalysis = require("../models/ReflectionAnalysis")
const AssessmentResponse = require("../models/AssessmentResponse")
const aiQueue = require("../queues/aiQueue")

const getReflectionQuestions = async (req, res) => {
  try {
    let existing = await ReflectionQuestion.findOne({
      userId: req.user._id
    }).sort({ createdAt: -1 })

    if (existing && existing.status === "completed") {
      return res.json({
        success: true,
        status: "completed",
        questions: existing.questions
      })
    }

    if (existing && existing.status === "pending") {
      return res.json({
        success: true,
        status: "pending",
        questions: []
      })
    }

    const reflection = await ReflectionQuestion.create({
      userId: req.user._id,
      status: "pending"
    })

    await aiQueue.add("reflection-questions", {
      type: "reflection-questions",
      payload: {
        reflectionId: reflection._id,
        userId: req.user._id
      }
    })

    return res.json({
      success: true,
      status: "pending",
      questions: []
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const startReflectionAnalysis = async (req, res) => {
  try {
    const { responses } = req.body

    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({
        success: false,
        message: "responses must be an array"
      })
    }

    const latestAssessment = await AssessmentResponse.findOne({
      userId: req.user._id
    }).sort({ createdAt: -1 })

    const analysis = await ReflectionAnalysis.create({
      userId: req.user._id,
      reflectionId: latestAssessment ? latestAssessment._id : null,
      status: "pending"
    })

    await aiQueue.add("reflection-analysis", {
      type: "reflection-analysis",
      payload: {
        reflectionAnalysisId: analysis._id,
        responses
      }
    })

    return res.json({
      success: true,
      analysisId: analysis._id,
      status: "pending"
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const getReflectionStatus = async (req, res) => {
  try {
    const analysis = await ReflectionAnalysis.findById(req.params.id)

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found"
      })
    }

    return res.json({
      success: true,
      status: analysis.status,
      data: analysis
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

module.exports = {
  getReflectionQuestions,
  startReflectionAnalysis,
  getReflectionStatus
}