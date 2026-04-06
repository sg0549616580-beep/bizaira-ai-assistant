import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, User, ArrowLeft, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NAVY   = "#0D2344";
const PURPLE = "#0D2344";

const AuthPage = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const isHe = lang === "he";
  const [isLogin, setIsLogin]     = useState(false);
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const BackArrow = isHe ? ArrowLeft : ArrowRight;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(isHe ? "נא למלא אימייל וסיסמה" : "Please fill in email and password");
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(isHe ? "התחברת בהצלחה!" : "Logged in successfully!");
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success(isHe ? "החשבון נוצר! בדוק את האימייל שלך" : "Account created! Check your email");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 py-10 bg-background"
      dir={isHe ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "linear-gradient(135deg, hsl(216 68% 16%), hsl(216 68% 14%))", boxShadow: "0 8px 24px -4px hsl(252 73% 60% / 0.35)" }}>
            <Sparkles size={28} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-black mb-1.5" style={{ color: NAVY }}>
            {isHe ? "הכל במקום אחד" : "Everything in one place"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLogin ? t("auth.welcomeBack") : t("auth.joinStudio")}
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="glass-card rounded-3xl p-7 space-y-5"
          style={{ boxShadow: "0 8px 40px -8px hsl(219 65% 17% / 0.08), 0 2px 12px -4px hsl(219 65% 17% / 0.06)" }}
        >
          {/* Name field */}
          {!isLogin && (
            <FieldWrapper label={isHe ? "שם מלא" : "Full name"}>
              <div className="relative">
                <User
                  size={15}
                  strokeWidth={1.5}
                  className="absolute top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  style={{ [isHe ? "right" : "left"]: "14px" }}
                />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t("auth.namePlaceholder")}
                  className="w-full bg-background border border-border rounded-xl py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  style={{ [isHe ? "paddingRight" : "paddingLeft"]: "40px", [isHe ? "paddingLeft" : "paddingRight"]: "16px" }}
                />
              </div>
            </FieldWrapper>
          )}

          {/* Email */}
          <FieldWrapper label={isHe ? "אימייל" : "Email"}>
            <div className="relative">
              <Mail
                size={15}
                strokeWidth={1.5}
                className="absolute top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                style={{ [isHe ? "right" : "left"]: "14px" }}
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                dir="ltr"
                className="w-full bg-background border border-border rounded-xl py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                style={{ [isHe ? "paddingRight" : "paddingLeft"]: "40px", [isHe ? "paddingLeft" : "paddingRight"]: "16px" }}
              />
            </div>
          </FieldWrapper>

          {/* Password */}
          <FieldWrapper label={isHe ? "סיסמה" : "Password"}>
            <div className="relative">
              <Lock
                size={15}
                strokeWidth={1.5}
                className="absolute top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                style={{ [isHe ? "right" : "left"]: "14px" }}
              />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full bg-background border border-border rounded-xl py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                style={{ [isHe ? "paddingRight" : "paddingLeft"]: "40px", [isHe ? "paddingLeft" : "paddingRight"]: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                style={{ [isHe ? "left" : "right"]: "14px" }}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </FieldWrapper>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-bold text-white gradient-glow glow-shadow flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading
              ? <Loader2 size={18} className="animate-spin" />
              : <Sparkles size={18} />}
            {isLogin ? t("auth.login") : t("auth.createAccount")}
          </button>

          {/* Toggle */}
          <div className="text-center pt-1 space-y-2">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-semibold transition-colors"
              style={{ color: PURPLE }}
            >
              {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}
            </button>
            {isLogin && (
              <div>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("auth.forgotPassword")}
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Back link */}
        <Link
          to="/"
          className="flex items-center justify-center gap-1.5 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <BackArrow size={14} />
          {t("auth.backHome")}
        </Link>
      </div>
    </div>
  );
};

const FieldWrapper = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block">
      {label}
    </label>
    {children}
  </div>
);

export default AuthPage;
