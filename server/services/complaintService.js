const Complaint = require('../models/Complaint');
const { ErrorResponse } = require('../middleware/errorHandler');

// Get all complaints
exports.getAllComplaints = async (filters = {}) => {
  const complaints = await Complaint.find(filters)
    .populate('student', 'studentId')
    .populate('student.user', 'name email')
    .populate('resolvedBy', 'name email')
    .sort({ createdAt: -1 });

  return {
    success: true,
    count: complaints.length,
    data: complaints,
  };
};

// Get single complaint
exports.getComplaint = async (complaintId) => {
  const complaint = await Complaint.findById(complaintId)
    .populate('student', 'studentId')
    .populate('student.user', 'name email')
    .populate('resolvedBy', 'name email');

  if (!complaint) {
    throw new ErrorResponse('Complaint not found', 404);
  }

  return {
    success: true,
    data: complaint,
  };
};

// Get complaints by student
exports.getComplaintsByStudent = async (studentId) => {
  const complaints = await Complaint.find({ student: studentId })
    .populate('resolvedBy', 'name email')
    .sort({ createdAt: -1 });

  return {
    success: true,
    count: complaints.length,
    data: complaints,
  };
};

// Create complaint
exports.createComplaint = async (complaintData) => {
  const complaint = await Complaint.create(complaintData);

  return {
    success: true,
    data: complaint,
  };
};

// Update complaint
exports.updateComplaint = async (complaintId, updateData) => {
  const complaint = await Complaint.findByIdAndUpdate(complaintId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!complaint) {
    throw new ErrorResponse('Complaint not found', 404);
  }

  return {
    success: true,
    data: complaint,
  };
};

// Resolve complaint
exports.resolveComplaint = async (complaintId, resolvedBy, response) => {
  const complaint = await Complaint.findById(complaintId);

  if (!complaint) {
    throw new ErrorResponse('Complaint not found', 404);
  }

  complaint.status = 'resolved';
  complaint.response = response;
  complaint.resolvedBy = resolvedBy;
  complaint.resolvedAt = new Date();

  await complaint.save();

  return {
    success: true,
    data: complaint,
  };
};

// Delete complaint
exports.deleteComplaint = async (complaintId) => {
  const complaint = await Complaint.findById(complaintId);

  if (!complaint) {
    throw new ErrorResponse('Complaint not found', 404);
  }

  await complaint.deleteOne();

  return {
    success: true,
    data: {},
  };
};
