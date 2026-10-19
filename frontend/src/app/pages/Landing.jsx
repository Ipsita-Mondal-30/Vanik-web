import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { Button } from "../components/ui/button";
import {
  Tractor,
  Handshake,
  TrendingUp,
  Globe,
  Sprout,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
function Landing() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useApp();
  return jsx("div", { className: "min-h-screen bg-gradient-to-b from-background to-muted/30", children: jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16", children: [
    jsx("div", { className: "flex justify-end mb-4", children: jsxs(
      Button,
      {
        variant: "outline",
        size: "sm",
        onClick: () => setLanguage(language === "en" ? "hi" : "en"),
        className: "flex items-center gap-2",
        children: [
          jsx(Globe, { className: "w-4 h-4" }),
          language === "en" ? "EN" : "\u0939\u093F\u0902\u0926\u0940"
        ]
      }
    ) }),
    jsxs("div", { className: "text-center mb-8 sm:mb-12", children: [
      jsx("span", { className: "inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-4 sm:mb-6", children: "Trusted marketplace for farmers and buyers" }),
      jsxs("h1", { className: "text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-foreground mb-4 sm:mb-6 px-2", children: [
        "Grow together with ",
        jsx("span", { className: "text-primary", children: "Vanik" })
      ] }),
      jsx("p", { className: "text-lg sm:text-xl lg:text-2xl text-foreground/80 mb-3 sm:mb-4 px-4 max-w-3xl mx-auto", children: t("landing.tagline") }),
      jsx("p", { className: "text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8", children: t("landing.subtitle") }),
      jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4", children: [
        jsxs(Button, { size: "lg", className: "w-full sm:w-auto min-w-48", onClick: () => navigate("/signup?role=farmer"), children: [
          jsx(Sprout, { className: "w-5 h-5 mr-2" }),
          t("landing.farmer")
        ] }),
        jsxs(Button, { size: "lg", variant: "secondary", className: "w-full sm:w-auto min-w-48", onClick: () => navigate("/signup?role=buyer"), children: [
          jsx(ShoppingBag, { className: "w-5 h-5 mr-2" }),
          t("landing.buyer")
        ] })
      ] })
    ] }),
    jsxs("div", { className: "grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-12 sm:mb-16", children: [
      jsx(
        "button",
        {
          onClick: () => navigate("/signup?role=farmer"),
          className: "bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-primary group",
          children: jsxs("div", { className: "flex flex-col items-center text-center", children: [
            jsx("div", { className: "bg-primary/10 rounded-full p-5 sm:p-6 mb-4 sm:mb-6 flex items-center justify-center", children: jsx(Sprout, { className: "w-12 h-12 sm:w-16 sm:h-16 text-primary" }) }),
            jsx("h2", { className: "text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4 group-hover:text-primary transition-colors", children: t("landing.farmer") }),
            jsx("p", { className: "text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8", children: t("role.farmer.desc") }),
            jsx(
              Button,
              {
                asChild: true,
                size: "lg",
                className: "w-full h-12 sm:h-14 text-base sm:text-lg gap-2",
                children: jsxs("span", { className: "inline-flex items-center gap-2", children: [
                  t("auth.signup"),
                  jsx(ArrowRight, { className: "w-5 h-5" })
                ] })
              }
            )
          ] })
        }
      ),
      jsx(
        "button",
        {
          onClick: () => navigate("/signup?role=buyer"),
          className: "bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-secondary group",
          children: jsxs("div", { className: "flex flex-col items-center text-center", children: [
            jsx("div", { className: "bg-secondary/10 rounded-full p-5 sm:p-6 mb-4 sm:mb-6 flex items-center justify-center", children: jsx(ShoppingBag, { className: "w-12 h-12 sm:w-16 sm:h-16 text-secondary" }) }),
            jsx("h2", { className: "text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4 group-hover:text-secondary transition-colors", children: t("landing.buyer") }),
            jsx("p", { className: "text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8", children: t("role.buyer.desc") }),
            jsx(
              Button,
              {
                asChild: true,
                size: "lg",
                variant: "secondary",
                className: "w-full h-12 sm:h-14 text-base sm:text-lg gap-2",
                children: jsxs("span", { className: "inline-flex items-center gap-2", children: [
                  t("auth.signup"),
                  jsx(ArrowRight, { className: "w-5 h-5" })
                ] })
              }
            )
          ] })
        }
      )
    ] }),
    jsxs("div", { className: "grid sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto mb-8 sm:mb-12", children: [
      jsxs("div", { className: "text-center", children: [
        jsx("div", { className: "bg-accent/20 rounded-full p-4 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center", children: jsx(Tractor, { className: "w-8 h-8 sm:w-10 sm:h-10 text-accent" }) }),
        jsx("h3", { className: "font-semibold text-base sm:text-lg mb-2", children: "Simple to Use" }),
        jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Easy for everyone" })
      ] }),
      jsxs("div", { className: "text-center", children: [
        jsx("div", { className: "bg-accent/20 rounded-full p-4 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center", children: jsx(Handshake, { className: "w-8 h-8 sm:w-10 sm:h-10 text-accent" }) }),
        jsx("h3", { className: "font-semibold text-base sm:text-lg mb-2", children: "Direct Connect" }),
        jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "No middlemen" })
      ] }),
      jsxs("div", { className: "text-center", children: [
        jsx("div", { className: "bg-accent/20 rounded-full p-4 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center", children: jsx(TrendingUp, { className: "w-8 h-8 sm:w-10 sm:h-10 text-accent" }) }),
        jsx("h3", { className: "font-semibold text-base sm:text-lg mb-2", children: "Fair Prices" }),
        jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Best deals" })
      ] })
    ] }),
    jsx("div", { className: "text-center", children: jsxs("p", { className: "text-base sm:text-lg text-muted-foreground", children: [
      t("auth.alreadyAccount"),
      " ",
      jsx(
        "button",
        {
          onClick: () => navigate("/login"),
          className: "text-primary font-semibold hover:underline",
          children: t("auth.login")
        }
      )
    ] }) })
  ] }) });
}
export {
  Landing
};
