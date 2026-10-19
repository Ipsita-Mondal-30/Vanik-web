import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { listNotifications, markAllRead } from "../controllers/notificationController.js";

const router = Router();

router.get("/", authMiddleware, listNotifications);
router.post("/read-all", authMiddleware, markAllRead);

export default router;

