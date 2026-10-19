import { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { Loader2, ArrowLeft, Send, MessageCircle, Sprout, ShoppingBag } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import api from "../api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";

function mapServerMessage(msg, chatId) {
  return {
    id: msg.id,
    chatId,
    senderId: msg.senderId,
    senderName: msg.senderName,
    text: msg.text,
    createdAt:
      typeof msg.createdAt === "string"
        ? msg.createdAt
        : new Date(msg.createdAt).toISOString(),
  };
}

export function Chat() {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, t } = useApp();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const chatId = user?.id && userId ? [user.id, userId].sort().join("-") : "";
  const bidId = searchParams.get("bidId");
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("vanik_token") : null;
  const useApi = Boolean(token && bidId);

  useEffect(() => {
    if (!user || !userId) return;

    const loadFromLocal = () => {
      const allMessages = JSON.parse(
        localStorage.getItem("vanik_messages") || "[]",
      );
      const chatMessages = allMessages.filter((msg) => msg.chatId === chatId);
      setMessages(chatMessages);
    };

    if (bidId && useApi) {
      api
        .get(`/api/bids/${encodeURIComponent(bidId)}`)
        .then(({ data }) => {
          const bid = data.bid;
          if (!bid) return;
          if (user.role === "farmer") {
            setOtherUser({ name: bid.buyerName, role: "buyer" });
          } else {
            setOtherUser({ name: bid.farmerName, role: "farmer" });
          }
        })
        .catch(() => {});
    }

    if (useApi) {
      setLoadingList(true);
      api
        .get(`/api/messages/${encodeURIComponent(bidId)}`)
        .then(({ data }) => {
          const mapped = (data.messages || []).map((m) => ({
            id: m.id,
            chatId,
            senderId: m.senderId,
            senderName: m.senderName,
            text: m.text,
            createdAt:
              typeof m.createdAt === "string"
                ? m.createdAt
                : new Date(m.createdAt).toISOString(),
          }));
          setMessages(mapped);
        })
        .catch((err) => {
          const msg =
            err.response?.data?.message ||
            "Could not load messages. Falling back to saved chat.";
          toast.error(msg);
          loadFromLocal();
        })
        .finally(() => setLoadingList(false));
    } else {
      loadFromLocal();
    }
  }, [user, userId, chatId, bidId, useApi]);

  useEffect(() => {
    if (!useApi || !bidId || !token || !user) return;

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const socket = io(apiUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      socket.emit("join_bid", { bidId });
    });

    socket.on("new_message", (msg) => {
      const mapped = mapServerMessage(msg, chatId);
      setMessages((prev) => {
        if (prev.some((m) => m.id === mapped.id)) return prev;
        return [...prev, mapped];
      });
    });

    socket.on("connect_error", () => {
      toast.error("Live chat could not connect. Messages may still send over HTTP.");
    });

    socketRef.current = socket;

    return () => {
      socket.emit("leave_bid", { bidId });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [useApi, bidId, token, user, chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (useApi) {
      const text = newMessage.trim();
      const socket = socketRef.current;

      if (socket?.connected) {
        setSending(true);
        socket.emit("chat_message", { bidId, text }, (response) => {
          setSending(false);
          if (response?.ok) {
            setNewMessage("");
          } else {
            toast.error(response?.error || "Could not send message");
          }
        });
        return;
      }

      setSending(true);
      try {
        const { data } = await api.post("/api/messages", {
          bidId,
          text,
        });
        const mapped = mapServerMessage(data.message, chatId);
        setMessages((prev) => {
          if (prev.some((m) => m.id === mapped.id)) return prev;
          return [...prev, mapped];
        });
        setNewMessage("");
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Could not send message",
        );
      } finally {
        setSending(false);
      }
      return;
    }

    const allMessages = JSON.parse(
      localStorage.getItem("vanik_messages") || "[]",
    );
    const message = {
      id: Date.now().toString(),
      chatId,
      senderId: user.id,
      senderName: user.name,
      text: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };
    allMessages.push(message);
    localStorage.setItem("vanik_messages", JSON.stringify(allMessages));
    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted/30 py-8 px-4">
      <div className="max-w-3xl mx-auto h-[calc(100vh-10rem)] flex flex-col">
        <div className="mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("common.back")}
          </Button>
        </div>
        <Card className="flex-1 flex flex-col shadow-xl overflow-hidden">
          <div className="bg-primary/5 p-4 sm:p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-muted rounded-full p-2.5 flex items-center justify-center">
                {otherUser?.role === "buyer" ? (
                  <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-secondary" />
                ) : (
                  <Sprout className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                )}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold">
                  {otherUser?.name || "User"}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {otherUser?.role === "buyer"
                    ? t("role.buyer")
                    : t("role.farmer")}
                </p>
              </div>
            </div>
          </div>
          <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 relative">
            {loadingList && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 z-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            {messages.length === 0 && !loadingList ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="w-14 h-14 sm:w-16 sm:h-16 text-muted-foreground mb-4" />
                <p className="text-sm sm:text-base text-muted-foreground">
                  Start the conversation
                </p>
              </div>
            ) : (
              <Fragment>
                {messages.map((message) => {
                  const isOwn = message.senderId === user.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
                          isOwn
                            ? "bg-primary text-white"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {!isOwn && (
                          <p className="text-xs font-medium opacity-80 mb-1">
                            {message.senderName ||
                              otherUser?.name ||
                              "User"}
                          </p>
                        )}
                        <p className="text-sm sm:text-base break-words">
                          {message.text}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            isOwn ? "text-white/70" : "text-muted-foreground"
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </Fragment>
            )}
          </CardContent>
          <div className="p-4 sm:p-6 border-t bg-white">
            <form
              onSubmit={handleSendMessage}
              className="flex gap-2 sm:gap-3"
            >
              <Input
                type="text"
                placeholder={t("chat.type")}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={sending || loadingList}
                className="flex-1 h-12 sm:h-14 text-base"
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 sm:h-14 px-4 sm:px-6"
                disabled={sending || loadingList}
              >
                {sending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span className="hidden sm:inline ml-2">
                      {t("chat.send")}
                    </span>
                  </>
                )}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
