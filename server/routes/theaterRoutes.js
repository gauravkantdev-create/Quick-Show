import express from "express";
import Theater from "../models/Theater.js";
import { isDatabaseConnected } from "../config/db.js";

const router = express.Router();

const databaseUnavailableResponse = {
  success: false,
  error:
    "Database connection is unavailable. Fix the MongoDB connection, then try again.",
};


/* ---------------- CLEAR ALL THEATERS ---------------- */
router.delete("/clear/all", async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json(databaseUnavailableResponse);
    }

    await Theater.deleteMany({})

    res.json({
      success: true,
      message: "All theaters deleted"
    })

  } catch (error) {
    res.status(500).json({
      success:false,
      message:"Error deleting theaters"
    })
  }
})



/* ---------------- GET ALL THEATERS ---------------- */
router.get("/", async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        ...databaseUnavailableResponse,
        count: 0,
        data: [],
      });
    }

    const theaters = await Theater.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: theaters.length,
      data: theaters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch theaters",
    });
  }
});


/* ---------------- GET SINGLE THEATER ---------------- */
router.get("/:id", async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json(databaseUnavailableResponse);
    }

    const theater = await Theater.findById(req.params.id);

    if (!theater) {
      return res.status(404).json({
        success: false,
        error: "Theater not found",
      })
    }

    res.json({
      success: true,
      data: theater
    })

  } catch (error) {
    res.status(500).json({
      success:false
    })
  }
})



/* ---------------- ADD THEATER ---------------- */
router.post("/", async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json(databaseUnavailableResponse);
    }

    const existing = await Theater.findOne({ name:req.body.name })

    if(existing){
      return res.json({
        success:false,
        message:"Theater already exists"
      })
    }

    const theater = await Theater.create(req.body)

    res.json({
      success:true,
      data:theater
    })

  } catch (error) {
    res.status(500).json({
      success:false
    })
  }
})


/* ---------------- DELETE THEATER ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json(databaseUnavailableResponse);
    }

    const theater = await Theater.findByIdAndDelete(req.params.id)

    if (!theater) {
      return res.status(404).json({
        success:false,
        error:"Theater not found"
      })
    }

    res.json({
      success:true
    })

  } catch (error) {
    res.status(500).json({
      success:false
    })
  }
})


export default router
