import express from "express";
import { body } from "express-validator";
import {
  submitFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  getFeedbackStats,
  bulkDeleteFeedback
} from "../controllers/feedback.controller.js";


const router = express.Router();

// Public routes
router.post(
  '/',
  [
    body("customerName").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").matches(/^[0-9]{10}$/).withMessage("Valid 10-digit phone number is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
    body("subject").notEmpty().withMessage("Subject is required"),
    body("message").notEmpty().withMessage("Message is required")
  ],
  submitFeedback
);



router.get("/admin", getAllFeedback);
router.get("/admin/stats", getFeedbackStats);
router.post("/admin/bulk-delete", bulkDeleteFeedback);
router.delete("/admin/bulk", bulkDeleteFeedback);
router.get("/admin/:id", getFeedbackById);
router.put("/admin/:id", updateFeedback);
router.delete("/admin/:id", deleteFeedback);

export default router;