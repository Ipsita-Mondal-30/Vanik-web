import mongoose from "mongoose";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

function serializePost(doc) {
  const farmer = doc.farmer;
  const farmerId =
    farmer && typeof farmer === "object" && farmer._id
      ? farmer._id.toString()
      : doc.farmer.toString();
  const farmerName =
    farmer && typeof farmer === "object" && farmer.name ? farmer.name : "";

  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    price:
      doc.price != null && doc.price !== ""
        ? String(doc.price)
        : "",
    farmerId,
    farmerName,
    createdAt: doc.createdAt.toISOString(),
  };
}

/** POST /api/posts — farmers only */
export async function createPost(req, res) {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({ message: "Only farmers can create posts" });
    }

    const { title, description, price } = req.body;
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!description || typeof description !== "string" || !description.trim()) {
      return res.status(400).json({ message: "Description is required" });
    }

    let priceNum = null;
    if (price !== undefined && price !== null && String(price).trim() !== "") {
      const n = Number(price);
      if (Number.isNaN(n) || n < 0) {
        return res.status(400).json({ message: "Price must be a valid number" });
      }
      priceNum = n;
    }

    const farmer = await User.findById(req.user.userId);
    if (!farmer) {
      return res.status(401).json({ message: "User not found" });
    }

    const post = await Post.create({
      farmer: req.user.userId,
      title: title.trim(),
      description: description.trim(),
      price: priceNum,
    });
    await post.populate("farmer", "name");

    return res.status(201).json({ post: serializePost(post) });
  } catch (err) {
    console.error("createPost error:", err);
    return res.status(500).json({ message: "Could not create post" });
  }
}

/** GET /api/posts */
export async function listPosts(req, res) {
  try {
    const posts = await Post.find()
      .populate("farmer", "name")
      .sort({ createdAt: -1 });
    return res.json({ posts: posts.map(serializePost) });
  } catch (err) {
    console.error("listPosts error:", err);
    return res.status(500).json({ message: "Could not load posts" });
  }
}

/** GET /api/posts/:id */
export async function getPostById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Post not found" });
    }

    const post = await Post.findById(id).populate("farmer", "name");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json({ post: serializePost(post) });
  } catch (err) {
    console.error("getPostById error:", err);
    return res.status(500).json({ message: "Could not load post" });
  }
}
