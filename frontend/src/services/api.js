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

export const getInsights = () => {
  return api.get("/reports/insights")
}

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
   RELAX ROOM (CHAT)
========================= */
/* handled by socket.io — no API needed */

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

/* =========================
   COUNSELOR
========================= */

export const getCounselorCases = () => {
  return api.get("/counselor/cases");
};

export const getCaseDetail = (id) => {
  return api.get(`/counselor/cases/${id}`);
};

export const updateCaseStatus = (id, status) => {
  return api.patch(`/counselor/cases/${id}`, { status });
};

export const submitCounselorSuggestion = (studentId, suggestion) => {
  return api.post(`/counselor/suggestions/${studentId}`, { suggestion });
};

export const getCounselorDirectory = () => {
  return api.get("/counselor/directory");
};

export const requestConsultation = (counselorId) => {
  return api.post("/counselor/request-consultation", { counselorId })
}

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