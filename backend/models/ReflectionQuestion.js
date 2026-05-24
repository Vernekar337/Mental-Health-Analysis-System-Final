const mongoose = require("mongoose")

const schema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  questions: {
    type: [String],
    default: []
  },

  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports =
mongoose.model(
  "ReflectionQuestion",
  schema
)