import express from "express";
import { listOrders, updateStatus } from "../controllers/canteenOrderController.js";
import { requireAuth } from "../middleware/dewmiAuthMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, listOrders);
router.patch("/:id/status", requireAuth, updateStatus);

export default router;
