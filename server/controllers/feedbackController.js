import Feedback from "../models/Feedback.js";

// Get all feedback
export const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("userId", "name email")
      .populate("orderId", "_id")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: feedback.length, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching feedback", error: error.message });
  }
};

// Update feedback status
export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const feedback = await Feedback.findById(id);
    if (!feedback) return res.status(404).json({ success: false, message: "Feedback not found" });

    feedback.status = status || feedback.status;
    await feedback.save();

    res.status(200).json({ success: true, data: feedback, message: "Feedback updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating feedback", error: error.message });
  }
};

// Delete feedback
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    await Feedback.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting feedback", error: error.message });
  }
};
