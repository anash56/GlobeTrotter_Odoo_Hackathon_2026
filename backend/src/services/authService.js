import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'globetrotter_secret_key';

const generateToken = (userId, email, role) => {
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Service to register a new user in the database
 */
export const signupService = async ({ name, email, password, confirmPassword }) => {
  if (!name || !email || !password) {
    throw { status: 400, message: 'Name, email, and password are required.' };
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    throw { status: 400, message: 'Passwords do not match.' };
  }

  if (password.length < 6) {
    throw { status: 400, message: 'Password must be at least 6 characters long.' };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (existingUser) {
    throw { status: 400, message: 'Email is already registered.' };
  }

  // Hash password using bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user record in DB
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

  // Exclude passwordHash
  const { passwordHash: _, ...userWithoutPassword } = newUser;

  return {
    message: 'Account created successfully!',
    token,
    user: userWithoutPassword,
  };
};

/**
 * Service to authenticate user with email and password
 */
export const loginService = async ({ email, password }) => {
  if (!email || !password) {
    throw { status: 400, message: 'Email and password are required.' };
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    throw { status: 401, message: 'Invalid email or password.' };
  }

  // Verify bcrypt password
  const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordMatch) {
    throw { status: 401, message: 'Invalid email or password.' };
  }

  // Generate JWT token
  const token = generateToken(user.id, user.email, user.role);

  // Exclude passwordHash
  const { passwordHash: _, ...userWithoutPassword } = user;

  return {
    message: 'Login successful!',
    token,
    user: userWithoutPassword,
  };
};

/**
 * Service to get user profile by ID
 */
export const getUserProfileService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw { status: 404, message: 'User profile not found.' };
  }

  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
