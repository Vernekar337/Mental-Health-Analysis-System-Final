const axios = require("axios")

const analyzeReflection = async (answers) => {

  try {

    const prompt = `
You are a mental health analysis assistant.

Analyze the following student reflection responses.

Identify signals such as:
- stress
- anxiety
- sleep issues
- academic pressure
- negative mood

Return JSON format like:

{
  "stress": "low | medium | high",
  "sleepIssues": true | false,
  "academicPressure": true | false,
  "negativeMood": true | false,
  "summary": "short explanation"
}

Responses:
${answers.join("\n")}
`

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "phi",
        prompt,
        stream: false
      }
    )

    const text = response.data.response

    try {
      return JSON.parse(text)
    } catch {
      return {
        stress: "unknown",
        sleepIssues: false,
        academicPressure: false,
        negativeMood: false,
        summary: "LLM response parsing failed"
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