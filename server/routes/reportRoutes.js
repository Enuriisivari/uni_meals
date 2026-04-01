import express from "express";
import { generateOrdersReport, generateRevenueReport } from "../controllers/reportController.js";

const router = express.Router();

router.get("/orders", generateOrdersReport);
router.get("/revenue", generateRevenueReport);

export default router;
