const Experience = require('../models/Experience');
const Slot = require('../models/Slot');

// Get all experiences
const getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: 1 });
    
    res.json({
      success: true,
      data: experiences,
      count: experiences.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching experiences',
      error: error.message
    });
  }
};

// Get single experience with slots
const getExperienceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }
    
    const slots = await Slot.find({ experience_id: id })
      .sort({ date: 1, time: 1 });
    
    res.json({
      success: true,
      data: {
        experience,
        slots
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching experience',
      error: error.message
    });
  }
};

// Create new experience
const createExperience = async (req, res) => {
  try {
    const experience = new Experience(req.body);
    await experience.save();
    
    res.status(201).json({
      success: true,
      data: experience
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating experience',
      error: error.message
    });
  }
};

module.exports = {
  getAllExperiences,
  getExperienceById,
  createExperience
};