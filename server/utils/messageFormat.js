/** Shared shape for API + socket payloads */
export function formatMessage(doc) {
  if (!doc) return null;
  const sender = doc.senderId;
  const senderIdObj = sender && typeof sender === "object" ? sender : null;
  return {
    id: doc._id.toString(),
    bidId: doc.bidId,
    text: doc.text,
    createdAt: doc.createdAt,
    senderId: senderIdObj
      ? senderIdObj._id.toString()
      : doc.senderId.toString(),
    senderName: senderIdObj?.name ?? "User",
    senderRole: senderIdObj?.role ?? null,
  };
}
