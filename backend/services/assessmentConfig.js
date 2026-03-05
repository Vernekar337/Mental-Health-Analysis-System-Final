const assessmentConfig = {

  PHQ9: {
    type: "quantitative",
    questions: 9,
    min: 0,
    max: 3,
    maxScore: 27,
    severity: [
      { limit: 4, label: "Minimal" },
      { limit: 9, label: "Mild" },
      { limit: 14, label: "Moderate" },
      { limit: 19, label: "Moderately Severe" },
      { limit: 27, label: "Severe" }
    ]
  },

  GAD7: {
    type: "quantitative",
    questions: 7,
    min: 0,
    max: 3,
    maxScore: 21,
    severity: [
      { limit: 4, label: "Minimal" },
      { limit: 9, label: "Mild" },
      { limit: 14, label: "Moderate" },
      { limit: 21, label: "Severe" }
    ]
  },

  DASS21: {
    type: "quantitative",
    questions: 21,
    min: 0,
    max: 3,
    maxScore: 63,
    severity: [
      { limit: 14, label: "Normal" },
      { limit: 21, label: "Mild" },
      { limit: 28, label: "Moderate" },
      { limit: 35, label: "Severe" },
      { limit: 63, label: "Extremely Severe" }
    ]
  },

  REFLECTION: {
    type: "qualitative"
  }

}

module.exports = assessmentConfig