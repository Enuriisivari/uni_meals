import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, "Customer name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [50, "Name cannot exceed 50 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"]
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"]
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["Delivery", "Product Quality", "Staff Behavior", "Pricing", "Website Issue", "Other"]
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: 1,
    max: 5
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    trim: true,
    minlength: [5, "Subject must be at least 5 characters"],
    maxlength: [100, "Subject cannot exceed 100 characters"]
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    trim: true,
    minlength: [10, "Message must be at least 10 characters"],
    maxlength: [1000, "Message cannot exceed 1000 characters"]
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "resolved", "archived"],
    default: "pending"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium"
  },
  adminResponse: {
    type: String,
    default: ""
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  respondedAt: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    filename: String,
    url: String,
    fileType: String
  }],
  ipAddress: String,
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better search performance
feedbackSchema.index({ customerName: "text", email: "text", subject: "text", message: "text" });
feedbackSchema.index({ status: 1, createdAt: -1 });
feedbackSchema.index({ category: 1, rating: 1 });

export default mongoose.model("Feedback", feedbackSchema);