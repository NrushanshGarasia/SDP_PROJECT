const feeService = require('../services/feeService');

// @desc    Get all fees
// @route   GET /api/fees
// @access  Private (Admin, Warden)
exports.getAllFees = async (req, res, next) => {
  try {
    const result = await feeService.getAllFees(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single fee
// @route   GET /api/fees/:id
// @access  Private
exports.getFee = async (req, res, next) => {
  try {
    const result = await feeService.getFee(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get my fees
// @route   GET /api/fees/me
// @access  Private (Student)
exports.getMyFees = async (req, res, next) => {
  try {
    const Student = require('../models/Student');
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    const result = await feeService.getFeesByStudent(student._id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Create fee
// @route   POST /api/fees
// @access  Private (Admin, Warden)
exports.createFee = async (req, res, next) => {
  try {
    const result = await feeService.createFee(req.body, req.user.id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Update fee
// @route   PUT /api/fees/:id
// @access  Private (Admin, Warden)
exports.updateFee = async (req, res, next) => {
  try {
    const result = await feeService.updateFee(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Pay fee
// @route   PUT /api/fees/:id/pay
// @access  Private
exports.payFee = async (req, res, next) => {
  try {
    const result = await feeService.payFee(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete fee
// @route   DELETE /api/fees/:id
// @access  Private (Admin)
exports.deleteFee = async (req, res, next) => {
  try {
    const result = await feeService.deleteFee(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
