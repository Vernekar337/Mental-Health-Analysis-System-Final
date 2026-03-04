const axios = require("axios")
const AudioDiary = require("../models/AudioDiary")

const uploadAudio = async (req, res) => {

  try {

    const userId = req.user._id
    const audioPath = req.file.path

    // send audio to python ML service
    const response = await axios.post(
      "http://localhost:8000/predict-audio",
      {
        audioPath
      }
    )

    const { emotion, confidence } = response.data

    const diary = await AudioDiary.create({
      userId,
      audioPath,
      detectedEmotion: emotion,
      confidence
    })

    res.json({
      success: true,
      emotion,
      confidence,
      diaryId: diary._id
    })

  } catch (err) {

    console.error(err.message)

    res.status(500).json({
      success: false,
      message: err.message
    })

  }

}

module.exports = { uploadAudio }