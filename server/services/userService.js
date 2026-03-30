const User = require('../models/User');
const { ErrorResponse } = require('../middleware/errorHandler');

// Get all users
exports.getAllUsers = async (filters = {}) => {
  const users = await User.find(filters)
    .select('-password')
    .sort({ createdAt: -1 });

  return {
    success: true,
    count: users.length,
    data: users,
  };
};

// Get single user
exports.getUser = async (userId) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  return {
    success: true,
    data: user,
  };
};

// Update user
exports.updateUser = async (userId, updateData) => {
  // Don't allow password update through this route
  delete updateData.password;

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  return {
    success: true,
    data: user,
  };
};

// Delete user
exports.deleteUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  await user.deleteOne();

  return {
    success: true,
    data: {},
  };
};

// Activate/Deactivate user
exports.toggleUserStatus = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  user.isActive = !user.isActive;
  await user.save();

  return {
    success: true,
    data: user,
  };
};
