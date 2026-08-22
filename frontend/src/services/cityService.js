import api from './api.js';

export const cityService = {
  /**
   * Search or list cities
   */
  async getCities(query = '', popular = false) {
    try {
      const params = {};
      if (query) params.q = query;
      if (popular) params.popular = 'true';

      const response = await api.get('/cities', { params });
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
