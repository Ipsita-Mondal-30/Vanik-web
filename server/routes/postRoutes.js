import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/requireRole.js";
import { createPost, getPost, listPosts } from "../controllers/postController.js";

const router = Router();

router.get("/", authMiddleware, listPosts);
router.get("/:id", authMiddleware, getPost);
router.post("/", authMiddleware, requireRole("farmer"), createPost);

export default router;

