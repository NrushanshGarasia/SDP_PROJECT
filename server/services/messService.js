const Mess = require('../models/Mess');
const MessMenu = require('../models/MessMenu');
const { ErrorResponse } = require('../middleware/errorHandler');

// Get all mess records
exports.getAllMessRecords = async (filters = {}) => {
  const messRecords = await Mess.find(filters)
    .populate('student', 'studentId')
    .populate('student.user', 'name email')
    .sort({ date: -1, mealType: 1 });

  return {
    success: true,
    count: messRecords.length,
    data: messRecords,
  };
};

// Get mess records by student
exports.getMessRecordsByStudent = async (studentId, filters = {}) => {
  const messRecords = await Mess.find({ student: studentId, ...filters })
    .sort({ date: -1, mealType: 1 });

  return {
    success: true,
    count: messRecords.length,
    data: messRecords,
  };
};

// Create mess record
exports.createMessRecord = async (messData) => {
  const mess = await Mess.create(messData);

  return {
    success: true,
    data: mess,
  };
};

// Update mess record
exports.updateMessRecord = async (messId, updateData) => {
  const mess = await Mess.findByIdAndUpdate(messId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!mess) {
    throw new ErrorResponse('Mess record not found', 404);
  }

  return {
    success: true,
    data: mess,
  };
};

// Delete mess record
exports.deleteMessRecord = async (messId) => {
  const mess = await Mess.findById(messId);

  if (!mess) {
    throw new ErrorResponse('Mess record not found', 404);
  }

  await mess.deleteOne();

  return {
    success: true,
    data: {},
  };
};

// Mess Menu Services
exports.getAllMenus = async () => {
  const menus = await MessMenu.find({ isActive: true })
    .populate('updatedBy', 'name email')
    .sort({ day: 1 });

  return {
    success: true,
    count: menus.length,
    data: menus,
  };
};

exports.getMenuByDay = async (day) => {
  const menu = await MessMenu.findOne({ day, isActive: true })
    .populate('updatedBy', 'name email');

  if (!menu) {
    throw new ErrorResponse('Menu not found for this day', 404);
  }

  return {
    success: true,
    data: menu,
  };
};

exports.createOrUpdateMenu = async (menuData, updatedBy) => {
  const menu = await MessMenu.findOneAndUpdate(
    { day: menuData.day },
    {
      ...menuData,
      updatedBy,
      isActive: true,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  return {
    success: true,
    data: menu,
  };
};

exports.deleteMenu = async (menuId) => {
  const menu = await MessMenu.findById(menuId);

  if (!menu) {
    throw new ErrorResponse('Menu not found', 404);
  }

  await menu.deleteOne();

  return {
    success: true,
    data: {},
  };
};
