const connectDB = require("../config/database")
connectDB()
const { Worker } = require("bullmq")
const connection = require("../config/redis")

const axios = require("axios")

const AudioDiary = require("../models/AudioDiary")
const ReflectionAnalysis = require("../models/ReflectionAnalysis")

const { analyzeReflection } =
require("../services/reflectionAnalysisService")

console.log("AI Worker started and waiting for jobs...")



const worker = new Worker(

  "ai-processing",

  async job => {

    console.log("Processing job:", job.name)

    const { type, payload } = job.data

    if (type === "reflection") {

      console.log("Running reflection analysis...")

      const { responses, reflectionId, userId } = payload

      const result =
        await analyzeReflection(responses)

      await ReflectionAnalysis.create({

        userId,
        reflectionId,

        signals: {
          stress: result.stress,
          sleepIssues: result.sleepIssues,
          academicPressure: result.academicPressure,
          negativeMood: result.negativeMood
        },

        riskLevel: "unknown",

        summary: result.summary

      })

      console.log("Reflection analysis completed")

    }

    if (type === "audio") {

      console.log("Running audio emotion analysis...")

      const { audioId } = payload

      const audio =
        await AudioDiary.findById(audioId)

      if (!audio) {
        console.log("Audio not found")
        return
      }

      const mlResponse = await axios.post(

        "http://localhost:8000/predict-emotion",

        {
          filePath: audio.filePath
        }

      )

      const { emotion, confidence, mentalState }
        = mlResponse.data

      audio.emotion = emotion
      audio.confidence = confidence
      audio.mentalState = mentalState

      await audio.save()

      console.log("Audio emotion analysis completed")

    }

  },

  { connection }

)

const { analyzeAudioFile } = require("../services/audioAnalysisService")

module.exports = async (job) => {

  const { type, payload } = job.data

  if (type !== "audio") return

  const { audioId } = payload

  const audio = await AudioDiary.findById(audioId)

  if (!audio) throw new Error("Audio not found")

  const result = await analyzeAudioFile(audio.filePath)

  audio.emotion = result.emotion
  audio.confidence = result.confidence
  audio.mentalState = result.mentalState

  await audio.save()

}

worker.on("completed", job => {

  console.log(`Job ${job.id} completed successfully`)

})

worker.on("failed", (job, err) => {

  console.error(`Job ${job.id} failed`, err)

})