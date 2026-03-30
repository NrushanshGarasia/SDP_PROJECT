const User = require('../models/User');
const { ErrorResponse } = require('../middleware/errorHandler');
const mongoose = require('mongoose');

// Register user
exports.register = async (userData) => {
  const { name, email, password, role, phone, address } = userData;

  // Fail fast if DB is not connected
  if (mongoose.connection.readyState !== 1) {
    throw new ErrorResponse(
      'Database not connected. Please start MongoDB and restart the backend server.',
      503
    );
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ErrorResponse('User already exists with this email', 400);
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'student',
    phone,
    address,
  });

  // Generate token
  const token = user.getSignedJwtToken();

  return {
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
    },
  };
};

// Login user
exports.login = async (email, password) => {
  // Validate email & password
  if (!email || !password) {
    throw new ErrorResponse('Please provide email and password', 400);
  }

  // Fail fast if DB is not connected
  if (mongoose.connection.readyState !== 1) {
    throw new ErrorResponse(
      'Database not connected. Please start MongoDB and restart the backend server.',
      503
    );
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ErrorResponse('Invalid credentials', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    throw new ErrorResponse('Account is deactivated', 401);
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new ErrorResponse('Invalid credentials', 401);
  }

  // Generate token
  const token = user.getSignedJwtToken();

  return {
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
    },
  };
};

// Get current user
exports.getMe = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  return {
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  };
};
