const express = require('express');
const { body } = require('express-validator');
const roomController = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const createRoomValidation = [
  body('roomNumber').trim().notEmpty().withMessage('Room number is required'),
  body('floor').isInt({ min: 0 }).withMessage('Valid floor number is required'),
  body('block').trim().notEmpty().withMessage('Block is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('roomType').optional().isIn(['single', 'double', 'triple', 'quad']).withMessage('Invalid room type'),
];

// Routes
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoom);
router.post('/', authorize('admin', 'warden'), createRoomValidation, validate, roomController.createRoom);
router.put('/:id', authorize('admin', 'warden'), roomController.updateRoom);
router.delete('/:id', authorize('admin'), roomController.deleteRoom);

module.exports = router;
