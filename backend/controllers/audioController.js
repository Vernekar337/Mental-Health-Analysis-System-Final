const AudioDiary = require("../models/AudioDiary")
const axios = require("axios")

// Upload audio
const uploadAudio = async (req, res) => {

  try {

    const audio = await AudioDiary.create({
      userId: req.user._id,
      filePath: req.file.path
    })

    res.json({
      success: true,
      audioId: audio._id
    })

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    })

  }

}


// Run ML analysis
const analyzeAudio = async (req, res) => {

  try {

    const { audioId } = req.body

    const audio = await AudioDiary.findById(audioId)

    if (!audio) {
      return res.status(404).json({ message: "Audio not found" })
    }

    // Call Python ML API
    const mlResponse = await axios.post(
      "http://localhost:8000/predict-emotion",
      {
        filePath: audio.filePath
      }
    )

    const { emotion, confidence, mentalState } = mlResponse.data

    audio.emotion = emotion
    audio.confidence = confidence
    audio.mentalState = mentalState

    await audio.save()

    res.json({
      emotion,
      confidence,
      mentalState
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      message: "Audio analysis failed"
    })

  }

}


// Get history
const getHistory = async (req, res) => {

  try {

    const history = await AudioDiary
      .find({ userId: req.user._id })
      .sort({ createdAt: -1 })

    res.json({
      history
    })

  } catch (err) {

    res.status(500).json({
      message: err.message
    })

  }

}


module.exports = {
  uploadAudio,
  analyzeAudio,
  getHistory
}