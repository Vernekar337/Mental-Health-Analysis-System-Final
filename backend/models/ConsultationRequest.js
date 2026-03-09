const mongoose = require("mongoose")

const consultationRequestSchema = new mongoose.Schema({

  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  counselorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  message: {
    type: String,
    default: "Parent requested consultation"
  },

  status: {
    type: String,
    default: "pending"
  }

}, { timestamps: true })

module.exports = mongoose.model("ConsultationRequest", consultationRequestSchema)