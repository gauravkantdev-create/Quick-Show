import express from 'express';
import mongoose from 'mongoose';
import Show from '../models/Show.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

/* ---------------- GET ALL SHOWS ---------------- */
router.get('/', async (req, res) => {
  try {

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

    const shows = await Show.find({
      theater: req.params.id
    })
      .populate("theater")
      .sort({ showDateTime: 1 });

    res.json({
      success: true,
      data: shows
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});


/* ---------------- GET SHOW BY ID ---------------- */
router.get('/:id', async (req, res) => {

  try {

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

    const { movie, theater, showDateTime, showPrice, screen } = req.body;

    const showDate = new Date(showDateTime);

    if (!movie?.id || !theater || Number.isNaN(showDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid show payload",
      });
    }

    const theaterObjectId = new mongoose.Types.ObjectId(theater);

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
      showPrice,
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