import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import api from "../api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, IndianRupee, Eye, Target, Mail, Sprout, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
function formatBidAmount(bid) {
  if (!bid?.amount) return "";
  if (bid.bidUnit === "hour" || bid.bidUnit === "day") {
    return `${bid.amount}/${bid.bidUnit}`;
  }
  return bid.amount;
}
function MyBids() {
  const navigate = useNavigate();
  const { user, t } = useApp();
  const [bidsWithPosts, setBidsWithPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingBidId, setEditingBidId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editUnit, setEditUnit] = useState("day");
  const [savingEdit, setSavingEdit] = useState(false);
  useEffect(() => {
    if (user) {
      setLoading(true);
      api
        .get("/api/bids/buyer")
        .then(({ data }) => setBidsWithPosts(data.bids || []))
        .catch(() => setBidsWithPosts([]))
        .finally(() => setLoading(false));
    }
  }, [user]);
  if (!user || user.role !== "buyer") {
    navigate("/dashboard");
    return null;
  }
  const startEdit = (bid) => {
    setEditingBidId(bid.id);
    setEditAmount(bid.amount || "");
    setEditUnit(bid.bidUnit === "hour" ? "hour" : "day");
  };
  const cancelEdit = () => {
    setEditingBidId(null);
    setEditAmount("");
    setEditUnit("day");
  };
  const saveEdit = async (bid) => {
    if (!editAmount || parseFloat(editAmount) <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }
    setSavingEdit(true);
    try {
      const { data } = await api.put(`/api/bids/${bid.id}`, {
        amount: editAmount,
        bidUnit: bid.bidUnit ? editUnit : "",
      });
      setBidsWithPosts((prev) => prev.map((b) => (b.id === bid.id ? data.bid : b)));
      toast.success("Bid updated");
      cancelEdit();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update bid");
    } finally {
      setSavingEdit(false);
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
      jsx("div", { className: "bg-accent/10 rounded-full p-3 flex items-center justify-center", children: jsx(Target, { className: "w-8 h-8 sm:w-10 sm:h-10 text-accent" }) }),
      jsxs("div", { children: [
        jsx("h1", { className: "text-2xl sm:text-3xl font-bold", children: t("dashboard.myBids") }),
        jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Track your bids" })
      ] })
    ] }),
    loading ? jsx(Card, { children: jsx(CardContent, { className: "p-10 sm:p-14 flex items-center justify-center", children: jsx(Loader2, { className: "w-8 h-8 animate-spin text-primary" }) }) }) : bidsWithPosts.length === 0 ? jsx(Card, { children: jsxs(CardContent, { className: "p-8 sm:p-12 text-center", children: [
      jsx("div", { className: "flex justify-center mb-4", children: jsx(Mail, { className: "w-14 h-14 sm:w-16 sm:h-16 text-muted-foreground" }) }),
      jsx("h3", { className: "text-lg sm:text-xl font-semibold mb-2", children: t("bid.noBids") }),
      jsx("p", { className: "text-sm sm:text-base text-muted-foreground mb-6", children: "Start bidding on posts" }),
      jsx(Button, { onClick: () => navigate("/browse"), children: t("dashboard.browsePosts") })
    ] }) }) : jsx("div", { className: "grid gap-4 sm:gap-6", children: bidsWithPosts.map((bid) => jsx(Card, { className: "hover:shadow-lg transition-all", children: jsx(CardContent, { className: "p-5 sm:p-6", children: jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      jsxs("div", { className: "flex-1", children: [
        jsx("h3", { className: "text-lg sm:text-xl font-bold mb-2", children: bid.postTitle }),
        jsx("div", { className: "flex items-center gap-2 text-sm sm:text-base text-muted-foreground mb-3", children: jsxs("span", { className: "bg-muted px-2 py-1 rounded inline-flex items-center gap-1.5", children: [
          jsx(Sprout, { className: "w-3.5 h-3.5 shrink-0" }),
          bid.farmerName
        ] }) }),
        jsxs("div", { className: "text-xs sm:text-sm text-muted-foreground", children: [
          "Bid placed: ",
          new Date(bid.createdAt).toLocaleString()
        ] })
      ] }),
      jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4", children: [
        editingBidId === bid.id ? jsxs("div", { className: "bg-accent/10 rounded-xl p-4 min-w-[220px]", children: [
          jsx("div", { className: "text-xs text-muted-foreground mb-2", children: "Edit Bid" }),
          jsxs("div", { className: "relative mb-3", children: [
            jsx(IndianRupee, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
            jsx(
              Input,
              {
                type: "number",
                value: editAmount,
                onChange: (e) => setEditAmount(e.target.value),
                className: "h-10 pl-9"
              }
            )
          ] }),
          bid.bidUnit && jsxs("div", { className: "flex items-center gap-4 mb-3", children: [
            jsxs(Label, { className: "flex items-center gap-2 text-xs", children: [
              jsx("input", { type: "radio", name: `editUnit-${bid.id}`, value: "hour", checked: editUnit === "hour", onChange: (e) => setEditUnit(e.target.value) }),
              "Per hour"
            ] }),
            jsxs(Label, { className: "flex items-center gap-2 text-xs", children: [
              jsx("input", { type: "radio", name: `editUnit-${bid.id}`, value: "day", checked: editUnit === "day", onChange: (e) => setEditUnit(e.target.value) }),
              "Per day"
            ] })
          ] }),
          jsxs("div", { className: "flex gap-2", children: [
            jsx(
              Button,
              {
                size: "sm",
                onClick: () => saveEdit(bid),
                disabled: savingEdit,
                children: savingEdit ? "Saving..." : "Save"
              }
            ),
            jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: cancelEdit,
                disabled: savingEdit,
                children: "Cancel"
              }
            )
          ] })
        ] }) : jsxs("div", { className: "bg-accent/10 rounded-xl p-4 text-center", children: [
          jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Your Bid" }),
          jsxs("div", { className: "flex items-center justify-center gap-1 text-xl sm:text-2xl font-bold text-accent", children: [
            jsx(IndianRupee, { className: "w-5 h-5" }),
            formatBidAmount(bid)
          ] })
        ] }),
        jsxs(
          Button,
          {
            onClick: () => navigate(`/post/${bid.postId}`),
            variant: "outline",
            size: "lg",
            className: "h-full",
            children: [
              jsx(Eye, { className: "w-5 h-5 mr-2" }),
              "View Post"
            ]
          }
        )
        ,
        bid.status === "pending" && editingBidId !== bid.id && jsx(
          Button,
          {
            onClick: () => startEdit(bid),
            variant: "secondary",
            size: "lg",
            className: "h-full",
            children: "Edit Bid"
          }
        ),
        bid.farmerId && jsxs(
          Button,
          {
            onClick: () => navigate(`/chat/${bid.farmerId}?bidId=${bid.id}`),
            size: "lg",
            className: "h-full",
            children: [
              jsx(MessageSquare, { className: "w-5 h-5 mr-2" }),
              t("bid.chat")
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
