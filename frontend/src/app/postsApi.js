import api from "./api";

export async function fetchPosts() {
  const { data } = await api.get("/api/posts");
  return data.posts;
}

export async function fetchPost(id) {
  const { data } = await api.get(`/api/posts/${id}`);
  return data.post;
}

export async function createPost({ title, description, price }) {
  const { data } = await api.post("/api/posts", {
    title,
    description,
    price:
      price === "" || price === undefined || price === null
        ? undefined
        : price,
  });
  return data.post;
}
