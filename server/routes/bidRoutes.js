import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/requireRole.js";
import {
  acceptBid,
  getBidById,
  getBuyerBids,
  getFarmerBids,
  placeBid,
  rejectBid,
  updateBid,
} from "../controllers/bidController.js";

const router = Router();

router.post("/", authMiddleware, requireRole("buyer"), placeBid);
router.put("/:id", authMiddleware, requireRole("buyer"), updateBid);
router.get("/farmer", authMiddleware, requireRole("farmer"), getFarmerBids);
router.get("/buyer", authMiddleware, requireRole("buyer"), getBuyerBids);
router.post("/:id/accept", authMiddleware, requireRole("farmer"), acceptBid);
router.post("/:id/reject", authMiddleware, requireRole("farmer"), rejectBid);
router.get("/:id", authMiddleware, getBidById);

export default router;

