const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ success: false, message: 'Name and password are required' });
    }
    if (!email && !phone) {
      return res.status(400).json({ success: false, message: 'Either email or phone is required' });
    }

    // Check existing user
    const existingQuery = [];
    if (email) existingQuery.push({ email });
    if (phone) existingQuery.push({ phone });
    const existing = await User.findOne({ $or: existingQuery });
    if (existing) {
      return res.status(409).json({ success: false, message: 'User with this email/phone already exists' });
    }

    const user = await User.create({ name, email, phone, password });
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;

    if (!password || (!email && !phone)) {
      return res.status(400).json({ success: false, message: 'Please provide email/phone and password' });
    }

    const query = email ? { email } : { phone };
    const user = await User.findOne(query).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account has been deactivated' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
