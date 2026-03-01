const generateInsights = async ({ mhIndex, severity, trend }) => {
  // For now we MOCK response (fast + safe)
  
  if (severity === "Severe") {
    return "Your recent assessments indicate high distress levels. Consider speaking to a counselor and practicing daily relaxation techniques."
  }

  if (severity === "Moderate") {
    return "You are showing moderate signs of stress. Try improving sleep, exercise regularly, and talk to someone you trust."
  }

  if (trend === "worsening") {
    return "Your mental health trend is declining. It is recommended to seek support and reduce stressors."
  }

  return "Your mental health looks stable. Continue maintaining healthy habits and self-care."
}

module.exports = { generateInsights }