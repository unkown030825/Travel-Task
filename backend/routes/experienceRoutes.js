const express = require('express');
const router = express.Router();
const {
  getAllExperiences,
  getExperienceById,
  createExperience
} = require('../controllers/experienceController');

router.get('/', getAllExperiences);
router.get('/:id', getExperienceById);
router.post('/', createExperience);

module.exports = router;