import api from './api.js';

export const activityService = {
  /**
   * Search or list activities with filters
   */
  async getActivities(params = {}) {
    try {
      const response = await api.get('/activities', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to load activities.');
    }
  },

  /**
   * Get single activity by ID
   */
  async getActivityById(id) {
    try {
      const response = await api.get(`/activities/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to load activity details.');
    }
  },
};
