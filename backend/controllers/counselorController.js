const User = require("../models/User")
const AnalysisResult = require("../models/AnalysisResult")
const AssessmentResponse = require("../models/AssessmentResponse")
const Suggestion = require("../models/Suggestion")

const getPublicCases = async (req, res) => {

  try {

    // find all students whose profiles are public
    const students = await User.find({
      role: "student",
      isProfilePublic: true
    })

    const cases = []

    for (let student of students) {

      const analysis = await AnalysisResult
        .findOne({ userId: student._id })
        .sort({ createdAt: -1 })

      const response = await AssessmentResponse
        .findOne({ userId: student._id })
        .sort({ createdAt: -1 })

      cases.push({

        studentId: student._id,
        studentName: student.name,

        mhIndex: analysis ? analysis.mhIndex : null,

        severity: response ? response.severity : "Unknown",

        lastAssessmentDate: response ? response.createdAt : null

      })

    }

    res.json({
      success: true,
      cases
    })

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    })

  }

}

const writeSuggestion = async (req, res) => {

  try {

    const counselorId = req.user._id
    const { studentId, message } = req.body

    const suggestion = await Suggestion.create({
      studentId,
      counselorId,
      message
    })

    res.json({
      success: true,
      suggestion
    })

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    })

  }

}

const getStudentSuggestions = async (req, res) => {

  try {

    const studentId = req.user._id

    const suggestions = await Suggestion
      .find({ studentId })
      .populate("counselorId", "name")

    res.json({
      success: true,
      suggestions
    })

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    })

  }

}

module.exports = { getPublicCases, writeSuggestion, getStudentSuggestions }