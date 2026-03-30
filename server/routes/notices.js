const express = require('express');
const { body } = require('express-validator');
const noticeController = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const createNoticeValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').optional().isIn(['general', 'important', 'urgent', 'maintenance', 'event']).withMessage('Valid category is required'),
  body('targetAudience').optional().isIn(['all', 'students', 'wardens', 'admin']).withMessage('Valid target audience is required'),
];

// Routes
router.get('/active', noticeController.getActiveNotices);
router.get('/', noticeController.getAllNotices);
router.get('/:id', noticeController.getNotice);
router.post('/', authorize('admin', 'warden'), createNoticeValidation, validate, noticeController.createNotice);
router.put('/:id', authorize('admin', 'warden'), noticeController.updateNotice);
router.delete('/:id', authorize('admin', 'warden'), noticeController.deleteNotice);

module.exports = router;
