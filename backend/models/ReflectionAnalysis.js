const mongoose = require("mongoose")
const ReflectionAnalysisSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  reflectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssessmentResponse"
  },

  signals: {
    stress: String,
    sleepIssues: Boolean,
    academicPressure: Boolean,
    negativeMood: Boolean
  },

  riskLevel: String,

  summary: String,

  createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model("ReflectionAnalysis", ReflectionAnalysisSchema)