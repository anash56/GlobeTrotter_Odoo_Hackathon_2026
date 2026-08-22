import api from './api.js';

export const authService = {
  /**
   * Login User
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      const data = response.data;
      if (data.token) {
        localStorage.setItem('gt_token', data.token);
        localStorage.setItem('gt_user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed. Invalid credentials.');
    }
  },

  /**
   * Signup User
   */
  async signup(userData) {
    try {
      const response = await api.post('/auth/signup', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
      });

      const data = response.data;
      if (data.token) {
        localStorage.setItem('gt_token', data.token);
        localStorage.setItem('gt_user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Signup failed. Please check your details.');
    }
  },

  /**
   * Register Alias
   */
  async register(userData) {
    return this.signup(userData);
  },

  /**
   * Get Logged-In User Profile via JWT
   */
  async getMe() {
    const token = localStorage.getItem('gt_token');
    if (!token) return null;

    try {
      const response = await api.get('/auth/me');
      if (response.data?.user) {
        localStorage.setItem('gt_user', JSON.stringify(response.data.user));
        return response.data.user;
      }
    } catch (err) {
      console.warn('Failed to verify token session:', err.message);
    }

    this.logout();
    return null;
  },

  /**
   * Get Current Stored User
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('gt_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Logout User
   */
  logout() {
    localStorage.removeItem('gt_token');
    localStorage.removeItem('gt_user');
  },

  /**
   * Request Password Reset
   */
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to request password reset. Please try again.');
    }
  },

  /**
   * Reset Password with Token
   */
  async resetPassword({ token, password, confirmPassword }) {
    try {
      const response = await api.post('/auth/reset-password', { token, password, confirmPassword });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to reset password. Please try again.');
    }
  },
};
