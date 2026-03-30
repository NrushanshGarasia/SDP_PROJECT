const Fee = require('../models/Fee');
const { ErrorResponse } = require('../middleware/errorHandler');

// Get all fees
exports.getAllFees = async (filters = {}) => {
  const fees = await Fee.find(filters)
    .populate('student', 'studentId')
    .populate('student.user', 'name email')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  return {
    success: true,
    count: fees.length,
    data: fees,
  };
};

// Get single fee
exports.getFee = async (feeId) => {
  const fee = await Fee.findById(feeId)
    .populate('student', 'studentId')
    .populate('student.user', 'name email')
    .populate('createdBy', 'name email');

  if (!fee) {
    throw new ErrorResponse('Fee not found', 404);
  }

  return {
    success: true,
    data: fee,
  };
};

// Get fees by student
exports.getFeesByStudent = async (studentId) => {
  const fees = await Fee.find({ student: studentId })
    .populate({
      path: 'student',
      select: 'studentId',
      populate: { path: 'user', select: 'name email' },
    })
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  return {
    success: true,
    count: fees.length,
    data: fees,
  };
};

// Create fee
exports.createFee = async (feeData, createdBy) => {
  const fee = await Fee.create({
    ...feeData,
    createdBy,
  });

  return {
    success: true,
    data: fee,
  };
};

// Update fee
exports.updateFee = async (feeId, updateData) => {
  const fee = await Fee.findByIdAndUpdate(feeId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!fee) {
    throw new ErrorResponse('Fee not found', 404);
  }

  return {
    success: true,
    data: fee,
  };
};

// Pay fee
exports.payFee = async (feeId, paymentData) => {
  const fee = await Fee.findById(feeId);

  if (!fee) {
    throw new ErrorResponse('Fee not found', 404);
  }

  if (fee.status === 'paid') {
    throw new ErrorResponse('Fee already paid', 400);
  }

  fee.status = 'paid';
  fee.paidDate = new Date();
  fee.paymentMethod = paymentData.paymentMethod;
  fee.transactionId = paymentData.transactionId;
  fee.remarks = paymentData.remarks;

  await fee.save();

  return {
    success: true,
    data: fee,
  };
};

// Delete fee
exports.deleteFee = async (feeId) => {
  const fee = await Fee.findById(feeId);

  if (!fee) {
    throw new ErrorResponse('Fee not found', 404);
  }

  await fee.deleteOne();

  return {
    success: true,
    data: {},
  };
};
