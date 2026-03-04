const express = require("express")
const router = express.Router()

const { uploadAudio } = require("../controllers/audioController")
const upload = require("../middlewares/upload")

const { protect } = require("../auth/authMiddleware")

router.post(
  "/upload",
  protect,
  upload.single("audio"),
  uploadAudio
)

module.exports = router