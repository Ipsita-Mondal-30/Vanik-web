import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import api from "../api";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, MessageSquare, MessageCircle, Sprout, ShoppingBag, Loader2 } from "lucide-react";
function Messages() {
  const navigate = useNavigate();
  const { user, t } = useApp();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user) {
      setLoading(true);
      api
        .get("/api/messages/inbox")
        .then(({ data }) => setChats(data.chats || []))
        .catch(() => setChats([]))
        .finally(() => setLoading(false));
    }
  }, [user]);
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
      jsx("div", { className: "bg-primary/10 rounded-full p-3 flex items-center justify-center", children: jsx(MessageCircle, { className: "w-8 h-8 sm:w-10 sm:h-10 text-primary" }) }),
      jsxs("div", { children: [
        jsx("h1", { className: "text-2xl sm:text-3xl font-bold", children: "Messages" }),
        jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Your conversations" })
      ] })
    ] }),
    loading ? jsx(Card, { children: jsx(CardContent, { className: "p-10 sm:p-14 flex items-center justify-center", children: jsx(Loader2, { className: "w-8 h-8 animate-spin text-primary" }) }) }) : chats.length === 0 ? jsx(Card, { children: jsxs(CardContent, { className: "p-8 sm:p-12 text-center", children: [
      jsx("div", { className: "flex justify-center mb-4", children: jsx(MessageCircle, { className: "w-14 h-14 sm:w-16 sm:h-16 text-muted-foreground" }) }),
      jsx("h3", { className: "text-lg sm:text-xl font-semibold mb-2", children: "No messages yet" }),
      jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Start chatting with buyers or farmers" })
    ] }) }) : jsx("div", { className: "grid gap-3 sm:gap-4", children: chats.map((chat) => jsx(
      Card,
      {
        className: "cursor-pointer hover:shadow-lg transition-all",
        onClick: () => navigate(`/chat/${chat.otherUserId}?bidId=${chat.bidId}`),
        children: jsx(CardContent, { className: "p-4 sm:p-6", children: jsxs("div", { className: "flex items-center gap-3 sm:gap-4", children: [
          jsx("div", { className: "bg-muted rounded-full p-2.5 flex items-center justify-center shrink-0", children: chat.otherUserRole === "buyer" ? jsx(ShoppingBag, { className: "w-6 h-6 sm:w-7 sm:h-7 text-secondary" }) : jsx(Sprout, { className: "w-6 h-6 sm:w-7 sm:h-7 text-primary" }) }),
          jsxs("div", { className: "flex-1 min-w-0", children: [
            jsx("h3", { className: "text-base sm:text-lg font-bold mb-1", children: chat.otherUserName }),
            jsx("p", { className: "text-sm sm:text-base text-muted-foreground truncate", children: chat.lastMessage })
          ] }),
          jsxs("div", { className: "text-right shrink-0", children: [
            jsx("div", { className: "text-xs sm:text-sm text-muted-foreground", children: new Date(chat.lastMessageTime).toLocaleDateString() }),
            jsx(MessageSquare, { className: "w-5 h-5 text-primary ml-auto mt-1" })
          ] })
        ] }) })
      },
      chat.bidId
    )) })
  ] }) });
}
export {
  Messages
};
