import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize authentication state on app load
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken) {
        setToken(storedToken);
        
        // Restore user data from localStorage if available
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (err) {
            console.error('Failed to parse stored user data:', err);
            localStorage.removeItem('user');
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data and token
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await authService.login(email, password);
      
      setToken(data.token);
      setUser(data.user);
      
      // Persist user data in localStorage for page refresh
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await authService.register(userData);
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user and clear authentication state
   */
  const logout = () => {
    authService.logout();
    localStorage.removeItem('user'); // Clear user data from localStorage
    setUser(null);
    setToken(null);
    setError(null);
  };

  /**
   * Update user information in context
   * @param {Object} userData - Updated user data
   */
  const updateUser = (userData) => {
    const updatedUser = {
      ...user,
      ...userData
    };
    setUser(updatedUser);
    
    // Update user data in localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    error,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
