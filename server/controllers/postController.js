import { Post } from "../models/Post.js";

function normalizePost(doc) {
  const farmer = doc.farmerId && typeof doc.farmerId === "object" ? doc.farmerId : null;
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    price: doc.price || "",
    isRent: Boolean(doc.isRent),
    rentUnit: doc.rentUnit || "",
    farmerId: farmer ? farmer._id.toString() : doc.farmerId.toString(),
    farmerName: farmer?.name ?? "Farmer",
    createdAt: doc.createdAt,
  };
}

export async function listPosts(req, res) {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate("farmerId", "name");
    return res.json({ posts: posts.map(normalizePost) });
  } catch (err) {
    console.error("listPosts error:", err);
    return res.status(500).json({ message: "Could not load posts" });
  }
}

export async function getPost(req, res) {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate("farmerId", "name");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.json({ post: normalizePost(post) });
  } catch (err) {
    console.error("getPost error:", err);
    return res.status(500).json({ message: "Could not load post" });
  }
}

export async function createPost(req, res) {
  try {
    const { title, description, price, isRent, rentUnit } = req.body || {};
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!description || typeof description !== "string" || !description.trim()) {
      return res.status(400).json({ message: "Description is required" });
    }
    const normalizedIsRent = Boolean(isRent);
    const normalizedRentUnit =
      typeof rentUnit === "string" ? rentUnit.trim().toLowerCase() : "";

    if (normalizedIsRent && !["hour", "day"].includes(normalizedRentUnit)) {
      return res
        .status(400)
        .json({ message: "Rent posts must select hour or day pricing" });
    }

    const post = await Post.create({
      title: title.trim(),
      description: description.trim(),
      price: typeof price === "string" ? price.trim() : String(price ?? "").trim(),
      isRent: normalizedIsRent,
      rentUnit: normalizedIsRent ? normalizedRentUnit : "",
      farmerId: req.user.userId,
    });

    const populated = await Post.findById(post._id).populate("farmerId", "name");
    return res.status(201).json({ post: normalizePost(populated) });
  } catch (err) {
    console.error("createPost error:", err);
    return res.status(500).json({ message: "Could not create post" });
  }
}

