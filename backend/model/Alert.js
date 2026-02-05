const mongoose = require("mongoose")

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    triggeredBy: {
      type: String,
      required: true
    },

    severity: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    sentTo: {
      type: String,
      required: true
    },

    acknowledged: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Alert", alertSchema)
