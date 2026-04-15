import { Message } from "../models/Message.js";
import { formatMessage } from "../utils/messageFormat.js";

function validateMessageBody(body) {
  const errors = [];
  const { bidId, text } = body;
  if (!bidId || typeof bidId !== "string" || !bidId.trim()) {
    errors.push("bidId is required");
  }
  if (!text || typeof text !== "string" || !text.trim()) {
    errors.push("Message text is required");
  }
  return errors;
}

export async function sendMessage(req, res) {
  try {
    const errors = validateMessageBody(req.body);
    if (errors.length) {
      return res.status(400).json({ message: errors[0], errors });
    }
    const { bidId, text } = req.body;
    const senderId = req.user.userId;

    const message = await Message.create({
      bidId: bidId.trim(),
      senderId,
      text: text.trim(),
    });

    const populated = await Message.findById(message._id).populate(
      "senderId",
      "name role",
    );

    return res.status(201).json({ message: formatMessage(populated) });
  } catch (err) {
    console.error("sendMessage error:", err);
    return res.status(500).json({ message: "Could not send message" });
  }
}

export async function getMessages(req, res) {
  try {
    const { bidId } = req.params;
    if (!bidId || !bidId.trim()) {
      return res.status(400).json({ message: "bidId is required" });
    }

    const list = await Message.find({ bidId: bidId.trim() })
      .sort({ createdAt: 1 })
      .populate("senderId", "name role");

    const messages = list.map(formatMessage);
    return res.json({ messages });
  } catch (err) {
    console.error("getMessages error:", err);
    return res.status(500).json({ message: "Could not load messages" });
  }
}
