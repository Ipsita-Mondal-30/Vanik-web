import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useApp } from "../contexts/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
function Chat() {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, t } = useApp();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);
  const chatId = [user?.id, userId].sort().join("-");
  const bidId = searchParams.get("bidId");
  useEffect(() => {
    if (user && userId) {
      const allMessages = JSON.parse(localStorage.getItem("vanik_messages") || "[]");
      const chatMessages = allMessages.filter((msg) => msg.chatId === chatId);
      setMessages(chatMessages);
      if (bidId) {
        const bids = JSON.parse(localStorage.getItem("vanik_bids") || "[]");
        const bid = bids.find((b) => b.id === bidId);
        if (bid) {
          setOtherUser({
            name: bid.buyerName,
            role: "buyer"
          });
        }
      }
    }
  }, [user, userId, chatId, bidId]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  if (!user) {
    navigate("/login");
    return null;
  }
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      return;
    }
    const allMessages = JSON.parse(localStorage.getItem("vanik_messages") || "[]");
    const message = {
      id: Date.now().toString(),
      chatId,
      senderId: user.id,
      senderName: user.name,
      text: newMessage,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    allMessages.push(message);
    localStorage.setItem("vanik_messages", JSON.stringify(allMessages));
    setMessages([...messages, message]);
    setNewMessage("");
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted/30 py-8 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto h-[calc(100vh-10rem)] flex flex-col", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        onClick: () => navigate(-1),
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
          t("common.back")
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(Card, { className: "flex-1 flex flex-col shadow-xl overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-primary/5 p-4 sm:p-6 border-b", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "text-3xl sm:text-4xl", children: otherUser?.role === "buyer" ? "\u{1F477}" : "\u{1F468}\u200D\u{1F33E}" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg sm:text-xl font-bold", children: otherUser?.name || "User" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: otherUser?.role === "buyer" ? t("role.buyer") : t("role.farmer") })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "flex-1 overflow-y-auto p-4 sm:p-6 space-y-4", children: messages.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-4xl sm:text-5xl mb-4", children: "\u{1F4AC}" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Start the conversation" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        messages.map((message) => {
          const isOwn = message.senderId === user.id;
          return /* @__PURE__ */ jsx(
            "div",
            {
              className: `flex ${isOwn ? "justify-end" : "justify-start"}`,
              children: /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `max-w-[75%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${isOwn ? "bg-primary text-white" : "bg-muted text-foreground"}`,
                  children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base break-words", children: message.text }),
                    /* @__PURE__ */ jsx(
                      "p",
                      {
                        className: `text-xs mt-1 ${isOwn ? "text-white/70" : "text-muted-foreground"}`,
                        children: new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })
                      }
                    )
                  ]
                }
              )
            },
            message.id
          );
        }),
        /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "p-4 sm:p-6 border-t bg-white", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSendMessage, className: "flex gap-2 sm:gap-3", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            placeholder: t("chat.type"),
            value: newMessage,
            onChange: (e) => setNewMessage(e.target.value),
            className: "flex-1 h-12 sm:h-14 text-base"
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            type: "submit",
            size: "lg",
            className: "h-12 sm:h-14 px-4 sm:px-6",
            children: [
              /* @__PURE__ */ jsx(Send, { className: "w-5 h-5" }),
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline ml-2", children: t("chat.send") })
            ]
          }
        )
      ] }) })
    ] })
  ] }) });
}
export {
  Chat
};
