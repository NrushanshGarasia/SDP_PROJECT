const express = require('express');
const { body } = require('express-validator');
const messController = require('../controllers/messController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const createMessRecordValidation = [
  body('student').isMongoId().withMessage('Valid student ID is required'),
  body('mealType').isIn(['breakfast', 'lunch', 'dinner']).withMessage('Valid meal type is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('status').optional().isIn(['present', 'absent', 'on_leave']).withMessage('Valid status is required'),
];

const createMenuValidation = [
  body('day').isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).withMessage('Valid day is required'),
];

// Mess Records Routes
router.get('/records/me', authorize('student'), messController.getMyMessRecords);
router.get('/records', authorize('admin', 'warden'), messController.getAllMessRecords);
router.post('/records', authorize('admin', 'warden'), createMessRecordValidation, validate, messController.createMessRecord);
router.put('/records/:id', authorize('admin', 'warden'), messController.updateMessRecord);
router.delete('/records/:id', authorize('admin', 'warden'), messController.deleteMessRecord);

// Mess Menu Routes
router.get('/menu', messController.getAllMenus);
router.get('/menu/:day', messController.getMenuByDay);
router.post('/menu', authorize('admin', 'warden'), createMenuValidation, validate, messController.createOrUpdateMenu);
router.delete('/menu/:id', authorize('admin', 'warden'), messController.deleteMenu);

module.exports = router;
