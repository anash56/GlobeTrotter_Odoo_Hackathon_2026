const API_BASE_URL = 'http://localhost:5000/api/auth';

export const authService = {
  /**
   * Login User
   */
  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed. Invalid credentials.');
    }

    if (data.token) {
      localStorage.setItem('gt_token', data.token);
      localStorage.setItem('gt_user', JSON.stringify(data.user));
    }

    return data;
  },

  /**
   * Signup User
   */
  async signup(userData) {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Signup failed. Please check your details.');
    }

    if (data.token) {
      localStorage.setItem('gt_token', data.token);
      localStorage.setItem('gt_user', JSON.stringify(data.user));
    }

    return data;
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
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('gt_user', JSON.stringify(data.user));
        return data.user;
      }
    } catch (err) {
      console.warn('Failed to verify token session:', err.message);
    }

    // Clear stale session on failure
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
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to request password reset. Please try again.');
    }

    return data;
  },

  /**
   * Reset Password with Token
   */
  async resetPassword({ token, password, confirmPassword }) {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password, confirmPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to reset password. Please try again.');
    }

    return data;
  },
};


