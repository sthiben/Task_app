import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';

/**
 * ProtectedRoute component to guard authenticated routes
 * Redirects to login page if user is not authenticated
 * Shows loading state while checking authentication
 * Includes Navbar for all authenticated pages
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactElement} Protected content or redirect
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content with Navbar if authenticated
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default ProtectedRoute;
