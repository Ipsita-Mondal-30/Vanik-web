import { Notification } from "../models/Notification.js";

function normalize(n) {
  return {
    id: n._id.toString(),
    type: n.type,
    title: n.title,
    message: n.message,
    data: n.data || {},
    read: Boolean(n.read),
    createdAt: n.createdAt,
  };
}

export async function listNotifications(req, res) {
  try {
    const userId = req.user.userId;
    const items = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(30);
    const unreadCount = await Notification.countDocuments({ userId, read: false });
    return res.json({ notifications: items.map(normalize), unreadCount });
  } catch (err) {
    console.error("listNotifications error:", err);
    return res.status(500).json({ message: "Could not load notifications" });
  }
}

export async function markAllRead(req, res) {
  try {
    const userId = req.user.userId;
    await Notification.updateMany({ userId, read: false }, { $set: { read: true } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("markAllRead error:", err);
    return res.status(500).json({ message: "Could not mark notifications read" });
  }
}

