const { Worker } = require("bullmq")
const connection = require("../config/redis")

const axios = require("axios")

const AudioDiary = require("../models/AudioDiary")
const ReflectionAnalysis = require("../models/ReflectionAnalysis")

const { analyzeReflection } =
require("../services/reflectionAnalysisService")

const worker = new Worker(

  "ai-processing",

  async job => {

    const { type, payload } = job.data

    if (type === "reflection") {

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

    }

    if (type === "audio") {

      const { audioId } = payload

      const audio =
        await AudioDiary.findById(audioId)

      if (!audio) return

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

    }

  },

  { connection }

)