const express = require('express');
const router = express.Router();
const {
  validatePromoCode,
  getAllPromoCodes,
  createPromoCode
} = require('../controllers/promoController');
const { validatePromoCode: validatePromoMiddleware } = require('../middleware/validation');

router.post('/validate', validatePromoMiddleware, validatePromoCode);
router.get('/', getAllPromoCodes);
router.post('/', createPromoCode);

module.exports = router;