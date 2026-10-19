import { Message } from "../models/Message.js";
import { formatMessage } from "../utils/messageFormat.js";
import { Bid } from "../models/Bid.js";

async function ensureAcceptedMember(bidId, userId) {
  const bid = await Bid.findById(bidId).populate({
    path: "postId",
    select: "farmerId",
  });
  if (!bid || !bid.postId) return { ok: false, status: 404, message: "Bid not found" };
  const farmerId = bid.postId.farmerId.toString();
  const buyerId = bid.buyerId.toString();
  const isMember = userId === farmerId || userId === buyerId;
  if (!isMember) return { ok: false, status: 403, message: "Forbidden" };
  if (bid.status !== "accepted") {
    return { ok: false, status: 403, message: "Chat is not active for this bid" };
  }
  return { ok: true };
}

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

    const allowed = await ensureAcceptedMember(bidId.trim(), senderId);
    if (!allowed.ok) {
      return res.status(allowed.status).json({ message: allowed.message });
    }

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

    const allowed = await ensureAcceptedMember(bidId.trim(), req.user.userId);
    if (!allowed.ok) {
      return res.status(allowed.status).json({ message: allowed.message });
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

export async function getInbox(req, res) {
  try {
    const userId = req.user.userId;

    // Find bids where the user is involved (buyer) OR (farmer via post)
    const bids = await Bid.find({ buyerId: userId, status: "accepted" })
      .populate("buyerId", "name role")
      .populate({
        path: "postId",
        select: "farmerId title",
        populate: { path: "farmerId", select: "name role" },
      });

    // Also include farmer-side bids by scanning posts they own
    const farmerBids = await Bid.find({ status: "accepted" })
      .populate("buyerId", "name role")
      .populate({
        path: "postId",
        select: "farmerId title",
        match: { farmerId: userId },
        populate: { path: "farmerId", select: "name role" },
      });

    const allBids = [...bids, ...farmerBids].filter((b) => b.postId);
    const unique = new Map();
    for (const b of allBids) unique.set(b._id.toString(), b);
    const bidList = Array.from(unique.values());

    const previews = await Promise.all(
      bidList.map(async (bid) => {
        const last = await Message.findOne({ bidId: bid._id.toString() })
          .sort({ createdAt: -1 })
          .populate("senderId", "name role");

        const buyer = bid.buyerId;
        const farmer = bid.postId?.farmerId;
        const isBuyer = buyer && buyer._id.toString() === userId;
        const other = isBuyer ? farmer : buyer;
        const otherRole = isBuyer ? "farmer" : "buyer";

        return {
          bidId: bid._id.toString(),
          postId: bid.postId?._id?.toString?.() ?? null,
          postTitle: bid.postId?.title ?? "Post",
          otherUserId: other?._id?.toString?.() ?? "",
          otherUserName: other?.name ?? "User",
          otherUserRole: other?.role ?? otherRole,
          lastMessage: last ? last.text : "Chat started",
          lastMessageTime: last ? last.createdAt : bid.acceptedAt ?? bid.createdAt,
        };
      }),
    );

    const chats = previews
      .filter(Boolean)
      .sort(
        (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime(),
      );

    return res.json({ chats });
  } catch (err) {
    console.error("getInbox error:", err);
    return res.status(500).json({ message: "Could not load inbox" });
  }
}
