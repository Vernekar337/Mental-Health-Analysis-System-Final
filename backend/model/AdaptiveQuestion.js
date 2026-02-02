const mongoose = require("mongoose")

const adaptiveQuestionSchema = new mongoose.Schema(
  {
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssessmentReport"
    },
    questionText: String,
    type: {
      type: String,
      enum: ["MCQ", "PARAGRAPH"]
    },
    options: [String], // only for MCQ
    answer: String // user response
  },
  { timestamps: true }
)

module.exports = mongoose.model("AdaptiveQuestion", adaptiveQuestionSchema)
