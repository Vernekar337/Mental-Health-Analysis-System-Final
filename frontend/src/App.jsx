import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentAssessments from './pages/student/Assessments';
import StudentJournal from './pages/student/Journal';
import StudentReport from './pages/student/Report';
import StudentHistory from './pages/student/History';
import ReflectiveAssessment from './pages/student/ReflectiveAssessment';
import RelaxRoom from './pages/student/RelaxRoom'; // New Import

// Counselor Pages
import CounselorDashboard from './pages/counselor/Dashboard';
import CounselorCaseDetail from './pages/counselor/CaseDetail'; // Real Component
import { CaseReview as CounselorCases } from './pages/counselor/Placeholders';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import NotFound from './pages/NotFound';
import ParentReport from './pages/parent/Report';
import ParentAlerts from './pages/parent/Alerts'; // New Import

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<Layout />}>
          {/* Student */}
          <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/assessments" element={<StudentAssessments />} />
            <Route path="/student/journal" element={<StudentJournal />} />
            <Route path="/student/report" element={<StudentReport />} />
            <Route path="/student/history" element={<StudentHistory />} />
            <Route path="/student/reflection" element={<ReflectiveAssessment />} />
            <Route path="/student/relax" element={<RelaxRoom />} />
          </Route>

          {/* Counselor */}
          <Route element={<ProtectedRoute allowedRoles={['Counselor']} />}>
            <Route path="/counselor/dashboard" element={<CounselorDashboard />} />
            <Route path="/counselor/cases" element={<CounselorCases />} />
            <Route path="/counselor/cases/:id" element={<CounselorCaseDetail />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Parent */}
          <Route element={<ProtectedRoute allowedRoles={['Parent']} />}>
            <Route path="/parent/report" element={<ParentReport />} />
            <Route path="/parent/alerts" element={<ParentAlerts />} />
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
