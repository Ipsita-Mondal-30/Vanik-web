import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, IndianRupee, MessageSquare } from "lucide-react";
function Bids() {
  const navigate = useNavigate();
  const { user, t } = useApp();
  const [bidsWithPosts, setBidsWithPosts] = useState([]);
  useEffect(() => {
    if (user) {
      const posts = JSON.parse(localStorage.getItem("vanik_posts") || "[]");
      const userPosts = posts.filter((post) => post.farmerId === user.id);
      const userPostIds = userPosts.map((p) => p.id);
      const allBids = JSON.parse(localStorage.getItem("vanik_bids") || "[]");
      const userBids = allBids.filter((bid) => userPostIds.includes(bid.postId));
      const bidsWithTitles = userBids.map((bid) => {
        const post = userPosts.find((p) => p.id === bid.postId);
        return {
          ...bid,
          postTitle: post?.title || "Unknown Post"
        };
      });
      bidsWithTitles.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setBidsWithPosts(bidsWithTitles);
    }
  }, [user]);
  if (!user || user.role !== "farmer") {
    navigate("/dashboard");
    return null;
  }
  const handleChat = (bid) => {
    navigate(`/chat/${bid.buyerId}?bidId=${bid.id}`);
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
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "text-4xl sm:text-5xl", children: "\u{1F3AF}" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-bold", children: t("dashboard.viewBids") }),
        /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "All bids on your posts" })
      ] })
    ] }),
    bidsWithPosts.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-8 sm:p-12 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-5xl sm:text-6xl mb-4", children: "\u{1F4ED}" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg sm:text-xl font-semibold mb-2", children: t("bid.noBids") }),
      /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Wait for buyers to place bids on your posts" })
    ] }) }) : /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:gap-6", children: bidsWithPosts.map((bid) => /* @__PURE__ */ jsx(Card, { className: "hover:shadow-lg transition-all", children: /* @__PURE__ */ jsx(CardContent, { className: "p-5 sm:p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs sm:text-sm text-muted-foreground mb-2", children: t("bid.bidder") }),
        /* @__PURE__ */ jsxs("h3", { className: "text-lg sm:text-xl font-bold mb-1", children: [
          "\u{1F477} ",
          bid.buyerName
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-muted-foreground mb-3", children: bid.postTitle }),
        /* @__PURE__ */ jsx("div", { className: "text-xs sm:text-sm text-muted-foreground", children: new Date(bid.createdAt).toLocaleString() })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-accent/10 rounded-xl p-4 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-1", children: t("bid.bidAmount") }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1 text-xl sm:text-2xl font-bold text-accent", children: [
            /* @__PURE__ */ jsx(IndianRupee, { className: "w-5 h-5" }),
            bid.amount
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: () => handleChat(bid),
            size: "lg",
            className: "h-full",
            children: [
              /* @__PURE__ */ jsx(MessageSquare, { className: "w-5 h-5 mr-2" }),
              t("bid.chat")
            ]
          }
        )
      ] })
    ] }) }) }, bid.id)) })
  ] }) });
}
export {
  Bids
};
