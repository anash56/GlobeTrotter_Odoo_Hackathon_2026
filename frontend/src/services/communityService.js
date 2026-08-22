import api from './api.js';

export const communityService = {
  /**
   * Get community posts with search, filter, sort
   */
  async getPosts(params = {}) {
    try {
      const response = await api.get('/community/posts', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch community posts.');
    }
  },

  /**
   * Create a new community post
   */
  async createPost(postData) {
    try {
      const response = await api.post('/community/posts', postData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to publish post.');
    }
  },

  /**
   * Delete a post
   */
  async deletePost(id) {
    try {
      const response = await api.delete(`/community/posts/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete post.');
    }
  },

  /**
   * Toggle like on post
   */
  async toggleLike(id) {
    try {
      const response = await api.post(`/community/posts/${id}/like`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to toggle like.');
    }
  },

  /**
   * Get comments for post
   */
  async getComments(id) {
    try {
      const response = await api.get(`/community/posts/${id}/comments`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch comments.');
    }
  },

  /**
   * Add comment to post
   */
  async addComment(id, content) {
    try {
      const response = await api.post(`/community/posts/${id}/comments`, { content });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add comment.');
    }
  },
};
