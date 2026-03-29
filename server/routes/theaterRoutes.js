import express from "express";
import Theater from "../models/Theater.js";

const router = express.Router();


/* ---------------- CLEAR ALL THEATERS ---------------- */
router.delete("/clear/all", async (req, res) => {
  try {
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
    const theater = await Theater.findById(req.params.id);

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

    await Theater.findByIdAndDelete(req.params.id)

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