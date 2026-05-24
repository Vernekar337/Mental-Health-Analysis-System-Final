const connectDB = require("../config/database")
connectDB()

const { Worker } = require("bullmq")
const connection = require("../config/redis")

const AudioDiary = require("../models/AudioDiary")
const ReflectionAnalysis = require("../models/ReflectionAnalysis")
const Insight = require("../models/Insight")
const ReflectionQuestion = require("../models/ReflectionQuestion")

const { generateInsights, generateParentRecommendations } = require("../services/llmService")
const { analyzeReflection } = require("../services/reflectionAnalysisService")
const { analyzeAudioFile } = require("../services/audioAnalysisService")
const { generateReflectionQuestions } = require("../services/reflectionService")

console.log("AI Worker started...")

const worker = new Worker(

  "ai-processing",

  async job => {
    const { type, payload } = job.data
    console.log("Running job:", type)

    // REFLECTION ANALYSIS (from assessmentController qualitative path)
    if (type === "reflection") {
      const { responses, reflectionId, userId } = payload
      const result = await analyzeReflection(responses)

      await ReflectionAnalysis.findByIdAndUpdate(reflectionId, {
        signals: {
          stress: result.stress,
          sleepIssues: result.sleepIssues,
          academicPressure: result.academicPressure,
          negativeMood: result.negativeMood
        },
        riskLevel: result.riskLevel || "unknown",
        summary: result.summary,
        status: "completed"
      })

      console.log("Reflection analysis completed")
    }

    // REFLECTION ANALYSIS (from reflectionController path)
    if (type === "reflection-analysis") {
      const { reflectionAnalysisId, responses } = payload
      const result = await analyzeReflection(responses)

      await ReflectionAnalysis.findByIdAndUpdate(reflectionAnalysisId, {
        signals: {
          stress: result.stress,
          sleepIssues: result.sleepIssues,
          academicPressure: result.academicPressure,
          negativeMood: result.negativeMood
        },
        riskLevel: result.riskLevel || "unknown",
        summary: result.summary,
        status: "completed"
      })

      console.log("Reflection analysis completed")
    }

    // REFLECTION QUESTIONS
    if (type === "reflection-questions") {
      const { reflectionId, userId } = payload
      const questions = await generateReflectionQuestions(userId)

      await ReflectionQuestion.findByIdAndUpdate(reflectionId, {
        questions,
        status: "completed"
      })

      console.log("Reflection questions generated")
    }

    // AUDIO ANALYSIS
    if (type === "audio") {
      const { audioId } = payload
      const audio = await AudioDiary.findById(audioId)

      if (!audio) throw new Error("Audio not found")

      const result = await analyzeAudioFile(audio.filePath)

      audio.emotion = result.emotion
      audio.confidence = result.confidence
      audio.mentalState = result.mentalState || null
      await audio.save()

      console.log("Audio analysis completed")
    }

    // INSIGHT GENERATION — now receives last 5 assessments for context
    if (type === "insight") {
      const { insightId, mhIndex, severity, trend, recentAssessments } = payload

      // Build a richer prompt context from recent assessment history
      const historyContext = recentAssessments && recentAssessments.length > 0
        ? recentAssessments.map((a, i) =>
            `Assessment ${i + 1}: Type=${a.type}, Score=${a.score}, Severity=${a.severity}, Date=${new Date(a.date).toDateString()}`
          ).join("\n")
        : "No recent assessment history available."

      const insightText = await generateInsights({
        mhIndex,
        severity,
        trend,
        historyContext
      })

      const insightArray = Array.isArray(insightText)
        ? insightText
        : insightText.split("\n").map(s => s.trim()).filter(Boolean)

      await Insight.findByIdAndUpdate(insightId, {
        content: insightArray,
        status: "completed"
      })

      console.log("Insight generation completed for mhIndex:", mhIndex)
    }

  },

  { connection }

)

worker.on("completed", job => {
  console.log(`Job ${job.id} (${job.data.type}) completed`)
})

worker.on("failed", async (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message)

  const { type, payload } = job.data

  if (type === "reflection") {
  const { responses, reflectionId, userId } = payload
  const result = await analyzeReflection(responses)

  // Create a new ReflectionAnalysis linked to the AssessmentResponse
  await ReflectionAnalysis.create({
    userId,
    reflectionId, // this is AssessmentResponse._id
    signals: {
      stress: result.stress,
      sleepIssues: result.sleepIssues,
      academicPressure: result.academicPressure,
      negativeMood: result.negativeMood
    },
    riskLevel: result.riskLevel || "unknown",
    summary: result.summary,
    status: "completed"
  })

  console.log("Reflection analysis completed")
}

  if (type === "reflection-questions") {
    if (payload.reflectionId) {
      await ReflectionQuestion.findByIdAndUpdate(payload.reflectionId, { status: "failed" })
    }
  }

  if (type === "insight") {
    if (payload.insightId) {
      await Insight.findByIdAndUpdate(payload.insightId, { status: "failed" })
    }
  }
})