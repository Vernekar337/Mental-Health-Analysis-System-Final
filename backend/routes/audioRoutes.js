const express = require("express")
const router = express.Router()

const auth = require("../auth/authMiddleware")
const upload = require("../middlewares/audioUpload")

const {
  uploadAudio,
  analyzeAudio,
  getHistory
} = require("../controllers/audioController")

router.post(
  "/upload",
  auth.protect,
  upload.single("audio"),
  uploadAudio
)

router.post(
  "/analyze",
  auth.protect,
  analyzeAudio
)

router.get(
  "/history",
  auth.protect,
  getHistory
)

module.exports = router