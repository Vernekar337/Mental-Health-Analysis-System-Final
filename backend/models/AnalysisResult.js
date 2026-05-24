const mongoose = require("mongoose")

const analysisResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    assessmentId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "AssessmentResponse",
  required: true
},

    mhIndex: {
      type: Number,
      required: true
    },

    mhIndexBreakdown: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },

    predictedTrajectory: {
      type: String,
      required: true
    },

    clusterLabel: {
      type: String,
      required: true
    },

    anomalyDetected: {
      type: Boolean,
      required: true
    },

    // In backend/models/AnalysisResult.js — add after anomalyDetected field:
severity: {
  type: String,
  default: null
},

trend: {
  type: String,
  default: "stable"
},
  },
  { timestamps: true }
)

module.exports = mongoose.model("AnalysisResult", analysisResultSchema)
