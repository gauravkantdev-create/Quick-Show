import express from 'express';
import mongoose from 'mongoose';
import Show from '../models/Show.js';
import Theater from '../models/Theater.js';
import { isDatabaseConnected } from "../config/db.js";
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const databaseUnavailableResponse = {
  success: false,
  error:
    "Database connection is unavailable. Fix the MongoDB connection, then try again.",
};

/* ---------------- GET ALL SHOWS ---------------- */
router.get('/', async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        ...databaseUnavailableResponse,
        data: [],
      });
    }

    const { movieId } = req.query;

    let query = {};

    // 🔥 filter by movie id if provided
    if (movieId) {
      query["movie.id"] = movieId;
    }

    const shows = await Show.find(query)
      .populate("theater")
      .sort({ showDateTime: 1 });

    res.json({
      success: true,
      data: shows
    });

  } catch (error) {

    res.json({
      success: false,
      data: [],
      message: error.message
    });

  }
});


/* ---------------- GET SHOWS BY THEATER ---------------- */
router.get('/theater/:id', async (req, res) => {

  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        ...databaseUnavailableResponse,
        data: [],
      });
    }

    console.log('Fetching shows for theater:', req.params.id)
    
    const shows = await Show.find({
      theater: req.params.id
    })
      .populate("theater")
      .sort({ showDateTime: 1 })
    
    console.log('Found shows count:', shows.length)
    console.log('First show:', shows[0])

    res.json({
      success: true,
      data: shows
    })

  } catch (error) {
    console.error('Error fetching shows by theater:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }

});


/* ---------------- GET SHOW BY ID ---------------- */
router.get('/:id', async (req, res) => {

  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json(databaseUnavailableResponse);
    }

    const show = await Show.findById(req.params.id).populate("theater");

    if (!show) {
      return res.status(404).json({
        success: false,
        error: 'Show not found'
      });
    }

    res.json({
      success: true,
      data: show
    });

  } catch (error) {

    res.json({
      success: false,
      error: error.message
    });

  }

});


/* ---------------- CREATE SHOW ---------------- */
router.post('/', async (req, res) => {

  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json(databaseUnavailableResponse);
    }

    const { movie, theater, showDateTime, showPrice, screen } = req.body;

    const showDate = new Date(showDateTime);

    if (
      !movie?.id ||
      !movie?.title ||
      !theater ||
      !mongoose.Types.ObjectId.isValid(theater) ||
      Number.isNaN(showDate.getTime()) ||
      Number(showPrice) <= 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid show payload",
      });
    }

    const theaterObjectId = new mongoose.Types.ObjectId(theater);
    const theaterExists = await Theater.exists({ _id: theaterObjectId });

    if (!theaterExists) {
      return res.status(404).json({
        success: false,
        error: "Selected theater does not exist",
      });
    }

    const existingShow = await Show.findOne({
      "movie.id": movie.id,
      theater: theaterObjectId,
      showDateTime: showDate,
    });

    if (existingShow) {
      return res.status(409).json({
        success: false,
        error: "Show already exists for this movie, theater and time",
      });
    }

    const show = await Show.create({
      movie,
      theater: theaterObjectId,
      showDateTime: showDate,
      showPrice: Number(showPrice),
      screen,
    });

    const populatedShow = await Show.findById(show._id).populate("theater");

    res.status(201).json({
      success: true,
      data: populatedShow
    });

  } catch (error) {

    console.error("Create show error:", error);

    res.json({
      success: false,
      error: error.message
    });

  }

});


/* ---------------- UPDATE SHOW ---------------- */
router.put('/:id', requireAuth, async (req, res) => {

  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json(databaseUnavailableResponse);
    }

    const show = await Show.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("theater");

    if (!show) {
      return res.status(404).json({
        success: false,
        error: 'Show not found'
      });
    }

    res.json({
      success: true,
      data: show
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});


/* ---------------- DELETE SHOW ---------------- */
router.delete('/:id', async (req, res) => {

  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json(databaseUnavailableResponse);
    }

    const show = await Show.findByIdAndDelete(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        error: 'Show not found'
      });
    }

    res.json({
      success: true,
      message: 'Show deleted'
    });

  } catch (error) {

    res.json({
      success: false,
      error: error.message
    });

  }

});


export default router;
