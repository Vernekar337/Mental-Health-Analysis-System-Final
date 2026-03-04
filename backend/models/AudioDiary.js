const mongoose = require("mongoose")

const audioDiarySchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  audioPath: {
    type: String
  },

  detectedEmotion: {
    type: String
  },

  confidence: {
    type: Number
  }

}, { timestamps: true })

module.exports = mongoose.model("AudioDiary", audioDiarySchema)