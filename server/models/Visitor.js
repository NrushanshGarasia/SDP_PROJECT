const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    visitorName: {
      type: String,
      required: true,
      trim: true,
    },
    visitorPhone: {
      type: String,
      required: true,
      trim: true,
    },
    visitorEmail: {
      type: String,
      trim: true,
    },
    relation: {
      type: String,
      required: true,
      trim: true,
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
    },
    entryTime: {
      type: Date,
      default: Date.now,
    },
    exitTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'denied', 'inside', 'left', 'checked_in', 'scheduled', 'cancelled'],
      default: 'pending',
    },
    idProof: {
      type: String,
      trim: true,
    },
    idNumber: {
      type: String,
      trim: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Visitor', visitorSchema);
