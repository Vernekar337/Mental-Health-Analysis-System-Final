const express = require("express")
const {
  getActiveRooms,
  createRoom,
  closeRoom
} = require("../controllers/relaxRoomController")
const { protect, authorize } = require("../auth/authMiddleware")

const router = express.Router()

router.get(
  "/",
  protect,
  authorize(["student"]),
  getActiveRooms
)

router.post(
  "/",
  protect,
  authorize(["student"]),
  createRoom
)

router.post(
  "/:id/close",
  protect,
  authorize(["student"]),
  closeRoom
)

module.exports = router
