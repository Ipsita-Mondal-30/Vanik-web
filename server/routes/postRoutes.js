import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createPost, listPosts, getPostById } from "../controllers/postController.js";

const router = Router();

router.get("/", authMiddleware, listPosts);
router.post("/", authMiddleware, createPost);
router.get("/:id", authMiddleware, getPostById);

export default router;
