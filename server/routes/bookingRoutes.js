import express from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Check if database is connected
const isDBConnected = () => mongoose.connection.readyState === 1;

router.use((req, res, next) => {
  console.log("🎟 Booking Router Debug:", req.method, req.url);
  next();
});


// Delete/Cancel booking
router.delete('/cancel/:id', async (req, res) => {
  console.log("🗑 DELETE request for booking:", req.params.id);

  console.log("👤 User ID from auth:", req.auth?.userId);

  try {
    if (!isDBConnected()) {
      return res.status(503).json({ success: false, error: 'Database not connected' });
    }

    const { id } = req.params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ Invalid Booking ID format:", id);
      return res.status(400).json({ success: false, error: "Invalid booking ID" });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      console.log("❌ Booking not found in DB:", id);
      return res.status(404).json({ success: false, error: "Booking not found" });
    }

    console.log("ℹ Booking found. Owner:", booking.user);

    // Check ownership
    if (booking.user !== req.auth.userId) {
      console.log("🚫 Unauthorized delete attempt. Auth User:", req.auth.userId, "Booking Owner:", booking.user);
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    // Release seats
    const show = await Show.findById(booking.show);
    if (show) {
      console.log("🎟 Releasing seats for show:", show._id, booking.bookedSeats);
      const occupiedSeats = show.occupiedSeats || {};
      booking.bookedSeats.forEach(seat => {
        delete occupiedSeats[seat];
      });
      show.occupiedSeats = occupiedSeats;
      show.markModified('occupiedSeats');
      await show.save();
    }

    await Booking.findByIdAndDelete(id);

    console.log("✅ Booking cancelled successfully:", id);
    res.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("🔥 Delete booking error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user bookings
router.get('/my-bookings', async (req, res) => {

  try {
    if (!isDBConnected()) {
      return res.json({ success: true, data: [] });
    }
    const bookings = await Booking.find({ user: req.auth.userId })
      .populate({
        path: "show",
        populate: { path: "theater" },
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.json({ success: true, data: [] });
  }
});

// Get all bookings (Admin)
router.get('/', async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.json({ success: true, data: [] });
    }
    const bookings = await Booking.find()
      .populate({
        path: "show",
        populate: { path: "theater" },
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.json({ success: true, data: [] });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({ success: false, error: 'Database not connected' });
    }

    const { show: showId, bookedSeats = [], amount = 0 } = req.body;
    if (!showId || !Array.isArray(bookedSeats) || bookedSeats.length === 0) {
      return res.status(400).json({ success: false, error: "Invalid booking payload" });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, error: "Show not found" });
    }

    const occupiedSeats = show.occupiedSeats || {};
    const alreadyBooked = bookedSeats.find((seat) => occupiedSeats[seat]);
    if (alreadyBooked) {
      return res.status(409).json({ success: false, error: `Seat ${alreadyBooked} already booked` });
    }

    bookedSeats.forEach((seat) => {
      occupiedSeats[seat] = true;
    });

    show.occupiedSeats = occupiedSeats;
    await show.save();

    const booking = await Booking.create({
      user: req.auth.userId,
      show: showId,
      bookedSeats,
      amount,
      isPaid: false,
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

export default router;



