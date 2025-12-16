import api from './api';

/**
 * Service for managing user operations
 * Handles all API calls related to user profiles
 */
const userService = {
  /**
   * Fetch user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User object with profile information
   * @throws {Error} Network or API error
   */
  async getUserById(userId) {
    try {
      const response = await api.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch user profile';
      throw new Error(errorMessage);
    }
  },

  /**
   * Update user information
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data (username, email, phone)
   * @returns {Promise<Object>} Updated user object
   * @throws {Error} Network or API error
   */
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/user/${userId}`, userData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update user profile';
      throw new Error(errorMessage);
    }
  }
};

export default userService;
