const roomService = require('../services/roomService');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private
exports.getAllRooms = async (req, res, next) => {
  try {
    const result = await roomService.getAllRooms(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Private
exports.getRoom = async (req, res, next) => {
  try {
    const result = await roomService.getRoom(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Create room
// @route   POST /api/rooms
// @access  Private (Admin, Warden)
exports.createRoom = async (req, res, next) => {
  try {
    const result = await roomService.createRoom(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private (Admin, Warden)
exports.updateRoom = async (req, res, next) => {
  try {
    const result = await roomService.updateRoom(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Admin)
exports.deleteRoom = async (req, res, next) => {
  try {
    const result = await roomService.deleteRoom(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
