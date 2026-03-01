const mongoose = require("mongoose")

const moodEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    moodScore: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },

    moodLabel: {
      type: String,
      required: true
      // e.g. "happy", "sad", "anxious"
    },

    note: {
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

module.exports = mongoose.model("MoodEntry", moodEntrySchema)
