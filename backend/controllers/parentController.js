const AnalysisResult = require("../models/AnalysisResult")
const AssessmentResponse = require("../models/AssessmentResponse")
const { generateParentRecommendations } = require("../services/llmService")

const User = require("../models/User")

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


const linkChild = async (req, res) => {
  try {
    const parentId = req.user._id
    const { childEmail } = req.body

    const child = await User.findOne({
      email: childEmail,
      role: "student"
    })

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      })
    }

    // update student
    child.parentId = parentId
    await child.save()

    // update parent
    await User.findByIdAndUpdate(parentId, {
      $addToSet: { children: child._id }
    })

    res.json({
      success: true,
      message: "Child linked successfully",
      childId: child._id
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}


module.exports = { getParentRecommendations, linkChild }