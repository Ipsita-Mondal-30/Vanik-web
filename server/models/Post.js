import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: String, default: "", trim: true },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

export const Post = mongoose.model("Post", postSchema);

