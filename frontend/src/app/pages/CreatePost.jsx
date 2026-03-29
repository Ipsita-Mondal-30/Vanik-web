import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
function CreatePost() {
  const navigate = useNavigate();
  const { user, t } = useApp();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: ""
  });
  if (!user || user.role !== "farmer") {
    navigate("/dashboard");
    return null;
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      return;
    }
    const posts = JSON.parse(localStorage.getItem("vanik_posts") || "[]");
    const newPost = {
      id: Date.now().toString(),
      ...formData,
      farmerId: user.id,
      farmerName: user.name,
      createdAt: (new Date()).toISOString()
    };
    posts.push(newPost);
    localStorage.setItem("vanik_posts", JSON.stringify(posts));
    navigate("/my-posts");
  };
  return jsx("div", { className: "min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted/30 py-8 sm:py-12 px-4", children: jsxs("div", { className: "max-w-2xl mx-auto", children: [
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
    jsx(Card, { className: "shadow-xl", children: jsxs(CardContent, { className: "p-6 sm:p-8", children: [
      jsxs("div", { className: "flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8", children: [
        jsx("div", { className: "bg-primary/10 rounded-full p-3 flex items-center justify-center", children: jsx(FileText, { className: "w-8 h-8 sm:w-10 sm:h-10 text-primary" }) }),
        jsxs("div", { children: [
          jsx("h1", { className: "text-2xl sm:text-3xl font-bold", children: t("dashboard.createPost") }),
          jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Post your crop or requirement" })
        ] })
      ] }),
      jsxs("form", { onSubmit: handleSubmit, className: "space-y-5 sm:space-y-6", children: [
        jsxs("div", { className: "space-y-2", children: [
          jsxs(Label, { htmlFor: "title", className: "text-base sm:text-lg", children: [
            t("post.title"),
            " *"
          ] }),
          jsx(
            Input,
            {
              id: "title",
              type: "text",
              placeholder: "e.g., Fresh Wheat - 10 Quintal",
              value: formData.title,
              onChange: (e) => setFormData({ ...formData, title: e.target.value }),
              required: true,
              className: "h-12 sm:h-14 text-base sm:text-lg"
            }
          )
        ] }),
        jsxs("div", { className: "space-y-2", children: [
          jsxs(Label, { htmlFor: "description", className: "text-base sm:text-lg", children: [
            t("post.description"),
            " *"
          ] }),
          jsx(
            Textarea,
            {
              id: "description",
              placeholder: "Describe your crop or requirement...",
              value: formData.description,
              onChange: (e) => setFormData({ ...formData, description: e.target.value }),
              required: true,
              rows: 6,
              className: "text-base sm:text-lg resize-none"
            }
          )
        ] }),
        jsxs("div", { className: "space-y-2", children: [
          jsxs(Label, { htmlFor: "price", className: "text-base sm:text-lg", children: [
            t("post.price"),
            " (\u20B9) - Optional"
          ] }),
          jsx(
            Input,
            {
              id: "price",
              type: "number",
              placeholder: "5000",
              value: formData.price,
              onChange: (e) => setFormData({ ...formData, price: e.target.value }),
              className: "h-12 sm:h-14 text-base sm:text-lg"
            }
          ),
          jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: "Leave empty if you want buyers to bid" })
        ] }),
        jsx(
          Button,
          {
            type: "submit",
            size: "lg",
            className: "w-full h-12 sm:h-14 text-base sm:text-lg",
            children: t("post.submit")
          }
        )
      ] })
    ] }) })
  ] }) });
}
export {
  CreatePost
};
