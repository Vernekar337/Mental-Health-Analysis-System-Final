import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust as needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock Data for scaffolding (since backend might not be ready or reachable)
const MOCK_DATA = {
    studentReport: {
        severity: 'Moderate',
        mhIndex: 65,
        trend: 'Stable',
        riskLevel: 'Medium',
        caseStatus: 'Pending Review',
        counselorName: 'Dr. Sarah Smith',
        reviewedAt: '2026-02-01T14:30:00Z',
        lastAssessmentDate: '2026-02-01',
        nextAssessmentDate: '2026-02-08',
        explainability: [
            "Sleep patterns have stabilized over the last 2 weeks.",
            "Reported anxiety levels are slightly elevated compared to last month.",
            "Academic stress factors indicated in journal entries."
        ]
    },
    assessmentsHistory: [
        { id: 1, date: '2026-01-01', type: 'PHQ-9', score: 70, severity: 'High', status: 'Reviewed' },
        { id: 2, date: '2026-01-08', type: 'GAD-7', score: 68, severity: 'Moderate', status: 'Reviewed' },
        { id: 3, date: '2026-01-15', type: 'PHQ-9', score: 65, severity: 'Moderate', status: 'Reviewed' },
        { id: 4, date: '2026-01-22', type: 'PHQ-9', score: 65, severity: 'Moderate', status: 'Auto-Processed' },
        { id: 5, date: '2026-02-01', type: 'DASS-21', score: 60, severity: 'Low', status: 'Pending Review' },
    ],
    counselorCases: [
        { id: 101, studentName: 'Alex Johnson', triggerReason: 'High Severity Score (PHQ-9)', riskLevel: 'High', status: 'Pending Review', lastUpdated: '2 hours ago' },
        { id: 102, studentName: 'Maria Garcia', triggerReason: 'Sudden Trend Shift', riskLevel: 'Medium', status: 'In Progress', lastUpdated: '1 day ago' },
        { id: 103, studentName: 'Sam Wilson', triggerReason: 'Keyword Alert in Journal', riskLevel: 'High', status: 'Pending Review', lastUpdated: '3 hours ago' },
        { id: 104, studentName: 'Chris Lee', triggerReason: 'Routine Check (Monthly)', riskLevel: 'Low', status: 'Reviewed', lastUpdated: '2 days ago' },
    ]
};

// ... existing interceptors ...

// Mock API calls for now to ensure UI renders
export const getStudentReport = async () => {
    // In production: return api.get('/reports/student');
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: MOCK_DATA.studentReport }), 500);
    });
};

export const getAssessmentHistory = async () => {
    // In production: return api.get('/assessments/history');
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: MOCK_DATA.assessmentsHistory }), 500);
    });
};

export const getCounselorCases = async () => {
    // In production: return api.get('/counselor/cases');
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: MOCK_DATA.counselorCases }), 500);
    });
};

export const getCaseDetail = async (id) => {
    // In production: return api.get(`/counselor/cases/${id}`);
    const caseItem = MOCK_DATA.counselorCases.find(c => c.id == id);
    // Merge with full report data for demo
    return new Promise((resolve) => {
        setTimeout(() => resolve({ 
            data: { 
                ...caseItem, 
                ...MOCK_DATA.studentReport, // Simulate full report data attach
                studentId: 'ST-2024-001'
            } 
        }), 500);
    });
};

export const updateCaseStatus = async (id, status) => {
    // In production: return api.post(`/counselor/cases/${id}/${status.toLowerCase()}`);
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: { success: true } }), 800);
    });
};

export const getParentReport = async () => {
    // In production: return api.get('/parent/report');
    return new Promise((resolve) => {
        setTimeout(() => resolve({ 
            data: { 
                studentName: 'Alex Johnson',
                reportDate: '2026-02-01',
                counselorName: 'Dr. Smith',
                approvalStatus: 'Approved',
                summary: 'Alex has been showing good progress. Stress levels are manageable, but sleep patterns should be monitored at home.',
                metrics: {
                    mood: 'Stable',
                    stress: 'Moderate',
                    sleep: 'Needs Improvement'
                },
                recommendations: [
                    'Encourage regular sleep schedule (8 hours).',
                    'Limit screen time before bed.',
                    'Continue supportive conversations about school workload.'
                ]
            } 
        }), 500);
    });
};

export const getPendingReflectiveAssessment = async () => {
    // In production: return api.get('/reflective-assessments/pending');
    return new Promise((resolve) => {
        setTimeout(() => resolve({
            data: [
                {
                    id: 1,
                    type: 'text',
                    question: 'You reported feeling overwhelmed by assignments. Can you describe which specific subjects are causing the most stress?',
                    placeholder: 'Type your answer here...'
                },
                {
                    id: 2,
                    type: 'mcq',
                    question: 'On a scale of 1-5, how well are you sleeping this week?',
                    options: ['1 - Very Poor', '2 - Poor', '3 - Average', '4 - Good', '5 - Excellent']
                },
                {
                    id: 3,
                    type: 'text',
                    question: 'What is one thing that helped you relax yesterday?',
                    placeholder: 'e.g., Reading, Gaming, Talking to a friend...'
                }
            ]
        }), 600);
    });
};

export const submitReflectiveAssessment = async (responses) => {
    // In production: return api.post('/reflective-assessments/submit', responses);
    console.log("Submitting reflective responses:", responses);
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: { success: true } }), 800);
    });
};

export const getParentAlerts = async () => {
    // In production: return api.get('/parent/alerts');
    return new Promise((resolve) => {
        setTimeout(() => resolve({
            data: [
                {
                    id: 1,
                    severity: 'high',
                    message: "Student reported 'High' stress levels for 3 consecutive days.",
                    timestamp: "2 hours ago",
                    acknowledged: false
                },
                {
                    id: 2,
                    severity: 'medium',
                    message: "Sleep duration dropped below 6 hours average this week.",
                    timestamp: "Yesterday",
                    acknowledged: true
                },
                {
                    id: 3,
                    severity: 'info',
                    message: "Weekly mental health report is available for review.",
                    timestamp: "2 days ago",
                    acknowledged: true
                }
            ]
        }), 500);
    });
};

export const acknowledgeAlert = async (id) => {
    // In production: return api.post(`/parent/alerts/${id}/acknowledge`);
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: { success: true } }), 500);
    });
};

export default api;
