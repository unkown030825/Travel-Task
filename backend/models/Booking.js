const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  experience_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
    required: true
  },
  slot_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
    required: true
  },
  user_name: {
    type: String,
    required: true,
    trim: true
  },
  user_email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  taxes: {
    type: Number,
    required: true,
    min: 0
  },
  total_price: {
    type: Number,
    required: true,
    min: 0
  },
  promo_code: {
    type: String,
    default: null
  },
  discount_amount: {
    type: Number,
    default: 0,
    min: 0
  },
  reference_id: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

// Index for efficient queries
bookingSchema.index({ reference_id: 1 });
bookingSchema.index({ user_email: 1 });
bookingSchema.index({ experience_id: 1, slot_id: 1 });

// Pre-save middleware to generate reference ID
bookingSchema.pre('save', function(next) {
  if (!this.reference_id) {
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    this.reference_id = `BK${random}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);