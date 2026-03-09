const axios = require("axios")

const analyzeAudioFile = async (filePath) => {

  try {

    const response = await axios.post(
      "http://localhost:8000/predict",
      { filePath }
    )

    return response.data

  } catch (error) {

    console.error("ML analysis error:", error.message)

    throw new Error("Audio analysis failed")

  }

}

module.exports = {
  analyzeAudioFile
}