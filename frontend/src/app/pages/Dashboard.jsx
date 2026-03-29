import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { Card, CardContent } from "../components/ui/card";
import { PlusCircle, FileText, Gavel, ShoppingBag, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
function Dashboard() {
  const navigate = useNavigate();
  const { user, t } = useApp();
  const [stats, setStats] = useState({ posts: 0, bids: 0, chats: 0 });
  useEffect(() => {
    if (user) {
      const posts = JSON.parse(localStorage.getItem("vanik_posts") || "[]");
      const bids = JSON.parse(localStorage.getItem("vanik_bids") || "[]");
      const messages = JSON.parse(localStorage.getItem("vanik_messages") || "[]");
      if (user.role === "farmer") {
        const myPosts = posts.filter((p) => p.farmerId === user.id);
        const myBids = bids.filter(
          (b) => myPosts.some((p) => p.id === b.postId)
        );
        const myChats = new Set(
          messages.filter((m) => m.chatId.includes(user.id)).map((m) => m.chatId)
        ).size;
        setStats({
          posts: myPosts.length,
          bids: myBids.length,
          chats: myChats
        });
      } else {
        const myBids = bids.filter((b) => b.buyerId === user.id);
        const viewedPosts = posts.length;
        const myChats = new Set(
          messages.filter((m) => m.chatId.includes(user.id)).map((m) => m.chatId)
        ).size;
        setStats({
          posts: myBids.length,
          // Reuse for bids placed
          bids: viewedPosts,
          chats: myChats
        });
      }
    }
  }, [user]);
  if (!user) {
    navigate("/login");
    return null;
  }
  const farmerActions = [
    {
      icon: PlusCircle,
      title: t("dashboard.createPost"),
      description: "Post crops or requirements",
      path: "/create-post",
      color: "bg-primary"
    },
    {
      icon: FileText,
      title: t("dashboard.myPosts"),
      description: "View your posts",
      path: "/my-posts",
      color: "bg-accent"
    },
    {
      icon: Gavel,
      title: t("dashboard.viewBids"),
      description: "Check bids on posts",
      path: "/bids",
      color: "bg-secondary"
    }
  ];
  const buyerActions = [
    {
      icon: ShoppingBag,
      title: t("dashboard.browsePosts"),
      description: "Find crops & services",
      path: "/browse",
      color: "bg-primary"
    },
    {
      icon: Gavel,
      title: t("dashboard.myBids"),
      description: "Your bids",
      path: "/my-bids",
      color: "bg-accent"
    },
    {
      icon: MessageSquare,
      title: t("bid.chat"),
      description: "Messages",
      path: "/messages",
      color: "bg-secondary"
    }
  ];
  const actions = user.role === "farmer" ? farmerActions : buyerActions;
  return /* @__PURE__ */ jsx("div", { className: "min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted/30 py-8 sm:py-12 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-8 sm:mb-12", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4", children: [
      /* @__PURE__ */ jsx("div", { className: "text-5xl sm:text-6xl", children: user.role === "farmer" ? "\u{1F468}\u200D\u{1F33E}" : "\u{1F477}" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-2xl sm:text-3xl font-bold", children: [
          t("dashboard.welcome"),
          ", ",
          user.name,
          "!"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-base sm:text-lg text-muted-foreground", children: t(`role.${user.role}`) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3", children: actions.map((action, index) => {
      const Icon = action.icon;
      return /* @__PURE__ */ jsx(
        Card,
        {
          className: "cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-primary/50",
          onClick: () => navigate(action.path),
          children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6 sm:p-8", children: [
            /* @__PURE__ */ jsx("div", { className: `${action.color} rounded-xl p-3 sm:p-4 w-fit mb-4 sm:mb-6`, children: /* @__PURE__ */ jsx(Icon, { className: "w-8 h-8 sm:w-10 sm:h-10 text-white" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg sm:text-xl font-bold mb-2", children: action.title }),
            /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: action.description })
          ] })
        },
        index
      );
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6", children: [
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4 sm:p-6 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2", children: stats.posts }),
        /* @__PURE__ */ jsx("div", { className: "text-xs sm:text-sm text-muted-foreground", children: user.role === "farmer" ? "Active Posts" : "Bids Placed" })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4 sm:p-6 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl sm:text-3xl font-bold text-accent mb-1 sm:mb-2", children: stats.bids }),
        /* @__PURE__ */ jsx("div", { className: "text-xs sm:text-sm text-muted-foreground", children: user.role === "farmer" ? "Total Bids" : "Posts Available" })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "col-span-2 md:col-span-1", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4 sm:p-6 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl sm:text-3xl font-bold text-secondary mb-1 sm:mb-2", children: stats.chats }),
        /* @__PURE__ */ jsx("div", { className: "text-xs sm:text-sm text-muted-foreground", children: "Active Chats" })
      ] }) })
    ] })
  ] }) });
}
export {
  Dashboard
};
