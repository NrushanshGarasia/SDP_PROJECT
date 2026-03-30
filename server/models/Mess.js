const mongoose = require('mongoose');

const messSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'on_leave'],
      default: 'present',
    },
    specialRequest: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate entries
messSchema.index({ student: 1, mealType: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Mess', messSchema);
