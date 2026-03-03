const axios = require("axios")

const generateInsights = async ({ mhIndex, severity, trend }) => {
  try {
    const prompt = `
You are a supportive mental health assistant.

User Assessment Summary:
- Mental Health Index (0-100, higher is better): ${mhIndex}
- Severity: ${severity}
- Trend over time: ${trend}

Based on this data:

1. If MH index is below 50 → focus on coping strategies.
2. If severity is Moderate or Severe → suggest seeking support.
3. If trend is worsening → suggest immediate attention.
4. If improving → encourage consistency.

Give:
- 3 specific, practical suggestions
- Keep under 120 words
- Be empathetic but not overly dramatic
- Do NOT say "I am here for you"
- Do NOT mention AI
`

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "mistral",
        prompt: prompt,
        stream: false
      }
    )

    return response.data.response

  } catch (err) {
    console.error("Ollama error:", err.message)
    return "Unable to generate insights right now."
  }
}

const generateReflectionQuestions = async ({ mhIndex, severity, trend }) => {
  try {
    const prompt = `
You are a clinical-style reflection question generator.

User Data:
- Mental Health Index: ${mhIndex}
- Severity: ${severity}
- Trend: ${trend}

Generate 5 personalized reflection questions.

Rules:
- Questions should encourage emotional awareness.
- If severity is Moderate or Severe → focus on coping and triggers.
- If trend is worsening → focus on recent changes.
- If improving → focus on sustaining positive habits.
- Keep questions short.
- Do not number them.
- Return only the questions separated by newline.
`

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "phi", // or "mistral" if stable
        prompt: prompt,
        stream: false
      }
    )

    const raw = response.data.response

    // Convert response text into clean array
    const questions = raw
      .split("\n")
      .map(q => q.trim())
      .filter(q => q.length > 10)

    return questions

  } catch (err) {
    console.error("Reflection LLM error:", err.message)
    return [
      "What emotions have been most present for you recently?",
      "What situations have affected your mood the most this week?",
      "What coping strategies have worked for you lately?"
    ]
  }
}

const generateParentRecommendations = async ({ mhIndex, severity, trend }) => {
  try {
    const prompt = `
You are a mental health support assistant helping a parent.

Child's Data:
- Mental Health Index: ${mhIndex}
- Severity: ${severity}
- Trend: ${trend}

Generate 4 practical recommendations for the parent to support their child.

Rules:
- Be calm and practical.
- Focus on communication, routine, emotional support.
- If severity is Moderate or Severe → encourage professional help gently.
- Keep under 150 words.
- Do not mention AI.
- Do not give medical diagnosis.
`

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "phi",   // or mistral if stable
        prompt: prompt,
        stream: false
      }
    )

    return response.data.response

  } catch (err) {
    console.error("Parent LLM error:", err.message)
    return "Encourage open communication, maintain routine, and monitor emotional changes."
  }
}

module.exports = { generateInsights, generateReflectionQuestions, generateParentRecommendations }