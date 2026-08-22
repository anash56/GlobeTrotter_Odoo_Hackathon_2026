import api from './api.js';

export const itineraryService = {
  /**
   * Get full itinerary details for a trip
   */
  async getItinerary(tripId) {
    try {
      const response = await api.get(`/trips/${tripId}/itinerary`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch trip itinerary.');
    }
  },

  /**
   * Add a new stop/destination section to trip
   */
  async createStop(tripId, stopData) {
    try {
      const response = await api.post(`/trips/${tripId}/stops`, stopData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add destination stop.');
    }
  },

  /**
   * Update an existing stop
   */
  async updateStop(tripId, stopId, stopData) {
    try {
      const response = await api.patch(`/trips/${tripId}/stops/${stopId}`, stopData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update destination stop.');
    }
  },

  /**
   * Delete a stop
   */
  async deleteStop(tripId, stopId) {
    try {
      const response = await api.delete(`/trips/${tripId}/stops/${stopId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete destination stop.');
    }
  },

  /**
   * Reorder stops
   */
  async reorderStops(tripId, stopIds) {
    try {
      const response = await api.patch(`/trips/${tripId}/stops/reorder`, { stopIds });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to reorder stops.');
    }
  },

  /**
   * Add activity to a stop
   */
  async createActivity(tripId, stopId, activityData) {
    try {
      const response = await api.post(`/trips/${tripId}/stops/${stopId}/activities`, activityData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add activity.');
    }
  },

  /**
   * Update an activity
   */
  async updateActivity(tripId, stopId, activityId, activityData) {
    try {
      const response = await api.patch(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`, activityData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update activity.');
    }
  },

  /**
   * Delete an activity
   */
  async deleteActivity(tripId, stopId, activityId) {
    try {
      const response = await api.delete(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete activity.');
    }
  },

  /**
   * Reorder activities in a stop
   */
  async reorderActivities(tripId, stopId, activityIds) {
    try {
      const response = await api.patch(`/trips/${tripId}/stops/${stopId}/activities/reorder`, { activityIds });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to reorder activities.');
    }
  },
};
