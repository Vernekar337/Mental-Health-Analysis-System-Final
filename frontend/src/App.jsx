import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AuthPage from './pages/auth/AuthPage';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentAssessments from './pages/student/Assessments';
import StudentJournal from './pages/student/Journal';
import StudentReport from './pages/student/Report';
import StudentHistory from './pages/student/History';
import ReflectiveAssessment from './pages/student/ReflectiveAssessment';
import RelaxRoom from './pages/student/RelaxRoom';
import AudioDiaryPage from './pages/student/AudioDiary'; // New Import

// Counselor Pages
import CounselorDashboard from './pages/counselor/Dashboard';
import CounselorCaseDetail from './pages/counselor/CaseDetail'; // Real Component
import { CaseReview as CounselorCases } from './pages/counselor/Placeholders';
import CounselorStudentSuggestion from './pages/counselor/StudentSuggestion';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import NotFound from './pages/NotFound';
import ParentReport from './pages/parent/Report';
import ParentAlerts from './pages/parent/Alerts';
import ParentLinkChild from './pages/parent/LinkChild';
import FindCounselor from './pages/parent/FindCounselor';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Routes */}
        <Route element={<Layout />}>
          {/* Student */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/assessments" element={<StudentAssessments />} />
            <Route path="/student/journal" element={<StudentJournal />} />
            <Route path="/student/report" element={<StudentReport />} />
            <Route path="/student/history" element={<StudentHistory />} />
            <Route path="/student/reflection" element={<ReflectiveAssessment />} />
            <Route path="/student/relax" element={<RelaxRoom />} />
            <Route path="/student/audio-diary" element={<AudioDiaryPage />} />
          </Route>

          {/* Counselor */}
          <Route element={<ProtectedRoute allowedRoles={['counselor']} />}>
            <Route path="/counselor/dashboard" element={<CounselorDashboard />} />
            <Route path="/counselor/cases" element={<CounselorCases />} />
            <Route path="/counselor/cases/:id" element={<CounselorCaseDetail />} />
            <Route path="/counselor/student/:studentId" element={<CounselorStudentSuggestion />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Parent */}
          <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
            <Route path="/parent/report" element={<ParentReport />} />
            <Route path="/parent/alerts" element={<ParentAlerts />} />
            <Route path="/parent/link-child" element={<ParentLinkChild />} />
            <Route path="/parent/find-counselor" element={<FindCounselor />} />
          </Route>

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/student/dashboard" replace />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
