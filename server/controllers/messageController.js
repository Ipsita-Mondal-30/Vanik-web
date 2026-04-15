import { Message } from "../models/Message.js";
import { User } from "../models/User.js";

function requireString(value, field) {
  if (!value || typeof value !== "string" || !value.trim()) {
    const err = new Error(`${field} is required`);
    err.statusCode = 400;
    throw err;
  }
  return value.trim();
}

export async function listMessagesByBid(req, res) {
  const bidId = requireString(req.params.bidId, "bidId");

  const messages = await Message.find({ bidId })
    .sort({ createdAt: 1 })
    .limit(500)
    .populate("senderId", "name role")
    .lean();

  return res.json({
    messages: messages.map((m) => ({
      id: m._id.toString(),
      bidId: m.bidId,
      senderId: m.senderId?._id?.toString?.() || m.senderId?.toString?.(),
      senderName: m.senderId?.name || "User",
      text: m.text,
      createdAt: m.createdAt,
    })),
  });
}

export async function createMessage(req, res) {
  const bidId = requireString(req.body?.bidId, "bidId");
  const text = requireString(req.body?.text, "text");

  const sender = await User.findById(req.user.userId).select("name role").lean();
  if (!sender) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const message = await Message.create({
    bidId,
    senderId: req.user.userId,
    text,
    createdAt: new Date(),
  });

  return res.status(201).json({
    message: {
      id: message._id.toString(),
      bidId,
      senderId: req.user.userId,
      senderName: sender.name,
      text,
      createdAt: message.createdAt,
    },
  });
}

