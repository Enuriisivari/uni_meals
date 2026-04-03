import express from "express";
import {
  register,
  login,
  getCurrentUser,
  registerDelivery,
  loginDelivery,
  getAllDelivery,
  resetPasswordDelivery,
  updatePassword,
  updateDeliveryStaff,
  toggleDeliveryStaffStatus,
  deleteDeliveryStaff,
} from "../controllers/authController.js";
import { registerStaff, loginStaff, getCurrentStaff, updateProfile } from '../src/controllers/authController.js'
import { requireAuth } from '../src/middleware/authMiddleware.js'
import { staffProfileUpload } from '../src/middleware/uploadMiddleware.js'
const router = express.Router();

router.post("/register", register);
router.post("/register-staff", registerStaff);
router.post("/login", login);
router.post("/login-staff", loginStaff);
router.get("/user/:id", getCurrentUser);
router.post("/change-password", updatePassword);
router.get("/me", requireAuth, getCurrentStaff);
router.put("/me", requireAuth, staffProfileUpload.single("avatar"), updateProfile);
// Delivery person routes
router.post("/delivery/register", registerDelivery);
router.post("/delivery/login", loginDelivery);
router.get("/delivery/all", getAllDelivery);
router.post("/delivery/reset-password", resetPasswordDelivery);
router.put("/delivery/:id", updateDeliveryStaff);
router.put("/delivery/:id/status", toggleDeliveryStaffStatus);
router.delete("/delivery/:id", deleteDeliveryStaff);

export default router;