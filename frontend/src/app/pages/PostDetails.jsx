import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useApp } from "../contexts/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, IndianRupee, User, Mail } from "lucide-react";
import { toast } from "sonner";
function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, t } = useApp();
  const [post, setPost] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  useEffect(() => {
    if (id) {
      const posts = JSON.parse(localStorage.getItem("vanik_posts") || "[]");
      const foundPost = posts.find((p) => p.id === id);
      setPost(foundPost || null);
    }
  }, [id]);
  if (!user) {
    navigate("/login");
    return null;
  }
  if (!post) {
    return jsx("div", { className: "min-h-[calc(100vh-5rem)] flex items-center justify-center", children: jsxs("div", { className: "text-center", children: [
      jsx("div", { className: "flex justify-center mb-4", children: jsx(Mail, { className: "w-14 h-14 text-muted-foreground" }) }),
      jsx("h3", { className: "text-xl font-semibold", children: "Post not found" })
    ] }) });
  }
  const handlePlaceBid = (e) => {
    e.preventDefault();
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }
    const bids = JSON.parse(localStorage.getItem("vanik_bids") || "[]");
    const newBid = {
      id: Date.now().toString(),
      postId: post.id,
      buyerId: user.id,
      buyerName: user.name,
      amount: bidAmount,
      createdAt: (new Date()).toISOString()
    };
    bids.push(newBid);
    localStorage.setItem("vanik_bids", JSON.stringify(bids));
    toast.success("Bid placed successfully!");
    setBidAmount("");
  };
  const isFarmer = user.role === "farmer";
  const isOwnPost = post.farmerId === user.id;
  return jsx("div", { className: "min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted/30 py-8 sm:py-12 px-4", children: jsxs("div", { className: "max-w-3xl mx-auto", children: [
    jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        onClick: () => navigate(-1),
        className: "mb-4 sm:mb-6",
        children: [
          jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
          t("common.back")
        ]
      }
    ),
    jsx(Card, { className: "shadow-xl mb-6", children: jsxs(CardContent, { className: "p-6 sm:p-8", children: [
      jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6 border-b", children: [
        jsxs("div", { className: "flex-1", children: [
          jsx("h1", { className: "text-2xl sm:text-3xl font-bold mb-3", children: post.title }),
          jsxs("div", { className: "flex items-center gap-2 text-sm sm:text-base text-muted-foreground", children: [
            jsx(User, { className: "w-4 h-4" }),
            jsx("span", { className: "font-semibold", children: post.farmerName }),
            jsx("span", { children: "\u2022" }),
            jsx("span", { children: new Date(post.createdAt).toLocaleDateString() })
          ] })
        ] }),
        post.price && jsxs("div", { className: "bg-primary/10 rounded-xl p-4 text-center shrink-0", children: [
          jsx("div", { className: "text-xs sm:text-sm text-muted-foreground mb-1", children: "Starting Price" }),
          jsxs("div", { className: "flex items-center justify-center gap-1 text-2xl sm:text-3xl font-bold text-primary", children: [
            jsx(IndianRupee, { className: "w-6 h-6" }),
            post.price
          ] })
        ] })
      ] }),
      jsxs("div", { className: "mb-6", children: [
        jsx("h3", { className: "text-lg font-semibold mb-3", children: t("post.description") }),
        jsx("p", { className: "text-base sm:text-lg text-foreground/80 whitespace-pre-wrap", children: post.description })
      ] })
    ] }) }),
    user.role === "buyer" && !isOwnPost && jsx(Card, { className: "shadow-xl", children: jsxs(CardContent, { className: "p-6 sm:p-8", children: [
      jsx("h3", { className: "text-xl font-bold mb-4", children: t("bid.place") }),
      jsx("form", { onSubmit: handlePlaceBid, className: "space-y-4", children: jsxs("div", { className: "space-y-2", children: [
        jsx(Label, { htmlFor: "bidAmount", className: "text-base", children: t("bid.amount") }),
        jsxs("div", { className: "flex gap-3", children: [
          jsxs("div", { className: "relative flex-1", children: [
            jsx(IndianRupee, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" }),
            jsx(
              Input,
              {
                id: "bidAmount",
                type: "number",
                placeholder: "5000",
                value: bidAmount,
                onChange: (e) => setBidAmount(e.target.value),
                className: "h-12 sm:h-14 text-base sm:text-lg pl-10",
                required: true
              }
            )
          ] }),
          jsx(
            Button,
            {
              type: "submit",
              size: "lg",
              className: "h-12 sm:h-14 px-6 sm:px-8",
              children: t("bid.place")
            }
          )
        ] })
      ] }) })
    ] }) }),
    isOwnPost && jsx(Card, { className: "shadow-xl", children: jsxs(CardContent, { className: "p-6 sm:p-8 text-center", children: [
      jsx("p", { className: "text-base text-muted-foreground mb-4", children: "This is your post. View all bids received." }),
      jsx(
        Button,
        {
          onClick: () => navigate("/bids"),
          size: "lg",
          className: "w-full sm:w-auto",
          children: t("dashboard.viewBids")
        }
      )
    ] }) })
  ] }) });
}
export {
  PostDetails
};
