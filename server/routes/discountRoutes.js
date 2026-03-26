import express from "express";
import {
    createDiscount,
    getDiscounts,
    updateDiscount,
    deleteDiscount
} from "../controllers/discountController.js";

const router = express.Router();

router.post("/", createDiscount);
router.get("/", getDiscounts);
router.put("/:id", updateDiscount);
router.delete("/:id", deleteDiscount);

export default router;
