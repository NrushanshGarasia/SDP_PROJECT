const Visitor = require('../models/Visitor');
const { ErrorResponse } = require('../middleware/errorHandler');

// Get all visitors
exports.getAllVisitors = async (filters = {}) => {
  const visitors = await Visitor.find(filters)
    .populate('student', 'studentId')
    .populate('student.user', 'name email')
    .populate('approvedBy', 'name email')
    .sort({ createdAt: -1 });

  return {
    success: true,
    count: visitors.length,
    data: visitors,
  };
};

// Get single visitor
exports.getVisitor = async (visitorId) => {
  const visitor = await Visitor.findById(visitorId)
    .populate('student', 'studentId')
    .populate('student.user', 'name email')
    .populate('approvedBy', 'name email');

  if (!visitor) {
    throw new ErrorResponse('Visitor not found', 404);
  }

  return {
    success: true,
    data: visitor,
  };
};

// Get visitors by student
exports.getVisitorsByStudent = async (studentId) => {
  const visitors = await Visitor.find({ student: studentId })
    .populate('approvedBy', 'name email')
    .sort({ createdAt: -1 });

  return {
    success: true,
    count: visitors.length,
    data: visitors,
  };
};

// Create visitor
exports.createVisitor = async (visitorData) => {
  const visitor = await Visitor.create(visitorData);

  return {
    success: true,
    data: visitor,
  };
};

// Update visitor
exports.updateVisitor = async (visitorId, updateData) => {
  const visitor = await Visitor.findByIdAndUpdate(visitorId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!visitor) {
    throw new ErrorResponse('Visitor not found', 404);
  }

  return {
    success: true,
    data: visitor,
  };
};

// Mark visitor exit
exports.markExit = async (visitorId) => {
  const visitor = await Visitor.findById(visitorId);

  if (!visitor) {
    throw new ErrorResponse('Visitor not found', 404);
  }

  if (visitor.status === 'left') {
    throw new ErrorResponse('Visitor already marked as left', 400);
  }

  visitor.status = 'left';
  visitor.exitTime = new Date();

  await visitor.save();

  return {
    success: true,
    data: visitor,
  };
};

// Delete visitor
exports.deleteVisitor = async (visitorId) => {
  const visitor = await Visitor.findById(visitorId);

  if (!visitor) {
    throw new ErrorResponse('Visitor not found', 404);
  }

  await visitor.deleteOne();

  return {
    success: true,
    data: {},
  };
};
