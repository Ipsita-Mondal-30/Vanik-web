import { Bid } from "../models/Bid.js";
import { Post } from "../models/Post.js";

function normalizeBid(doc) {
  const buyer = doc.buyerId && typeof doc.buyerId === "object" ? doc.buyerId : null;
  const post = doc.postId && typeof doc.postId === "object" ? doc.postId : null;
  const farmer = post?.farmerId && typeof post.farmerId === "object" ? post.farmerId : null;

  return {
    id: doc._id.toString(),
    amount: doc.amount,
    createdAt: doc.createdAt,
    postId: post ? post._id.toString() : doc.postId.toString(),
    postTitle: post?.title ?? "Post",
    buyerId: buyer ? buyer._id.toString() : doc.buyerId.toString(),
    buyerName: buyer?.name ?? "Buyer",
    farmerId: farmer ? farmer._id.toString() : post?.farmerId?.toString?.() ?? null,
    farmerName: farmer?.name ?? (post ? "Farmer" : null),
  };
}

export async function placeBid(req, res) {
  try {
    const { postId, amount } = req.body || {};
    if (!postId || typeof postId !== "string") {
      return res.status(400).json({ message: "postId is required" });
    }
    if (!amount || typeof amount !== "string" || !amount.trim()) {
      return res.status(400).json({ message: "amount is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const bid = await Bid.create({
      postId,
      buyerId: req.user.userId,
      amount: amount.trim(),
    });

    const populated = await Bid.findById(bid._id)
      .populate("buyerId", "name")
      .populate({
        path: "postId",
        select: "title farmerId",
        populate: { path: "farmerId", select: "name" },
      });

    return res.status(201).json({ bid: normalizeBid(populated) });
  } catch (err) {
    console.error("placeBid error:", err);
    return res.status(500).json({ message: "Could not place bid" });
  }
}

export async function getFarmerBids(req, res) {
  try {
    // bids for posts owned by farmer
    const bids = await Bid.find({})
      .sort({ createdAt: -1 })
      .populate("buyerId", "name")
      .populate({
        path: "postId",
        select: "title farmerId",
        match: { farmerId: req.user.userId },
        populate: { path: "farmerId", select: "name" },
      });

    const filtered = bids.filter((b) => b.postId); // remove bids whose post didn't match farmerId
    return res.json({ bids: filtered.map(normalizeBid) });
  } catch (err) {
    console.error("getFarmerBids error:", err);
    return res.status(500).json({ message: "Could not load bids" });
  }
}

export async function getBuyerBids(req, res) {
  try {
    const bids = await Bid.find({ buyerId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate("buyerId", "name")
      .populate({
        path: "postId",
        select: "title farmerId",
        populate: { path: "farmerId", select: "name" },
      });

    return res.json({ bids: bids.map(normalizeBid) });
  } catch (err) {
    console.error("getBuyerBids error:", err);
    return res.status(500).json({ message: "Could not load bids" });
  }
}

export async function getBidById(req, res) {
  try {
    const { id } = req.params;
    const bid = await Bid.findById(id)
      .populate("buyerId", "name")
      .populate({
        path: "postId",
        select: "title farmerId",
        populate: { path: "farmerId", select: "name" },
      });

    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    const normalized = normalizeBid(bid);
    const isBuyer = normalized.buyerId === req.user.userId;
    const isFarmer = normalized.farmerId === req.user.userId;
    if (!isBuyer && !isFarmer) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json({ bid: normalized });
  } catch (err) {
    console.error("getBidById error:", err);
    return res.status(500).json({ message: "Could not load bid" });
  }
}

