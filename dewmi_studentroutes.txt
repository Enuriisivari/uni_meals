import express from "express";
import {
  createOrder,
  listStudentMenuItems,
  listStudentOrders,
} from "../controllers/studentController.js";

const router = express.Router();

router.get("/menu-items", listStudentMenuItems);
router.get("/orders", listStudentOrders);
router.post("/orders", createOrder);

export default router;
