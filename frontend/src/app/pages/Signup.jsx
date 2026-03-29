import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useApp } from "../contexts/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft } from "lucide-react";
function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, t } = useApp();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(
    searchParams.get("role") || null
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  useEffect(() => {
    if (selectedRole) {
      setStep(2);
    }
  }, [selectedRole]);
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep(2);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRole || !formData.name || !formData.email || !formData.password) {
      return;
    }
    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: selectedRole
    };
    login(newUser);
    navigate("/dashboard");
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted/30 py-8 sm:py-12 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto", children: [
    step === 2 && /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        onClick: () => {
          setSelectedRole(null);
          setStep(1);
        },
        className: "mb-4 sm:mb-6",
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
          t("common.back")
        ]
      }
    ),
    step === 1 && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8 sm:mb-12", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-bold mb-2 sm:mb-3", children: t("auth.signup") }),
        /* @__PURE__ */ jsx("p", { className: "text-base sm:text-lg text-muted-foreground", children: t("auth.selectRole") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:gap-6", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleRoleSelect("farmer"),
            className: "bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-primary text-left group",
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 sm:gap-6", children: [
              /* @__PURE__ */ jsx("div", { className: "text-5xl sm:text-6xl", children: "\u{1F468}\u200D\u{1F33E}" }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-xl sm:text-2xl font-bold mb-1 sm:mb-2 group-hover:text-primary transition-colors", children: t("role.farmer") }),
                /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: t("role.farmer.desc") })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-2xl sm:text-3xl text-primary opacity-0 group-hover:opacity-100 transition-opacity", children: "\u2192" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleRoleSelect("buyer"),
            className: "bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-secondary text-left group",
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 sm:gap-6", children: [
              /* @__PURE__ */ jsx("div", { className: "text-5xl sm:text-6xl", children: "\u{1F477}" }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-xl sm:text-2xl font-bold mb-1 sm:mb-2 group-hover:text-secondary transition-colors", children: t("role.buyer") }),
                /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: t("role.buyer.desc") })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-2xl sm:text-3xl text-secondary opacity-0 group-hover:opacity-100 transition-opacity", children: "\u2192" })
            ] })
          }
        )
      ] })
    ] }),
    step === 2 && selectedRole && /* @__PURE__ */ jsx(Card, { className: "shadow-xl", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6 sm:p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-muted rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-4xl sm:text-5xl", children: selectedRole === "farmer" ? "\u{1F468}\u200D\u{1F33E}" : "\u{1F477}" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: t("auth.signingAs") }),
          /* @__PURE__ */ jsx("p", { className: "text-lg sm:text-xl font-bold", children: t(`role.${selectedRole}`) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-5 sm:space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "name", className: "text-base sm:text-lg", children: t("auth.name") }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "name",
              type: "text",
              placeholder: t("auth.name"),
              value: formData.name,
              onChange: (e) => setFormData({ ...formData, name: e.target.value }),
              required: true,
              className: "h-12 sm:h-14 text-base sm:text-lg"
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
            variant: selectedRole === "farmer" ? "default" : "secondary",
            children: t("auth.createAccount")
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-center text-sm sm:text-base text-muted-foreground mt-6 sm:mt-8", children: [
        t("auth.alreadyAccount"),
        " ",
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/login"),
            className: "text-primary font-semibold hover:underline",
            children: t("auth.login")
          }
        )
      ] })
    ] }) })
  ] }) });
}
export {
  Signup
};
