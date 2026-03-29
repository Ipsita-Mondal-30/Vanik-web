import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, IndianRupee, PlusCircle } from "lucide-react";
function MyPosts() {
  const navigate = useNavigate();
  const { user, t } = useApp();
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    if (user) {
      const savedPosts = JSON.parse(localStorage.getItem("vanik_posts") || "[]");
      const userPosts = savedPosts.filter((post) => post.farmerId === user.id);
      setPosts(userPosts);
    }
  }, [user]);
  if (!user || user.role !== "farmer") {
    navigate("/dashboard");
    return null;
  }
  const getBidCount = (postId) => {
    const bids = JSON.parse(localStorage.getItem("vanik_bids") || "[]");
    return bids.filter((bid) => bid.postId === postId).length;
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted/30 py-8 sm:py-12 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        onClick: () => navigate("/dashboard"),
        className: "mb-4 sm:mb-6",
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
          t("common.back")
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-4xl sm:text-5xl", children: "\u{1F4CB}" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-bold", children: t("dashboard.myPosts") }),
          /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Manage your posts" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          size: "lg",
          onClick: () => navigate("/create-post"),
          className: "w-full sm:w-auto",
          children: [
            /* @__PURE__ */ jsx(PlusCircle, { className: "w-5 h-5 mr-2" }),
            t("dashboard.createPost")
          ]
        }
      )
    ] }),
    posts.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-8 sm:p-12 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-5xl sm:text-6xl mb-4", children: "\u{1F4DD}" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg sm:text-xl font-semibold mb-2", children: t("post.noPosts") }),
      /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-muted-foreground mb-6", children: t("post.createFirst") }),
      /* @__PURE__ */ jsxs(Button, { onClick: () => navigate("/create-post"), children: [
        /* @__PURE__ */ jsx(PlusCircle, { className: "w-5 h-5 mr-2" }),
        t("dashboard.createPost")
      ] })
    ] }) }) : /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:gap-6", children: posts.map((post) => {
      const bidCount = getBidCount(post.id);
      return /* @__PURE__ */ jsx(
        Card,
        {
          className: "cursor-pointer hover:shadow-xl transition-all",
          onClick: () => navigate(`/post/${post.id}`),
          children: /* @__PURE__ */ jsxs(CardContent, { className: "p-5 sm:p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg sm:text-xl font-bold mb-2", children: post.title }),
                /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-muted-foreground line-clamp-2 mb-3", children: post.description }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 text-xs sm:text-sm text-muted-foreground", children: /* @__PURE__ */ jsx("span", { children: new Date(post.createdAt).toLocaleDateString() }) })
              ] }),
              post.price && /* @__PURE__ */ jsx("div", { className: "bg-primary/10 rounded-xl p-3 text-center shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1 text-xl font-bold text-primary", children: [
                /* @__PURE__ */ jsx(IndianRupee, { className: "w-5 h-5" }),
                post.price
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-accent/20 text-accent px-3 py-2 rounded-lg flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xl font-bold", children: bidCount }),
                /* @__PURE__ */ jsx("span", { className: "text-sm", children: bidCount === 1 ? "Bid" : "Bids" })
              ] }),
              bidCount > 0 && /* @__PURE__ */ jsx(
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
