const mongoose = require("mongoose")

const chatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
})

module.exports = mongoose.model("ChatRoom", chatRoomSchema)