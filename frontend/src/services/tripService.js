import api from './api.js';

export const tripService = {
  /**
   * Create a new trip
   */
  async createTrip(tripData) {
    try {
      const response = await api.post('/trips', tripData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create trip.');
    }
  },

  /**
   * Get user trips
   */
  async getTrips() {
    try {
      const response = await api.get('/trips');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to load trips.');
    }
  },

  /**
   * Get trip by ID
   */
  async getTripById(id) {
    try {
      const response = await api.get(`/trips/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch trip details.');
    }
  },
};
