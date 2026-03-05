const config = require("./assessmentConfig")

const computeScores = (assessmentType, responses) => {

  const rules = config[assessmentType]

  if (!rules)
    throw new Error("Invalid assessment type")

  if (responses.length !== rules.questions)
    throw new Error("Incorrect number of responses")

  // Validate response values
  for (const r of responses) {
    if (r < rules.min || r > rules.max) {
      throw new Error("Invalid response value")
    }
  }

  // Calculate total score
  const totalScore =
    responses.reduce((sum, val) => sum + val, 0)

  // Determine severity
  let severity = "Unknown"

  for (const s of rules.severity) {
    if (totalScore <= s.limit) {
      severity = s.label
      break
    }
  }

  // Normalize to MH Index (0-100)
  const mhIndex =
    Math.round((1 - totalScore / rules.maxScore) * 100)

  return {
    totalScore,
    severity,
    mhIndex
  }

}

module.exports = { computeScores }