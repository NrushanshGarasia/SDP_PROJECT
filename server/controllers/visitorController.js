const visitorService = require('../services/visitorService');

// @desc    Get all visitors
// @route   GET /api/visitors
// @access  Private (Admin, Warden)
exports.getAllVisitors = async (req, res, next) => {
  try {
    const result = await visitorService.getAllVisitors(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single visitor
// @route   GET /api/visitors/:id
// @access  Private
exports.getVisitor = async (req, res, next) => {
  try {
    const result = await visitorService.getVisitor(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get my visitors
// @route   GET /api/visitors/me
// @access  Private (Student)
exports.getMyVisitors = async (req, res, next) => {
  try {
    const Student = require('../models/Student');
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    const result = await visitorService.getVisitorsByStudent(student._id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Create visitor
// @route   POST /api/visitors
// @access  Private (Student)
exports.createVisitor = async (req, res, next) => {
  try {
    const Student = require('../models/Student');
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    const result = await visitorService.createVisitor({
      ...req.body,
      student: student._id,
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Update visitor
// @route   PUT /api/visitors/:id
// @access  Private (Admin, Warden)
exports.updateVisitor = async (req, res, next) => {
  try {
    const result = await visitorService.updateVisitor(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark visitor exit
// @route   PUT /api/visitors/:id/exit
// @access  Private (Admin, Warden)
exports.markExit = async (req, res, next) => {
  try {
    const result = await visitorService.markExit(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete visitor
// @route   DELETE /api/visitors/:id
// @access  Private (Admin)
exports.deleteVisitor = async (req, res, next) => {
  try {
    const result = await visitorService.deleteVisitor(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
