const validateBooking = (req, res, next) => {
  const { user_name, user_email, quantity, experience_id, slot_id } = req.body;
  
  const errors = [];
  
  if (!user_name || user_name.trim().length < 2) {
    errors.push('Valid user name is required (min 2 characters)');
  }
  
  if (!user_email || !/^\S+@\S+\.\S+$/.test(user_email)) {
    errors.push('Valid email is required');
  }
  
  if (!quantity || quantity < 1) {
    errors.push('Quantity must be at least 1');
  }
  
  if (!experience_id) {
    errors.push('Experience ID is required');
  }
  
  if (!slot_id) {
    errors.push('Slot ID is required');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

const validatePromoCode = (req, res, next) => {
  const { code } = req.body;
  
  if (!code || code.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Promo code is required'
    });
  }
  
  next();
};

module.exports = {
  validateBooking,
  validatePromoCode
};