import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import config from '../config/config.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, phone, role, location, preferredLanguage, pin } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      phone,
      role,
      location,
      preferredLanguage,
      pin
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { phone, pin } = req.body;

    // Check for user
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if PIN matches
    if (user.pin !== pin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-pin');
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
}; 