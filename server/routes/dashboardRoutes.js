import express from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        data: {
          totalBookings: 0,
          totalRevenue: 0,
          activeShows: [],
          totalUsers: 0
        }
      });
    }

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
    console.error('Dashboard stats error:', error);
    res.json({
      success: true,
      data: {
        totalBookings: 0,
        totalRevenue: 0,
        activeShows: [],
        totalUsers: 0
      }
    });
  }
});

export default router;
