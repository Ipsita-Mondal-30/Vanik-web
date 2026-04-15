import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { listMessagesByBid, createMessage } from "../controllers/messageController.js";

const router = Router();

router.get("/:bidId", authMiddleware, listMessagesByBid);
router.post("/", authMiddleware, createMessage);

export default router;

