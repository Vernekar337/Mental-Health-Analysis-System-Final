const mongoose = require("mongoose")

const MHIndexHistorySchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  mhIndex: {
    type: Number,
    required: true
  },

  severity: {
    type: String,
    required: true
  },

  sourceAssessment: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model(
  "MHIndexHistory",
  MHIndexHistorySchema
)