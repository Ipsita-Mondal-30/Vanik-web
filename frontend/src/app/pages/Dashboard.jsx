import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import api from "../api";
import { Card, CardContent } from "../components/ui/card";
import { PlusCircle, FileText, Gavel, ShoppingBag, MessageSquare, Sprout } from "lucide-react";
import { useEffect, useState } from "react";
function Dashboard() {
  const navigate = useNavigate();
  const { user, t } = useApp();
  const [stats, setStats] = useState({ posts: 0, bids: 0, chats: 0 });
  useEffect(() => {
    if (user) {
      if (user.role === "farmer") {
        Promise.all([
          api.get("/api/posts"),
          api.get("/api/bids/farmer"),
          api.get("/api/messages/inbox"),
        ])
          .then(([postsRes, bidsRes, inboxRes]) => {
            const allPosts = postsRes.data.posts || [];
            const myPosts = allPosts.filter((p) => p.farmerId === user.id);
            const myBids = bidsRes.data.bids || [];
            const chats = inboxRes.data.chats || [];
            setStats({
              posts: myPosts.length,
              bids: myBids.length,
              chats: chats.length,
            });
          })
          .catch(() => setStats({ posts: 0, bids: 0, chats: 0 }));
      } else {
        Promise.all([
          api.get("/api/posts"),
          api.get("/api/bids/buyer"),
          api.get("/api/messages/inbox"),
        ])
          .then(([postsRes, bidsRes, inboxRes]) => {
            const allPosts = postsRes.data.posts || [];
            const myBids = bidsRes.data.bids || [];
            const chats = inboxRes.data.chats || [];
            setStats({
              posts: myBids.length,
              bids: allPosts.length,
              chats: chats.length,
            });
          })
          .catch(() => setStats({ posts: 0, bids: 0, chats: 0 }));
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
    },
    {
      icon: MessageSquare,
      title: t("bid.chat"),
      description: "Messages",
      path: "/messages",
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
  return jsx("div", { className: "min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted/30 py-8 sm:py-12 px-4", children: jsxs("div", { className: "max-w-4xl mx-auto", children: [
    jsx("div", { className: "mb-8 sm:mb-12", children: jsxs("div", { className: "flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4", children: [
      jsx("div", { className: "bg-primary/10 rounded-full p-3 sm:p-4 flex items-center justify-center", children: user.role === "farmer" ? jsx(Sprout, { className: "w-10 h-10 sm:w-12 sm:h-12 text-primary" }) : jsx(ShoppingBag, { className: "w-10 h-10 sm:w-12 sm:h-12 text-secondary" }) }),
      jsxs("div", { children: [
        jsxs("h1", { className: "text-2xl sm:text-3xl font-bold", children: [
          t("dashboard.welcome"),
          ", ",
          user.name,
          "!"
        ] }),
        jsx("p", { className: "text-base sm:text-lg text-muted-foreground", children: t(`role.${user.role}`) })
      ] })
    ] }) }),
    jsx("div", { className: "grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3", children: actions.map((action, index) => {
      const Icon = action.icon;
      const showChatBadge = action.path === "/messages" && stats.chats > 0;
      return jsx(
        Card,
        {
          className: "cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-primary/50",
          onClick: () => navigate(action.path),
          children: jsxs(CardContent, { className: "p-6 sm:p-8", children: [
            jsxs("div", { className: "relative w-fit mb-4 sm:mb-6", children: [
              jsx("div", { className: `${action.color} rounded-xl p-3 sm:p-4`, children: jsx(Icon, { className: "w-8 h-8 sm:w-10 sm:h-10 text-white" }) }),
              showChatBadge && jsx(
                "span",
                {
                  className: "absolute -top-2 -right-2 min-w-6 h-6 px-1 rounded-full bg-destructive text-white text-xs font-bold flex items-center justify-center",
                  children: stats.chats > 99 ? "99+" : stats.chats
                }
              )
            ] }),
            jsx("h3", { className: "text-lg sm:text-xl font-bold mb-2", children: action.title }),
            jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: action.description })
          ] })
        },
        index
      );
    }) }),
    jsxs("div", { className: "mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6", children: [
      jsx(Card, { children: jsxs(CardContent, { className: "p-4 sm:p-6 text-center", children: [
        jsx("div", { className: "text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2", children: stats.posts }),
        jsx("div", { className: "text-xs sm:text-sm text-muted-foreground", children: user.role === "farmer" ? "Active Posts" : "Bids Placed" })
      ] }) }),
      jsx(Card, { children: jsxs(CardContent, { className: "p-4 sm:p-6 text-center", children: [
        jsx("div", { className: "text-2xl sm:text-3xl font-bold text-accent mb-1 sm:mb-2", children: stats.bids }),
        jsx("div", { className: "text-xs sm:text-sm text-muted-foreground", children: user.role === "farmer" ? "Total Bids" : "Posts Available" })
      ] }) }),
      jsx(Card, { className: "col-span-2 md:col-span-1", children: jsxs(CardContent, { className: "p-4 sm:p-6 text-center", children: [
        jsx("div", { className: "text-2xl sm:text-3xl font-bold text-secondary mb-1 sm:mb-2", children: stats.chats }),
        jsx("div", { className: "text-xs sm:text-sm text-muted-foreground", children: "Active Chats" })
      ] }) })
    ] })
  ] }) });
}
export {
  Dashboard
};
