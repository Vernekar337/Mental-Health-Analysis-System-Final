const mongoose = require("mongoose")

const assessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    assessmentType: {
      type: String,
      enum: ["PHQ-9", "GAD-7", "DASS-21"],
      required: true
    },

    rawResponses: {
      type: [Number],
      required: true
    },

    computedScores: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },

    severityLevel: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Assessment", assessmentSchema)
