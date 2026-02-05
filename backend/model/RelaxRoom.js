const mongoose = require("mongoose")

const relaxRoomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("RelaxRoom", relaxRoomSchema)
