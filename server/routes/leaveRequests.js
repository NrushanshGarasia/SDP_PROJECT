const express = require('express');
const { body } = require('express-validator');
const leaveRequestController = require('../controllers/leaveRequestController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const createLeaveRequestValidation = [
  body('leaveType').isIn(['short', 'long', 'emergency']).withMessage('Valid leave type is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('reason').trim().notEmpty().withMessage('Reason is required'),
];

const approveLeaveRequestValidation = [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
];

// Routes
router.get('/me', authorize('student'), leaveRequestController.getMyLeaveRequests);
router.get('/', authorize('admin', 'warden'), leaveRequestController.getAllLeaveRequests);
router.get('/:id', leaveRequestController.getLeaveRequest);
router.post('/', authorize('student'), createLeaveRequestValidation, validate, leaveRequestController.createLeaveRequest);
router.put('/:id', authorize('student'), leaveRequestController.updateLeaveRequest);
router.put('/:id/approve', authorize('admin', 'warden'), approveLeaveRequestValidation, validate, leaveRequestController.approveLeaveRequest);
router.delete('/:id', authorize('student'), leaveRequestController.deleteLeaveRequest);

module.exports = router;
