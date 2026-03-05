const AssessmentResponse =
require("../models/AssessmentResponse")

const generateAnalysis = async (userId, mhIndex) => {

  const history =
  await AssessmentResponse
  .find({ userId })
  .sort({ createdAt: -1 })
  .limit(5)

  let trend = "stable"

  if(history.length >= 2){

    const latest = history[0].totalScore || 0
    const previous = history[1].totalScore || 0

    if(latest > previous)
      trend = "worsening"

    if(latest < previous)
      trend = "improving"

  }

  const anomalyDetected =
  mhIndex !== null && mhIndex < 30

  return {

    trend,

    anomalyDetected,

    clusterLabel:
      mhIndex !== null && mhIndex < 40
        ? "high-risk"
        : "normal",

    predictedTrajectory:
      trend === "worsening"
        ? "declining"
        : "stable"

  }

}

module.exports = { generateAnalysis }