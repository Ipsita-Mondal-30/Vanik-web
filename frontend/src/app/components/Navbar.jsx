import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Link, useLocation, useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sprout, LogOut, Globe } from "lucide-react";
function Navbar() {
  const { language, setLanguage, user, logout, t } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  if (location.pathname === "/" && !user) {
    return null;
  }
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return /* @__PURE__ */ jsx("nav", { className: "bg-white border-b border-border shadow-sm sticky top-0 z-50", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center h-16 sm:h-20", children: [
    /* @__PURE__ */ jsxs(Link, { to: user ? "/dashboard" : "/", className: "flex items-center gap-2 sm:gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-primary rounded-full p-2 sm:p-2.5", children: /* @__PURE__ */ jsx(Sprout, { className: "w-6 h-6 sm:w-7 sm:h-7 text-white" }) }),
      /* @__PURE__ */ jsx("span", { className: "text-xl sm:text-2xl font-bold text-primary", children: "Vanik" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-4", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => setLanguage(language === "en" ? "hi" : "en"),
          className: "flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-2.5 sm:px-3",
          children: [
            /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: language === "en" ? "EN" : "\u0939\u093F\u0902\u0926\u0940" }),
            /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: language === "en" ? "EN" : "\u0939\u093F" })
          ]
        }
      ),
      user && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(
          Badge,
          {
            variant: user.role === "farmer" ? "default" : "secondary",
            className: "px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm",
            children: [
              user.role === "farmer" ? "\u{1F468}\u200D\u{1F33E}" : "\u{1F477}",
              " ",
              t(`role.${user.role}`)
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: handleLogout,
            className: "flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-2.5 sm:px-3",
            children: [
              /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: t("auth.logout") })
            ]
          }
        )
      ] })
    ] })
  ] }) }) });
}
export {
  Navbar
};
