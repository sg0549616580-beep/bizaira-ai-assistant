import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Wand2, CreditCard, HeadphonesIcon, Calendar, TrendingUp,
  ChevronRight, ChevronLeft, Sparkles, Download, PenTool,
  Archive, MessageSquare, BarChart3, DollarSign, Clock, Camera,
  Trash2, Copy, Check, BookOpen,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import {
  loadCreations, deleteCreation, trackDownload, type Creation, type CreationType,
} from "@/lib/creations-store";

const TYPE_ICON: Record<CreationType, React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>> = {
  message:   MessageSquare,
  analytics: BarChart3,
  pricing:   DollarSign,
  time:      Clock,
  image:     Camera,
  photo:     Camera,
};

const STORAGE_KEYS = {
  firstUseDate: "bizaira_first_credit_use",
  creationsCount: "bizaira_creations_count",
  downloadsCount: "bizaira_downloads_count",
};

const DashboardPage = () => {
  const { t, lang } = useI18n();
  const { user, profile } = useAuth();
  const isHe = lang === "he";

  const userName = user?.user_metadata?.full_name || (isHe ? "אורח" : "Guest");
  const creditsUsed = profile?.credits_used ?? 0;
  const creditsTotal = profile?.credits_total ?? 5;
  const creditsLeft = creditsTotal - creditsUsed;
  const creditPct = creditsTotal > 0 ? Math.round((creditsLeft / creditsTotal) * 100) : 0;

  const [firstUseDate, setFirstUseDate] = useState<string | null>(null);
  const [creationsCount, setCreationsCount] = useState(0);
  const [downloadsCount, setDownloadsCount] = useState(0);
  const [creations, setCreations] = useState<Creation[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "archive">("overview");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const refreshData = useCallback(() => {
    const storedFirstUse = localStorage.getItem(STORAGE_KEYS.firstUseDate);
    const storedCreations = localStorage.getItem(STORAGE_KEYS.creationsCount);
    const storedDownloads = localStorage.getItem(STORAGE_KEYS.downloadsCount);
    if (storedFirstUse) setFirstUseDate(storedFirstUse);
    if (storedCreations) setCreationsCount(parseInt(storedCreations, 10) || 0);
    if (storedDownloads) setDownloadsCount(parseInt(storedDownloads, 10) || 0);
    setCreations(loadCreations());
  }, []);

  useEffect(() => {
    refreshData();
    const handler = () => refreshData();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [refreshData]);

  const getNextRenewalDate = () => {
    if (!firstUseDate) return isHe ? "טרם נעשה שימוש" : "No usage yet";
    const first = new Date(firstUseDate);
    const next = new Date(first);
    next.setMonth(next.getMonth() + 1);
    return next.toLocaleDateString(isHe ? "he-IL" : "en-US");
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(isHe ? "he-IL" : "en-US", {
      day: "numeric", month: "short",
    });

  const formatFirstUseDate = () => {
    if (!firstUseDate) return isHe ? "טרם נעשה שימוש" : "No usage yet";
    return new Date(firstUseDate).toLocaleDateString(isHe ? "he-IL" : "en-US");
  };

  const Arrow = isHe ? ChevronLeft : ChevronRight;

  const handleCopyCreation = (c: Creation) => {
    navigator.clipboard.writeText(c.content);
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadCreation = (c: Creation) => {
    const blob = new Blob([c.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
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
    { to: "/create", icon: Wand2, label: t("dash.startCreate") },
    { to: "/pricing", icon: CreditCard, label: t("dash.manageSub") },
    { to: "/support", icon: HeadphonesIcon, label: t("dash.supportTitle") },
  ];

  const typeLabel = (type: CreationType) => {
    const labels: Record<CreationType, { he: string; en: string }> = {
      message:   { he: "הודעה",         en: "Message"   },
      analytics: { he: "ניתוח עסקי",   en: "Analytics" },
      pricing:   { he: "תמחור",         en: "Pricing"   },
      time:      { he: "ניהול זמן",     en: "Time Mgmt" },
      image:     { he: "תמונה",         en: "Image"     },
      photo:     { he: "סטודיו",        en: "Photo"     },
    };
    return isHe ? labels[type].he : labels[type].en;
  };

  return (
    <div className="pb-6 max-w-lg mx-auto" dir={isHe ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="px-5 pt-8 mb-6 animate-float-up">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
          {isHe ? "שלום" : "Hello"}
        </p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{userName}</h1>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-5 animate-float-up" style={{ animationDelay: "40ms" }}>
        <div className="flex gap-1 p-1 bg-muted rounded-xl">
          {[
            { key: "overview", he: "סקירה", en: "Overview" },
            { key: "archive",  he: `ארכיון (${creations.length})`, en: `Archive (${creations.length})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as "overview" | "archive")}
              className="flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200"
              style={{
                background: activeTab === tab.key ? "hsl(0 0% 100%)" : "transparent",
                color: activeTab === tab.key ? "hsl(210 100% 12%)" : "hsl(0 0% 44%)",
                boxShadow: activeTab === tab.key ? "0 1px 4px hsl(0 0% 0% / 0.08)" : "none",
              }}
            >
              {isHe ? tab.he : tab.en}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="px-5 space-y-5">
          {/* Credits card */}
          <div className="glass-card rounded-2xl p-5 space-y-4 animate-float-up" style={{ animationDelay: "60ms" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">{t("dash.plan")}</p>
                <div className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-primary" strokeWidth={1.5} />
                  <span className="text-sm font-bold text-foreground">Free</span>
                </div>
              </div>
              <Link
                to="/pricing"
                className="gradient-glow glow-shadow text-white text-xs font-semibold px-4 py-2 rounded-xl hover:scale-105 transition-transform"
                style={{ color: "hsl(39 48% 90%)" }}
              >
                {t("dash.upgrade")}
              </Link>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t("dash.credits")}</span>
                <span className="font-semibold text-foreground">{creditsLeft} / {creditsTotal}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full gradient-glow rounded-full transition-all duration-700" style={{ width: `${creditPct}%` }} />
              </div>
              <p className="text-[11px] text-muted-foreground">
                {creditPct}% {isHe ? "קרדיטים נותרים" : "credits remaining"}
              </p>
            </div>
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar size={11} strokeWidth={1.5} />
                  {isHe ? "שימוש ראשון:" : "First Use:"}
                </span>
                <span className="font-medium text-foreground">{formatFirstUseDate()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar size={11} strokeWidth={1.5} />
                  {isHe ? "חידוש הבא:" : "Next Renewal:"}
                </span>
                <span className="font-medium text-foreground">{getNextRenewalDate()}</span>
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="glass-card rounded-2xl p-5 animate-float-up" style={{ animationDelay: "120ms" }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={15} strokeWidth={1.5} className="text-primary" />
              <span className="text-sm font-semibold text-foreground">{t("dash.activity")}</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <PenTool size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  {t("dash.creations")}
                </span>
                <span className="text-sm font-semibold text-foreground">{creationsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Download size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  {t("dash.downloads")}
                </span>
                <span className="font-semibold text-foreground text-sm">{downloadsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Archive size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  {isHe ? "שמורות בארכיון" : "Saved in archive"}
                </span>
                <span className="font-semibold text-foreground text-sm">{creations.length}</span>
              </div>
            </div>
          </div>

          {/* Recent creations preview */}
          {creations.length > 0 && (
            <div className="animate-float-up" style={{ animationDelay: "150ms" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {isHe ? "יצירות אחרונות" : "Recent Creations"}
                </p>
                <button
                  onClick={() => setActiveTab("archive")}
                  className="text-xs text-primary font-semibold"
                >
                  {isHe ? "הצג הכל" : "Show all"}
                </button>
              </div>
              <div className="space-y-2">
                {creations.slice(0, 3).map(c => {
                  const IconComp = TYPE_ICON[c.type];
                  return (
                    <div key={c.id} className="glass-card rounded-xl p-3 flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "hsl(210 100% 12%)" }}
                      >
                        <IconComp size={14} strokeWidth={1.5} style={{ color: "hsl(39 48% 56%)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
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
          <div className="animate-float-up" style={{ animationDelay: "180ms" }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              {t("dash.quickActions")}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl hover:scale-[1.03] transition-all duration-200"
                  style={{
                    background: "hsl(210 100% 12%)",
                    boxShadow: "0 4px 20px -4px hsl(210 100% 12% / 0.35), 0 2px 10px -2px hsl(39 48% 56% / 0.15)",
                  }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-2" style={{ background: "hsl(210 100% 16%)" }}>
                    <Icon size={20} strokeWidth={1.5} style={{ color: "hsl(39 48% 56%)" }} />
                  </div>
                  <p className="text-xs font-bold text-center leading-tight" style={{ color: "hsl(39 48% 56%)" }}>
                    {label}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "archive" && (
        <div className="px-5 space-y-3 animate-fade-in">
          {creations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center opacity-60">
              <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mb-4">
                <Archive size={24} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-bold text-foreground">
                {isHe ? "הארכיון ריק" : "Archive is empty"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
                {isHe
                  ? "כל יצירה שתפיקי תישמר כאן אוטומטית"
                  : "Every creation you make is saved here automatically"}
              </p>
              <Link
                to="/create"
                className="mt-5 gradient-glow text-white text-sm font-bold px-6 py-3 rounded-xl"
                style={{ color: "hsl(39 48% 90%)" }}
              >
                {isHe ? "התחל ליצור" : "Start Creating"}
              </Link>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-1">
                {isHe
                  ? `${creations.length} יצירות שמורות`
                  : `${creations.length} saved creations`}
              </p>
              {creations.map(c => {
                const IconComp = TYPE_ICON[c.type];
                const isCopied = copiedId === c.id;
                return (
                  <div key={c.id} className="glass-card rounded-xl p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "hsl(210 100% 12%)" }}
                      >
                        <IconComp size={15} strokeWidth={1.5} style={{ color: "hsl(39 48% 56%)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
                            {typeLabel(c.type)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{formatDate(c.createdAt)}</span>
                        </div>
                        <p className="text-xs font-semibold text-foreground mt-0.5 truncate">{c.title}</p>
                      </div>
                    </div>

                    <div className="bg-background/60 rounded-lg p-3 mb-3 border border-border/30">
                      <p className="text-xs text-foreground leading-relaxed line-clamp-4 whitespace-pre-wrap">
                        {c.content}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopyCreation(c)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-semibold transition-all"
                        style={{
                          background: isCopied ? "hsl(142 60% 94%)" : "hsl(0 0% 96%)",
                          color: isCopied ? "hsl(142 60% 30%)" : "hsl(210 100% 12%)",
                        }}
                      >
                        {isCopied
                          ? <><Check size={12} />{isHe ? "הועתק" : "Copied"}</>
                          : <><Copy size={12} />{isHe ? "העתק" : "Copy"}</>}
                      </button>
                      <button
                        onClick={() => handleDownloadCreation(c)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-semibold transition-all"
                        style={{ background: "hsl(0 0% 96%)", color: "hsl(210 100% 12%)" }}
                      >
                        <Download size={12} />{isHe ? "הורד" : "Download"}
                      </button>
                      <button
                        onClick={() => handleDeleteCreation(c.id)}
                        className="px-3 py-2 rounded-lg transition-all"
                        style={{ background: "hsl(0 84% 97%)", color: "hsl(0 84% 50%)" }}
                      >
                        <Trash2 size={12} />
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
