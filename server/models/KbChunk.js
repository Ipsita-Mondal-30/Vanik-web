import mongoose from "mongoose";

const kbChunkSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    embedding: { type: [Number], required: true },
    title: { type: String, default: "" },
    source: { type: String, default: "" }, // e.g. "faq", "policy", "post:123"
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
      index: true,
    },
    roles: {
      type: [String],
      enum: ["farmer", "buyer"],
      default: [],
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false },
);

kbChunkSchema.index({ source: 1, createdAt: -1 });

export const KbChunk = mongoose.model("KbChunk", kbChunkSchema);

