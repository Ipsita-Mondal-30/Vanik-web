import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/requireRole.js";
import { getBidById, getBuyerBids, getFarmerBids, placeBid } from "../controllers/bidController.js";

const router = Router();

router.post("/", authMiddleware, requireRole("buyer"), placeBid);
router.get("/farmer", authMiddleware, requireRole("farmer"), getFarmerBids);
router.get("/buyer", authMiddleware, requireRole("buyer"), getBuyerBids);
router.get("/:id", authMiddleware, getBidById);

export default router;

