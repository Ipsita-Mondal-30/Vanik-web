import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Sprout, ShoppingBag, ChevronRight } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import api from "../api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";

export function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, t } = useApp();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(
    searchParams.get("role") || null,
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedRole) {
      setStep(2);
    }
  }, [selectedRole]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedRole ||
      !formData.name?.trim() ||
      !formData.email?.trim() ||
      !formData.password
    ) {
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/signup", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: selectedRole,
      });
      login(data.user, data.token);
      toast.success("Account created");
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Signup failed. Is the server running?";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted/30 py-8 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {step === 2 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedRole(null);
              setStep(1);
            }}
            className="mb-4 sm:mb-6"
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("common.back")}
          </Button>
        )}
        {step === 1 && (
          <div>
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
                {t("auth.signup")}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                {t("auth.selectRole")}
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6">
              <button
                type="button"
                onClick={() => handleRoleSelect("farmer")}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-primary text-left group"
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="bg-primary/10 rounded-full p-4 flex items-center justify-center shrink-0">
                    <Sprout className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 group-hover:text-primary transition-colors">
                      {t("role.farmer")}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {t("role.farmer.desc")}
                    </p>
                  </div>
                  <ChevronRight className="w-8 h-8 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("buyer")}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-secondary text-left group"
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="bg-secondary/10 rounded-full p-4 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 group-hover:text-secondary transition-colors">
                      {t("role.buyer")}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {t("role.buyer.desc")}
                    </p>
                  </div>
                  <ChevronRight className="w-8 h-8 text-secondary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              </button>
            </div>
          </div>
        )}
        {step === 2 && selectedRole && (
          <Card className="shadow-xl">
            <CardContent className="p-6 sm:p-8">
              <div className="bg-muted rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
                <div className="rounded-full p-3 flex items-center justify-center bg-background">
                  {selectedRole === "farmer" ? (
                    <Sprout className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                  ) : (
                    <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-secondary" />
                  )}
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t("auth.signingAs")}
                  </p>
                  <p className="text-lg sm:text-xl font-bold">
                    {t(`role.${selectedRole}`)}
                  </p>
                </div>
              </div>
              <form
                onSubmit={handleSubmit}
                className="space-y-5 sm:space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base sm:text-lg">
                    {t("auth.name")}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder={t("auth.name")}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    disabled={loading}
                    className="h-12 sm:h-14 text-base sm:text-lg"
                  />
                </div>
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
                    autoComplete="new-password"
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
                  <p className="text-xs text-muted-foreground">
                    Min. 6 characters
                  </p>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 sm:h-14 text-base sm:text-lg"
                  variant={selectedRole === "farmer" ? "default" : "secondary"}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t("common.loading")}
                    </>
                  ) : (
                    t("auth.createAccount")
                  )}
                </Button>
              </form>
              <p className="text-center text-sm sm:text-base text-muted-foreground mt-6 sm:mt-8">
                {t("auth.alreadyAccount")}{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-primary font-semibold hover:underline"
                >
                  {t("auth.login")}
                </button>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
