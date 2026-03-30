const Notice = require('../models/Notice');
const { ErrorResponse } = require('../middleware/errorHandler');

// Get all notices
exports.getAllNotices = async (filters = {}) => {
  const notices = await Notice.find(filters)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  return {
    success: true,
    count: notices.length,
    data: notices,
  };
};

// Get active notices
exports.getActiveNotices = async (targetAudience = 'all') => {
  const query = {
    isActive: true,
    $or: [{ targetAudience: 'all' }, { targetAudience }],
  };

  // Filter out expired notices
  const notices = await Notice.find(query)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  const activeNotices = notices.filter((notice) => {
    if (!notice.expiryDate) return true;
    return new Date(notice.expiryDate) > new Date();
  });

  return {
    success: true,
    count: activeNotices.length,
    data: activeNotices,
  };
};

// Get single notice
exports.getNotice = async (noticeId) => {
  const notice = await Notice.findById(noticeId).populate('createdBy', 'name email');

  if (!notice) {
    throw new ErrorResponse('Notice not found', 404);
  }

  return {
    success: true,
    data: notice,
  };
};

// Create notice
exports.createNotice = async (noticeData, createdBy) => {
  const notice = await Notice.create({
    ...noticeData,
    createdBy,
  });

  return {
    success: true,
    data: notice,
  };
};

// Update notice
exports.updateNotice = async (noticeId, updateData) => {
  const notice = await Notice.findByIdAndUpdate(noticeId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!notice) {
    throw new ErrorResponse('Notice not found', 404);
  }

  return {
    success: true,
    data: notice,
  };
};

// Delete notice
exports.deleteNotice = async (noticeId) => {
  const notice = await Notice.findById(noticeId);

  if (!notice) {
    throw new ErrorResponse('Notice not found', 404);
  }

  await notice.deleteOne();

  return {
    success: true,
    data: {},
  };
};
