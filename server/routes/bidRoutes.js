import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createBid,
  listMyBids,
  listBidsOnMyPosts,
} from "../controllers/bidController.js";

const router = Router();

router.post("/", authMiddleware, createBid);
router.get("/mine", authMiddleware, listMyBids);
router.get("/on-my-posts", authMiddleware, listBidsOnMyPosts);

export default router;
