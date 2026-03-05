const mongoose = require("mongoose")

const alertSchema = new mongoose.Schema(
{
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  message: {
    type: String,
    required: true
  },

  severity: {
    type: String,
    enum: ["Low","Moderate","High","Severe"],
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