import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AccessDenied from './pages/AccessDenied';
import { ROUTES } from './utils/constants';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div className="loading-spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path={ROUTES.LOGIN} 
        element={
          user 
            ? <Navigate to={user.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.EMPLOYEE_DASHBOARD} replace /> 
            : <Login />
        } 
      />
      <Route 
        path={ROUTES.SIGNUP} 
        element={
          user 
            ? <Navigate to={user.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.EMPLOYEE_DASHBOARD} replace /> 
            : <Signup />
        } 
      />

      {/* Protected routes */}
      <Route
        path={ROUTES.EMPLOYEE_DASHBOARD}
        element={
          <ProtectedRoute>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_DASHBOARD}
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Error routes */}
      <Route path={ROUTES.ACCESS_DENIED} element={<AccessDenied />} />

      {/* Redirect root to appropriate dashboard */}
      <Route 
        path="/" 
        element={
          user 
            ? <Navigate to={user.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.EMPLOYEE_DASHBOARD} replace />
            : <Navigate to={ROUTES.LOGIN} replace />
        } 
      />

      {/* 404 - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
