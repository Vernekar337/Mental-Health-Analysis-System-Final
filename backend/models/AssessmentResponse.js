const mongoose = require("mongoose")

const assessmentResponseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    assessmentType: {
      type: String,
      required: true
      // "PHQ9", "GAD7"
    },

    responses: {
      type: [mongoose.Schema.Types.Mixed],
      required: true
    },

    totalScore: {
    type: Number,
    default: null
  },

    severity: {
      type: String,
      default: null
    },

    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model(
  "AssessmentResponse",
  assessmentResponseSchema
)
