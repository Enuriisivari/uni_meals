import express from "express";
import {
  addMenuItem,
  editMenuItem,
  listMenuItems,
  removeMenuItem,
} from "../controllers/menuController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { menuItemUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, listMenuItems);
router.post("/", requireAuth, menuItemUpload.single("image"), addMenuItem);
router.put("/:id", requireAuth, menuItemUpload.single("image"), editMenuItem);
router.delete("/:id", requireAuth, removeMenuItem);

export default router;
