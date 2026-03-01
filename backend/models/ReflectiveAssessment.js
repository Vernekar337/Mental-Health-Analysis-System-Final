const mongoose = require("mongoose")

const reflectiveAssessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    sourceAssessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true
    },

    generatedQuestions: {
      type: Array,
      required: true
    },

    responses: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model(
  "ReflectiveAssessment",
  reflectiveAssessmentSchema
)
