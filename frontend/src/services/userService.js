import api from './api.js';

export const userService = {
  /**
   * Fetch authenticated user's profile and trip statistics
   */
  async getProfile() {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch user profile.');
    }
  },

  /**
   * Update authenticated user's profile (name & avatarUrl)
   */
  async updateProfile(profileData) {
    try {
      const response = await api.patch('/users/me', profileData);
      const data = response.data;
      if (data.user) {
        localStorage.setItem('gt_user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update user profile.');
    }
  },
};
