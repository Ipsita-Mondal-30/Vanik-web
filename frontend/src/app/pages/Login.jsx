import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
function Login() {
  const navigate = useNavigate();
  const { login, t } = useApp();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "farmer"
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return;
    }
    const user = {
      id: Date.now().toString(),
      name: formData.email.split("@")[0],
      email: formData.email,
      role: formData.role
    };
    login(user);
    navigate("/dashboard");
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted/30 py-8 sm:py-12 px-4 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-md", children: /* @__PURE__ */ jsx(Card, { className: "shadow-xl", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6 sm:p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-6 sm:mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-bold mb-2", children: t("auth.login") }),
      /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: t("auth.loginAs") })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-5 sm:space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 sm:space-y-4", children: [
        /* @__PURE__ */ jsx(Label, { className: "text-base sm:text-lg", children: t("auth.selectRole") }),
        /* @__PURE__ */ jsxs(
          RadioGroup,
          {
            value: formData.role,
            onValueChange: (value) => setFormData({ ...formData, role: value }),
            className: "grid grid-cols-2 gap-3 sm:gap-4",
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(RadioGroupItem, { value: "farmer", id: "farmer", className: "peer sr-only" }),
                /* @__PURE__ */ jsxs(
                  Label,
                  {
                    htmlFor: "farmer",
                    className: "flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-white p-4 sm:p-6 hover:bg-accent cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all",
                    children: [
                      /* @__PURE__ */ jsx("div", { className: "text-3xl sm:text-4xl mb-2", children: "\u{1F468}\u200D\u{1F33E}" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm sm:text-base font-semibold", children: t("role.farmer") })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(RadioGroupItem, { value: "buyer", id: "buyer", className: "peer sr-only" }),
                /* @__PURE__ */ jsxs(
                  Label,
                  {
                    htmlFor: "buyer",
                    className: "flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-white p-4 sm:p-6 hover:bg-accent cursor-pointer peer-data-[state=checked]:border-secondary peer-data-[state=checked]:bg-secondary/5 transition-all",
                    children: [
                      /* @__PURE__ */ jsx("div", { className: "text-3xl sm:text-4xl mb-2", children: "\u{1F477}" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm sm:text-base font-semibold", children: t("role.buyer") })
                    ]
                  }
                )
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "email", className: "text-base sm:text-lg", children: t("auth.email") }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "email",
            type: "email",
            placeholder: t("auth.email"),
            value: formData.email,
            onChange: (e) => setFormData({ ...formData, email: e.target.value }),
            required: true,
            className: "h-12 sm:h-14 text-base sm:text-lg"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password", className: "text-base sm:text-lg", children: t("auth.password") }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "password",
            type: "password",
            placeholder: t("auth.password"),
            value: formData.password,
            onChange: (e) => setFormData({ ...formData, password: e.target.value }),
            required: true,
            className: "h-12 sm:h-14 text-base sm:text-lg"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          size: "lg",
          className: "w-full h-12 sm:h-14 text-base sm:text-lg",
          variant: formData.role === "farmer" ? "default" : "secondary",
          children: t("auth.login")
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-center text-sm sm:text-base text-muted-foreground mt-6 sm:mt-8", children: [
      t("auth.noAccount"),
      " ",
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/signup"),
          className: "text-primary font-semibold hover:underline",
          children: t("auth.signup")
        }
      )
    ] })
  ] }) }) }) });
}
export {
  Login
};
