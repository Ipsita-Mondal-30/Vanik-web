import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Link, useLocation, useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sprout, ShoppingBag, LogOut, Globe } from "lucide-react";
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
  return jsx("nav", { className: "bg-white border-b border-border shadow-sm sticky top-0 z-50", children: jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: jsxs("div", { className: "flex justify-between items-center h-16 sm:h-20", children: [
    jsxs(Link, { to: user ? "/dashboard" : "/", className: "flex items-center gap-2 sm:gap-3", children: [
      jsx("div", { className: "bg-primary rounded-full p-2 sm:p-2.5", children: jsx(Sprout, { className: "w-6 h-6 sm:w-7 sm:h-7 text-white" }) }),
      jsx("span", { className: "text-xl sm:text-2xl font-bold text-primary", children: "Vanik" })
    ] }),
    jsxs("div", { className: "flex items-center gap-2 sm:gap-4", children: [
      jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => setLanguage(language === "en" ? "hi" : "en"),
          className: "flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-2.5 sm:px-3",
          children: [
            jsx(Globe, { className: "w-4 h-4" }),
            jsx("span", { className: "hidden sm:inline", children: language === "en" ? "EN" : "\u0939\u093F\u0902\u0926\u0940" }),
            jsx("span", { className: "sm:hidden", children: language === "en" ? "EN" : "\u0939\u093F" })
          ]
        }
      ),
      user && jsxs(Fragment, { children: [
        jsxs(
          Badge,
          {
            variant: user.role === "farmer" ? "default" : "secondary",
            className: "px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm",
            children: [
              user.role === "farmer" ? jsx(Sprout, { className: "w-3.5 h-3.5" }) : jsx(ShoppingBag, { className: "w-3.5 h-3.5" }),
              t(`role.${user.role}`)
            ]
          }
        ),
        jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: handleLogout,
            className: "flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-2.5 sm:px-3",
            children: [
              jsx(LogOut, { className: "w-4 h-4" }),
              jsx("span", { className: "hidden sm:inline", children: t("auth.logout") })
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
