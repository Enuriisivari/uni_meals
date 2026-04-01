import express from "express";
import {
  register,
  login,
  getCurrentUser,
  updatePassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user/:id", getCurrentUser);
router.post("/change-password", updatePassword);

export default router;