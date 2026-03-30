const complaintService = require('../services/complaintService');

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private (Admin, Warden)
exports.getAllComplaints = async (req, res, next) => {
  try {
    const result = await complaintService.getAllComplaints(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaint = async (req, res, next) => {
  try {
    const result = await complaintService.getComplaint(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get my complaints
// @route   GET /api/complaints/me
// @access  Private (Student)
exports.getMyComplaints = async (req, res, next) => {
  try {
    const Student = require('../models/Student');
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    const result = await complaintService.getComplaintsByStudent(student._id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Create complaint
// @route   POST /api/complaints
// @access  Private (Student)
exports.createComplaint = async (req, res, next) => {
  try {
    const Student = require('../models/Student');
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    const result = await complaintService.createComplaint({
      ...req.body,
      student: student._id,
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private (Admin, Warden)
exports.updateComplaint = async (req, res, next) => {
  try {
    const result = await complaintService.updateComplaint(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Resolve complaint
// @route   PUT /api/complaints/:id/resolve
// @access  Private (Admin, Warden)
exports.resolveComplaint = async (req, res, next) => {
  try {
    const result = await complaintService.resolveComplaint(
      req.params.id,
      req.user.id,
      req.body.response
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Admin)
exports.deleteComplaint = async (req, res, next) => {
  try {
    const result = await complaintService.deleteComplaint(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
