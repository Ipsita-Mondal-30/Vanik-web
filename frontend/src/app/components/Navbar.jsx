import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useApp } from "../contexts/AppContext";
import api from "../api";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Sprout,
  ShoppingBag,
  LogOut,
  Globe,
  Bell,
  Check,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
function Navbar() {
  const { language, setLanguage, user, logout, t } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;
    api
      .get("/api/notifications")
      .then(({ data }) => {
        setUnreadCount(data.unreadCount || 0);
        setNotifications(data.notifications || []);
      })
      .catch(() => {});
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const markAllRead = async () => {
    try {
      await api.post("/api/notifications/read-all");
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // ignore
    }
  };

  if (location.pathname === "/" && !user) {
    return null;
  }

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
      user && jsx(DropdownMenu, { children: jsxs(Fragment, { children: [
        jsx(DropdownMenuTrigger, { asChild: true, children: jsxs(
          Button,
          {
            variant: "outline",
            size: "icon",
            className: "relative",
            children: [
              jsx(Bell, { className: "w-4 h-4" }),
              unreadCount > 0 && jsx("span", { className: "absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-destructive text-white text-[10px] font-bold flex items-center justify-center", children: unreadCount > 99 ? "99+" : unreadCount })
            ]
          }
        ) }),
        jsx(DropdownMenuContent, { align: "end", className: "w-80", children: notifications.length === 0 ? jsx("div", { className: "px-3 py-6 text-sm text-muted-foreground text-center", children: "No notifications" }) : jsxs(Fragment, { children: [
          jsx(DropdownMenuItem, { onSelect: (e) => e.preventDefault(), className: "flex items-center justify-between", children: jsxs("div", { className: "flex items-center justify-between w-full", children: [
            jsx("span", { className: "text-sm font-medium", children: "Notifications" }),
            unreadCount > 0 && jsxs(Button, { variant: "ghost", size: "sm", onClick: markAllRead, className: "h-8", children: [
              jsx(Check, { className: "w-4 h-4 mr-1.5" }),
              "Mark all read"
            ] })
          ] }) }),
          jsx(DropdownMenuSeparator, {}),
          notifications.slice(0, 8).map((n) => jsx(
            DropdownMenuItem,
            {
              onSelect: () => {
                if (n.data?.bidId) navigate(`/messages`);
              },
              className: `flex flex-col items-start gap-0.5 ${n.read ? "opacity-70" : ""}`,
              children: [
                jsx("div", { className: "text-sm font-medium", children: n.title }),
                jsx("div", { className: "text-xs text-muted-foreground", children: n.message })
              ]
            },
            n.id
          ))
        ] }) })
      ] }) }),
      user && jsxs(Fragment, { children: [
        jsx(
          Button,
          {
            asChild: true,
            variant: "outline",
            size: "sm",
            className: "flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-2.5 sm:px-3",
            children: jsxs(Link, { to: "/assistant", children: [
              jsx(Sparkles, { className: "w-4 h-4" }),
              jsx("span", { className: "hidden sm:inline", children: "Assistant" })
            ] })
          }
        ),
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
