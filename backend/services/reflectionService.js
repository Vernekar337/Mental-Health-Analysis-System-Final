const axios = require("axios")
const AssessmentResponse = require("../models/AssessmentResponse")
const AnalysisResult = require("../models/AnalysisResult")

const generateReflectionQuestions = async (userId) => {

  const latestAnalysis =
    await AnalysisResult
      .findOne({ userId })
      .sort({ createdAt: -1 })

  const assessments =
    await AssessmentResponse
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(3)

  const responses = assessments.map(a => ({
    type: a.assessmentType,
    answers: a.responses
  }))

  const prompt = `
  You are a mental health reflection assistant.

  Student mental health data:
  MH Index: ${latestAnalysis?.mhIndex ?? "unknown"}
  Severity: ${latestAnalysis?.severity ?? "unknown"}
  Trend: ${latestAnalysis?.trend ?? "unknown"}

  Recent assessments:
  ${JSON.stringify(responses)}

  Generate exactly 5 short reflection questions that help the student reflect on emotions, stress, anxiety, or mood.

  Rules:
  - Only output questions
  - No explanations
  - No markdown
  - Each question must end with a question mark

  Example format:
  1. Question?
  2. Question?
  3. Question?
  4. Question?
  5. Question?
  `

  const response = await axios.post(
  "http://localhost:11434/api/generate",
  {
    model: "phi",
    prompt: prompt,
    stream: false
  },
  {
    headers: {
      "Content-Type": "application/json"
    }
  }
)

const raw = response.data.response || ""

// split the text into lines
const lines = raw
  .split("\n")
  .map(l => l.trim())
  .filter(l => l.length > 0)

// remove numbering like "1."
const questions = lines.map(q =>
  q.replace(/^\d+\.\s*/, "")
)

// return only first 5 questions
return questions.slice(0,5)
}

module.exports = { generateReflectionQuestions }