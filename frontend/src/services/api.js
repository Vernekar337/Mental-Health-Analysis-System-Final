import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

/* =========================
   Attach JWT token
========================= */

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* =========================
   Handle Unauthorized
========================= */

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

/* =========================
   STUDENT
========================= */

export const getStudentReport = () => {
  return api.get("/reports/dashboard");
};

export const getAssessmentHistory = () => {
  return api.get("/reports/history");
};

export const getInsights = async () => {
  const res = await api.get("/reports/insights");
  // Normalize: backend returns { status, insights } — extract the array
  if (res.data && Array.isArray(res.data.insights)) {
    return { ...res, data: res.data.insights };
  }
  if (Array.isArray(res.data)) {
    return res;
  }
  return { ...res, data: [] };
};

/* =========================
   ASSESSMENTS
========================= */

export const submitAssessment = (data) => {
  return api.post("/assessments", data);
};

export const getReflectionQuestions = () => {
  return api.get("/reflection/questions");
};

export const submitReflection = (data) => {
  return api.post("/assessments", data);
};

/* =========================
   REFLECTION
========================= */

export const getPendingReflectiveAssessment = () => {
  return api.get("/reflection/questions");
};

export const submitReflectiveAssessment = (data) => {
  return api.post("/reflection/submit", data);
};

/* =========================
   MOOD
========================= */

export const createMoodEntry = (data) => {
  return api.post("/mood", data);
};

export const getMoodEntries = () => {
  return api.get("/mood");
};

export const getMoodByDateRange = (from, to) => {
  return api.get(`/mood/range?from=${from}&to=${to}`);
};

/* =========================
   JOURNAL
========================= */

export const createJournalEntry = (data) => {
  return api.post("/journal", data);
};

export const getJournalEntries = () => {
  return api.get("/journal");
};

export const getJournalEntryById = (id) => {
  return api.get(`/journal/${id}`);
};

export const deleteJournalEntry = (id) => {
  return api.delete(`/journal/${id}`);
};

/* =========================
   ACTIVITY
========================= */

export const createActivityLog = (data) => {
  return api.post("/activity", data);
};

export const getActivityLogs = () => {
  return api.get("/activity");
};

/* =========================
   ANALYTICS
========================= */

export const getWeeklyMoodAverage = () => {
  return api.get("/analytics/mood/weekly");
};

export const getMoodDistribution = () => {
  return api.get("/analytics/mood/distribution");
};

export const getAssessmentTrend = (type) => {
  return api.get(`/analytics/assessment/${type}`);
};

export const getMonthlySummary = (year, month) => {
  return api.get(`/analytics/summary/monthly?year=${year}&month=${month}`);
};

/* =========================
   PARENT
========================= */

export const getParentAlerts = () => {
  return api.get("/parent/alerts");
};

export const acknowledgeAlert = (id) => {
  return api.patch(`/parent/alerts/${id}`);
};

export const linkChild = (childId) => {
  return api.post("/parent/link-child", { childId });
};

export const getParentReport = () => {
  return api.get("/parent/report");
};

export const getLinkedChildren = () => {
  return api.get("/parent/children");
};

export const requestConsultation = (counselorId) => {
  return api.post("/counselor/request-consultation", { counselorId });
};

/* =========================
   COUNSELOR
========================= */

export const getCounselorCases = () => {
  return api.get("/counselor/cases");
};

export const getCaseDetail = (id) => {
  return api.get(`/counselor/case/${id}`);
};

export const updateCaseStatus = (id, status) => {
  return api.patch(`/counselor/cases/${id}`, { status });
};

export const submitCounselorSuggestion = (studentId, suggestion) => {
  return api.post("/counselor/suggestion", { studentId, suggestion });
};

export const getCounselorDirectory = () => {
  return api.get("/counselor/directory");
};

/* =========================
   AUDIO DIARY
========================= */

export const uploadAudioDiary = (formData) => {
  return api.post("/audio/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

/* =========================
   AUTH
========================= */

export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

export default api;