import api from './api';

/**
 * Service for managing statistics and aggregations
 * Admin only endpoints
 */
const statsService = {
  // Class statistics
  async getClassStatsByType() {
    try {
      const response = await api.get('/gym/stats/by-type');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch class stats by type';
      throw new Error(errorMessage);
    }
  },

  async getPopularClasses() {
    try {
      const response = await api.get('/gym/stats/popular');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch popular classes';
      throw new Error(errorMessage);
    }
  },

  async getClassesByStatus() {
    try {
      const response = await api.get('/gym/stats/by-status');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch classes by status';
      throw new Error(errorMessage);
    }
  },

  async getClassDashboard() {
    try {
      const response = await api.get('/gym/stats/dashboard');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch class dashboard';
      throw new Error(errorMessage);
    }
  },

  // User statistics
  async getUsersByMembership() {
    try {
      const response = await api.get('/user/stats/by-membership');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch users by membership';
      throw new Error(errorMessage);
    }
  },

  async getUsersByRole() {
    try {
      const response = await api.get('/user/stats/by-role');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch users by role';
      throw new Error(errorMessage);
    }
  },

  async getUserDashboard() {
    try {
      const response = await api.get('/user/stats/dashboard');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch user dashboard';
      throw new Error(errorMessage);
    }
  },

  // Get all users (admin only)
  async getAllUsers() {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      throw new Error(errorMessage);
    }
  },

  // Delete user (admin only)
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/user/${userId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete user';
      throw new Error(errorMessage);
    }
  }
};

export default statsService;
