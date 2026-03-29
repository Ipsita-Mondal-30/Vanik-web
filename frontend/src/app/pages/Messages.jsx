import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, MessageSquare } from "lucide-react";
function Messages() {
  const navigate = useNavigate();
  const { user, t } = useApp();
  const [chats, setChats] = useState([]);
  useEffect(() => {
    if (user) {
      const allMessages = JSON.parse(localStorage.getItem("vanik_messages") || "[]");
      const chatMap = /* @__PURE__ */ new Map();
      allMessages.forEach((msg) => {
        if (msg.chatId.includes(user.id)) {
          if (!chatMap.has(msg.chatId)) {
            chatMap.set(msg.chatId, []);
          }
          chatMap.get(msg.chatId).push(msg);
        }
      });
      const bids = JSON.parse(localStorage.getItem("vanik_bids") || "[]");
      const chatPreviews = [];
      chatMap.forEach((messages, chatId) => {
        messages.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const lastMessage = messages[0];
        const otherUserId = chatId.split("-").find((id) => id !== user.id) || "";
        const bid = bids.find(
          (b) => b.buyerId === otherUserId || b.farmerId === otherUserId
        );
        chatPreviews.push({
          chatId,
          otherUserId,
          otherUserName: bid?.buyerName || bid?.farmerName || "User",
          otherUserRole: bid?.buyerId === otherUserId ? "buyer" : "farmer",
          lastMessage: lastMessage.text,
          lastMessageTime: lastMessage.createdAt
        });
      });
      chatPreviews.sort(
        (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );
      setChats(chatPreviews);
    }
  }, [user]);
  if (!user) {
    navigate("/login");
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
      /* @__PURE__ */ jsx("div", { className: "text-4xl sm:text-5xl", children: "\u{1F4AC}" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-bold", children: "Messages" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Your conversations" })
      ] })
    ] }),
    chats.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-8 sm:p-12 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-5xl sm:text-6xl mb-4", children: "\u{1F4AC}" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg sm:text-xl font-semibold mb-2", children: "No messages yet" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Start chatting with buyers or farmers" })
    ] }) }) : /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:gap-4", children: chats.map((chat) => /* @__PURE__ */ jsx(
      Card,
      {
        className: "cursor-pointer hover:shadow-lg transition-all",
        onClick: () => navigate(`/chat/${chat.otherUserId}`),
        children: /* @__PURE__ */ jsx(CardContent, { className: "p-4 sm:p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-3xl sm:text-4xl", children: chat.otherUserRole === "buyer" ? "\u{1F477}" : "\u{1F468}\u200D\u{1F33E}" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-base sm:text-lg font-bold mb-1", children: chat.otherUserName }),
            /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-muted-foreground truncate", children: chat.lastMessage })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right shrink-0", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs sm:text-sm text-muted-foreground", children: new Date(chat.lastMessageTime).toLocaleDateString() }),
            /* @__PURE__ */ jsx(MessageSquare, { className: "w-5 h-5 text-primary ml-auto mt-1" })
          ] })
        ] }) })
      },
      chat.chatId
    )) })
  ] }) });
}
export {
  Messages
};
