import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, IndianRupee, Eye } from "lucide-react";
function MyBids() {
  const navigate = useNavigate();
  const { user, t } = useApp();
  const [bidsWithPosts, setBidsWithPosts] = useState([]);
  useEffect(() => {
    if (user) {
      const allBids = JSON.parse(localStorage.getItem("vanik_bids") || "[]");
      const userBids = allBids.filter((bid) => bid.buyerId === user.id);
      const posts = JSON.parse(localStorage.getItem("vanik_posts") || "[]");
      const bidsWithInfo = userBids.map((bid) => {
        const post = posts.find((p) => p.id === bid.postId);
        return {
          ...bid,
          postTitle: post?.title || "Unknown Post",
          farmerName: post?.farmerName || "Unknown Farmer"
        };
      });
      bidsWithInfo.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setBidsWithPosts(bidsWithInfo);
    }
  }, [user]);
  if (!user || user.role !== "buyer") {
    navigate("/dashboard");
    return null;
  }
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
        /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-bold", children: t("dashboard.myBids") }),
        /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Track your bids" })
      ] })
    ] }),
    bidsWithPosts.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-8 sm:p-12 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-5xl sm:text-6xl mb-4", children: "\u{1F4ED}" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg sm:text-xl font-semibold mb-2", children: t("bid.noBids") }),
      /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-muted-foreground mb-6", children: "Start bidding on posts" }),
      /* @__PURE__ */ jsx(Button, { onClick: () => navigate("/browse"), children: t("dashboard.browsePosts") })
    ] }) }) : /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:gap-6", children: bidsWithPosts.map((bid) => /* @__PURE__ */ jsx(Card, { className: "hover:shadow-lg transition-all", children: /* @__PURE__ */ jsx(CardContent, { className: "p-5 sm:p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg sm:text-xl font-bold mb-2", children: bid.postTitle }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 text-sm sm:text-base text-muted-foreground mb-3", children: /* @__PURE__ */ jsxs("span", { className: "bg-muted px-2 py-1 rounded", children: [
          "\u{1F468}\u200D\u{1F33E} ",
          bid.farmerName
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs sm:text-sm text-muted-foreground", children: [
          "Bid placed: ",
          new Date(bid.createdAt).toLocaleString()
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-accent/10 rounded-xl p-4 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Your Bid" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1 text-xl sm:text-2xl font-bold text-accent", children: [
            /* @__PURE__ */ jsx(IndianRupee, { className: "w-5 h-5" }),
            bid.amount
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: () => navigate(`/post/${bid.postId}`),
            variant: "outline",
            size: "lg",
            className: "h-full",
            children: [
              /* @__PURE__ */ jsx(Eye, { className: "w-5 h-5 mr-2" }),
              "View Post"
            ]
          }
        )
      ] })
    ] }) }) }, bid.id)) })
  ] }) });
}
export {
  MyBids
};
