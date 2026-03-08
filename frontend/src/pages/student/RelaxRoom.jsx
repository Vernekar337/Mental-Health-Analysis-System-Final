import React, { useState, useEffect, useRef } from 'react'
import { io } from "socket.io-client"
import { Users, Send, ArrowLeft, Shield } from 'lucide-react'

const socket = io("http://localhost:5000")

const ROOMS = [
  { id: 1, name: 'general' },
  { id: 2, name: 'academic' },
  { id: 3, name: 'anxiety' },
  { id: 4, name: 'sleep' },
]

const RelaxRoom = () => {

  const [currentRoom, setCurrentRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState("")
  const [myId, setMyId] = useState(null)
  const [typingUser, setTypingUser] = useState(null)
  const [onlineCount, setOnlineCount] = useState(0)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  /* =========================
     JOIN ROOM
  ========================= */

  useEffect(() => {

    if (!currentRoom) return

    socket.emit("joinRoom", currentRoom)
    socket.on("userTyping", (user) => {

      setTypingUser(user)

      setTimeout(() => {
        setTypingUser(null)
      }, 2000)

    })

    socket.on("onlineUsers", (count) => {
      setOnlineCount(count)
    })

    socket.on("chatHistory", (history) => {

      const formatted = history.map(m => ({
        id: m._id,
        text: m.message,
        sender: m.anonymousId,
        isMine: m.anonymousId === myId,
        timestamp: new Date(m.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      }))

      setMessages(formatted)

    })

    socket.on("newMessage", (msg) => {

      if (!myId) {
        setMyId(msg.anonymousId)
      }

      const formatted = {
        id: msg._id,
        text: msg.message,
        sender: msg.anonymousId,
        isMine: msg.anonymousId === myId,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      }

      setMessages(prev => [...prev, formatted])

    })

    return () => {
      socket.off("chatHistory")
      socket.off("newMessage")
    }

  }, [currentRoom, myId])

  /* =========================
     SEND MESSAGE
  ========================= */

  const handleSendMessage = (e) => {

    e.preventDefault()

    if (!inputText.trim()) return

    socket.emit("sendMessage", {
      room: currentRoom,
      message: inputText
    })

    setInputText("")

  }

  /* =========================
     ROOM SELECT SCREEN
  ========================= */

  if (!currentRoom) {

    return (

      <div className="max-w-4xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Relax Room
          </h1>
          <p className="text-slate-500 mt-1">
            Anonymous peer emotional support. No names, no judgment.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start">

          <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />

          <div>
            <h3 className="text-sm font-semibold text-blue-800">
              Community Guidelines
            </h3>

            <p className="text-sm text-blue-700 mt-1">
              Be respectful and kind. Do not share personal information.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {ROOMS.map(room => (

            <button
              key={room.id}
              onClick={() => {
                setCurrentRoom(room.name)
                setMessages([])
              }}
              className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all text-left"
            >

              <div className="flex justify-between items-center mb-2">

                <h3 className="font-semibold text-slate-800">
                  {room.name.toUpperCase()}
                </h3>

                <div className="flex items-center text-slate-400 text-xs bg-slate-100 px-2 py-1 rounded-full">
                  <Users className="w-3 h-3 mr-1" />
                  Live
                </div>

              </div>

              <p className="text-sm text-slate-500">
                Join anonymously
              </p>

            </button>

          ))}

        </div>

      </div>

    )

  }

  /* =========================
     CHAT UI
  ========================= */

  return (

    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">

      {/* Header */}

      <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">

        <div className="flex items-center">

          <button
            onClick={() => setCurrentRoom(null)}
            className="mr-4 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h2 className="font-bold text-slate-800">
              {currentRoom}
            </h2>

            <span className="text-xs text-emerald-600">
              {onlineCount} online
            </span>
          </div>

        </div>

        <div className="text-xs text-slate-400">
          Anonymous Mode
        </div>

      </div>

      {/* Chat Messages */}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">

        {messages.map(msg => (

          <div
            key={msg.id}
            className={`flex ${msg.isMine ? "justify-end" : "justify-start"} animate-message`}
          >

            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg text-sm shadow-sm
              ${msg.isMine
                  ? "bg-emerald-600 text-white rounded-br-none"
                  : "bg-white text-slate-700 border border-slate-200 rounded-bl-none"
                }`}
            >

              <p>{msg.text}</p>

              <p className={`text-[10px] mt-1 text-right
                ${msg.isMine ? "text-emerald-100" : "text-slate-400"}
              `}>
                {msg.timestamp}
              </p>

            </div>

          </div>

        ))}
        {typingUser && (
          <div className="text-xs text-slate-400 italic">
            Someone is typing...
          </div>
        )}

        <div ref={messagesEndRef} />

      </div>

      {/* Input */}

      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white border-t border-slate-200"
      >

        <div className="flex gap-2">

          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value)
              socket.emit("typing")
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>

        </div>

      </form>

    </div>

  )

}

export default RelaxRoom