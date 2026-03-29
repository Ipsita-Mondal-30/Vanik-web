import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft } from "lucide-react";
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
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    posts.push(newPost);
    localStorage.setItem("vanik_posts", JSON.stringify(posts));
    navigate("/my-posts");
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted/30 py-8 sm:py-12 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto", children: [
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
    /* @__PURE__ */ jsx(Card, { className: "shadow-xl", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6 sm:p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "text-4xl sm:text-5xl", children: "\u{1F4DD}" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-bold", children: t("dashboard.createPost") }),
          /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Post your crop or requirement" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-5 sm:space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "title", className: "text-base sm:text-lg", children: [
            t("post.title"),
            " *"
          ] }),
          /* @__PURE__ */ jsx(
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
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "description", className: "text-base sm:text-lg", children: [
            t("post.description"),
            " *"
          ] }),
          /* @__PURE__ */ jsx(
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
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "price", className: "text-base sm:text-lg", children: [
            t("post.price"),
            " (\u20B9) - Optional"
          ] }),
          /* @__PURE__ */ jsx(
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
          /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: "Leave empty if you want buyers to bid" })
        ] }),
        /* @__PURE__ */ jsx(
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
