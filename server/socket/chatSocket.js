import jwt from "jsonwebtoken";
import { Message } from "../models/Message.js";
import { formatMessage } from "../utils/messageFormat.js";
import { Bid } from "../models/Bid.js";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return "dev-only-insecure-secret";
  }
  return secret;
}

/**
 * Real-time chat: clients join room `bid:<bidId>` and exchange messages persisted in MongoDB.
 */
export function setupChatSocket(io) {
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, "");
      if (!token) {
        return next(new Error("Authentication required"));
      }
      const payload = jwt.verify(token, getJwtSecret());
      if (!payload.userId) {
        return next(new Error("Invalid token"));
      }
      socket.userId = payload.userId;
      socket.userRole = payload.role;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join_bid", async ({ bidId }, ack) => {
      try {
        if (!bidId || typeof bidId !== "string" || !bidId.trim()) return;
        const bid = await Bid.findById(bidId.trim()).populate({
          path: "postId",
          select: "farmerId",
        });
        if (!bid || !bid.postId) {
          ack?.({ ok: false, error: "Bid not found" });
          return;
        }
        const farmerId = bid.postId.farmerId.toString();
        const buyerId = bid.buyerId.toString();
        const isMember = socket.userId === farmerId || socket.userId === buyerId;
        if (!isMember) {
          ack?.({ ok: false, error: "Forbidden" });
          return;
        }
        if (bid.status !== "accepted") {
          ack?.({ ok: false, error: "Chat is not active for this bid" });
          return;
        }
        socket.join(`bid:${bidId.trim()}`);
        ack?.({ ok: true });
      } catch (err) {
        ack?.({ ok: false, error: "Could not join chat" });
      }
    });

    socket.on("leave_bid", ({ bidId }) => {
      if (bidId && typeof bidId === "string") {
        socket.leave(`bid:${bidId.trim()}`);
      }
    });

    socket.on("chat_message", async ({ bidId, text }, ack) => {
      try {
        if (!bidId || typeof bidId !== "string" || !bidId.trim()) {
          ack?.({ ok: false, error: "bidId required" });
          return;
        }
        if (!text || typeof text !== "string" || !text.trim()) {
          ack?.({ ok: false, error: "text required" });
          return;
        }

        const bid = await Bid.findById(bidId.trim()).populate({
          path: "postId",
          select: "farmerId",
        });
        if (!bid || !bid.postId) {
          ack?.({ ok: false, error: "Bid not found" });
          return;
        }
        const farmerId = bid.postId.farmerId.toString();
        const buyerId = bid.buyerId.toString();
        const isMember = socket.userId === farmerId || socket.userId === buyerId;
        if (!isMember) {
          ack?.({ ok: false, error: "Forbidden" });
          return;
        }
        if (bid.status !== "accepted") {
          ack?.({ ok: false, error: "Chat is not active for this bid" });
          return;
        }

        const message = await Message.create({
          bidId: bidId.trim(),
          senderId: socket.userId,
          text: text.trim(),
        });

        const populated = await Message.findById(message._id).populate(
          "senderId",
          "name role",
        );

        const payload = formatMessage(populated);
        io.to(`bid:${bidId.trim()}`).emit("new_message", payload);
        ack?.({ ok: true, message: payload });
      } catch (err) {
        console.error("chat_message socket error:", err);
        ack?.({ ok: false, error: "Could not send message" });
      }
    });

    socket.on("disconnect", () => {});
  });
}
