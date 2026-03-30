const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    block: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    occupied: {
      type: Number,
      default: 0,
      min: 0,
    },
    roomType: {
      type: String,
      enum: ['single', 'double', 'triple', 'quad'],
      default: 'double',
    },
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    maintenanceStatus: {
      type: String,
      enum: ['good', 'needs_repair', 'under_maintenance'],
      default: 'good',
    },
    warden: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual to check if room is full
roomSchema.virtual('isFull').get(function () {
  return this.occupied >= this.capacity;
});

module.exports = mongoose.model('Room', roomSchema);
