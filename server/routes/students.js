const express = require('express');
const { body } = require('express-validator');
const studentController = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const createStudentValidation = [
  body('user').isMongoId().withMessage('Valid user ID is required'),
  body('studentId').trim().notEmpty().withMessage('Student ID is required'),
  body('course').trim().notEmpty().withMessage('Course is required'),
  body('year').trim().notEmpty().withMessage('Year is required'),
  body('semester').trim().notEmpty().withMessage('Semester is required'),
];

const assignRoomValidation = [
  body('roomId').isMongoId().withMessage('Valid room ID is required'),
];

// Routes
router.get('/me', authorize('student'), studentController.getMyProfile);
router.get('/', authorize('admin', 'warden'), studentController.getAllStudents);
router.get('/:id', studentController.getStudent);
router.post('/', authorize('admin', 'warden'), createStudentValidation, validate, studentController.createStudent);
router.put('/:id', authorize('admin', 'warden'), studentController.updateStudent);
router.put('/:id/assign-room', authorize('admin', 'warden'), assignRoomValidation, validate, studentController.assignRoom);
router.put('/:id/deallocate-room', authorize('admin', 'warden'), studentController.deallocateRoom);
router.delete('/:id', authorize('admin'), studentController.deleteStudent);

module.exports = router;
