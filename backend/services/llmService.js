
// Replace implementation with actual Grok 
const generateReflectiveQuestions = async (reportContext) => {
  return [
    {
      id: "q1",
      type: "PARAGRAPH",
      question:
        "Describe in your own words how you have been feeling over the past two weeks."
    },
    {
      id: "q2",
      type: "MCQ",
      question:
        "Which of the following best describes your recent stress levels?",
      options: ["Low", "Moderate", "High", "Very High"]
    },
    {
      id: "q3",
      type: "PARAGRAPH",
      question:
        "Are there any recent events that you believe contributed to these feelings?"
    }
  ]
}

module.exports = { generateReflectiveQuestions }
