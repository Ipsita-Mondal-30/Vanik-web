import mongoose from "mongoose";
import { Bid } from "../models/Bid.js";
import { Post } from "../models/Post.js";

function serializeBidForBuyer(doc) {
  const post = doc.post;
  let postTitle = "";
  let farmerName = "";
  if (post && typeof post === "object") {
    postTitle = post.title || "";
    const farmer = post.farmer;
    if (farmer && typeof farmer === "object" && farmer.name) {
      farmerName = farmer.name;
    }
  }

  return {
    id: doc._id.toString(),
    postId: doc.post._id ? doc.post._id.toString() : doc.post.toString(),
    buyerId: doc.buyer._id ? doc.buyer._id.toString() : doc.buyer.toString(),
    buyerName:
      doc.buyer && typeof doc.buyer === "object" && doc.buyer.name
        ? doc.buyer.name
        : "",
    amount: String(doc.amount),
    createdAt: doc.createdAt.toISOString(),
    postTitle,
    farmerName,
  };
}

function serializeBidForFarmer(doc) {
  const post = doc.post;
  const postTitle =
    post && typeof post === "object" && post.title ? post.title : "";

  return {
    id: doc._id.toString(),
    postId: doc.post._id ? doc.post._id.toString() : doc.post.toString(),
    buyerId: doc.buyer._id ? doc.buyer._id.toString() : doc.buyer.toString(),
    buyerName:
      doc.buyer && typeof doc.buyer === "object" && doc.buyer.name
        ? doc.buyer.name
        : "",
    amount: String(doc.amount),
    createdAt: doc.createdAt.toISOString(),
    postTitle,
  };
}

/** POST /api/bids — buyers only */
export async function createBid(req, res) {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({ message: "Only retailers can place bids" });
    }

    const { postId, amount } = req.body;
    if (!postId || typeof postId !== "string") {
      return res.status(400).json({ message: "postId is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(404).json({ message: "Post not found" });
    }

    const n = Number(amount);
    if (Number.isNaN(n) || n < 1) {
      return res.status(400).json({ message: "Amount must be at least 1" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.farmer.toString() === req.user.userId) {
      return res.status(403).json({ message: "You cannot bid on your own post" });
    }

    const bid = await Bid.create({
      post: postId,
      buyer: req.user.userId,
      amount: Math.round(n * 100) / 100,
    });

    await bid.populate([
      { path: "buyer", select: "name" },
      {
        path: "post",
        select: "title farmer",
        populate: { path: "farmer", select: "name" },
      },
    ]);

    return res.status(201).json({ bid: serializeBidForBuyer(bid) });
  } catch (err) {
    console.error("createBid error:", err);
    return res.status(500).json({ message: "Could not place bid" });
  }
}

/** GET /api/bids/mine — buyer's bids */
export async function listMyBids(req, res) {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({ message: "Only retailers can view this" });
    }

    const bids = await Bid.find({ buyer: req.user.userId })
      .sort({ createdAt: -1 })
      .populate("buyer", "name")
      .populate({
        path: "post",
        select: "title farmer",
        populate: { path: "farmer", select: "name" },
      });

    const payload = bids
      .filter((b) => b.post)
      .map(serializeBidForBuyer);

    return res.json({ bids: payload });
  } catch (err) {
    console.error("listMyBids error:", err);
    return res.status(500).json({ message: "Could not load bids" });
  }
}

/** GET /api/bids/on-my-posts — bids on farmer's posts */
export async function listBidsOnMyPosts(req, res) {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({ message: "Only farmers can view this" });
    }

    const myPosts = await Post.find({ farmer: req.user.userId }).select("_id");
    const postIds = myPosts.map((p) => p._id);
    if (postIds.length === 0) {
      return res.json({ bids: [] });
    }

    const bids = await Bid.find({ post: { $in: postIds } })
      .sort({ createdAt: -1 })
      .populate("buyer", "name")
      .populate("post", "title");

    const payload = bids
      .filter((b) => b.post)
      .map(serializeBidForFarmer);

    return res.json({ bids: payload });
  } catch (err) {
    console.error("listBidsOnMyPosts error:", err);
    return res.status(500).json({ message: "Could not load bids" });
  }
}
