import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { signupService, loginService, getUserProfileService } from '../services/authService.js';
import { sendPasswordResetEmail } from '../services/emailService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'globetrotter_secret_key';

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

/**
 * @desc    Request password reset instructions via Brevo email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address.' });
    }

    // Generate signed JWT reset token with 15 minutes expiration
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email, purpose: 'reset-password' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/?resetToken=${resetToken}`;

    // Send email using Brevo
    await sendPasswordResetEmail(user.email, user.name, resetUrl);

    return res.status(200).json({
      message: `Password reset link sent to ${email.toLowerCase().trim()}`,
      success: true,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error processing password reset.' });
  }
};

/**
 * @desc    Reset password using valid reset token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Password reset token is missing or expired.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    // Verify JWT reset token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ error: 'Reset token is invalid or has expired. Please request a new link.' });
    }

    if (decoded.purpose !== 'reset-password') {
      return res.status(400).json({ error: 'Invalid token purpose.' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password in database
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { passwordHash: hashedPassword },
    });

    return res.status(200).json({
      message: 'Password has been successfully reset! You can now log in with your new password.',
      success: true,
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Failed to reset password. Please try again.' });
  }
};

export const register = signup;
