import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import api from "../api";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, IndianRupee, MessageSquare, Target, Mail, User, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
function Bids() {
  const navigate = useNavigate();
  const { user, t } = useApp();
  const [bidsWithPosts, setBidsWithPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  useEffect(() => {
    if (user) {
      setLoading(true);
      api
        .get("/api/bids/farmer")
        .then(({ data }) => setBidsWithPosts(data.bids || []))
        .catch(() => setBidsWithPosts([]))
        .finally(() => setLoading(false));
    }
  }, [user]);
  if (!user || user.role !== "farmer") {
    navigate("/dashboard");
    return null;
  }
  const handleChat = (bid) => {
    navigate(`/chat/${bid.buyerId}?bidId=${bid.id}`);
  };
  const updateStatus = async (bidId, action) => {
    setUpdatingId(bidId);
    try {
      const { data } = await api.post(`/api/bids/${bidId}/${action}`);
      setBidsWithPosts((prev) => prev.map((b) => (b.id === bidId ? data.bid : b)));
      toast.success(action === "accept" ? "Bid accepted" : "Bid rejected");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update bid");
    } finally {
      setUpdatingId(null);
    }
  };
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
      jsx("div", { className: "bg-secondary/10 rounded-full p-3 flex items-center justify-center", children: jsx(Target, { className: "w-8 h-8 sm:w-10 sm:h-10 text-secondary" }) }),
      jsxs("div", { children: [
        jsx("h1", { className: "text-2xl sm:text-3xl font-bold", children: t("dashboard.viewBids") }),
        jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "All bids on your posts" })
      ] })
    ] }),
    loading ? jsx(Card, { children: jsx(CardContent, { className: "p-10 sm:p-14 flex items-center justify-center", children: jsx(Loader2, { className: "w-8 h-8 animate-spin text-primary" }) }) }) : bidsWithPosts.length === 0 ? jsx(Card, { children: jsxs(CardContent, { className: "p-8 sm:p-12 text-center", children: [
      jsx("div", { className: "flex justify-center mb-4", children: jsx(Mail, { className: "w-14 h-14 sm:w-16 sm:h-16 text-muted-foreground" }) }),
      jsx("h3", { className: "text-lg sm:text-xl font-semibold mb-2", children: t("bid.noBids") }),
      jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Wait for buyers to place bids on your posts" })
    ] }) }) : jsx("div", { className: "grid gap-4 sm:gap-6", children: bidsWithPosts.map((bid) => jsx(Card, { className: "hover:shadow-lg transition-all", children: jsx(CardContent, { className: "p-5 sm:p-6", children: jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      jsxs("div", { className: "flex-1", children: [
        jsx("div", { className: "text-xs sm:text-sm text-muted-foreground mb-2", children: t("bid.bidder") }),
        jsxs("h3", { className: "text-lg sm:text-xl font-bold mb-1 flex items-center gap-2", children: [
          jsx(User, { className: "w-5 h-5 text-muted-foreground shrink-0" }),
          bid.buyerName
        ] }),
        jsx("p", { className: "text-sm sm:text-base text-muted-foreground mb-3", children: bid.postTitle }),
        jsx("div", { className: "text-xs sm:text-sm text-muted-foreground", children: new Date(bid.createdAt).toLocaleString() })
      ] }),
      jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4", children: [
        jsxs("div", { className: "bg-accent/10 rounded-xl p-4 text-center", children: [
          jsx("div", { className: "text-xs text-muted-foreground mb-1", children: t("bid.bidAmount") }),
          jsxs("div", { className: "flex items-center justify-center gap-1 text-xl sm:text-2xl font-bold text-accent", children: [
            jsx(IndianRupee, { className: "w-5 h-5" }),
            bid.amount
          ] })
        ] }),
        bid.status === "pending" ? jsxs("div", { className: "flex gap-2", children: [
          jsx(
            Button,
            {
              onClick: () => updateStatus(bid.id, "accept"),
              size: "lg",
              disabled: updatingId === bid.id,
              className: "h-12",
              children: jsxs("span", { className: "inline-flex items-center", children: [
                jsx(Check, { className: "w-5 h-5 mr-2" }),
                "Accept"
              ] })
            }
          ),
          jsx(
            Button,
            {
              onClick: () => updateStatus(bid.id, "reject"),
              size: "lg",
              variant: "outline",
              disabled: updatingId === bid.id,
              className: "h-12",
              children: jsxs("span", { className: "inline-flex items-center", children: [
                jsx(X, { className: "w-5 h-5 mr-2" }),
                "Reject"
              ] })
            }
          )
        ] }) : bid.status === "accepted" ? jsxs(
          Button,
          {
            onClick: () => handleChat(bid),
            size: "lg",
            className: "h-full",
            children: [
              jsx(MessageSquare, { className: "w-5 h-5 mr-2" }),
              t("bid.chat")
            ]
          }
        ) : jsx("div", { className: "text-sm text-muted-foreground", children: "Rejected" })
      ] })
    ] }) }) }, bid.id)) })
  ] }) });
}
export {
  Bids
};
