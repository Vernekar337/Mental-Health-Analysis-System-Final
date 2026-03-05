module.exports = (io) => {

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id)

    // Student joins a relax room
    socket.on("joinRoom", ({ room }) => {

      socket.join(room)

      console.log(`${socket.id} joined room: ${room}`)

      io.to(room).emit("systemMessage", {
        message: "A user has joined the room",
        time: new Date()
      })

    })

    // Student sends message
    socket.on("sendMessage", ({ room, message }) => {

      console.log(`Message in ${room}:`, message)

      io.to(room).emit("receiveMessage", {
        message,
        sender: socket.id,
        time: new Date()
      })

    })

    socket.on("disconnect", () => {

      console.log("User disconnected:", socket.id)

    })

  })

}