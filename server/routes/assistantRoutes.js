import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { ingestDocument, askAssistant, listAssistantModels } from "../controllers/assistantController.js";

const router = Router();

router.post("/ingest", authMiddleware, ingestDocument);
router.post("/ask", authMiddleware, askAssistant);
router.get("/models", authMiddleware, listAssistantModels);

export default router;

