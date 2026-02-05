const ModerationLog = require("../models/ModerationLog")

const relaxRoomSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("join-room", ({ roomId, anonymousUserId }) => {
      socket.join(roomId)
    })

    socket.on(
      "send-message",
      async ({ roomId, anonymousUserId, message }) => {
        // Emit message to room (ephemeral)
        io.to(roomId).emit("receive-message", {
          anonymousUserId,
          message,
          timestamp: new Date()
        })

        // Simple moderation trigger example
        if (message.toLowerCase().includes("kill")) {
          await ModerationLog.create({
            roomId,
            anonymousUserId,
            message,
            flaggedReason: "Potential self-harm language"
          })
        }
      }
    )

    socket.on("leave-room", ({ roomId }) => {
      socket.leave(roomId)
    })
  })
}

module.exports = relaxRoomSocket
