import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import MyAttendance from './pages/MyAttendance';
import Profile from './pages/Profile';
import ManagerDashboard from './pages/ManagerDashboard';
import AllAttendance from './pages/AllAttendance';
import Reports from './pages/Reports';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Employee Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <Layout>
                <EmployeeDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-history"
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <Layout>
                <MyAttendance />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['employee', 'manager']}>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Manager Routes */}
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <Layout>
                <ManagerDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-attendance"
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <Layout>
                <AllAttendance />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
