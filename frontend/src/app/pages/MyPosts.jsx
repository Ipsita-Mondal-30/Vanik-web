import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import api from "../api";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, IndianRupee, PlusCircle, ClipboardList, FileText, Loader2 } from "lucide-react";
function getPriceText(post) {
  if (!post?.price) return null;
  if (post.isRent) {
    return `${post.price}/${post.rentUnit === "hour" ? "hour" : "day"}`;
  }
  return post.price;
}
function MyPosts() {
  const navigate = useNavigate();
  const { user, t } = useApp();
  const [posts, setPosts] = useState([]);
  const [bidCountByPostId, setBidCountByPostId] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([api.get("/api/posts"), api.get("/api/bids/farmer")])
        .then(([postsRes, bidsRes]) => {
          const allPosts = postsRes.data.posts || [];
          const myPosts = allPosts.filter((p) => p.farmerId === user.id);
          setPosts(myPosts);

          const counts = {};
          for (const b of bidsRes.data.bids || []) {
            counts[b.postId] = (counts[b.postId] || 0) + 1;
          }
          setBidCountByPostId(counts);
        })
        .catch(() => {
          setPosts([]);
          setBidCountByPostId({});
        })
        .finally(() => setLoading(false));
    }
  }, [user]);
  if (!user || user.role !== "farmer") {
    navigate("/dashboard");
    return null;
  }
  return jsx("div", { className: "min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted/30 py-8 sm:py-12 px-4", children: jsxs("div", { className: "max-w-4xl mx-auto", children: [
    jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        onClick: () => navigate("/dashboard"),
        className: "mb-4 sm:mb-6",
        children: [
          jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
          t("common.back")
        ]
      }
    ),
    jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8", children: [
      jsxs("div", { className: "flex items-center gap-3 sm:gap-4", children: [
        jsx("div", { className: "bg-primary/10 rounded-full p-3 flex items-center justify-center", children: jsx(ClipboardList, { className: "w-8 h-8 sm:w-10 sm:h-10 text-primary" }) }),
        jsxs("div", { children: [
          jsx("h1", { className: "text-2xl sm:text-3xl font-bold", children: t("dashboard.myPosts") }),
          jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Manage your posts" })
        ] })
      ] }),
      jsxs(
        Button,
        {
          size: "lg",
          onClick: () => navigate("/create-post"),
          className: "w-full sm:w-auto",
          children: [
            jsx(PlusCircle, { className: "w-5 h-5 mr-2" }),
            t("dashboard.createPost")
          ]
        }
      )
    ] }),
    loading ? jsx(Card, { children: jsx(CardContent, { className: "p-10 sm:p-14 flex items-center justify-center", children: jsx(Loader2, { className: "w-8 h-8 animate-spin text-primary" }) }) }) : posts.length === 0 ? jsx(Card, { children: jsxs(CardContent, { className: "p-8 sm:p-12 text-center", children: [
      jsx("div", { className: "flex justify-center mb-4", children: jsx(FileText, { className: "w-14 h-14 sm:w-16 sm:h-16 text-muted-foreground" }) }),
      jsx("h3", { className: "text-lg sm:text-xl font-semibold mb-2", children: t("post.noPosts") }),
      jsx("p", { className: "text-sm sm:text-base text-muted-foreground mb-6", children: t("post.createFirst") }),
      jsxs(Button, { onClick: () => navigate("/create-post"), children: [
        jsx(PlusCircle, { className: "w-5 h-5 mr-2" }),
        t("dashboard.createPost")
      ] })
    ] }) }) : jsx("div", { className: "grid gap-4 sm:gap-6", children: posts.map((post) => {
      const bidCount = bidCountByPostId[post.id] || 0;
      const priceText = getPriceText(post);
      return jsx(
        Card,
        {
          className: "cursor-pointer hover:shadow-xl transition-all",
          onClick: () => navigate(`/post/${post.id}`),
          children: jsxs(CardContent, { className: "p-5 sm:p-6", children: [
            jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4", children: [
              jsxs("div", { className: "flex-1", children: [
                jsx("h3", { className: "text-lg sm:text-xl font-bold mb-2", children: post.title }),
                jsx("p", { className: "text-sm sm:text-base text-muted-foreground line-clamp-2 mb-3", children: post.description }),
                jsx("div", { className: "flex items-center gap-2 text-xs sm:text-sm text-muted-foreground", children: jsx("span", { children: new Date(post.createdAt).toLocaleDateString() }) })
              ] }),
              priceText && jsx("div", { className: "bg-primary/10 rounded-xl p-3 text-center shrink-0", children: jsxs("div", { className: "flex items-center justify-center gap-1 text-xl font-bold text-primary", children: [
                jsx(IndianRupee, { className: "w-5 h-5" }),
                priceText
              ] }) })
            ] }),
            jsxs("div", { className: "flex items-center gap-3", children: [
              jsxs("div", { className: "bg-accent/20 text-accent px-3 py-2 rounded-lg flex items-center gap-2", children: [
                jsx("span", { className: "text-xl font-bold", children: bidCount }),
                jsx("span", { className: "text-sm", children: bidCount === 1 ? "Bid" : "Bids" })
              ] }),
              bidCount > 0 && jsx(
                Button,
                {
                  size: "sm",
                  onClick: (e) => {
                    e.stopPropagation();
                    navigate("/bids");
                  },
                  children: t("dashboard.viewBids")
                }
              )
            ] })
          ] })
        },
        post.id
      );
    }) })
  ] }) });
}
export {
  MyPosts
};
