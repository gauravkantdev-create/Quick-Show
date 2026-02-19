import express from 'express';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get user bookings
router.get('/my-bookings', requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.auth.userId }).populate('show').sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all bookings (Admin)
router.get('/', requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('show').sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create booking
router.post('/', requireAuth, async (req, res) => {
  try {
    const { showId, bookedSeats, amount } = req.body;
    
    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ success: false, error: 'Show not found' });

    // Check if seats are available
    const unavailableSeats = bookedSeats.filter(seat => show.occupiedSeats[seat]);
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ success: false, error: 'Some seats are already booked' });
    }

    // Update occupied seats
    bookedSeats.forEach(seat => {
      show.occupiedSeats[seat] = req.auth.userId;
    });
    await show.save();

    // Create booking
    const booking = await Booking.create({
      user: req.auth.userId,
      show: showId,
      bookedSeats,
      amount,
      isPaid: true
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
