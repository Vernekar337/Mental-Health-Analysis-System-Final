const AnalysisResult = require("../models/AnalysisResult")
const AssessmentResponse = require("../models/AssessmentResponse")
const { generateReflectionQuestions } = require("../services/reflectionService")

const getReflectionQuestions = async (req, res) => {

  try {

    const questions =
      await generateReflectionQuestions(req.user._id)

    res.json({
      success: true,
      questions
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      success: false,
      message: err.message
    })

  }

}


module.exports = { getReflectionQuestions }