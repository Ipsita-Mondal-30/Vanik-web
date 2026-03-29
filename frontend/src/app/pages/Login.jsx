import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import api from "../api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";

export function Login() {
  const navigate = useNavigate();
  const { login, t } = useApp();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email?.trim() || !formData.password) {
      toast.error(t("auth.email") + " / " + t("auth.password"));
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });
      login(data.user, data.token);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Is the server running?";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted/30 py-8 sm:py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {t("auth.login")}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t("auth.loginAs")}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base sm:text-lg">
                  {t("auth.email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("auth.email")}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={loading}
                  className="h-12 sm:h-14 text-base sm:text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base sm:text-lg">
                  {t("auth.password")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder={t("auth.password")}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  minLength={6}
                  disabled={loading}
                  className="h-12 sm:h-14 text-base sm:text-lg"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 sm:h-14 text-base sm:text-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t("common.loading")}
                  </>
                ) : (
                  t("auth.login")
                )}
              </Button>
            </form>
            <p className="text-center text-sm sm:text-base text-muted-foreground mt-6 sm:mt-8">
              {t("auth.noAccount")}{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-primary font-semibold hover:underline"
              >
                {t("auth.signup")}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
