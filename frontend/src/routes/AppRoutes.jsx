import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Import pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Classes from '../pages/Classes';
import ClassDetailsPage from '../pages/ClassDetailsPage';
import Profile from '../pages/Profile';
import AdminDashboard from '../pages/AdminDashboard';

// Import protected route component
import ProtectedRoute from './ProtectedRoute';

/**
 * AppRoutes component - Defines all application routes
 * Handles routing logic for authenticated and unauthenticated users
 * 
 * Routes:
 * - / : Redirects to /classes if authenticated, otherwise to /login
 * - /login : Public login page
 * - /register : Public registration page
 * - /classes : Protected classes list page
 * - /classes/:id : Protected class details page
 * - /profile : Protected user profile page
 */
const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Root route - redirect based on authentication status */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to="/classes" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route 
        path="/classes" 
        element={
          <ProtectedRoute>
            <Classes />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/classes/:id" 
        element={
          <ProtectedRoute>
            <ClassDetailsPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Catch-all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
