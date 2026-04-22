import express from "express";
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getOrders);
router.post("/", createOrder);
router.get("/:id", getOrder);
router.put("/:id", updateOrder);

export default router;
