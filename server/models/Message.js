import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    bidId: { type: String, required: true, index: true },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

export const Message = mongoose.model("Message", messageSchema);
