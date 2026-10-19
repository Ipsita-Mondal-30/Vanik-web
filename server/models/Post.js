import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, default: null },
  },
  { timestamps: true },
);

export const Post = mongoose.model("Post", postSchema);
