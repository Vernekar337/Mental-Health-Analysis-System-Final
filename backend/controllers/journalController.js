const JournalEntry = require("../models/JournalEntry")

// POST /api/journal
exports.createJournalEntry = async (req, res) => {
  const { title, content, moodScore, date } = req.body

  if (!content || !date) {
    return res.status(400).json({ message: "Content and date are required" })
  }

  const entry = await JournalEntry.create({
    userId: req.user._id,
    title,
    content,
    moodScore,
    date
  })

  res.status(201).json(entry)
}

// GET /api/journal
exports.getJournalEntries = async (req, res) => {
  const entries = await JournalEntry.find({
    userId: req.user._id
  }).sort({ date: -1 })

  res.json(entries)
}

// GET /api/journal/:id
exports.getJournalEntryById = async (req, res) => {
  const entry = await JournalEntry.findOne({
    _id: req.params.id,
    userId: req.user._id
  })

  if (!entry) {
    return res.status(404).json({ message: "Journal entry not found" })
  }

  res.json(entry)
}

// DELETE /api/journal/:id
exports.deleteJournalEntry = async (req, res) => {
  const entry = await JournalEntry.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id
  })

  if (!entry) {
    return res.status(404).json({ message: "Journal entry not found" })
  }

  res.json({ message: "Journal entry deleted" })
}
