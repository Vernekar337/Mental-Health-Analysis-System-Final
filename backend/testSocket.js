const { io } = require("socket.io-client")

const socket = io("http://localhost:5000")

socket.on("connect", () => {

  console.log("Connected:", socket.id)

  socket.emit("joinRoom", "anxiety")

  setTimeout(() => {

    socket.emit("sendMessage", {
      room: "anxiety",
      message: "Hello everyone, I feel anxious today"
    })

  }, 2000)

})

socket.on("newMessage", (data) => {

  console.log("Message received:", data)

})

socket.on("chatHistory", (messages) => {

  console.log("Previous messages:", messages)

})