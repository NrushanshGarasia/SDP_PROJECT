const messService = require('../services/messService');

// Mess Records Controllers
// @desc    Get all mess records
// @route   GET /api/mess/records
// @access  Private (Admin, Warden)
exports.getAllMessRecords = async (req, res, next) => {
  try {
    const result = await messService.getAllMessRecords(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get my mess records
// @route   GET /api/mess/records/me
// @access  Private (Student)
exports.getMyMessRecords = async (req, res, next) => {
  try {
    const Student = require('../models/Student');
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    const result = await messService.getMessRecordsByStudent(student._id, req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Create mess record
// @route   POST /api/mess/records
// @access  Private (Admin, Warden)
exports.createMessRecord = async (req, res, next) => {
  try {
    const result = await messService.createMessRecord(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Update mess record
// @route   PUT /api/mess/records/:id
// @access  Private (Admin, Warden)
exports.updateMessRecord = async (req, res, next) => {
  try {
    const result = await messService.updateMessRecord(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete mess record
// @route   DELETE /api/mess/records/:id
// @access  Private (Admin, Warden)
exports.deleteMessRecord = async (req, res, next) => {
  try {
    const result = await messService.deleteMessRecord(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Mess Menu Controllers
// @desc    Get all menus
// @route   GET /api/mess/menu
// @access  Private
exports.getAllMenus = async (req, res, next) => {
  try {
    const result = await messService.getAllMenus();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get menu by day
// @route   GET /api/mess/menu/:day
// @access  Private
exports.getMenuByDay = async (req, res, next) => {
  try {
    const result = await messService.getMenuByDay(req.params.day);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update menu
// @route   POST /api/mess/menu
// @access  Private (Admin, Warden)
exports.createOrUpdateMenu = async (req, res, next) => {
  try {
    const result = await messService.createOrUpdateMenu(req.body, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete menu
// @route   DELETE /api/mess/menu/:id
// @access  Private (Admin, Warden)
exports.deleteMenu = async (req, res, next) => {
  try {
    const result = await messService.deleteMenu(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
