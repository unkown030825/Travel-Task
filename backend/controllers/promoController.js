const PromoCode = require('../models/PromoCode');

// Validate promo code
const validatePromoCode = async (req, res) => {
  try {
    const { code } = req.body;
    
    const promoCode = await PromoCode.findOne({ 
      code: code.toUpperCase(), 
      active: true 
    });
    
    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: 'Invalid promo code'
      });
    }
    
    res.json({
      success: true,
      data: promoCode,
      message: 'Promo code is valid'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error validating promo code',
      error: error.message
    });
  }
};

// Get all active promo codes
const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find({ active: true }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: promoCodes,
      count: promoCodes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching promo codes',
      error: error.message
    });
  }
};

// Create new promo code
const createPromoCode = async (req, res) => {
  try {
    const promoCode = new PromoCode(req.body);
    await promoCode.save();
    
    res.status(201).json({
      success: true,
      data: promoCode,
      message: 'Promo code created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating promo code',
      error: error.message
    });
  }
};

module.exports = {
  validatePromoCode,
  getAllPromoCodes,
  createPromoCode
};