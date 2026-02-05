const RelaxRoom = require("../models/RelaxRoom")

// GET /api/relax-rooms
const getActiveRooms = async (req, res) => {
  const rooms = await RelaxRoom.find({
    isActive: true,
    expiresAt: { $gt: new Date() }
  }).sort({ createdAt: -1 })

  res.json({
    data: rooms
  })
}

// POST /api/relax-rooms
const createRoom = async (req, res) => {
  const { roomName, expiresInMinutes } = req.body

  if (!roomName || !expiresInMinutes) {
    return res.status(400).json({
      success: false,
      message: "Missing room data"
    })
  }

  const expiresAt = new Date(
    Date.now() + expiresInMinutes * 60 * 1000
  )

  const room = await RelaxRoom.create({
    roomName,
    expiresAt
  })

  res.status(201).json({
    success: true,
    room
  })
}

// POST /api/relax-rooms/:id/close
const closeRoom = async (req, res) => {
  const room = await RelaxRoom.findById(req.params.id)

  if (!room) {
    return res.status(404).json({
      success: false,
      message: "Room not found"
    })
  }

  room.isActive = false
  await room.save()

  res.json({ success: true })
}

module.exports = {
  getActiveRooms,
  createRoom,
  closeRoom
}
