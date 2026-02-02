const mongoose = require("mongoose")

const journalEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    title: {
      type: String,
      trim: true
    },

    content: {
      type: String,
      required: true
    },

    moodScore: {
      type: Number,
      min: 1,
      max: 10
    },

    date: {
      type: Date,
      required: true,
      index: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("JournalEntry", journalEntrySchema)
