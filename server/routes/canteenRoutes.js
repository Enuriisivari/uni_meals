import express from "express";
import {
  getCanteens,
  getCanteen,
  createNewCanteen,
  updateExistingCanteen,
  removeCanteen,
} from "../controllers/canteenController.js";

const router = express.Router();

router.get("/", getCanteens);
router.get("/:id", getCanteen);
router.post("/", createNewCanteen);
router.put("/:id", updateExistingCanteen);
router.delete("/:id", removeCanteen);

export default router;