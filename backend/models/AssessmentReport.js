const mongoose = require("mongoose")

const assessmentReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assessmentType: String, // PHQ9, GAD7
    totalScore: Number,
    severity: String,
    summary: String, // generated text report
    generatedAt: Date
  },
  { timestamps: true }
)

module.exports = mongoose.model("AssessmentReport", assessmentReportSchema)
