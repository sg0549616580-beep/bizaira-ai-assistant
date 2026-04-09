import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Sparkles, ArrowLeft, Check,
  ShoppingBag, Utensils, Star, Home, Monitor, Briefcase,
  Heart, GraduationCap, MoreHorizontal,
  Users, Baby, User, UserCheck, Building, PartyPopper, Globe,
  TrendingUp, Megaphone, Share2, Award, Clock, UserPlus,
} from "lucide-react";

interface OnboardingFlowProps {
  onComplete: () => void;
}

type Step = "greeting" | "business" | "business-info" | "audience" | "audience-info" | "goal" | "done";

const PURPLE = "#0D2344";
const NAVY   = "#0D2344";

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const { lang } = useI18n();
  const { user } = useAuth();
  const isHe = lang === "he";

  const [step, setStep]             = useState<Step>("greeting");
  const [businessType, setBusinessType] = useState("");
  const [audience, setAudience]         = useState("");
  const [goal, setGoal]                 = useState("");

  const businessTypes: { label: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = isHe
    ? [
        { label: "אופנה",         Icon: ShoppingBag  },
        { label: "אוכל",          Icon: Utensils     },
        { label: "יופי וטיפוח",  Icon: Star         },
        { label: "נדל״ן",        Icon: Home         },
        { label: "דיגיטל",       Icon: Monitor      },
        { label: "שירותים",      Icon: Briefcase    },
        { label: "בריאות",       Icon: Heart        },
        { label: "חינוך",        Icon: GraduationCap},
        { label: "אחר",           Icon: MoreHorizontal},
      ]
    : [
        { label: "Fashion",     Icon: ShoppingBag  },
        { label: "Food",        Icon: Utensils     },
        { label: "Beauty",      Icon: Star         },
        { label: "Real Estate", Icon: Home         },
        { label: "Digital",     Icon: Monitor      },
        { label: "Services",    Icon: Briefcase    },
        { label: "Health",      Icon: Heart        },
        { label: "Education",   Icon: GraduationCap},
        { label: "Other",       Icon: MoreHorizontal},
      ];

  const audiences: { label: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = isHe
    ? [
        { label: "בני נוער",     Icon: Baby        },
        { label: "מבוגרים",      Icon: User        },
        { label: "נשים",         Icon: Users       },
        { label: "גברים",        Icon: UserCheck   },
        { label: "עסקים (B2B)", Icon: Building    },
        { label: "הורים",        Icon: PartyPopper },
        { label: "קהל כללי",    Icon: Globe       },
      ]
    : [
        { label: "Teens",           Icon: Baby        },
        { label: "Adults",          Icon: User        },
        { label: "Women",           Icon: Users       },
        { label: "Men",             Icon: UserCheck   },
        { label: "Businesses (B2B)",Icon: Building    },
        { label: "Parents",         Icon: PartyPopper },
        { label: "General",         Icon: Globe       },
      ];

  const goals: { label: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = isHe
    ? [
        { label: "יותר מכירות",     Icon: TrendingUp  },
        { label: "יותר חשיפה",      Icon: Megaphone   },
        { label: "תוכן לרשתות",    Icon: Share2      },
        { label: "מיתוג מקצועי",   Icon: Award       },
        { label: "חיסכון בזמן",    Icon: Clock       },
        { label: "גיוס לקוחות",    Icon: UserPlus    },
      ]
    : [
        { label: "More Sales",             Icon: TrendingUp  },
        { label: "More Exposure",          Icon: Megaphone   },
        { label: "Social Content",         Icon: Share2      },
        { label: "Professional Branding",  Icon: Award       },
        { label: "Save Time",              Icon: Clock       },
        { label: "Attract Clients",        Icon: UserPlus    },
      ];

  const businessInfoText = isHe
    ? `מעולה! בתחום ה${businessType} — נתאים לך תוכן שיווקי מדויק, תמונות מוצר מרהיבות, וניסוחים שמדברים בשפה של הלקוחות שלך.`
    : `Awesome! In the ${businessType} space — we'll tailor marketing content, stunning product photos, and copy that speaks your customers' language.`;

  const audienceInfoText = isHe
    ? `מצוין! נתאים את הסגנון, הטון והשפה כדי לפנות בדיוק ל${audience} — תוכן שמושך, מדבר ומניע לפעולה.`
    : `Perfect! We'll match the style, tone, and language to reach ${audience} — content that attracts, speaks, and drives action.`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background px-5"
      dir={isHe ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md">

        {/* ─── Screen 1: Greeting ─── */}
        {step === "greeting" && (
          <div className="text-center animate-fade-in">
            <div className="relative mx-auto mb-8 w-20 h-20">
              <div
                className="absolute -inset-4 rounded-full blur-2xl opacity-20 animate-pulse"
                style={{ background: `linear-gradient(135deg, ${PURPLE}, ${NAVY})` }}
              />
              <img
                src="/images/bizaira-illustration.png"
                alt="BizAIra"
                className="relative w-20 h-20 object-contain drop-shadow-md"
              />
            </div>

            <h1 className="text-3xl font-black mb-3" style={{ color: NAVY }}>
              {isHe ? "היי! איזה כיף שהגעת" : "Hey! So glad you're here"}
            </h1>
            <p className="text-base font-semibold mb-2" style={{ color: NAVY }}>
              {isHe ? "עוד רגע מתחילים" : "We're about to begin"}
            </p>
            <p className="text-sm text-muted-foreground mb-10 leading-relaxed max-w-xs mx-auto">
              {isHe
                ? "רק 3 שאלות קצרות שיעזרו לנו להתאים לך חוויה מדויקת לעסק שלך."
                : "Just 3 quick questions to tailor the perfect experience for your business."}
            </p>

            <button
              onClick={() => setStep("business")}
              className="w-full py-4 rounded-2xl font-bold text-lg gradient-glow text-white glow-shadow hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              {isHe ? "מוכנים? בואו נתחיל" : "Ready? Let's go!"}
            </button>
          </div>
        )}

        {/* ─── Screen 2: Business Type ─── */}
        {step === "business" && (
          <div className="animate-fade-in">
            <StepHeader
              num={1} total={3}
              title={isHe ? "מה סוג העסק שלך?" : "What type of business do you have?"}
            />
            <div className="grid grid-cols-3 gap-2.5 mb-7">
              {businessTypes.map(({ label, Icon }) => {
                const selected = businessType === label;
                return (
                  <button
                    key={label}
                    onClick={() => setBusinessType(label)}
                    className="flex flex-col items-center gap-2 py-3.5 px-2 rounded-2xl border-2 transition-all text-center"
                    style={{
                      background:   selected ? NAVY      : "hsl(0 0% 100%)",
                      borderColor:  selected ? NAVY      : "hsl(220 16% 90%)",
                      color:        selected ? "#fff"    : NAVY,
                      boxShadow:    selected ? `0 4px 16px -4px ${NAVY}44` : "none",
                      transform:    selected ? "scale(1.03)" : "scale(1)",
                    }}
                  >
                    <Icon size={20} strokeWidth={1.5} />
                    <span className="text-xs font-semibold leading-tight">{label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => businessType && setStep("business-info")}
              disabled={!businessType}
              className="w-full py-3.5 rounded-2xl font-bold gradient-glow text-white glow-shadow hover:scale-[1.02] transition-all disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isHe ? "המשך" : "Continue"}
            </button>
          </div>
        )}

        {/* ─── Screen 3: Business Info (Outline CTA) ─── */}
        {step === "business-info" && (
          <div className="animate-fade-in text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "hsl(216 50% 94%)" }}>
              <Check size={24} style={{ color: PURPLE }} />
            </div>
            <h2 className="text-2xl font-black mb-3" style={{ color: NAVY }}>
              {isHe ? "נהדר, הבנו!" : "Got it!"}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-10 max-w-xs mx-auto">
              {businessInfoText}
            </p>
            <button
              onClick={() => setStep("audience")}
              className="w-full py-3.5 rounded-2xl font-bold text-sm border-2 hover:bg-primary hover:text-white transition-all"
              style={{ borderColor: NAVY, color: NAVY }}
            >
              {isHe ? "להמשיך לשאלה הבאה" : "Next question"}
            </button>
          </div>
        )}

        {/* ─── Screen 4: Audience ─── */}
        {step === "audience" && (
          <div className="animate-fade-in">
            <StepHeader
              num={2} total={3}
              title={isHe ? "למי העסק פונה?" : "Who's your audience?"}
            />
            <div className="grid grid-cols-2 gap-2.5 mb-7">
              {audiences.map(({ label, Icon }) => {
                const selected = audience === label;
                return (
                  <button
                    key={label}
                    onClick={() => setAudience(label)}
                    className="flex items-center gap-3 py-3 px-4 rounded-2xl border-2 transition-all text-start"
                    style={{
                      background:  selected ? NAVY   : "hsl(0 0% 100%)",
                      borderColor: selected ? NAVY   : "hsl(220 16% 90%)",
                      color:       selected ? "#fff" : NAVY,
                      boxShadow:   selected ? `0 4px 16px -4px ${NAVY}44` : "none",
                    }}
                  >
                    <Icon size={16} strokeWidth={1.5} />
                    <span className="text-xs font-semibold">{label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setStep("business")}
                className="w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all hover:bg-muted shrink-0"
                style={{ borderColor: "hsl(220 16% 90%)", color: NAVY }}
              >
                <ArrowLeft size={16} className={isHe ? "rotate-180" : ""} />
              </button>
              <button
                onClick={() => audience && setStep("audience-info")}
                disabled={!audience}
                className="flex-1 py-3.5 rounded-2xl font-bold gradient-glow text-white glow-shadow hover:scale-[1.02] transition-all disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isHe ? "המשך" : "Continue"}
              </button>
            </div>
          </div>
        )}

        {/* ─── Screen 5: Audience Info (Outline CTA) ─── */}
        {step === "audience-info" && (
          <div className="animate-fade-in text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "hsl(216 50% 94%)" }}>
              <Check size={24} style={{ color: PURPLE }} />
            </div>
            <h2 className="text-2xl font-black mb-3" style={{ color: NAVY }}>
              {isHe ? "מעולה!" : "Excellent!"}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-10 max-w-xs mx-auto">
              {audienceInfoText}
            </p>
            <button
              onClick={() => setStep("goal")}
              className="w-full py-3.5 rounded-2xl font-bold text-sm border-2 hover:bg-primary hover:text-white transition-all"
              style={{ borderColor: NAVY, color: NAVY }}
            >
              {isHe ? "שאלה אחרונה!" : "Last question!"}
            </button>
          </div>
        )}

        {/* ─── Screen 6: Goal ─── */}
        {step === "goal" && (
          <div className="animate-fade-in">
            <StepHeader
              num={3} total={3}
              title={isHe ? "מה המטרה שלך כרגע?" : "What's your current goal?"}
            />
            <div className="grid grid-cols-2 gap-2.5 mb-7">
              {goals.map(({ label, Icon }) => {
                const selected = goal === label;
                return (
                  <button
                    key={label}
                    onClick={() => setGoal(label)}
                    className="flex items-center gap-3 py-3.5 px-4 rounded-2xl border-2 transition-all text-start"
                    style={{
                      background:  selected ? PURPLE  : "hsl(0 0% 100%)",
                      borderColor: selected ? PURPLE  : "hsl(220 16% 90%)",
                      color:       selected ? "#fff"  : NAVY,
                      boxShadow:   selected ? `0 4px 16px -4px ${PURPLE}55` : "none",
                    }}
                  >
                    <Icon size={16} strokeWidth={1.5} />
                    <span className="text-xs font-semibold leading-snug">{label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setStep("audience")}
                className="w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all hover:bg-muted shrink-0"
                style={{ borderColor: "hsl(220 16% 90%)", color: NAVY }}
              >
                <ArrowLeft size={16} className={isHe ? "rotate-180" : ""} />
              </button>
              <button
                onClick={() => goal && setStep("done")}
                disabled={!goal}
                className="flex-1 py-3.5 rounded-2xl font-bold gradient-glow text-white glow-shadow hover:scale-[1.02] transition-all disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isHe ? "סיום" : "Finish"}
              </button>
            </div>
          </div>
        )}

        {/* ─── Screen 7: Done ─── */}
        {step === "done" && (
          <div className="animate-fade-in text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 glow-shadow"
              style={{ background: `linear-gradient(135deg, ${PURPLE}, hsl(216 68% 14%))` }}
            >
              <Check size={28} className="text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black mb-3" style={{ color: NAVY }}>
              {isHe ? "הכל מוכן!" : "All Set!"}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-10 max-w-xs mx-auto">
              {isHe
                ? "התאמנו הכל בדיוק בשבילך — תוכן חכם, מדויק ומותאם לעסק שלך. בלי סיבוכים, בלי המתנה."
                : "Everything's tailored just for you — smart, precise content for your business. No complications, no waiting."}
            </p>
            <button
              onClick={async () => {
                // Save onboarding data
                const onboardingData = {
                  business_type: businessType,
                  target_audience: audience,
                  business_goals: goal,
                };
                
                if (user) {
                  // Save to profile if user is logged in
                  const { error } = await supabase
                    .from("profiles")
                    .update({
                      ...onboardingData,
                      onboarding_completed: true,
                    })
                    .eq("user_id", user.id);
                  
                  if (error) {
                    toast.error(isHe ? "שגיאה בשמירת הנתונים" : "Error saving data");
                    return;
                  }
                } else {
                  // Store in localStorage for later
                  localStorage.setItem("bizaira_onboarding", JSON.stringify(onboardingData));
                }
                
                onComplete();
              }}
              className="w-full py-4 rounded-2xl font-bold text-lg gradient-glow text-white glow-shadow hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
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
  <div className="mb-6">
    <div className="flex items-center gap-1.5 mb-4">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="h-1.5 rounded-full flex-1 transition-all duration-500"
          style={{
            background: i < num
              ? "linear-gradient(90deg, hsl(216 68% 16%), hsl(216 68% 15%))"
              : "hsl(220 16% 90%)",
          }}
        />
      ))}
    </div>
    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
      שלב {num} מתוך {total}
    </p>
    <h2 className="text-xl font-black" style={{ color: "hsl(219 65% 17%)" }}>{title}</h2>
  </div>
);

export default OnboardingFlow;
