const axios = require("axios")

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/generate"
const MODEL = process.env.LLM_MODEL || "phi"

/*
  Now receives historyContext — a summary of last 5 assessments
  so the model has full picture of what's been happening
*/
const generateInsights = async ({ mhIndex, severity, trend, historyContext }) => {
  try {
    const prompt = `You are a supportive mental health assistant analyzing a student's mental health data.

Current Status:
- Mental Health Index (0-100, higher is better): ${mhIndex}
- Current Severity: ${severity}
- Trend: ${trend}

Recent Assessment History (last 5 reports):
${historyContext || "No history available."}

Based on the above history and current status, provide exactly 3 specific, practical, personalized insights or coping suggestions for this student.

Rules:
- Each insight must be one sentence only.
- Reference the trend or history when relevant.
- No numbering, no bullet points, no markdown.
- No explanations or preamble.
- Do NOT mention AI or that you are an AI.
- Each sentence ends with a period.

Output only the 3 sentences, one per line.`

    const response = await axios.post(OLLAMA_URL, {
      model: MODEL,
      prompt,
      stream: false
    })

    const text = response.data.response || ""

    const insights = text
      .split("\n")
      .map(i => i.replace(/^\d+\.\s*|^[-*]\s*/, "").trim())
      .filter(i => i.length > 10 && i.endsWith("."))

    return insights.slice(0, 3).length > 0
      ? insights.slice(0, 3)
      : [
          "Consider taking short breaks throughout your day to manage stress.",
          "Reaching out to a trusted friend or counselor can provide valuable support.",
          "Maintaining a consistent sleep schedule can significantly improve mental wellbeing."
        ]

  } catch (err) {
    console.error("Ollama error:", err.message)
    return [
      "Consider taking short breaks throughout your day to manage stress.",
      "Reaching out to a trusted friend or counselor can provide valuable support.",
      "Maintaining a consistent sleep schedule can significantly improve mental wellbeing."
    ]
  }
}

const generateReflectionQuestions = async ({ userId, latestAnalysis, recentAssessments }) => {
  try {
    const responses = recentAssessments
      ? recentAssessments.map(a => ({ type: a.assessmentType, answers: a.responses }))
      : []

    const prompt = `You are a mental health reflection assistant.

Student metrics:
MH Index: ${latestAnalysis?.mhIndex ?? "unknown"}
Severity: ${latestAnalysis?.severity ?? "unknown"}
Trend: ${latestAnalysis?.trend ?? "unknown"}

Recent assessments:
${JSON.stringify(responses)}

Generate exactly 5 reflection questions. Output only the questions, no explanations, no markdown.

1. Question
2. Question
3. Question
4. Question
5. Question`

    const response = await axios.post(OLLAMA_URL, {
      model: MODEL,
      prompt,
      stream: false
    })

    const raw = response.data.response || ""

    const questions = raw
      .split("\n")
      .map(q => q.replace(/^\d+\.\s*/, "").trim())
      .filter(q => q.length > 10)

    return questions.slice(0, 5)

  } catch (err) {
    console.error("Reflection LLM error:", err.message)
    return [
      "What emotions have been most present for you recently?",
      "What situations have affected your mood the most this week?",
      "What coping strategies have worked for you lately?",
      "How would you describe your energy levels over the past few days?",
      "What is one small thing you could do tomorrow to support your wellbeing?"
    ]
  }
}

const generateParentRecommendations = async ({ mhIndex, severity, trend }) => {
  try {
    const prompt = `You are a mental health support assistant helping a parent.

Child's Data:
- Mental Health Index: ${mhIndex}
- Severity: ${severity}
- Trend: ${trend}

Generate 4 practical recommendations for the parent. Be calm and practical. Keep under 150 words. Do not mention AI.`

    const response = await axios.post(OLLAMA_URL, {
      model: MODEL,
      prompt,
      stream: false
    })

    return response.data.response

  } catch (err) {
    console.error("Parent LLM error:", err.message)
    return "Encourage open communication, maintain routine, and monitor emotional changes."
  }
}

module.exports = { generateInsights, generateReflectionQuestions, generateParentRecommendations }