import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, IndianRupee, ShoppingCart, Mail, Sprout, ArrowRight } from "lucide-react";
function BrowsePosts() {
  const navigate = useNavigate();
  const { user, t } = useApp();
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("vanik_posts") || "[]");
    setPosts(savedPosts);
  }, []);
  if (!user) {
    navigate("/login");
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
    jsxs("div", { className: "flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8", children: [
      jsx("div", { className: "bg-primary/10 rounded-full p-3 flex items-center justify-center", children: jsx(ShoppingCart, { className: "w-8 h-8 sm:w-10 sm:h-10 text-primary" }) }),
      jsxs("div", { children: [
        jsx("h1", { className: "text-2xl sm:text-3xl font-bold", children: t("dashboard.browsePosts") }),
        jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Find crops and services" })
      ] })
    ] }),
    posts.length === 0 ? jsx(Card, { children: jsxs(CardContent, { className: "p-8 sm:p-12 text-center", children: [
      jsx("div", { className: "flex justify-center mb-4", children: jsx(Mail, { className: "w-14 h-14 sm:w-16 sm:h-16 text-muted-foreground" }) }),
      jsx("h3", { className: "text-lg sm:text-xl font-semibold mb-2", children: t("post.noPosts") }),
      jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Check back later for new posts" })
    ] }) }) : jsx("div", { className: "grid gap-4 sm:gap-6", children: posts.map((post) => jsx(
      Card,
      {
        className: "cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1",
        onClick: () => navigate(`/post/${post.id}`),
        children: jsxs(CardContent, { className: "p-5 sm:p-6", children: [
          jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4", children: [
            jsxs("div", { className: "flex-1", children: [
              jsx("h3", { className: "text-lg sm:text-xl font-bold mb-2", children: post.title }),
              jsx("p", { className: "text-sm sm:text-base text-muted-foreground line-clamp-2 mb-3", children: post.description }),
              jsxs("div", { className: "flex items-center gap-2 text-xs sm:text-sm text-muted-foreground", children: [
                jsxs("span", { className: "bg-muted px-2 py-1 rounded inline-flex items-center gap-1.5", children: [
                  jsx(Sprout, { className: "w-3.5 h-3.5 shrink-0" }),
                  post.farmerName
                ] }),
                jsx("span", { children: "\u2022" }),
                jsx("span", { children: new Date(post.createdAt).toLocaleDateString() })
              ] })
            ] }),
            post.price && jsxs("div", { className: "bg-primary/10 rounded-xl p-3 sm:p-4 text-center shrink-0", children: [
              jsxs("div", { className: "flex items-center justify-center gap-1 text-xl sm:text-2xl font-bold text-primary", children: [
                jsx(IndianRupee, { className: "w-5 h-5 sm:w-6 sm:h-6" }),
                post.price
              ] }),
              jsx("div", { className: "text-xs sm:text-sm text-muted-foreground mt-1", children: "Starting" })
            ] })
          ] }),
          jsxs(Button, { size: "sm", className: "w-full sm:w-auto gap-2", children: [
            t("post.viewDetails"),
            jsx(ArrowRight, { className: "w-4 h-4" })
          ] })
        ] })
      },
      post.id
    )) })
  ] }) });
}
export {
  BrowsePosts
};
