const express = require('express');
const { body } = require('express-validator');
const visitorController = require('../controllers/visitorController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const createVisitorValidation = [
  body('visitorName').trim().notEmpty().withMessage('Visitor name is required'),
  body('visitorPhone').trim().notEmpty().withMessage('Visitor phone is required'),
  body('relation').trim().notEmpty().withMessage('Relation is required'),
  body('purpose').trim().notEmpty().withMessage('Purpose is required'),
];

// Routes
router.get('/me', authorize('student'), visitorController.getMyVisitors);
router.get('/', authorize('admin', 'warden'), visitorController.getAllVisitors);
router.get('/:id', visitorController.getVisitor);
router.post('/', authorize('student'), createVisitorValidation, validate, visitorController.createVisitor);
router.put('/:id', authorize('admin', 'warden'), visitorController.updateVisitor);
router.put('/:id/exit', authorize('admin', 'warden'), visitorController.markExit);
router.delete('/:id', authorize('admin'), visitorController.deleteVisitor);

module.exports = router;
