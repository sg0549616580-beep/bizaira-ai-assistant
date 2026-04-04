import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Sparkles, ArrowLeft, Check } from "lucide-react";

interface OnboardingFlowProps {
  onComplete: () => void;
}

type Step = "greeting" | "business" | "business-info" | "audience" | "audience-info" | "goal" | "done";

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const { lang } = useI18n();
  const isHe = lang === "he";

  const [step, setStep] = useState<Step>("greeting");
  const [businessType, setBusinessType] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("");

  const businessTypes = isHe
    ? ["אופנה 👗", "אוכל 🍽️", "יופי וטיפוח 💄", "נדל״ן 🏠", "דיגיטל 💻", "שירותים 🔧", "בריאות 🏥", "חינוך 📚", "אחר ✨"]
    : ["Fashion 👗", "Food 🍽️", "Beauty 💄", "Real Estate 🏠", "Digital 💻", "Services 🔧", "Health 🏥", "Education 📚", "Other ✨"];

  const audiences = isHe
    ? ["בני נוער 🧑‍🎤", "מבוגרים 👨‍💼", "נשים 👩", "גברים 👨", "עסקים (B2B) 🏢", "הורים 👪", "קהל כללי 🌍"]
    : ["Teens 🧑‍🎤", "Adults 👨‍💼", "Women 👩", "Men 👨", "Businesses (B2B) 🏢", "Parents 👪", "General 🌍"];

  const goals = isHe
    ? ["יותר מכירות 💰", "יותר חשיפה 📣", "תוכן לרשתות 📱", "מיתוג מקצועי 🎨", "חיסכון בזמן ⏱️", "גיוס לקוחות 🎯"]
    : ["More Sales 💰", "More Exposure 📣", "Social Content 📱", "Professional Branding 🎨", "Save Time ⏱️", "Attract Clients 🎯"];

  const businessInfoText = isHe
    ? `מעולה! בתחום ה${businessType.replace(/\s*[^\w\sא-ת].*/g, "")} — נתאים לך תוכן שיווקי מדויק, תמונות מוצר מרהיבות, וניסוחים שמדברים בשפה של הלקוחות שלך. 🎯`
    : `Awesome! In the ${businessType.replace(/\s*[^\w\s].*/g, "")} space — we'll tailor marketing content, stunning product photos, and copy that speaks your customers' language. 🎯`;

  const audienceInfoText = isHe
    ? `מצוין! נתאים את הסגנון, הטון והשפה כדי לפנות בדיוק ל${audience.replace(/\s*[^\w\sא-ת].*/g, "")} — תוכן שמושך, מדבר ומניע לפעולה. 🚀`
    : `Perfect! We'll match the style, tone, and language to reach ${audience.replace(/\s*[^\w\s].*/g, "")} — content that attracts, speaks, and drives action. 🚀`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background px-5" dir={isHe ? "rtl" : "ltr"}>
      <div className="w-full max-w-md">

        {/* Greeting */}
        {step === "greeting" && (
          <div className="text-center animate-fade-in">
            <div className="relative mx-auto mb-6 w-28 h-28">
              <div
                className="absolute -inset-6 rounded-full blur-3xl animate-pulse opacity-25"
                style={{ background: "linear-gradient(135deg, hsl(var(--accent) / 0.5), hsl(var(--primary) / 0.3))" }}
              />
              <img src="/images/bizaira-illustration.png" alt="BizAIra" className="relative w-28 h-28 object-contain" />
            </div>
            <h1 className="text-3xl font-black text-foreground mb-3">
              {isHe ? "היי! 👋 טוב שבאת" : "Hey! 👋 Glad you're here"}
            </h1>
            <p className="text-base text-muted-foreground mb-8 leading-relaxed">
              {isHe
                ? "לפני שמתחילים, נשאל אותך 3 שאלות קצרות כדי להתאים הכל בדיוק בשבילך."
                : "Before we start, we'll ask 3 quick questions to tailor everything just for you."}
            </p>
            <button
              onClick={() => setStep("business")}
              className="w-full py-4 rounded-2xl font-bold text-lg gradient-glow text-primary-foreground glow-shadow hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              {isHe ? "יאללה, בואו נתחיל!" : "Let's go!"}
            </button>
          </div>
        )}

        {/* Q1: Business Type */}
        {step === "business" && (
          <div className="animate-fade-in">
            <StepHeader num={1} total={3} title={isHe ? "מה סוג העסק שלך?" : "What type of business do you have?"} />
            <div className="grid grid-cols-3 gap-2 mb-6">
              {businessTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setBusinessType(type)}
                  className={`text-sm rounded-xl px-2 py-3 border transition-all text-center ${
                    businessType === type
                      ? "border-accent bg-accent/10 text-foreground font-semibold shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-accent/40"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <button
              onClick={() => businessType && setStep("business-info")}
              disabled={!businessType}
              className="w-full py-3.5 rounded-2xl font-bold gradient-glow text-primary-foreground glow-shadow hover:scale-[1.02] transition-all disabled:opacity-40 disabled:hover:scale-100"
            >
              {isHe ? "המשך" : "Continue"}
            </button>
          </div>
        )}

        {/* Business info screen */}
        {step === "business-info" && (
          <div className="animate-fade-in text-center">
            <div className="text-5xl mb-5">🎯</div>
            <h2 className="text-xl font-bold text-foreground mb-3">
              {isHe ? "נהדר, הבנו!" : "Got it!"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 text-sm">{businessInfoText}</p>
            <button
              onClick={() => setStep("audience")}
              className="w-full py-3.5 rounded-2xl font-bold gradient-glow text-primary-foreground glow-shadow hover:scale-[1.02] transition-all"
            >
              {isHe ? "להמשיך לשאלה הבאה" : "Next question"}
            </button>
          </div>
        )}

        {/* Q2: Audience */}
        {step === "audience" && (
          <div className="animate-fade-in">
            <StepHeader num={2} total={3} title={isHe ? "למי העסק פונה?" : "Who's your audience?"} />
            <div className="grid grid-cols-2 gap-2 mb-6">
              {audiences.map((a) => (
                <button
                  key={a}
                  onClick={() => setAudience(a)}
                  className={`text-sm rounded-xl px-3 py-3 border transition-all text-center ${
                    audience === a
                      ? "border-accent bg-accent/10 text-foreground font-semibold shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-accent/40"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep("business")} className="px-4 py-3.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground transition-all">
                <ArrowLeft size={16} className={isHe ? "rotate-180" : ""} />
              </button>
              <button
                onClick={() => audience && setStep("audience-info")}
                disabled={!audience}
                className="flex-1 py-3.5 rounded-2xl font-bold gradient-glow text-primary-foreground glow-shadow hover:scale-[1.02] transition-all disabled:opacity-40 disabled:hover:scale-100"
              >
                {isHe ? "המשך" : "Continue"}
              </button>
            </div>
          </div>
        )}

        {/* Audience info screen */}
        {step === "audience-info" && (
          <div className="animate-fade-in text-center">
            <div className="text-5xl mb-5">🚀</div>
            <h2 className="text-xl font-bold text-foreground mb-3">
              {isHe ? "מעולה!" : "Excellent!"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 text-sm">{audienceInfoText}</p>
            <button
              onClick={() => setStep("goal")}
              className="w-full py-3.5 rounded-2xl font-bold gradient-glow text-primary-foreground glow-shadow hover:scale-[1.02] transition-all"
            >
              {isHe ? "שאלה אחרונה!" : "Last question!"}
            </button>
          </div>
        )}

        {/* Q3: Goal */}
        {step === "goal" && (
          <div className="animate-fade-in">
            <StepHeader num={3} total={3} title={isHe ? "מה המטרה שלך כרגע?" : "What's your current goal?"} />
            <div className="grid grid-cols-2 gap-2 mb-6">
              {goals.map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`text-sm rounded-xl px-3 py-3 border transition-all text-center ${
                    goal === g
                      ? "border-accent bg-accent/10 text-foreground font-semibold shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-accent/40"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep("audience")} className="px-4 py-3.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground transition-all">
                <ArrowLeft size={16} className={isHe ? "rotate-180" : ""} />
              </button>
              <button
                onClick={() => goal && setStep("done")}
                disabled={!goal}
                className="flex-1 py-3.5 rounded-2xl font-bold gradient-glow text-primary-foreground glow-shadow hover:scale-[1.02] transition-all disabled:opacity-40 disabled:hover:scale-100"
              >
                {isHe ? "סיום" : "Finish"}
              </button>
            </div>
          </div>
        )}

        {/* Done */}
        {step === "done" && (
          <div className="animate-fade-in text-center">
            <div className="w-16 h-16 rounded-full gradient-glow flex items-center justify-center mx-auto mb-5 glow-shadow">
              <Check size={28} className="text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-3">
              {isHe ? "הכל מוכן! 🎉" : "All Set! 🎉"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
              {isHe
                ? "התאמנו הכל בדיוק בשבילך — תוכן חכם, מדויק ומותאם לעסק שלך. בלי סיבוכים, בלי המתנה. פשוט מתחילים. 🚀"
                : "Everything's tailored just for you — smart, precise content made for your business. No complications, no waiting. Let's go! 🚀"}
            </p>
            <button
              onClick={onComplete}
              className="w-full py-4 rounded-2xl font-bold text-lg gradient-glow text-primary-foreground glow-shadow hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              {isHe ? "בואו נתחיל!" : "Let's start!"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const StepHeader = ({ num, total, title }: { num: number; total: number; title: string }) => (
  <div className="mb-5">
    <div className="flex items-center gap-2 mb-3">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full flex-1 transition-all ${
            i < num ? "gradient-glow" : "bg-border"
          }`}
        />
      ))}
    </div>
    <h2 className="text-xl font-bold text-foreground">{title}</h2>
  </div>
);

export default OnboardingFlow;
