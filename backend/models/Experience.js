const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  }, 
  description: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create text index for search functionality
experienceSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Experience', experienceSchema);