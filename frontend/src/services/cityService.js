import api from './api.js';

export const cityService = {
  /**
   * Search or list cities with query and filters
   */
  async getCities(params = {}) {
    try {
      // Allow calling with string query or filter object
      const queryParams = typeof params === 'string' ? { q: params } : params;
      const response = await api.get('/cities', { params: queryParams });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to load destination cities.');
    }
  },

  /**
   * Get single city by ID
   */
  async getCityById(id) {
    try {
      const response = await api.get(`/cities/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to load city details.');
    }
  },
};
