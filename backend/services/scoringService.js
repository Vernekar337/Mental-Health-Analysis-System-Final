const normalizeScore = (type, total) => {
  const maxMap = {
    PHQ9: 27,
    GAD7: 21,
    DASS21: 42
  }

  const max = maxMap[type] || 30
  return Math.round((total / max) * 100)
}

const computeScores = (assessmentType, rawResponses) => {
  const total = rawResponses.reduce((a, b) => a + b, 0)

  let severityLevel = "Minimal"

  if (assessmentType === "PHQ9") {
    if (total >= 20) severityLevel = "Severe"
    else if (total >= 15) severityLevel = "Moderately Severe"
    else if (total >= 10) severityLevel = "Moderate"
    else if (total >= 5) severityLevel = "Mild"
  }

  if (assessmentType === "GAD7") {
    if (total >= 15) severityLevel = "Severe"
    else if (total >= 10) severityLevel = "Moderate"
    else if (total >= 5) severityLevel = "Mild"
  }

  if (assessmentType === "DASS21") {
    if (total >= 60) severityLevel = "Severe"
    else if (total >= 40) severityLevel = "Moderate"
    else if (total >= 20) severityLevel = "Mild"
  }

  const normalized = normalizeScore(assessmentType, total)

  // Mental Health Index (inverse)
  const mhIndex = 100 - normalized

  return {
    totalScore: total,
    severity: severityLevel,
    normalizedScore: normalized,
    mhIndex
  }
}

module.exports = { computeScores }