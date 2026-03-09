const mongoose = require("mongoose")

const AudioDiarySchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  filePath: {
    type: String,
    required: true
  },

  emotion: {
    type: String,
    default: null
  },

  confidence: {
    type: Number,
    default: null
  },

  mentalState: {
    type: String,
    default: null
  },

  title: {
  type: String,
  default: "Untitled Diary"
},

  createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model("AudioDiary", AudioDiarySchema)