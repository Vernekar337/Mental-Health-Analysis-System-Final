const mongoose = require("mongoose")

const insightSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  mhIndexAtGeneration: {
    type: Number
  },

  severity: { type: String },
  trend: { type: String },

  // Array of insight strings for easy serving
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },

  status: {
    type: String,
    enum: ["pending", "completed", "failed", "stale"],
    default: "pending"
  }

}, { timestamps: true })

module.exports = mongoose.model("Insight", insightSchema)