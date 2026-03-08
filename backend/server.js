const dotenv = require("dotenv")
dotenv.config()

const http = require("http")
const { Server } = require("socket.io")

const connectDB = require("./config/database")
const app = require("./src/app")

const Message = require("./models/Message")

connectDB()

const PORT = process.env.PORT || 5000

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

io.on("connection", (socket) => {
  const roomUsers = {}

  const anonymousId = "User_" + Math.floor(Math.random() * 10000)

  console.log("User connected:", anonymousId)

  // user joins a room chosen on frontend
  socket.on("joinRoom", async (room) => {

  socket.join(room)

  socket.room = room

  console.log(`${anonymousId} joined room ${room}`)

  if (!roomUsers[room]) {
    roomUsers[room] = []
  }

  roomUsers[room].push(anonymousId)

  io.to(room).emit("onlineUsers", roomUsers[room].length)

  try {

    const history = await Message
      .find({ room })
      .sort({ createdAt: 1 })
      .limit(50)

    socket.emit("chatHistory", history)

  } catch (err) {
    console.error(err.message)
  }

})

  // send message
  socket.on("sendMessage", async ({ room, message }) => {

    try {

      const newMessage = await Message.create({
        room,
        anonymousId,
        message
      })

      // broadcast to everyone in that room
      io.to(room).emit("newMessage", newMessage)

    } catch (err) {
      console.error(err.message)
    }

  })

  socket.on("disconnect", () => {

  const room = socket.room

  if (room && roomUsers[room]) {

    roomUsers[room] = roomUsers[room].filter(u => u !== anonymousId)

    io.to(room).emit("onlineUsers", roomUsers[room].length)

  }

  console.log("User disconnected:", anonymousId)

})
  socket.on("typing", () => {

  socket.to(socket.room).emit("userTyping", anonymousId)

})

})

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})