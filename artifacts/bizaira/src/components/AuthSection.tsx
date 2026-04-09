import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, User, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

interface AuthSectionProps {
  onSuccess?: () => void;
}

const AuthSection = ({ onSuccess }: AuthSectionProps) => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(lang === "he" ? "נא למלא אימייל וסיסמה" : "Please fill in email and password");
      return;
    }
    if (!isLogin && !acceptPrivacy) {
      toast.error(lang === "he" ? "נא לאשר את מדיניות הפרטיות" : "Please accept the privacy policy");
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(lang === "he" ? "התחברת בהצלחה!" : "Logged in successfully!");
        if (onSuccess) onSuccess();
        else navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              full_name: name,
              accept_privacy: acceptPrivacy,
              accept_marketing: acceptMarketing
            },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success(lang === "he" ? "החשבון נוצר! בדוק את האימייל שלך" : "Account created! Check your email");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto w-full" dir={lang === "he" ? "rtl" : "ltr"}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold gradient-glow-text mb-1">BizAIra</h2>
        <p className="text-muted-foreground text-sm">
          {isLogin
            ? (lang === "he" ? "שמחים לראות אותך שוב" : "Welcome back")
            : (lang === "he" ? "הצטרפו לסטודיו AI" : "Join the AI Studio")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4">
        {!isLogin && (
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
              {lang === "he" ? "שם מלא" : "Full Name"}
            </label>
            <div className="relative">
              <User size={15} className={`absolute ${lang === "he" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none`} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === "he" ? "השם שלך" : "Your name"}
                className={`w-full h-11 bg-background border border-input rounded-xl ${lang === "he" ? "pl-10 pr-4" : "pr-10 pl-4"} text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 transition-all`}
                dir={lang === "he" ? "rtl" : "ltr"}
              />
            </div>
          </div>
        )}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
            {lang === "he" ? "אימייל" : "Email"}
          </label>
          <div className="relative">
            <Mail size={15} className={`absolute ${lang === "he" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none`} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={`w-full h-11 bg-background border border-input rounded-xl ${lang === "he" ? "pl-10 pr-4" : "pr-10 pl-4"} text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 transition-all`}
              dir="ltr"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
            {lang === "he" ? "סיסמה" : "Password"}
          </label>
          <div className="relative">
            <Lock size={15} className={`absolute ${lang === "he" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none`} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full h-11 bg-background border border-input rounded-xl ${lang === "he" ? "pl-10 pr-4" : "pr-10 pl-4"} text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 transition-all`}
              dir="ltr"
            />
          </div>
        </div>

        {!isLogin && (
          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="privacy"
                checked={acceptPrivacy}
                onCheckedChange={(checked) => setAcceptPrivacy(!!checked)}
                className="mt-1"
              />
              <label htmlFor="privacy" className={`text-sm leading-relaxed ${lang === "he" ? "text-right" : ""}`}>
                {lang === "he" ? "אני מסכים ל" : "I agree to the"}{" "}
                <Link to="/privacy" className="text-primary underline hover:text-primary/80">
                  {lang === "he" ? "מדיניות הפרטיות" : "Privacy Policy"}
                </Link>{" "}
                {lang === "he" ? "ותנאי השימוש" : "and Terms of Use"}
              </label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="marketing"
                checked={acceptMarketing}
                onCheckedChange={(checked) => setAcceptMarketing(!!checked)}
                className="mt-1"
              />
              <label htmlFor="marketing" className={`text-sm leading-relaxed ${lang === "he" ? "text-right" : ""}`}>
                {lang === "he" ? "אני מסכים לקבל תוכן שיווקי" : "I agree to receive marketing content"}
              </label>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (!isLogin && !acceptPrivacy)}
          className="w-full gradient-glow glow-shadow text-primary-foreground font-bold py-3 rounded-2xl text-base flex items-center justify-center gap-2 mt-2 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {isLogin
            ? (lang === "he" ? "התחבר" : "Log In")
            : (lang === "he" ? "צור חשבון" : "Create Account")}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {lang === "he" ? "או" : "Or"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center gap-3 py-3 border border-input rounded-xl bg-background hover:bg-accent transition-colors text-sm font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {lang === "he" ? "המשך עם גוגל" : "Continue with Google"}
        </button>

        <div className="text-center pt-1">
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-accent hover:text-accent/80 transition-colors">
            {isLogin
              ? (lang === "he" ? "אין לך חשבון? הירשם" : "Don't have an account? Sign up")
              : (lang === "he" ? "כבר יש לך חשבון? התחבר" : "Already have an account? Log in")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthSection;
