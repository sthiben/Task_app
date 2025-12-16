import api from './api';

/**
 * Service for managing gym class operations
 * Handles all API calls related to classes (tasks in the backend)
 */
const classService = {
  /**
   * Fetch all classes from the API
   * @returns {Promise<Array>} Array of class objects
   * @throws {Error} Network or API error
   */
  async getAllClasses() {
    try {
      const response = await api.get('/gym');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch classes';
      throw new Error(errorMessage);
    }
  },

  /**
   * Fetch a single class by ID
   * @param {string} id - Class ID
   * @returns {Promise<Object>} Class object with full details
   * @throws {Error} Network or API error
   */
  async getClassById(id) {
    try {
      const response = await api.get(`/gym/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch class details';
      throw new Error(errorMessage);
    }
  },

  /**
   * Create a new class
   * @param {Object} classData - Class data including title, description, type, etc.
   * @returns {Promise<Object>} Created class object
   * @throws {Error} Network or API error
   */
  async createClass(classData) {
    try {
      const response = await api.post('/gym', classData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create class';
      throw new Error(errorMessage);
    }
  },

  /**
   * Update an existing class
   * @param {string} id - Class ID
   * @param {Object} classData - Updated class data
   * @returns {Promise<Object>} Updated class object
   * @throws {Error} Network or API error
   */
  async updateClass(id, classData) {
    try {
      const response = await api.put(`/gym/${id}`, classData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update class';
      throw new Error(errorMessage);
    }
  },

  /**
   * Add a comment to a class
   * @param {string} classId - Class ID
   * @param {Object} commentData - Comment data with userId, name, and text
   * @returns {Promise<Object>} Updated class object with new comment
   * @throws {Error} Network or API error
   */
  async addComment(classId, commentData) {
    try {
      const response = await api.post(`/gym/${classId}/comment`, commentData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add comment';
      throw new Error(errorMessage);
    }
  },

  async enrollInClass(classId, userId) {
    try {
      const response = await api.post(`/gym/${classId}/enroll`, { userId });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to enroll in class';
      throw new Error(errorMessage);
    }
  },

  async deleteClass(classId) {
    try {
      const response = await api.delete(`/gym/${classId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete class';
      throw new Error(errorMessage);
    }
  }
};

export default classService;
