const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  experience_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  available_count: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  total_count: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
slotSchema.index({ experience_id: 1, date: 1, time: 1 });

module.exports = mongoose.model('Slot', slotSchema);