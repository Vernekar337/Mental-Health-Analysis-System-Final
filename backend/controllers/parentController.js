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

const getChildReport = async (req, res) => {

  try {

    const parentId = req.user._id

    // find linked child
    const child = await User.findOne({
      parentId: parentId,
      role: "student"
    })

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "No child linked"
      })
    }

    // fetch latest analysis
    const latestAnalysis =
      await AnalysisResult
      .findOne({ userId: child._id })
      .sort({ createdAt: -1 })

    // fetch assessment history
    const assessments =
      await AssessmentResponse
      .find({ userId: child._id })
      .sort({ createdAt: -1 })

    res.json({

      success: true,

      child: {
        id: child._id,
        name: child.name,
        age: child.age
      },

      analysis: latestAnalysis,

      assessments

    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      success: false,
      message: err.message
    })

  }

}



const linkChild = async (req, res) => {

  try {

    const { studentId } = req.body

    const parentId = req.user._id

    const student = await User.findById(studentId)

    if (!student || student.role !== "student") {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      })
    }

    // update student
    student.parentId = parentId
    await student.save()

    // update parent
    await User.findByIdAndUpdate(
      parentId,
      { $addToSet: { linkedStudentIds: studentId } }
    )

    res.json({
      success: true,
      message: "Child linked successfully"
    })

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    })

  }

}


module.exports = { getParentRecommendations, linkChild, getChildReport }