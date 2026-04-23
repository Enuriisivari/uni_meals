import express from "express";
import {
  registerStaff,
  loginStaff,
  getCurrentStaff,
  updateProfile,
  registerStudent,
  loginStudent,
  getCurrentStudent,
  updateCurrentStudent,
  deleteCurrentStudent,
  forgotPasswordStudent,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { staffProfileUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();
router.post("/register-staff", registerStaff);
router.post("/login-staff", loginStaff);
router.get("/me", requireAuth, getCurrentStaff);
router.put("/me", requireAuth, staffProfileUpload.single("avatar"), updateProfile);

router.post("/student/register", registerStudent);
router.post("/student/login", loginStudent);
router.get("/student/me", requireAuth, getCurrentStudent);
router.put("/student/me", requireAuth, staffProfileUpload.single("avatar"), updateCurrentStudent);
router.delete("/student/me", requireAuth, deleteCurrentStudent);
router.post("/student/forgot-password", forgotPasswordStudent);

export default router;
