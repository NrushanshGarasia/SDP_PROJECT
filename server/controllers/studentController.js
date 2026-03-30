const studentService = require('../services/studentService');

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin, Warden)
exports.getAllStudents = async (req, res, next) => {
  try {
    const result = await studentService.getAllStudents(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
exports.getStudent = async (req, res, next) => {
  try {
    const result = await studentService.getStudent(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student profile
// @route   GET /api/students/me
// @access  Private (Student)
exports.getMyProfile = async (req, res, next) => {
  try {
    const result = await studentService.getStudentByUserId(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Create student
// @route   POST /api/students
// @access  Private (Admin, Warden)
exports.createStudent = async (req, res, next) => {
  try {
    const result = await studentService.createStudent(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Admin, Warden)
exports.updateStudent = async (req, res, next) => {
  try {
    const result = await studentService.updateStudent(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin)
exports.deleteStudent = async (req, res, next) => {
  try {
    const result = await studentService.deleteStudent(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Assign room to student
// @route   PUT /api/students/:id/assign-room
// @access  Private (Admin, Warden)
exports.assignRoom = async (req, res, next) => {
  try {
    const result = await studentService.assignRoom(req.params.id, req.body.roomId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Deallocate room from student
// @route   PUT /api/students/:id/deallocate-room
// @access  Private (Admin, Warden)
exports.deallocateRoom = async (req, res, next) => {
  try {
    const result = await studentService.deallocateRoom(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
