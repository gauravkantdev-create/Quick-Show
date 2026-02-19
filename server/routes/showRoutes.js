import express from 'express';
import Show from '../models/Show.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all shows
router.get('/', async (req, res) => {
  try {
    const shows = await Show.find().sort({ showDateTime: 1 });
    res.json({ success: true, shows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get show by ID
router.get('/:id', async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ success: false, error: 'Show not found' });
    res.json({ success: true, show });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create show (Admin only)
router.post('/', requireAuth, async (req, res) => {
  try {
    const show = await Show.create(req.body);
    res.status(201).json({ success: true, show });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update show
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!show) return res.status(404).json({ success: false, error: 'Show not found' });
    res.json({ success: true, show });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete show
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) return res.status(404).json({ success: false, error: 'Show not found' });
    res.json({ success: true, message: 'Show deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
