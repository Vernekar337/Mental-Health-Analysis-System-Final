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
      type: [Number],
      required: true
      // frontend sends array of answers
    },

    totalScore: {
      type: Number,
      required: true
    },

    severity: {
      type: String,
      required: true
      //"mild", "moderate", "severe"
    },

    date: {
      type: Date,
      required: true,
      index: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model(
  "AssessmentResponse",
  assessmentResponseSchema
)
