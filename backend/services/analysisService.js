const computeTrend = (scores) => {
  if (scores.length < 2) return "stable"

  const last = scores[scores.length - 1]
  const prev = scores[scores.length - 2]

  if (last > prev) return "improving"
  if (last < prev) return "worsening"
  return "stable"
}

const generateAnalysis = (assessment, severityLevel) => {
  const mhIndex = Math.min(100, assessment.computedScores.total * 4)

  return {
    mhIndex,
    mhIndexBreakdown: {
      score: assessment.computedScores.total,
      severity: severityLevel
    },
    predictedTrajectory:
      severityLevel === "Severe" ? "Declining" : "Stable",
    clusterLabel:
      severityLevel === "Severe" ? "High Risk" : "Normal",
    anomalyDetected: severityLevel === "Severe"
  }
}

module.exports = { generateAnalysis }
