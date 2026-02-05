const computeScores = (assessmentType, rawResponses) => {
  let computedScores = {}
  let severityLevel = "Low"

  const total = rawResponses.reduce((a, b) => a + b, 0)

  if (assessmentType === "PHQ-9") {
    computedScores.total = total
    if (total >= 20) severityLevel = "Severe"
    else if (total >= 15) severityLevel = "Moderately Severe"
    else if (total >= 10) severityLevel = "Moderate"
    else if (total >= 5) severityLevel = "Mild"
  }

  if (assessmentType === "GAD-7") {
    computedScores.total = total
    if (total >= 15) severityLevel = "Severe"
    else if (total >= 10) severityLevel = "Moderate"
    else if (total >= 5) severityLevel = "Mild"
  }

  if (assessmentType === "DASS-21") {
    computedScores.total = total
    if (total >= 60) severityLevel = "Severe"
    else if (total >= 40) severityLevel = "Moderate"
    else if (total >= 20) severityLevel = "Mild"
  }

  return { computedScores, severityLevel }
}

module.exports = { computeScores }
