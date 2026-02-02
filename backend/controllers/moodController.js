const MoodEntry = require("../models/MoodEntry")


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


exports.getMoodEntries = async (req, res) => {
  const moods = await MoodEntry.find({ userId: req.user._id })
    .sort({ date: -1 })

  res.json(moods)
}


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
