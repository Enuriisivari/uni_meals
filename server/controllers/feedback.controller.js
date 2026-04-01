import Feedback from "../models/Feedback.js";
import { validationResult } from "express-validator";

// @desc    Submit new feedback
// @route   POST /api/feedback
// @access  Public
export const submitFeedback = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const feedback = await Feedback.create({
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json({
      success: true,
      message: "Thank you for your feedback! We appreciate your input.",
      data: {
        id: feedback._id,
        rating: feedback.rating,
        status: feedback.status
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};

// @desc    Get all feedback (Admin)
// @route   GET /api/feedback/admin
// @access  Private/Admin
export const getAllFeedback = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      priority,
      rating,
      search,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query;

    let query = {};
    
    // Filters
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (rating) query.rating = parseInt(rating);
    if (search) {
      query.$text = { $search: search };
    }

    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (page - 1) * limit;
    
    const feedbacks = await Feedback.find(query)
      .populate("respondedBy", "name email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Feedback.countDocuments(query);

    res.json({
      success: true,
      data: feedbacks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Get single feedback
// @route   GET /api/feedback/admin/:id
// @access  Private/Admin
export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate("respondedBy", "name email");
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found"
      });
    }

    res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Update feedback (Admin)
// @route   PUT /api/feedback/admin/:id
// @access  Private/Admin
export const updateFeedback = async (req, res) => {
  try {
    const { status, priority, adminResponse, tags, category, rating } = req.body;
    
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found"
      });
    }

    // Update fields
    if (status) feedback.status = status;
    if (priority) feedback.priority = priority;
    if (adminResponse) {
      feedback.adminResponse = adminResponse;
      feedback.respondedBy = req.user._id;
      feedback.respondedAt = Date.now();
    }
    if (tags) feedback.tags = tags;
    if (category) feedback.category = category;
    if (rating) feedback.rating = rating;
    
    feedback.updatedAt = Date.now();
    
    await feedback.save();

    res.json({
      success: true,
      message: "Feedback updated successfully",
      data: feedback
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/admin/:id
// @access  Private/Admin
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found"
      });
    }

    await feedback.deleteOne();

    res.json({
      success: true,
      message: "Feedback deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Get feedback statistics
// @route   GET /api/feedback/admin/stats
// @access  Private/Admin
export const getFeedbackStats = async (req, res) => {
  try {
    const total = await Feedback.countDocuments();
    const pending = await Feedback.countDocuments({ status: "pending" });
    const reviewed = await Feedback.countDocuments({ status: "reviewed" });
    const resolved = await Feedback.countDocuments({ status: "resolved" });
    
    const averageRating = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);
    
    const byCategory = await Feedback.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const byRating = await Feedback.aggregate([
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    const byPriority = await Feedback.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);
    
    const recentTrend = await Feedback.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 7 }
    ]);

    res.json({
      success: true,
      data: {
        total,
        pending,
        reviewed,
        resolved,
        averageRating: averageRating[0]?.avgRating || 0,
        byCategory,
        byRating,
        byPriority,
        recentTrend: recentTrend.reverse()
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Bulk delete feedback
// @route   DELETE /api/feedback/admin/bulk
// @access  Private/Admin
export const bulkDeleteFeedback = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid feedback IDs"
      });
    }
    
    await Feedback.deleteMany({ _id: { $in: ids } });
    
    res.json({
      success: true,
      message: `${ids.length} feedback(s) deleted successfully`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};