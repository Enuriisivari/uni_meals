import express from "express";
import { assignToken, getTokens } from "../controllers/tokenController.js";

const router = express.Router();

router.post("/assign", assignToken);
router.get("/", getTokens);

export default router;
