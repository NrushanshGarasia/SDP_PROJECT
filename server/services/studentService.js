const Student = require('../models/Student');
const User = require('../models/User');
const { ErrorResponse } = require('../middleware/errorHandler');

// Get all students
exports.getAllStudents = async (filters = {}) => {
  const students = await Student.find(filters)
    .populate('user', 'name email phone role')
    .populate('room', 'roomNumber floor block')
    .sort({ createdAt: -1 });

  return {
    success: true,
    count: students.length,
    data: students,
  };
};

// Get single student
exports.getStudent = async (studentId) => {
  const student = await Student.findById(studentId)
    .populate('user', 'name email phone role')
    .populate('room', 'roomNumber floor block capacity occupied');

  if (!student) {
    throw new ErrorResponse('Student not found', 404);
  }

  return {
    success: true,
    data: student,
  };
};

// Get student by user ID
exports.getStudentByUserId = async (userId) => {
  const student = await Student.findOne({ user: userId })
    .populate('user', 'name email phone role')
    .populate('room', 'roomNumber floor block capacity occupied');

  if (!student) {
    throw new ErrorResponse('Student not found', 404);
  }

  return {
    success: true,
    data: student,
  };
};

// Create student
exports.createStudent = async (studentData) => {
  const { user, studentId, course, year, semester, guardianName, guardianPhone, guardianRelation } = studentData;

  // Check if user exists and is a student
  const userDoc = await User.findById(user);
  if (!userDoc) {
    throw new ErrorResponse('User not found', 404);
  }
  if (userDoc.role !== 'student') {
    throw new ErrorResponse('User must have student role', 400);
  }

  // Check if student already exists
  const existingStudent = await Student.findOne({ $or: [{ user }, { studentId }] });
  if (existingStudent) {
    throw new ErrorResponse('Student already exists', 400);
  }

  const student = await Student.create({
    user,
    studentId,
    course,
    year,
    semester,
    guardianName,
    guardianPhone,
    guardianRelation,
  });

  return {
    success: true,
    data: student,
  };
};

// Update student
exports.updateStudent = async (studentId, updateData) => {
  const student = await Student.findByIdAndUpdate(studentId, updateData, {
    new: true,
    runValidators: true,
  })
    .populate('user', 'name email phone role')
    .populate('room', 'roomNumber floor block');

  if (!student) {
    throw new ErrorResponse('Student not found', 404);
  }

  return {
    success: true,
    data: student,
  };
};

// Delete student
exports.deleteStudent = async (studentId) => {
  const student = await Student.findById(studentId);

  if (!student) {
    throw new ErrorResponse('Student not found', 404);
  }

  // If student has a room, free the occupancy
  if (student.room) {
    const Room = require('../models/Room');
    const room = await Room.findById(student.room);
    if (room) {
      room.occupied = Math.max(0, room.occupied - 1);
      room.isAvailable = true;
      await room.save();
    }
  }

  await student.deleteOne();

  return {
    success: true,
    data: {},
  };
};

// Assign room to student
exports.assignRoom = async (studentId, roomId) => {
  const student = await Student.findById(studentId);
  if (!student) {
    throw new ErrorResponse('Student not found', 404);
  }

  const Room = require('../models/Room');
  const room = await Room.findById(roomId);
  if (!room) {
    throw new ErrorResponse('Room not found', 404);
  }

  if (room.occupied >= room.capacity) {
    throw new ErrorResponse('Room is full', 400);
  }

  // If student already has a room, free it
  if (student.room) {
    const oldRoom = await Room.findById(student.room);
    if (oldRoom) {
      oldRoom.occupied = Math.max(0, oldRoom.occupied - 1);
      await oldRoom.save();
    }
  }

  student.room = roomId;
  await student.save();

  room.occupied += 1;
  if (room.occupied >= room.capacity) {
    room.isAvailable = false;
  }
  await room.save();

  return {
    success: true,
    data: await Student.findById(studentId).populate('room', 'roomNumber floor block'),
  };
};

// Deallocate room from student
exports.deallocateRoom = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) {
    throw new ErrorResponse('Student not found', 404);
  }

  if (!student.room) {
    // Nothing to do
    return {
      success: true,
      data: student,
    };
  }

  const Room = require('../models/Room');
  const room = await Room.findById(student.room);
  if (room) {
    room.occupied = Math.max(0, room.occupied - 1);
    room.isAvailable = true;
    await room.save();
  }

  student.room = null;
  await student.save();

  return {
    success: true,
    data: await Student.findById(studentId)
      .populate('user', 'name email phone role')
      .populate('room', 'roomNumber floor block'),
  };
};
