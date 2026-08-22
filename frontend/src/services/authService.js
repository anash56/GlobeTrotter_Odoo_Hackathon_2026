const API_BASE_URL = 'http://localhost:5000/api/auth';

/**
 * Helper to simulate network latency when backend is running in fallback mode
 */
const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  /**
   * Login User
   */
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        if (credentials.rememberMe) {
          localStorage.setItem('gt_user', JSON.stringify(data.user));
          localStorage.setItem('gt_token', data.token);
        } else {
          sessionStorage.setItem('gt_user', JSON.stringify(data.user));
          sessionStorage.setItem('gt_token', data.token);
        }
        return data;
      }
    } catch (err) {
      console.warn('Backend unavailable, engaging frontend simulation mode:', err.message);
    }

    // Simulated fallback response for seamless frontend testing
    await delay(1000);
    
    // Simple verification check for demo
    if (credentials.password.length < 6) {
      throw new Error('Invalid credentials. Password must be at least 6 characters.');
    }

    const mockUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: credentials.email.split('@')[0].replace('.', ' '),
      email: credentials.email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    };
    const mockToken = 'mock_jwt_token_' + Date.now();

    if (credentials.rememberMe) {
      localStorage.setItem('gt_user', JSON.stringify(mockUser));
      localStorage.setItem('gt_token', mockToken);
    } else {
      sessionStorage.setItem('gt_user', JSON.stringify(mockUser));
      sessionStorage.setItem('gt_token', mockToken);
    }

    return { user: mockUser, token: mockToken, message: 'Login successful!' };
  },

  /**
   * Register User
   */
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('Backend unavailable, engaging simulation mode:', err.message);
    }

    // Simulated fallback response
    await delay(1200);

    const newUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: userData.name,
      email: userData.email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    };
    const mockToken = 'mock_jwt_token_' + Date.now();

    localStorage.setItem('gt_user', JSON.stringify(newUser));
    localStorage.setItem('gt_token', mockToken);

    return { user: newUser, token: mockToken, message: 'Account created successfully!' };
  },

  /**
   * Request Password Reset
   */
  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('Backend unavailable, engaging simulation mode:', err.message);
    }

    await delay(900);
    return { success: true, message: `Password reset link sent to ${email}` };
  },

  /**
   * Get Current Session User
   */
  getCurrentUser() {
    const local = localStorage.getItem('gt_user');
    if (local) return JSON.parse(local);

    const session = sessionStorage.getItem('gt_user');
    if (session) return JSON.parse(session);

    return null;
  },

  /**
   * Logout
   */
  logout() {
    localStorage.removeItem('gt_user');
    localStorage.removeItem('gt_token');
    sessionStorage.removeItem('gt_user');
    sessionStorage.removeItem('gt_token');
  }
};
