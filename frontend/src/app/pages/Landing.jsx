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
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="flex justify-end mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            {language === "en" ? "EN" : "हिंदी"}
          </Button>
        </div>

        <section className="relative overflow-hidden rounded-3xl border bg-card/80 shadow-sm p-8 sm:p-10 lg:p-14 mb-10 sm:mb-14">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/10 pointer-events-none" />
          <div className="relative max-w-3xl">
            <p className="inline-flex items-center rounded-full border px-3 py-1 text-xs sm:text-sm text-muted-foreground mb-4">
              Bharat's farm-to-market platform
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
              Vanik
            </h1>
            <p className="text-lg sm:text-2xl text-foreground/85 mb-3">{t("landing.tagline")}</p>
            <p className="text-sm sm:text-base text-muted-foreground mb-7 sm:mb-8">
              {t("landing.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                size="lg"
                className="h-12 text-base sm:text-lg gap-2"
                onClick={() => navigate("/signup?role=farmer")}
              >
                <Sprout className="w-5 h-5" />
                {t("landing.farmer")}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="h-12 text-base sm:text-lg gap-2"
                onClick={() => navigate("/signup?role=buyer")}
              >
                <ShoppingBag className="w-5 h-5" />
                {t("landing.buyer")}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-12 sm:mb-16">
          <button
            onClick={() => navigate("/signup?role=farmer")}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-primary group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 rounded-full p-5 sm:p-6 mb-4 sm:mb-6 flex items-center justify-center">
                <Sprout className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                {t("landing.farmer")}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
                {t("role.farmer.desc")}
              </p>
              <Button asChild size="lg" className="w-full h-12 sm:h-14 text-base sm:text-lg gap-2">
                <span className="inline-flex items-center gap-2">
                  {t("auth.signup")}
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </div>
          </button>

          <button
            onClick={() => navigate("/signup?role=buyer")}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-secondary group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-secondary/10 rounded-full p-5 sm:p-6 mb-4 sm:mb-6 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-secondary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4 group-hover:text-secondary transition-colors">
                {t("landing.buyer")}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
                {t("role.buyer.desc")}
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="w-full h-12 sm:h-14 text-base sm:text-lg gap-2"
              >
                <span className="inline-flex items-center gap-2">
                  {t("auth.signup")}
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </div>
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto mb-8 sm:mb-12">
          <div className="text-center">
            <div className="bg-accent/20 rounded-full p-4 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <Tractor className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg mb-2">Simple to Use</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Easy for everyone</p>
          </div>

          <div className="text-center">
            <div className="bg-accent/20 rounded-full p-4 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <Handshake className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg mb-2">Direct Connect</h3>
            <p className="text-sm sm:text-base text-muted-foreground">No middlemen</p>
          </div>

          <div className="text-center">
            <div className="bg-accent/20 rounded-full p-4 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg mb-2">Fair Prices</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Best deals</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-base sm:text-lg text-muted-foreground">
            {t("auth.alreadyAccount")}{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary font-semibold hover:underline"
            >
              {t("auth.login")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
export {
  Landing
};
