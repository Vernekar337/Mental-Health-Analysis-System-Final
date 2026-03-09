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
const aiQueue = require("../queues/aiQueue")

const analyzeAudio = async (req, res) => {

  try {

    const { audioId } = req.body

    await aiQueue.add(

      "audio",

      {
        type: "audio",
        payload: { audioId }
      }

    )

    res.json({
      success: true,
      message: "Audio analysis started"
    })

  }

  catch (err) {

    res.status(500).json({
      message: err.message
    })

  }

}

const renameAudio = async (req, res) => {

  try {

    const { audioId, title } = req.body

    const audio = await AudioDiary.findById(audioId)

    if (!audio) {
      return res.status(404).json({ message: "Audio not found" })
    }

    audio.title = title

    await audio.save()

    res.json({
      success: true,
      audio
    })

  } catch (err) {

    res.status(500).json({
      message: err.message
    })

  }

}


// Get history
const getHistory = async (req, res) => {

  try {

    const history = await AudioDiary
  .find({ userId: req.user._id })
  .sort({ createdAt: -1 })
  .select("emotion confidence mentalState createdAt")

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
  getHistory,
  renameAudio
}