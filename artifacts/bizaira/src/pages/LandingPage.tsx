import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import OnboardingFlow from "@/components/OnboardingFlow";
import AuthSection from "@/components/AuthSection";

type Step = "onboarding" | "main";

const LandingPage = () => {
  const { lang } = useI18n();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("onboarding");

  useEffect(() => {
    if (!loading && user) {
      setStep("main");
    }
  }, [user, loading]);

  const onOnboardingComplete = useCallback(() => {
    setStep("main");
  }, []);

  const handleGuestContinue = () => {
    navigate("/create");
  };

  if (step === "onboarding" && !user) {
    return <OnboardingFlow onComplete={onOnboardingComplete} />;
  }

  // Main: Hero title + Auth or Welcome
  return (
    <section className="px-4 pt-8 pb-4 animate-fade-in">
      {/* Hero — Elegant centered title with gold/lilac glow */}
      <div className="text-center mb-10 pt-8">
        <h1 
          className="text-4xl md:text-6xl font-black leading-tight tracking-tight"
          style={{
            background: "linear-gradient(135deg, hsl(39 48% 56%), hsl(270 30% 60%), hsl(39 50% 50%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 0 60px hsl(39 48% 56% / 0.3)"
          }}
        >
          {lang === "he" ? "הכל במקום אחד" : "Everything In One Place"}
        </h1>
        {/* Decorative gold/lilac divider */}
        <div 
          className="w-24 h-1 mx-auto mt-5 rounded-full"
          style={{ 
            background: "linear-gradient(90deg, transparent, hsl(39 48% 56%), hsl(270 30% 65%), transparent)" 
          }}
          aria-hidden="true"
        />
      </div>

      {/* Auth section for non-logged-in users */}
      {!user && (
        <section className="mb-8">
          <div className="text-center mb-5">
            <h2 className="text-xl font-bold text-foreground mb-1">
              {lang === "he" ? "צרו חשבון והתחילו עכשיו" : "Create an Account & Start Now"}
            </h2>
          </div>
          <AuthSection onSuccess={() => {}} />

          {/* Guest continue */}
          <div className="text-center mt-5">
            <button
              onClick={handleGuestContinue}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              {lang === "he" ? "המשך כאורח →" : "Continue as Guest →"}
            </button>
          </div>
        </section>
      )}

      {/* Welcome for logged-in users */}
      {user && (
        <section className="text-center">
          <p className="text-lg text-foreground font-semibold">
            {lang === "he"
              ? `שלום, ${user.user_metadata?.full_name || ""}`
              : `Hello, ${user.user_metadata?.full_name || ""}`}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "he" ? "נווט ליצירה דרך התפריט למטה" : "Navigate to Create from the menu below"}
          </p>
        </section>
      )}
    </section>
  );
};

export default LandingPage;
