const ReflectionAnalysis = require("../models/ReflectionAnalysis")
const AudioDiary = require("../models/AudioDiary")
const AnalysisResult = require("../models/AnalysisResult")

const computeRiskLevel = (mhIndex, reflectionSignals, emotion) => {

  let riskScore = 0

  if (mhIndex !== null) {

    if (mhIndex < 40) riskScore += 3
    else if (mhIndex < 60) riskScore += 2
    else if (mhIndex < 75) riskScore += 1

  }

  if (reflectionSignals) {

    if (reflectionSignals.stress === "high") riskScore += 2
    if (reflectionSignals.sleepIssues) riskScore += 1
    if (reflectionSignals.negativeMood) riskScore += 2

  }

  if (emotion) {

    if (emotion === "sad") riskScore += 2
    if (emotion === "angry") riskScore += 2
    if (emotion === "fear") riskScore += 1

  }

  if (riskScore >= 6) return "high"
  if (riskScore >= 3) return "moderate"
  return "low"

}

const aggregateMentalSignals = async (userId) => {

  const latestAnalysis = await AnalysisResult
    .findOne({ userId })
    .sort({ createdAt: -1 })

  const latestReflection = await ReflectionAnalysis
    .findOne({ userId })
    .sort({ createdAt: -1 })

  const latestAudio = await AudioDiary
    .findOne({ userId })
    .sort({ createdAt: -1 })

  const mhIndex = latestAnalysis ? latestAnalysis.mhIndex : null
  const reflectionSignals = latestReflection || null
  const emotion = latestAudio ? latestAudio.emotion : null

  const riskLevel = computeRiskLevel(
    mhIndex,
    reflectionSignals,
    emotion
  )

  return {
    mhIndex,
    reflectionSignals,
    emotion,
    riskLevel
  }

}

module.exports = {
  aggregateMentalSignals
}