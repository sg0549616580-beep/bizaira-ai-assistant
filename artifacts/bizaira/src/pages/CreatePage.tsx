import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import {
  Camera, MessageSquare, BarChart3, CalendarClock, DollarSign, BookOpen,
  ChevronLeft, ChevronRight,
} from "lucide-react";

const NAVY = "hsl(210 100% 12%)";
const NAVY_ICON = "hsl(210 100% 16%)";
const GOLD = "hsl(39 48% 56%)";
const GOLD_LIGHT = "hsl(39 48% 72%)";

const CreatePage = () => {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const isHe = lang === "he";
  const Arrow = isHe ? ChevronLeft : ChevronRight;

  const tools = [
    {
      id: "studio",
      icon: Camera,
      titleKey: "tool.studio.title",
      descKey: "tool.studio.desc",
      route: "/create/product-photos",
    },
    {
      id: "message",
      icon: MessageSquare,
      titleKey: "tool.messages.title",
      descKey: "tool.messages.desc",
      route: "/create/messages",
    },
    {
      id: "analytics",
      icon: BarChart3,
      titleKey: "tool.analytics.title",
      descKey: "tool.analytics.desc",
      route: "/create/analytics",
    },
    {
      id: "time",
      icon: CalendarClock,
      titleKey: "tool.time.title",
      descKey: "tool.time.desc",
      route: "/create/time",
    },
    {
      id: "pricing",
      icon: DollarSign,
      titleKey: "tool.pricing.title",
      descKey: "tool.pricing.desc",
      route: "/create/pricing",
    },
    {
      id: "journal",
      icon: BookOpen,
      titleKey: "tool.journal.title",
      descKey: "tool.journal.desc",
      route: "/journal",
    },
  ];

  return (
    <div className="pb-28" dir={isHe ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="px-5 pt-8 mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          {isHe ? "סטודיו AI" : "AI Studio"}
        </p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {t("create.title")}
        </h1>
      </div>

      {/* Full-width edge-to-edge strips */}
      <div className="flex flex-col gap-2 px-0">
        {tools.map((tool, i) => {
          const IconComp = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => navigate(tool.route)}
              className="w-full flex items-center justify-between px-5 py-4 animate-float-up active:scale-[0.99] transition-all duration-150"
              style={{
                animationDelay: `${i * 60}ms`,
                background: NAVY,
                boxShadow: "0 2px 8px -2px hsl(210 100% 12% / 0.25)",
              }}
            >
              {/* Left: icon + text */}
              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: NAVY_ICON }}
                >
                  <IconComp
                    size={20}
                    strokeWidth={1.5}
                    style={{ color: GOLD }}
                  />
                </div>
                <div className="text-start">
                  <div
                    className="text-sm font-bold leading-snug"
                    style={{ color: GOLD }}
                  >
                    {t(tool.titleKey)}
                  </div>
                  <div
                    className="text-[11px] leading-relaxed mt-0.5"
                    style={{ color: GOLD_LIGHT, opacity: 0.85 }}
                  >
                    {t(tool.descKey)}
                  </div>
                </div>
              </div>

              {/* Right: arrow */}
              <Arrow
                size={16}
                strokeWidth={2}
                style={{ color: GOLD, opacity: 0.6 }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CreatePage;
