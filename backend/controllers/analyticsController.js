const MoodEntry = require("../models/MoodEntry")
const ActivityLog = require("../models/ActivityLog")
const { calculateStreak } = require("../utils/streakUtils")
const JournalEntry = require("../models/JournalEntry")

exports.getWeeklyMoodAverage = async (req, res) => {
  const data = await MoodEntry.aggregate([
    {
      $match: {
        userId: req.user._id
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          week: { $week: "$date" }
        },
        averageMood: { $avg: "$moodScore" }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.week": 1 }
    }
  ])

  const formatted = data.map((d) => ({
    week: `${d._id.year}-W${d._id.week}`,
    averageMood: Number(d.averageMood.toFixed(2))
  }))

  res.json(formatted)
}

exports.getMoodDistribution = async (req, res) => {
  const data = await MoodEntry.aggregate([
    {
      $match: {
        userId: req.user._id
      }
    },
    {
      $group: {
        _id: "$moodLabel",
        count: { $sum: 1 }
      }
    }
  ])

  res.json(
    data.map((d) => ({
      moodLabel: d._id,
      count: d.count
    }))
  )
}

const ActivityLog = require("../models/ActivityLog")

exports.getActiveDaysCount = async (req, res) => {
  const data = await ActivityLog.aggregate([
    {
      $match: {
        userId: req.user._id
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" }
        }
      }
    },
    {
      $count: "activeDays"
    }
  ])

  res.json({ activeDays: data[0]?.activeDays || 0 })
}

const ActivityLog = require("../models/ActivityLog")

exports.getActiveDaysCount = async (req, res) => {
  const data = await ActivityLog.aggregate([
    {
      $match: {
        userId: req.user._id
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" }
        }
      }
    },
    {
      $count: "activeDays"
    }
  ])

  res.json({ activeDays: data[0]?.activeDays || 0 })
}

const AssessmentResponse = require("../models/AssessmentResponse")

exports.getAssessmentTrend = async (req, res) => {
  const data = await AssessmentResponse.find({
    userId: req.user._id,
    assessmentType: req.params.type
  })
    .sort({ date: 1 })
    .select("date totalScore severity -_id")

  res.json(data)
}

exports.getActivityStreak = async (req, res) => {
  const logs = await ActivityLog.find(
    { userId: req.user._id },
    { date: 1, _id: 0 }
  ).sort({ date: 1 })

  const streak = calculateStreak(logs.map(l => l.date))

  res.json({ streak })
}

exports.getMonthlySummary = async (req, res) => {
  const year = Number(req.query.year)
  const month = Number(req.query.month) - 1

  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 0, 23, 59, 59)

  const [mood, journals, activities] = await Promise.all([
    MoodEntry.aggregate([
      { $match: { userId: req.user._id, date: { $gte: start, $lte: end } } },
      { $group: { _id: null, avgMood: { $avg: "$moodScore" } } }
    ]),
    JournalEntry.countDocuments({
      userId: req.user._id,
      date: { $gte: start, $lte: end }
    }),
    ActivityLog.aggregate([
      { $match: { userId: req.user._id, date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
        }
      },
      { $count: "activeDays" }
    ])
  ])

  res.json({
    month: `${year}-${month + 1}`,
    avgMood: mood[0]?.avgMood?.toFixed(2) || null,
    journalCount: journals,
    activeDays: activities[0]?.activeDays || 0
  })
}