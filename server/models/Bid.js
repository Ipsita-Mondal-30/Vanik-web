import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
);

bidSchema.index({ post: 1, buyer: 1 });

export const Bid = mongoose.model("Bid", bidSchema);
