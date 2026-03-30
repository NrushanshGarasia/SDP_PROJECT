const express = require('express');
const { body } = require('express-validator');
const complaintController = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const createComplaintValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['room', 'mess', 'maintenance', 'security', 'other']).withMessage('Valid category is required'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Valid priority is required'),
];

const resolveComplaintValidation = [
  body('response').trim().notEmpty().withMessage('Response is required'),
];

// Routes
router.get('/me', authorize('student'), complaintController.getMyComplaints);
router.get('/', authorize('admin', 'warden'), complaintController.getAllComplaints);
router.get('/:id', complaintController.getComplaint);
router.post('/', authorize('student'), createComplaintValidation, validate, complaintController.createComplaint);
router.put('/:id', authorize('admin', 'warden'), complaintController.updateComplaint);
router.put('/:id/resolve', authorize('admin', 'warden'), resolveComplaintValidation, validate, complaintController.resolveComplaint);
router.delete('/:id', authorize('admin'), complaintController.deleteComplaint);

module.exports = router;
