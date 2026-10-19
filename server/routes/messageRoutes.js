import { Router } from "express";
import { sendMessage, getInbox, getMessages } from "../controllers/messageController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, sendMessage);
router.get("/inbox", authMiddleware, getInbox);
router.get("/:bidId", authMiddleware, getMessages);

export default router;
