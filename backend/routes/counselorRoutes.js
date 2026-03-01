const express = require("express")
const {
  getPendingCases,
  approveCase
} = require("../controllers/counselorController")
const { protect, authorize } = require("../auth/authMiddleware")

const router = express.Router()

router.get(
  "/cases",
  protect,
  authorize(["counselor"]),
  getPendingCases
)

router.post(
  "/cases/:id/approve",
  protect,
  authorize(["counselor"]),
  approveCase
)

module.exports = router
