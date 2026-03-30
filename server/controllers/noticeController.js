const noticeService = require('../services/noticeService');

// @desc    Get all notices
// @route   GET /api/notices
// @access  Private
exports.getAllNotices = async (req, res, next) => {
  try {
    const result = await noticeService.getAllNotices(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get active notices
// @route   GET /api/notices/active
// @access  Private
exports.getActiveNotices = async (req, res, next) => {
  try {
    const targetAudience = req.user.role || 'all';
    const result = await noticeService.getActiveNotices(targetAudience);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single notice
// @route   GET /api/notices/:id
// @access  Private
exports.getNotice = async (req, res, next) => {
  try {
    const result = await noticeService.getNotice(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Create notice
// @route   POST /api/notices
// @access  Private (Admin, Warden)
exports.createNotice = async (req, res, next) => {
  try {
    const result = await noticeService.createNotice(req.body, req.user.id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Update notice
// @route   PUT /api/notices/:id
// @access  Private (Admin, Warden)
exports.updateNotice = async (req, res, next) => {
  try {
    const result = await noticeService.updateNotice(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private (Admin, Warden)
exports.deleteNotice = async (req, res, next) => {
  try {
    const result = await noticeService.deleteNotice(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
