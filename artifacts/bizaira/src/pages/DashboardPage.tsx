import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Wand2, CreditCard, HeadphonesIcon, Calendar, TrendingUp,
  Sparkles, Download, PenTool,
  Archive, MessageSquare, BarChart3, DollarSign, Clock, Camera,
  Trash2, Copy, Check, ChevronRight, ChevronLeft,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import {
  loadCreations, deleteCreation, trackDownload,
  type Creation, type CreationType,
} from "@/lib/creations-store";

const NAVY   = "hsl(219 65% 17%)";
const PURPLE = "hsl(252 73% 60%)";
const PURPLE_LIGHT = "hsl(252 73% 96%)";

const TYPE_ICON: Record<CreationType, React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>> = {
  message:   MessageSquare,
  analytics: BarChart3,
  pricing:   DollarSign,
  time:      Clock,
  image:     Camera,
  photo:     Camera,
};

const STORAGE_KEYS = {
  firstUseDate:    "bizaira_first_credit_use",
  creationsCount:  "bizaira_creations_count",
  downloadsCount:  "bizaira_downloads_count",
};

const DashboardPage = () => {
  const { t, lang } = useI18n();
  const { user, profile } = useAuth();
  const isHe = lang === "he";

  const userName    = user?.user_metadata?.full_name || (isHe ? "אורח" : "Guest");
  const creditsUsed = profile?.credits_used ?? 0;
  const creditsTotal = profile?.credits_total ?? 5;
  const creditsLeft  = creditsTotal - creditsUsed;
  const creditPct    = creditsTotal > 0 ? Math.round((creditsLeft / creditsTotal) * 100) : 0;

  const [firstUseDate, setFirstUseDate]     = useState<string | null>(null);
  const [creationsCount, setCreationsCount] = useState(0);
  const [downloadsCount, setDownloadsCount] = useState(0);
  const [creations, setCreations]           = useState<Creation[]>([]);
  const [activeTab, setActiveTab]           = useState<"overview" | "archive">("overview");
  const [copiedId, setCopiedId]             = useState<string | null>(null);

  const refreshData = useCallback(() => {
    const s1 = localStorage.getItem(STORAGE_KEYS.firstUseDate);
    const s2 = localStorage.getItem(STORAGE_KEYS.creationsCount);
    const s3 = localStorage.getItem(STORAGE_KEYS.downloadsCount);
    if (s1) setFirstUseDate(s1);
    if (s2) setCreationsCount(parseInt(s2, 10) || 0);
    if (s3) setDownloadsCount(parseInt(s3, 10) || 0);
    setCreations(loadCreations());
  }, []);

  useEffect(() => {
    refreshData();
    window.addEventListener("storage", refreshData);
    return () => window.removeEventListener("storage", refreshData);
  }, [refreshData]);

  const getNextRenewalDate = () => {
    if (!firstUseDate) return isHe ? "טרם נעשה שימוש" : "No usage yet";
    const next = new Date(firstUseDate);
    next.setMonth(next.getMonth() + 1);
    return next.toLocaleDateString(isHe ? "he-IL" : "en-US");
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(isHe ? "he-IL" : "en-US", { day: "numeric", month: "short" });

  const formatFirstUseDate = () =>
    firstUseDate
      ? new Date(firstUseDate).toLocaleDateString(isHe ? "he-IL" : "en-US")
      : (isHe ? "טרם נעשה שימוש" : "No usage yet");

  const Arrow = isHe ? ChevronLeft : ChevronRight;

  const handleCopyCreation = (c: Creation) => {
    navigator.clipboard.writeText(c.content);
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadCreation = (c: Creation) => {
    const blob = new Blob([c.content], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `bizaira-${c.type}-${c.id.slice(0, 6)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    trackDownload();
    refreshData();
  };

  const handleDeleteCreation = (id: string) => {
    deleteCreation(id);
    refreshData();
  };

  const quickActions = [
    { to: "/create",   icon: Wand2,          label: t("dash.startCreate")   },
    { to: "/pricing",  icon: CreditCard,      label: t("dash.manageSub")     },
    { to: "/support",  icon: HeadphonesIcon,  label: t("dash.supportTitle")  },
  ];

  const typeLabel = (type: CreationType) => {
    const labels: Record<CreationType, { he: string; en: string }> = {
      message:   { he: "הודעה",         en: "Message"   },
      analytics: { he: "ניתוח עסקי",   en: "Analytics" },
      pricing:   { he: "תמחור",         en: "Pricing"   },
      time:      { he: "ניהול זמן",     en: "Time"      },
      image:     { he: "תמונה",         en: "Image"     },
      photo:     { he: "סטודיו",        en: "Photo"     },
    };
    return isHe ? labels[type].he : labels[type].en;
  };

  return (
    <div className="pb-8 max-w-lg mx-auto" dir={isHe ? "rtl" : "ltr"}>

      {/* Header */}
      <div className="px-5 pt-8 mb-6 animate-float-up">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
          {isHe ? "שלום," : "Hello,"}
        </p>
        <h1 className="text-2xl font-black" style={{ color: NAVY }}>{userName}</h1>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-5 animate-float-up" style={{ animationDelay: "40ms" }}>
        <div className="flex gap-1 p-1 bg-muted rounded-xl">
          {[
            { key: "overview", he: "סקירה",                                        en: "Overview"          },
            { key: "archive",  he: `ארכיון (${creations.length})`, en: `Archive (${creations.length})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as "overview" | "archive")}
              className="flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200"
              style={{
                background:  activeTab === tab.key ? "#fff"                        : "transparent",
                color:       activeTab === tab.key ? NAVY                          : "hsl(220 12% 50%)",
                boxShadow:   activeTab === tab.key ? "0 1px 4px hsl(0 0% 0% / 0.07)" : "none",
              }}
            >
              {isHe ? tab.he : tab.en}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Overview tab ─── */}
      {activeTab === "overview" && (
        <div className="px-5 space-y-4">

          {/* Credits card */}
          <div className="glass-card rounded-2xl p-5 space-y-4 animate-float-up" style={{ animationDelay: "60ms" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  {t("dash.plan")}
                </p>
                <div className="flex items-center gap-1.5">
                  <Sparkles size={13} strokeWidth={1.5} style={{ color: PURPLE }} />
                  <span className="text-sm font-bold" style={{ color: NAVY }}>Free</span>
                </div>
              </div>
              <Link
                to="/pricing"
                className="gradient-glow glow-shadow text-white text-xs font-bold px-4 py-2 rounded-xl hover:scale-105 transition-transform"
              >
                {t("dash.upgrade")}
              </Link>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t("dash.credits")}</span>
                <span className="font-bold" style={{ color: NAVY }}>{creditsLeft} / {creditsTotal}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${creditPct}%`,
                    background: `linear-gradient(90deg, ${PURPLE}, hsl(252 73% 50%))`,
                  }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                {creditPct}% {isHe ? "קרדיטים נותרים" : "credits remaining"}
              </p>
            </div>

            <div className="pt-3 border-t border-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar size={11} />
                  {isHe ? "שימוש ראשון:" : "First Use:"}
                </span>
                <span className="font-semibold" style={{ color: NAVY }}>{formatFirstUseDate()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar size={11} />
                  {isHe ? "חידוש הבא:" : "Next Renewal:"}
                </span>
                <span className="font-semibold" style={{ color: NAVY }}>{getNextRenewalDate()}</span>
              </div>
            </div>
          </div>

          {/* Activity stats */}
          <div className="glass-card rounded-2xl p-5 animate-float-up" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: PURPLE_LIGHT }}>
                <TrendingUp size={14} strokeWidth={1.5} style={{ color: PURPLE }} />
              </div>
              <span className="text-sm font-bold" style={{ color: NAVY }}>{t("dash.activity")}</span>
            </div>
            <div className="space-y-3">
              {[
                { icon: PenTool,  label: t("dash.creations"),                  val: creationsCount },
                { icon: Download, label: t("dash.downloads"),                   val: downloadsCount },
                { icon: Archive,  label: isHe ? "שמורות בארכיון" : "In archive", val: creations.length },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Icon size={14} strokeWidth={1.5} />
                    {label}
                  </span>
                  <span className="text-sm font-bold" style={{ color: NAVY }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent creations preview */}
          {creations.length > 0 && (
            <div className="animate-float-up" style={{ animationDelay: "140ms" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  {isHe ? "יצירות אחרונות" : "Recent Creations"}
                </p>
                <button
                  onClick={() => setActiveTab("archive")}
                  className="text-xs font-bold"
                  style={{ color: PURPLE }}
                >
                  {isHe ? "הצג הכל" : "Show all"}
                </button>
              </div>
              <div className="space-y-2">
                {creations.slice(0, 3).map(c => {
                  const IconComp = TYPE_ICON[c.type];
                  return (
                    <div key={c.id} className="glass-card rounded-xl p-3 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: PURPLE_LIGHT }}>
                        <IconComp size={14} strokeWidth={1.5} style={{ color: PURPLE }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: PURPLE }}>
                            {typeLabel(c.type)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{formatDate(c.createdAt)}</span>
                        </div>
                        <p className="text-xs text-foreground leading-relaxed line-clamp-2">{c.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="animate-float-up" style={{ animationDelay: "175ms" }}>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
              {t("dash.quickActions")}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="glass-card flex flex-col items-center justify-center p-4 rounded-2xl hover:border-accent/40 hover:scale-[1.03] active:scale-[0.99] transition-all duration-200 group"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-2 transition-all duration-200 group-hover:scale-110"
                    style={{ background: PURPLE_LIGHT }}
                  >
                    <Icon size={20} strokeWidth={1.5} style={{ color: PURPLE }} />
                  </div>
                  <p className="text-xs font-bold text-center leading-tight" style={{ color: NAVY }}>
                    {label}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Archive tab ─── */}
      {activeTab === "archive" && (
        <div className="px-5 space-y-3 animate-fade-in">
          {creations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mb-4">
                <Archive size={24} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-bold" style={{ color: NAVY }}>
                {isHe ? "הארכיון ריק" : "Archive is empty"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
                {isHe
                  ? "כל יצירה שתפיקי תישמר כאן אוטומטית"
                  : "Every creation you make is saved here automatically"}
              </p>
              <Link
                to="/create"
                className="mt-5 gradient-glow glow-shadow text-white text-sm font-bold px-6 py-3 rounded-xl"
              >
                {isHe ? "התחל ליצור" : "Start Creating"}
              </Link>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-1">
                {isHe ? `${creations.length} יצירות שמורות` : `${creations.length} saved creations`}
              </p>
              {creations.map(c => {
                const IconComp = TYPE_ICON[c.type];
                const isCopied = copiedId === c.id;
                return (
                  <div key={c.id} className="glass-card rounded-xl p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: PURPLE_LIGHT }}>
                        <IconComp size={15} strokeWidth={1.5} style={{ color: PURPLE }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: PURPLE }}>
                            {typeLabel(c.type)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{formatDate(c.createdAt)}</span>
                        </div>
                        <p className="text-xs font-bold mt-0.5 truncate" style={{ color: NAVY }}>{c.title}</p>
                      </div>
                    </div>

                    <div className="bg-muted rounded-xl p-3 mb-3">
                      <p className="text-xs text-foreground leading-relaxed line-clamp-4 whitespace-pre-wrap">
                        {c.content}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopyCreation(c)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold transition-all"
                        style={{
                          background: isCopied ? "hsl(142 70% 94%)" : "hsl(220 18% 95%)",
                          color:      isCopied ? "hsl(142 60% 30%)" : NAVY,
                        }}
                      >
                        {isCopied
                          ? <><Check size={11} />{isHe ? "הועתק" : "Copied"}</>
                          : <><Copy size={11} />{isHe ? "העתק" : "Copy"}</>}
                      </button>
                      <button
                        onClick={() => handleDownloadCreation(c)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold transition-all"
                        style={{ background: "hsl(220 18% 95%)", color: NAVY }}
                      >
                        <Download size={11} />{isHe ? "הורד" : "Download"}
                      </button>
                      <button
                        onClick={() => handleDeleteCreation(c.id)}
                        className="px-3 py-2 rounded-xl transition-all"
                        style={{ background: "hsl(0 84% 97%)", color: "hsl(0 84% 50%)" }}
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
