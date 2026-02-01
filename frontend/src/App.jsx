import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './routes/ProtectedRoute';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentAssessments from './pages/student/Assessments';
import StudentJournal from './pages/student/Journal';

// Counselor Pages
import CounselorDashboard from './pages/counselor/Dashboard';
import CounselorCases from './pages/counselor/CaseReview';
import CounselorCaseDetail from './pages/counselor/CaseDetail';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import NotFound from './pages/NotFound';

const App = () => {
  return (
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

        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
