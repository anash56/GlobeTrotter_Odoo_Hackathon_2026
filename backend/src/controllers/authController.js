import prisma from '../config/prisma.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    // Check if user with given email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    // Create user using Prisma (role automatically USER, no bcrypt/JWT)
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash: password,
        role: 'USER',
      },
    });

    // Exclude passwordHash from output
    const { passwordHash, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      message: 'Account created successfully!',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error during signup.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Verify entered password against stored password
    if (user.passwordHash !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Exclude passwordHash from output (no token / JWT)
    const { passwordHash, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: 'Login successful!',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
};

export const register = signup;
