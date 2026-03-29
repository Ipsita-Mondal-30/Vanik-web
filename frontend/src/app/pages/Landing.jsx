import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { Button } from "../components/ui/button";
import { Tractor, Handshake, TrendingUp, Globe } from "lucide-react";
import { FarmingIllustration } from "../components/FarmingIllustration";
import { DemoNotice } from "../components/DemoNotice";
function Landing() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useApp();
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-b from-background to-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-end mb-4", children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "outline",
        size: "sm",
        onClick: () => setLanguage(language === "en" ? "hi" : "en"),
        className: "flex items-center gap-2",
        children: [
          /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4" }),
          language === "en" ? "EN" : "\u0939\u093F\u0902\u0926\u0940"
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "mb-6 sm:mb-8", children: /* @__PURE__ */ jsx(DemoNotice, {}) }),
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8 sm:mb-12", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6 sm:mb-8", children: /* @__PURE__ */ jsx(FarmingIllustration, {}) }),
      /* @__PURE__ */ jsx("h1", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6", children: "Vanik" }),
      /* @__PURE__ */ jsx("p", { className: "text-xl sm:text-2xl lg:text-3xl text-foreground/80 mb-3 sm:mb-4 px-4", children: t("landing.tagline") }),
      /* @__PURE__ */ jsx("p", { className: "text-base sm:text-lg text-muted-foreground", children: t("landing.subtitle") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-12 sm:mb-16", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/signup?role=farmer"),
          className: "bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-primary group",
          children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-6xl sm:text-7xl mb-4 sm:mb-6", children: "\u{1F468}\u200D\u{1F33E}" }),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4 group-hover:text-primary transition-colors", children: t("landing.farmer") }),
            /* @__PURE__ */ jsx("p", { className: "text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8", children: t("role.farmer.desc") }),
            /* @__PURE__ */ jsxs(Button, { size: "lg", className: "w-full h-12 sm:h-14 text-base sm:text-lg", children: [
              t("auth.signup"),
              " \u2192"
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/signup?role=buyer"),
          className: "bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-secondary group",
          children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-6xl sm:text-7xl mb-4 sm:mb-6", children: "\u{1F477}" }),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4 group-hover:text-secondary transition-colors", children: t("landing.buyer") }),
            /* @__PURE__ */ jsx("p", { className: "text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8", children: t("role.buyer.desc") }),
            /* @__PURE__ */ jsxs(Button, { size: "lg", variant: "secondary", className: "w-full h-12 sm:h-14 text-base sm:text-lg", children: [
              t("auth.signup"),
              " \u2192"
            ] })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto mb-8 sm:mb-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-accent/20 rounded-full p-4 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center", children: /* @__PURE__ */ jsx(Tractor, { className: "w-8 h-8 sm:w-10 sm:h-10 text-accent" }) }),
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-base sm:text-lg mb-2", children: "Simple to Use" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Easy for everyone" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-accent/20 rounded-full p-4 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center", children: /* @__PURE__ */ jsx(Handshake, { className: "w-8 h-8 sm:w-10 sm:h-10 text-accent" }) }),
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-base sm:text-lg mb-2", children: "Direct Connect" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "No middlemen" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-accent/20 rounded-full p-4 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center", children: /* @__PURE__ */ jsx(TrendingUp, { className: "w-8 h-8 sm:w-10 sm:h-10 text-accent" }) }),
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-base sm:text-lg mb-2", children: "Fair Prices" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Best deals" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-base sm:text-lg text-muted-foreground", children: [
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
    ] }) })
  ] }) });
}
export {
  Landing
};
