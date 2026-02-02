const mongoose = require("mongoose")

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    activityType: {
      type: String,
      required: true
      //"meditation", "exercise", "therapy"
    },

    durationMinutes: {
      type: Number,
      min: 1
    },

    notes: {
      type: String,
      trim: true
    },

    date: {
      type: Date,
      required: true,
      index: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("ActivityLog", activityLogSchema)
