const express = require('express');
const { body } = require('express-validator');
const feeController = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const createFeeValidation = [
  body('student').isMongoId().withMessage('Valid student ID is required'),
  body('feeType').isIn(['hostel', 'mess', 'maintenance', 'security', 'other']).withMessage('Valid fee type is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
];

const payFeeValidation = [
  body('paymentMethod').isIn(['cash', 'online', 'cheque', 'bank_transfer']).withMessage('Valid payment method is required'),
];

// Routes
router.get('/me', authorize('student'), feeController.getMyFees);
router.get('/', authorize('admin', 'warden'), feeController.getAllFees);
router.get('/:id', feeController.getFee);
router.post('/', authorize('admin', 'warden'), createFeeValidation, validate, feeController.createFee);
router.put('/:id', authorize('admin', 'warden'), feeController.updateFee);
router.put('/:id/pay', payFeeValidation, validate, feeController.payFee);
router.delete('/:id', authorize('admin'), feeController.deleteFee);

module.exports = router;
