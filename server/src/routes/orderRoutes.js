import express from "express";
import { listOrders, updateStatus } from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, listOrders);
router.patch("/:id/status", requireAuth, updateStatus);

export default router;
