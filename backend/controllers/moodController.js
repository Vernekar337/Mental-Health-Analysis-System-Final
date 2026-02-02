const MoodEntry = require("../models/MoodEntry")

// POST /api/mood
exports.createMoodEntry = async (req, res) => {
  const { moodScore, moodLabel, note, date } = req.body

  if (!moodScore || !moodLabel || !date) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  const mood = await MoodEntry.create({
    userId: req.user._id,
    moodScore,
    moodLabel,
    note,
    date
  })

  res.status(201).json(mood)
}

// GET /api/mood
exports.getMoodEntries = async (req, res) => {
  const moods = await MoodEntry.find({ userId: req.user._id })
    .sort({ date: -1 })

  res.json(moods)
}

// GET /api/mood/range?from=&to=
exports.getMoodByDateRange = async (req, res) => {
  const { from, to } = req.query

  const moods = await MoodEntry.find({
    userId: req.user._id,
    date: {
      $gte: new Date(from),
      $lte: new Date(to)
    }
  }).sort({ date: 1 })

  res.json(moods)
}
