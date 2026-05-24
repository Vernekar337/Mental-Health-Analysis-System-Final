const axios = require("axios")

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/generate"
const MODEL = process.env.LLM_MODEL || "phi"

const analyzeReflection = async (answers) => {
  try {
    const prompt = `You are a mental health analysis assistant.

Analyze the following student reflection responses.

Identify signals such as stress, anxiety, sleep issues, academic pressure, negative mood.

Return ONLY valid JSON, no extra text, no markdown backticks:

{
  "stress": "low",
  "sleepIssues": false,
  "academicPressure": false,
  "negativeMood": false,
  "summary": "short explanation"
}

stress must be one of: low, medium, high
sleepIssues, academicPressure, negativeMood must be true or false

Responses:
${answers.join("\n")}`

    const response = await axios.post(OLLAMA_URL, {
      model: MODEL,
      prompt,
      stream: false
    })

    const text = response.data.response || ""

    try {
      const clean = text.replace(/```json|```/g, "").trim()
      return JSON.parse(clean)
    } catch {
      return {
        stress: "unknown",
        sleepIssues: false,
        academicPressure: false,
        negativeMood: false,
        summary: "Analysis parsing failed"
      }
    }

  } catch (err) {
    console.error("Reflection analysis failed:", err.message)
    return {
      stress: "unknown",
      sleepIssues: false,
      academicPressure: false,
      negativeMood: false,
      summary: "Reflection analysis unavailable"
    }
  }
}

module.exports = { analyzeReflection }