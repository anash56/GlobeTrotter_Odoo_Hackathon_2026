import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'globetrotter_secret_key';

const generateToken = (userId, email, role) => {
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: '7d' });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    // Hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with hashed password
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash: hashedPassword,
        role: 'USER',
      },
    });

    // Generate JWT token
    const token = generateToken(newUser.id, newUser.email, newUser.role);

    // Exclude passwordHash from returned payload
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Signup error:', error);
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare hashed password with bcrypt
    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email, user.role);

    // Exclude passwordHash from returned payload
    const { passwordHash: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: 'Login successful!',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
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
    return res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
};

export const register = signup;
