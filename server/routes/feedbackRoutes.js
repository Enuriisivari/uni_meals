import express from 'express';
import Feedback from '../models/Feedback.js';
const router = express.Router();

// 1. GET: Fetch all feedback (Admin View)
router.get('/all', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching feedback" });
  }
});

// 2. PUT: Update feedback (e.g., mark as 'Reviewed' or hide it)
router.put('/:id', async (req, res) => {
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});

// 3. DELETE: Remove feedback
router.delete('/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;