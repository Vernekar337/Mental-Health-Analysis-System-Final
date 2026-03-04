const mongoose = require("mongoose")

const suggestionSchema = new mongoose.Schema({

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  counselorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  message: {
    type: String,
    required: true
  }

}, { timestamps: true })

module.exports = mongoose.model("Suggestion", suggestionSchema)