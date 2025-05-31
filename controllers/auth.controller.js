import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import config from '../config/config.js';
import { generateOTP, getOTPExpiration, validateOTP, formatPhoneNumber } from '../utils/otp.utils.js';

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

    // Format phone number
    const formattedPhone = formatPhoneNumber(phone);

    // Check if user exists
    const userExists = await User.findOne({ phone: formattedPhone });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      phone: formattedPhone,
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
    const formattedPhone = formatPhoneNumber(phone);

    // Check for user
    const user = await User.findOne({ phone: formattedPhone });
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

// @desc    Request PIN reset
// @route   POST /api/auth/forgot-pin
// @access  Public
export const forgotPin = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const formattedPhone = formatPhoneNumber(phone);

    // Find user
    const user = await User.findOne({ phone: formattedPhone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiration = getOTPExpiration();

    // Save OTP to user
    user.otp = {
      code: otp,
      expiresAt: otpExpiration
    };
    await user.save();

    // TODO: Integrate with SMS service to send OTP
    // For now, we'll just return it in the response
    res.json({ 
      message: 'OTP sent successfully',
      otp // Remove this in production
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

// @desc    Verify OTP and reset PIN
// @route   POST /api/auth/reset-pin
// @access  Public
export const resetPin = async (req, res, next) => {
  try {
    const { phone, otp, newPin } = req.body;
    const formattedPhone = formatPhoneNumber(phone);

    // Find user
    const user = await User.findOne({ phone: formattedPhone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate OTP
    const isValid = validateOTP(
      user.otp?.code,
      user.otp?.expiresAt,
      otp
    );

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update PIN
    user.pin = newPin;
    user.otp = undefined; // Clear OTP after successful reset
    await user.save();

    res.json({ message: 'PIN reset successful' });
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
}; 