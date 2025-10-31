const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const Experience = require('../models/Experience');
const PromoCode = require('../models/PromoCode');

// Helper function to generate reference ID
const generateReferenceId = () => {
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `BK${random}`;
};

// Create new booking
const createBooking = async (req, res) => {
  try {
    const {
      experience_id,
      slot_id,
      user_name,
      user_email,
      quantity,
      promo_code
    } = req.body;

    // Check if slot exists and has available capacity
    const slot = await Slot.findById(slot_id);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    if (slot.available_count < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough available slots'
      });
    }

    // Get experience for pricing
    const experience = await Experience.findById(experience_id);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    // Calculate pricing
    let subtotal = experience.price * quantity;
    let discount_amount = 0;

    // Apply promo code if provided
    if (promo_code) {
      const promo = await PromoCode.findOne({ 
        code: promo_code.toUpperCase(), 
        active: true 
      });
      
      if (promo) {
        if (promo.type === 'percent') {
          discount_amount = (subtotal * promo.value) / 100;
        } else if (promo.type === 'flat') {
          discount_amount = promo.value;
        }
        
        // Ensure discount doesn't exceed subtotal
        discount_amount = Math.min(discount_amount, subtotal);
      }
    }

    const taxes = (subtotal - discount_amount) * 0.1; // 10% tax
    const total_price = subtotal - discount_amount + taxes;

    // Generate reference ID
    const reference_id = generateReferenceId();

    // Create booking
    const booking = new Booking({
      experience_id,
      slot_id,
      user_name,
      user_email,
      quantity,
      subtotal,
      taxes,
      total_price,
      promo_code: promo_code || null,
      discount_amount,
      reference_id, // Add the generated reference_id
      status: 'confirmed'
    });

    await booking.save();

    // Update slot availability
    slot.available_count -= quantity;
    await slot.save();

    // Populate the response with experience and slot details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('experience_id')
      .populate('slot_id');

    res.status(201).json({
      success: true,
      data: populatedBooking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// Get booking by reference ID
const getBookingByReference = async (req, res) => {
  try {
    const { reference_id } = req.params;
    
    const booking = await Booking.findOne({ reference_id })
      .populate('experience_id')
      .populate('slot_id');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

// Get all bookings (with pagination)
const getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bookings = await Booking.find()
      .populate('experience_id')
      .populate('slot_id')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments();

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getBookingByReference,
  getAllBookings
};