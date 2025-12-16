import api from './api';

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Username
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Password
   * @param {string} userData.phone - Phone number
   * @param {string} userData.membershipType - Membership type (Básica, Premium, VIP)
   * @returns {Promise<Object>} Response data
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Response data with token and user info
   */
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  /**
   * Logout user by removing token from localStorage
   */
  logout() {
    localStorage.removeItem('token');
  }
};

export default authService;
