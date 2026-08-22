const API_BASE_URL = 'http://localhost:5000/api/auth';

export const authService = {
  /**
   * Login User (NO JWT/Token stored)
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

    return data;
  },

  /**
   * Signup User (NO JWT/Token stored)
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

    return data;
  },

  /**
   * Register Alias
   */
  async register(userData) {
    return this.signup(userData);
  },

  /**
   * Request Password Reset (UI-Only placeholder)
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
      console.warn('Forgot password backend offline');
    }
    return { success: true, message: `Password reset link sent to ${email}` };
  },
};
