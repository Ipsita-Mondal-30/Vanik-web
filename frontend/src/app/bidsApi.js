import api from "./api";

export async function createBid({ postId, amount }) {
  const { data } = await api.post("/api/bids", { postId, amount });
  return data.bid;
}

export async function fetchMyBids() {
  const { data } = await api.get("/api/bids/mine");
  return data.bids;
}

export async function fetchBidsOnMyPosts() {
  const { data } = await api.get("/api/bids/on-my-posts");
  return data.bids;
}
