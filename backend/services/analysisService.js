const MHIndexHistory = require("../models/MHIndexHistory")

const detectTrend = async (userId) => {

  const history = await MHIndexHistory
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(3)

  if (history.length < 2) {
    return "stable"
  }

  const latest = history[0].mhIndex
  const previous = history[1].mhIndex

  if (latest > previous + 5) {
    return "improving"
  }

  if (latest < previous - 5) {
    return "declining"
  }

  return "stable"

}

module.exports = {
  detectTrend
}