const mongoose = require("mongoose")

const moderationLogSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RelaxRoom",
      required: true
    },

    anonymousUserId: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    flaggedReason: {
      type: String
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model(
  "ModerationLog",
  moderationLogSchema
)
