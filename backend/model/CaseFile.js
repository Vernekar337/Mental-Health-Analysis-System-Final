const mongoose = require("mongoose")

const caseFileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    triggerReason: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Resolved"],
      default: "Pending"
    },

    counselorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    counselorNotes: {
      type: String
    },

    resolvedAt: {
      type: Date
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("CaseFile", caseFileSchema)
