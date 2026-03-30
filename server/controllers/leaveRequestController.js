const leaveRequestService = require('../services/leaveRequestService');

// @desc    Get all leave requests
// @route   GET /api/leave-requests
// @access  Private (Admin, Warden)
exports.getAllLeaveRequests = async (req, res, next) => {
  try {
    const result = await leaveRequestService.getAllLeaveRequests(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single leave request
// @route   GET /api/leave-requests/:id
// @access  Private
exports.getLeaveRequest = async (req, res, next) => {
  try {
    const result = await leaveRequestService.getLeaveRequest(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get my leave requests
// @route   GET /api/leave-requests/me
// @access  Private (Student)
exports.getMyLeaveRequests = async (req, res, next) => {
  try {
    const Student = require('../models/Student');
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    const result = await leaveRequestService.getLeaveRequestsByStudent(student._id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Create leave request
// @route   POST /api/leave-requests
// @access  Private (Student)
exports.createLeaveRequest = async (req, res, next) => {
  try {
    const Student = require('../models/Student');
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    const result = await leaveRequestService.createLeaveRequest({
      ...req.body,
      student: student._id,
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Update leave request
// @route   PUT /api/leave-requests/:id
// @access  Private (Student)
exports.updateLeaveRequest = async (req, res, next) => {
  try {
    const result = await leaveRequestService.updateLeaveRequest(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Reject leave request
// @route   PUT /api/leave-requests/:id/approve
// @access  Private (Admin, Warden)
exports.approveLeaveRequest = async (req, res, next) => {
  try {
    const result = await leaveRequestService.approveLeaveRequest(
      req.params.id,
      req.user.id,
      req.body.status,
      req.body.remarks
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete leave request
// @route   DELETE /api/leave-requests/:id
// @access  Private (Student)
exports.deleteLeaveRequest = async (req, res, next) => {
  try {
    const result = await leaveRequestService.deleteLeaveRequest(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
