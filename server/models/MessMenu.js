const mongoose = require('mongoose');

const messMenuSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true,
    },
    breakfast: {
      items: [
        {
          type: String,
          trim: true,
        },
      ],
    },
    lunch: {
      items: [
        {
          type: String,
          trim: true,
        },
      ],
    },
    dinner: {
      items: [
        {
          type: String,
          trim: true,
        },
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MessMenu', messMenuSchema);
