
const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookingByReference,
  getAllBookings
} = require('../controllers/bookingController');
const { validateBooking } = require('../middleware/validation');

router.post('/', validateBooking, createBooking);
router.get('/', getAllBookings);
router.get('/:reference_id', getBookingByReference);

module.exports = router;