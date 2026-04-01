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

export default router;