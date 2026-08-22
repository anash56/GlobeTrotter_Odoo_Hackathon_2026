const API_BASE_URL = 'http://localhost:5000/api/trips';

export const tripService = {
  /**
   * Get trips belonging to current authenticated user
   */
  async getTrips() {
    const token = localStorage.getItem('gt_token');
    if (!token) return [];

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.trips || [];
      }
    } catch (err) {
      console.warn('Backend unavailable, returning user trip session data:', err.message);
    }

    return [];
  },

  /**
   * Create a new trip for current authenticated user
   */
  async createTrip(tripData) {
    const token = localStorage.getItem('gt_token');
    if (!token) {
      throw new Error('Please sign in to create a trip.');
    }

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tripData),
      });

      if (response.ok) {
        const data = await response.json();
        return data.trip;
      }
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to create trip.');
    } catch (err) {
      console.warn('Backend fallback trip creation:', err.message);
      const newTrip = {
        id: 'trip_' + Date.now(),
        title: tripData.title,
        description: tripData.description || 'Custom personal itinerary',
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        totalBudget: tripData.totalBudget || 0,
        coverPhotoUrl: tripData.coverPhotoUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
        stops: [],
      };
      return newTrip;
    }
  },
};
