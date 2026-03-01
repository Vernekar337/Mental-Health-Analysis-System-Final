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
      ref: "Assessment",
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
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("AnalysisResult", analysisResultSchema)
