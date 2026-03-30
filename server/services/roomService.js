const Room = require('../models/Room');
const { ErrorResponse } = require('../middleware/errorHandler');

// Get all rooms
exports.getAllRooms = async (filters = {}) => {
  const rooms = await Room.find(filters)
    .populate('warden', 'name email')
    .sort({ floor: 1, roomNumber: 1 });

  return {
    success: true,
    count: rooms.length,
    data: rooms,
  };
};

// Get single room
exports.getRoom = async (roomId) => {
  const room = await Room.findById(roomId)
    .populate('warden', 'name email')
    .populate({
      path: 'students',
      model: 'Student',
      populate: {
        path: 'user',
        model: 'User',
        select: 'name email phone',
      },
    });

  if (!room) {
    throw new ErrorResponse('Room not found', 404);
  }

  return {
    success: true,
    data: room,
  };
};

// Create room
exports.createRoom = async (roomData) => {
  const room = await Room.create(roomData);

  return {
    success: true,
    data: room,
  };
};

// Update room
exports.updateRoom = async (roomId, updateData) => {
  const room = await Room.findByIdAndUpdate(roomId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!room) {
    throw new ErrorResponse('Room not found', 404);
  }

  return {
    success: true,
    data: room,
  };
};

// Delete room
exports.deleteRoom = async (roomId) => {
  const room = await Room.findById(roomId);

  if (!room) {
    throw new ErrorResponse('Room not found', 404);
  }

  if (room.occupied > 0) {
    throw new ErrorResponse('Cannot delete room with students', 400);
  }

  await room.deleteOne();

  return {
    success: true,
    data: {},
  };
};
