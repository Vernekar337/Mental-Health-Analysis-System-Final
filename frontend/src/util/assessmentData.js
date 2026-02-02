// Standardized Assessment Data
// DISCLAIMER: This is for educational/development purposes only.

export const ASSESSMENTS = {
    'PHQ-9': {
        title: "PHQ-9 (Patient Health Questionnaire)",
        description: "Screening for depression severity.",
        frequency: "Weekly",
        instructions: "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
        questions: [
            "Little interest or pleasure in doing things",
            "Feeling down, depressed, or hopeless",
            "Trouble falling or staying asleep, or sleeping too much",
            "Feeling tired or having little energy",
            "Poor appetite or overeating",
            "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
            "Trouble concentrating on things, such as reading the newspaper or watching television",
            "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
            "Thoughts that you would be better off dead or of hurting yourself in some way"
        ],
        options: [
            { value: 0, label: "Not at all" },
            { value: 1, label: "Several days" },
            { value: 2, label: "More than half the days" },
            { value: 3, label: "Nearly every day" }
        ]
    },
    'GAD-7': {
        title: "GAD-7 (Generalized Anxiety Disorder)",
        description: "Screening for anxiety severity.",
        frequency: "Weekly",
        instructions: "Over the last 2 weeks, how often have you been bothered by the following problems?",
        questions: [
            "Feeling nervous, anxious, or on edge",
            "Not being able to stop or control worrying",
            "Worrying too much about different things",
            "Trouble relaxing",
            "Being so restless that it is hard to sit still",
            "Becoming easily annoyed or irritable",
            "Feeling afraid as if something awful might happen"
        ],
        options: [
            { value: 0, label: "Not at all" },
            { value: 1, label: "Several days" },
            { value: 2, label: "More than half the days" },
            { value: 3, label: "Nearly every day" }
        ]
    },
    'DASS-21': {
        title: "DASS-21 (Depression Anxiety Stress Scales)",
        description: "Measuring states of depression, anxiety and stress.",
        frequency: "Monthly",
        instructions: "Please read each statement and circle a number 0, 1, 2 or 3 which indicates how much the statement applied to you over the past week.",
        questions: [
            "I found it hard to wind down",
            "I was aware of dryness of my mouth",
            "I couldn't seem to experience any positive feeling at all",
            "I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)",
            "I found it difficult to work up the initiative to do things",
            "I tended to over-react to situations",
            "I experienced trembling (e.g. in the hands)",
            "I felt that I was using a lot of nervous energy",
            "I was worried about situations in which I might panic and make a fool of myself",
            "I felt that I had nothing to look forward to",
            "I found myself getting agitated",
            "I found it difficult to relax",
            "I felt down-hearted and blue",
            "I was intolerant of anything that kept me from getting on with what I was doing",
            "I felt I was close to panic",
            "I was unable to become enthusiastic about anything",
            "I felt I wasn't worth much as a person",
            "I felt that I was rather touchy",
            "I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat)",
            "I felt scared without any good reason",
            "I felt that life was meaningless"
        ],
        options: [
            { value: 0, label: "Did not apply to me at all" },
            { value: 1, label: "Applied to me to some degree, or some of the time" },
            { value: 2, label: "Applied to me to a considerable degree or a good part of time" },
            { value: 3, label: "Applied to me very much or most of the time" }
        ]
    },
    'REFLECTION': {
        title: "Monthly Reflection",
        description: "Self-reflection on well-being.",
        frequency: "Monthly",
        instructions: "Please rate your agreement with the following statements regarding the past month.",
        questions: [
            "I felt satisfied with my academic performance.",
            "I managed my time effectively.",
            "I felt connected to my peers and community.",
            "I was able to handle unexpected challenges.",
            "I felt physically healthy and energetic."
        ],
        options: [
            { value: 0, label: "Strongly Disagree" },
            { value: 1, label: "Disagree" },
            { value: 2, label: "Agree" },
            { value: 3, label: "Strongly Agree" }
        ]
    }
};
