import express from 'express';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard stats
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalUsers = await User.countDocuments();
    const activeShows = await Show.find().sort({ showDateTime: -1 }).limit(10);

    res.json({
      success: true,
      data: {
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalUsers,
        activeShows
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
