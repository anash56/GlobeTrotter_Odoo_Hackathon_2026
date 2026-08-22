export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    // Response structure
    const user = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
    };
    const token = 'jwt_token_' + Date.now();

    return res.status(201).json({
      message: 'Account created successfully!',
      user,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0].replace('.', ' '),
      email,
    };
    const token = 'jwt_token_' + Date.now();

    return res.status(200).json({
      message: 'Login successful!',
      user,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    return res.status(200).json({
      success: true,
      message: `Password reset link sent to ${email}`,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Internal server error during password reset.' });
  }
};
