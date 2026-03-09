const AnalysisResult = require("../models/AnalysisResult")
const AssessmentResponse = require("../models/AssessmentResponse")
const { generateParentRecommendations } = require("../services/llmService")
const User = require("../models/User")
const Reflection = require("../models/ReflectionAnalysis")

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

    const parent = await User.findById(parentId)

    if (!parent || parent.linkedStudentIds.length === 0) {
      return res.json({})
    }

    // Allow selecting specific child
    let studentId = req.query.studentId

    if (!studentId) {
      studentId = parent.linkedStudentIds[0]
    }

    const student = await User.findById(studentId)

    if (!student) {
      return res.json({})
    }

    const latestAnalysis = await AnalysisResult
      .findOne({ userId: studentId })
      .sort({ createdAt: -1 })

    const latestAssessment = await AssessmentResponse
      .findOne({ userId: studentId })
      .sort({ createdAt: -1 })

    const latestReflection = await Reflection
      .findOne({ userId: studentId })
      .sort({ createdAt: -1 })

    const history = await AnalysisResult
      .find({ userId: studentId })
      .sort({ createdAt: 1 })

    const trendData = history.map((item, i) => ({
      name: `${i + 1}`,
      score: item.mhIndex
    }))

    let recommendations = []

if (latestAnalysis) {

  const aiRecommendation = await generateParentRecommendations({
    mhIndex: latestAnalysis.mhIndex,
    severity: latestAssessment?.severity || "Mild",
    trend: latestAnalysis?.predictedTrajectory || "Stable"
  })

  recommendations = aiRecommendation
  .split(/\d+\.\s/)
  .filter(Boolean)

}

    res.json({

      childName: student.name,

      mhIndex: latestAnalysis?.mhIndex || null,

      severity: latestAssessment?.severity || "Unknown",

      riskLevel: latestAnalysis?.anomalyDetected
        ? "High Risk"
        : "Low Risk",

      trend: latestAnalysis?.predictedTrajectory || "Stable",

      counselorName: "System",

      reportDate: latestAssessment?.createdAt || null,

      lastAssessmentDate: latestAssessment?.createdAt || null,

      summary: "Mental health indicators based on latest assessment.",

      studentReflection:
  latestReflection?.analysis ||
  latestReflection?.summary ||
  latestReflection?.reflection ||
  null,

      metrics: {
        mood: "N/A",
        stress: "N/A",
        sleep: "N/A"
      },

      recommendations: recommendations,

      trendData

    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      message: "Failed to fetch parent report"
    })

  }

}



const linkChild = async (req, res) => {

  try {

    const parentId = req.user._id
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        message: "Student email is required"
      })
    }

    const student = await User.findOne({
      email: email.toLowerCase(),
      role: "student"
    })

    if (!student) {
      return res.status(404).json({
        message: "Student account not found"
      })
    }

    if (student.parentId) {
      return res.status(400).json({
        message: "Student is already linked to a parent"
      })
    }

    const parent = await User.findById(parentId)

    if (!parent) {
      return res.status(404).json({
        message: "Parent account not found"
      })
    }

    // 🔹 Link student to parent
    student.parentId = parentId
    await student.save()

    // 🔹 Add student to parent's linkedStudentIds
    if (!parent.linkedStudentIds.includes(student._id)) {
      parent.linkedStudentIds.push(student._id)
      await parent.save()
    }

    res.json({
      success: true,
      student: {
        _id: student._id,
        name: student.name,
        email: student.email
      }
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Failed to link child"
    })

  }

}

const updateChildVisibility = async (req, res) => {

  try {

    const { studentId, isPublic } = req.body
    const parentId = req.user._id

    const student = await User.findOne({
      _id: studentId,
      parentId: parentId
    })

    if (!student) {
      return res.status(404).json({
        message: "Student not found or not linked"
      })
    }

    // Correct field from User schema
    student.isProfilePublic = isPublic

    await student.save()

    res.json({
      success: true,
      isProfilePublic: student.isProfilePublic
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Failed to update visibility"
    })

  }

}

const getLinkedChildren = async (req, res) => {
  try {

    const parentId = req.user._id

    const children = await User.find({
      parentId: parentId,
      role: "student"
    })
      .select("name email isProfilePublic")

    res.json({
  success: true,
  children
})

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Failed to fetch children"
    })

  }
}


module.exports = { getParentRecommendations, linkChild, getChildReport, getLinkedChildren, updateChildVisibility }