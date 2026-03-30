const LeaveRequest = require('../models/LeaveRequest');
const { ErrorResponse } = require('../middleware/errorHandler');

// Get all leave requests
exports.getAllLeaveRequests = async (filters = {}) => {
  const leaveRequests = await LeaveRequest.find(filters)
    .populate({
      path: 'student',
      select: 'studentId',
      populate: { path: 'user', select: 'name email' },
    })
    .populate('approvedBy', 'name email')
    .sort({ createdAt: -1 });

  return {
    success: true,
    count: leaveRequests.length,
    data: leaveRequests,
  };
};

// Get single leave request
exports.getLeaveRequest = async (leaveRequestId) => {
  const leaveRequest = await LeaveRequest.findById(leaveRequestId)
    .populate({
      path: 'student',
      select: 'studentId',
      populate: { path: 'user', select: 'name email' },
    })
    .populate('approvedBy', 'name email');

  if (!leaveRequest) {
    throw new ErrorResponse('Leave request not found', 404);
  }

  return {
    success: true,
    data: leaveRequest,
  };
};

// Get leave requests by student
exports.getLeaveRequestsByStudent = async (studentId) => {
  const leaveRequests = await LeaveRequest.find({ student: studentId })
    .populate('approvedBy', 'name email')
    .sort({ createdAt: -1 });

  return {
    success: true,
    count: leaveRequests.length,
    data: leaveRequests,
  };
};

// Create leave request
exports.createLeaveRequest = async (leaveRequestData) => {
  // Validate dates
  if (new Date(leaveRequestData.endDate) < new Date(leaveRequestData.startDate)) {
    throw new ErrorResponse('End date must be after start date', 400);
  }

  const leaveRequest = await LeaveRequest.create(leaveRequestData);

  return {
    success: true,
    data: leaveRequest,
  };
};

// Update leave request
exports.updateLeaveRequest = async (leaveRequestId, updateData) => {
  const leaveRequest = await LeaveRequest.findByIdAndUpdate(leaveRequestId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!leaveRequest) {
    throw new ErrorResponse('Leave request not found', 404);
  }

  return {
    success: true,
    data: leaveRequest,
  };
};

// Approve/Reject leave request
exports.approveLeaveRequest = async (leaveRequestId, approvedBy, status, remarks) => {
  const leaveRequest = await LeaveRequest.findById(leaveRequestId);

  if (!leaveRequest) {
    throw new ErrorResponse('Leave request not found', 404);
  }

  if (leaveRequest.status !== 'pending') {
    throw new ErrorResponse('Leave request already processed', 400);
  }

  leaveRequest.status = status;
  leaveRequest.approvedBy = approvedBy;
  leaveRequest.approvedAt = new Date();
  leaveRequest.remarks = remarks;

  await leaveRequest.save();

  return {
    success: true,
    data: leaveRequest,
  };
};

// Delete leave request
exports.deleteLeaveRequest = async (leaveRequestId) => {
  const leaveRequest = await LeaveRequest.findById(leaveRequestId);

  if (!leaveRequest) {
    throw new ErrorResponse('Leave request not found', 404);
  }

  await leaveRequest.deleteOne();

  return {
    success: true,
    data: {},
  };
};
