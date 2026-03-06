const axios = require("axios")

const generateInsights = async ({ mhIndex, severity, trend }) => {

  try {

    const prompt = `
You are a mental health assistant.

Student mental health summary:

MH Index: ${mhIndex}
Severity Level: ${severity}
Trend: ${trend}

Provide 3 short supportive insights or suggestions for the student.

Rules:
- Each insight must be one sentence.
- Do not include explanations.
- Return only the list.

Example format:
1. Insight text
2. Insight text
3. Insight text
`

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "phi",
        prompt: prompt,
        stream: false
      }
    )

    const text = response.data.response || ""

    const insights = text
      .split("\n")
      .map(i => i.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean)

    return insights.slice(0,3)

  }

  catch (err) {

    console.error("Insight generation error:", err.message)

    return []

  }

}

module.exports = { generateInsights }