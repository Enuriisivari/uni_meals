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

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user/:id", getCurrentUser);
router.post("/change-password", updatePassword);

// Delivery person routes
router.post("/delivery/register", registerDelivery);
router.post("/delivery/login", loginDelivery);
router.get("/delivery/all", getAllDelivery);
router.post("/delivery/reset-password", resetPasswordDelivery);
router.put("/delivery/:id", updateDeliveryStaff);
router.put("/delivery/:id/status", toggleDeliveryStaffStatus);
router.delete("/delivery/:id", deleteDeliveryStaff);

export default router;