const SCORING_RULES = {
  PHQ9: {
    maxQuestions: 9,
    severity: [
      { max: 4, label: "minimal" },
      { max: 9, label: "mild" },
      { max: 14, label: "moderate" },
      { max: 19, label: "moderately severe" },
      { max: 27, label: "severe" }
    ]
  },
  GAD7: {
    maxQuestions: 7,
    severity: [
      { max: 4, label: "minimal" },
      { max: 9, label: "mild" },
      { max: 14, label: "moderate" },
      { max: 21, label: "severe" }
    ]
  }
}

exports.scoreAssessment = (type, responses) => {
  const rule = SCORING_RULES[type]

  if (!rule) {
    throw new Error("Unsupported assessment type")
  }

  if (responses.length !== rule.maxQuestions) {
    throw new Error("Invalid number of responses")
  }

  const totalScore = responses.reduce((a, b) => a + b, 0)

  const severity =
    rule.severity.find((s) => totalScore <= s.max)?.label || "unknown"

  return { totalScore, severity }
}
