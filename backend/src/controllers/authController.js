import { signupService, loginService, getUserProfileService } from '../services/authService.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req, res) => {
  try {
    const result = await signupService(req.body);
    return res.status(201).json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error('Signup controller error:', error);
    return res.status(500).json({ error: 'Internal server error during signup.' });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const result = await loginService(req.body);
    return res.status(200).json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error('Login controller error:', error);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
};

/**
 * @desc    Get logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    const userProfile = await getUserProfileService(req.user.id);
    return res.status(200).json({ user: userProfile });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error('GetMe controller error:', error);
    return res.status(500).json({ error: 'Failed to retrieve user profile.' });
  }
};

export const register = signup;
