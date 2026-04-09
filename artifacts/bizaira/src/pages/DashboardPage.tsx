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

const NAVY         = "hsl(var(--luxury-navy))";
const PURPLE       = "hsl(var(--luxury-navy))";
const PURPLE_LIGHT = "hsl(var(--luxury-gray-100))";

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
    <div className="min-h-screen bg-gradient-to-br from-luxury-gray-50 to-luxury-white pb-12" dir={isHe ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto px-6 pt-12">

        {/* Header */}
        <div className="mb-16 animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="luxury-caption mb-2 text-luxury-gray-500">
                {isHe ? "שלום," : "Welcome back,"}
              </p>
              <h1 className="luxury-heading-1 text-luxury-black">
                {userName}
              </h1>
              <p className="luxury-body mt-3 text-luxury-gray-600 max-w-md">
                {isHe ? "הנה סקירה של הפעילות והיצירות שלך" : "Here's an overview of your activity and creations"}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 luxury-glass rounded-2xl flex items-center justify-center">
                <Sparkles size={32} className="text-luxury-navy" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex gap-2 p-2 luxury-glass rounded-xl max-w-md">
            {[
              { key: "overview", he: "סקירה כללית", en: "Overview" },
              { key: "archive",  he: `ארכיון (${creations.length})`, en: `Archive (${creations.length})` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "overview" | "archive")}
                className={`flex-1 py-3 px-6 luxury-transition rounded-lg luxury-body-small font-medium ${
                  activeTab === tab.key
                    ? "luxury-gold-accent text-white shadow-lg"
                    : "text-luxury-gray-600 hover:text-luxury-black hover:bg-luxury-gray-100"
                }`}
              >
                {isHe ? tab.he : tab.en}
              </button>
            ))}
          </div>
        </div>

      {/* ─── Overview tab ─── */}
      {activeTab === "overview" && (
        <div className="space-y-8">

          {/* Credits card */}
          <div className="luxury-card rounded-xl p-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 luxury-glass rounded-lg flex items-center justify-center">
                    <Sparkles size={20} className="text-luxury-navy" />
                  </div>
                  <div>
                    <p className="luxury-caption text-luxury-gray-500 mb-1">
                      {t("dash.plan")}
                    </p>
                    <p className="luxury-body font-semibold text-luxury-black">
                      Free Plan
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="luxury-body-small text-luxury-gray-600">{t("dash.credits")}</span>
                    <span className="luxury-body font-semibold text-luxury-black">{creditsLeft} / {creditsTotal}</span>
                  </div>
                  <div className="h-2 bg-luxury-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full luxury-gold-accent rounded-full luxury-transition"
                      style={{ width: `${creditPct}%` }}
                    />
                  </div>
                  <p className="luxury-caption text-luxury-gray-500">
                    {creditPct}% {isHe ? "קרדיטים נותרים" : "credits remaining"}
                  </p>
                </div>
              </div>

              <Link
                to="/pricing"
                className="luxury-gold-accent text-white px-6 py-3 rounded-lg font-medium hover:shadow-xl luxury-transition luxury-hover-lift"
              >
                {t("dash.upgrade")}
              </Link>
            </div>

            <div className="border-t border-luxury-gray-200 pt-6 mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="luxury-body-small text-luxury-gray-600 flex items-center gap-2">
                  <Calendar size={14} />
                  {isHe ? "שימוש ראשון:" : "First Use:"}
                </span>
                <span className="luxury-body-small font-medium text-luxury-black">{formatFirstUseDate()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="luxury-body-small text-luxury-gray-600 flex items-center gap-2">
                  <Calendar size={14} />
                  {isHe ? "חידוש הבא:" : "Next Renewal:"}
                </span>
                <span className="luxury-body-small font-medium text-luxury-black">{getNextRenewalDate()}</span>
              </div>
            </div>
          </div>

          {/* Activity stats */}
          <div className="luxury-card rounded-xl p-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 luxury-glass rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-luxury-navy" />
              </div>
              <div>
                <h3 className="luxury-heading-3 text-luxury-black">{t("dash.activity")}</h3>
                <p className="luxury-body-small text-luxury-gray-500 mt-1">
                  {isHe ? "הפעילות שלך החודש" : "Your activity this month"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: PenTool,  label: t("dash.creations"), val: creationsCount, desc: isHe ? "יצירות שנוצרו" : "creations made" },
                { icon: Download, label: t("dash.downloads"),  val: downloadsCount, desc: isHe ? "הורדות" : "downloads" },
                { icon: Archive,  label: isHe ? "בארכיון" : "In archive", val: creations.length, desc: isHe ? "שמורות" : "saved" },
              ].map(({ icon: Icon, label, val, desc }) => (
                <div key={label} className="text-center p-4 luxury-glass rounded-lg">
                  <div className="w-12 h-12 mx-auto mb-3 luxury-glass rounded-lg flex items-center justify-center">
                    <Icon size={20} className="text-luxury-navy" />
                  </div>
                  <div className="text-2xl font-bold text-luxury-black mb-1">{val}</div>
                  <div className="luxury-body-small text-luxury-gray-600">{label}</div>
                  <div className="luxury-caption text-luxury-gray-500 mt-1">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent creations preview */}
          {creations.length > 0 && (
            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="luxury-heading-3 text-luxury-black">
                    {isHe ? "יצירות אחרונות" : "Recent Creations"}
                  </h3>
                  <p className="luxury-body-small text-luxury-gray-500 mt-1">
                    {isHe ? "היצירות האחרונות שלך" : "Your latest creations"}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("archive")}
                  className="luxury-body-small text-luxury-navy hover:text-luxury-gold font-medium luxury-transition"
                >
                  {isHe ? "צפה בהכל" : "View all"} {Arrow}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {creations.slice(0, 3).map(c => {
                  const IconComp = TYPE_ICON[c.type];
                  return (
                    <div key={c.id} className="luxury-card rounded-lg p-4 luxury-hover-lift">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 luxury-glass rounded-lg flex items-center justify-center shrink-0">
                          <IconComp size={14} className="text-luxury-navy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="luxury-caption text-luxury-gray-500">
                              {typeLabel(c.type)}
                            </span>
                            <span className="luxury-caption text-luxury-gray-400">{formatDate(c.createdAt)}</span>
                          </div>
                          <p className="luxury-body-small text-luxury-black font-medium truncate">{c.title}</p>
                        </div>
                      </div>
                      <p className="luxury-body-small text-luxury-gray-600 leading-relaxed line-clamp-3">
                        {c.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="mb-6">
              <h3 className="luxury-heading-3 text-luxury-black">
                {t("dash.quickActions")}
              </h3>
              <p className="luxury-body-small text-luxury-gray-500 mt-1">
                {isHe ? "פעולות נפוצות" : "Common actions"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="luxury-card rounded-lg p-6 text-center luxury-hover-lift group"
                >
                  <div className="w-12 h-12 mx-auto mb-4 luxury-glass rounded-lg flex items-center justify-center group-hover:scale-110 luxury-transition">
                    <Icon size={20} className="text-luxury-navy" />
                  </div>
                  <p className="luxury-body-small font-medium text-luxury-black">
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
        <div className="space-y-6 animate-fade-in">
          {creations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 luxury-glass rounded-2xl flex items-center justify-center mb-6">
                <Archive size={32} className="text-luxury-gray-400" />
              </div>
              <h3 className="luxury-heading-3 text-luxury-black mb-2">
                {isHe ? "הארכיון ריק" : "Archive is empty"}
              </h3>
              <p className="luxury-body text-luxury-gray-600 mb-8 max-w-md">
                {isHe
                  ? "כל יצירה שתפיקי תישמר כאן אוטומטית"
                  : "Every creation you make is saved here automatically"}
              </p>
              <Link
                to="/create"
                className="luxury-gold-accent text-white px-8 py-4 rounded-lg font-medium hover:shadow-xl luxury-transition luxury-hover-lift"
              >
                {isHe ? "התחל ליצור" : "Start Creating"}
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="luxury-body-small text-luxury-gray-500">
                  {isHe ? `${creations.length} יצירות שמורות` : `${creations.length} saved creations`}
                </p>
              </div>
              <div className="space-y-4">
                {creations.map(c => {
                  const IconComp = TYPE_ICON[c.type];
                  const isCopied = copiedId === c.id;
                  return (
                    <div key={c.id} className="luxury-card rounded-lg p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 luxury-glass rounded-lg flex items-center justify-center shrink-0">
                          <IconComp size={18} className="text-luxury-navy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="luxury-caption text-luxury-gray-500">
                              {typeLabel(c.type)}
                            </span>
                            <span className="luxury-caption text-luxury-gray-400">{formatDate(c.createdAt)}</span>
                          </div>
                          <p className="luxury-body font-medium text-luxury-black truncate">{c.title}</p>
                        </div>
                      </div>

                      <div className="bg-luxury-gray-50 rounded-lg p-4 mb-4">
                        <p className="luxury-body-small text-luxury-gray-700 leading-relaxed line-clamp-4 whitespace-pre-wrap">
                          {c.content}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleCopyCreation(c)}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg luxury-body-small font-medium luxury-transition ${
                            isCopied
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "luxury-glass text-luxury-gray-700 hover:text-luxury-black"
                          }`}
                        >
                          {isCopied
                            ? <><Check size={14} />{isHe ? "הועתק" : "Copied"}</>
                            : <><Copy size={14} />{isHe ? "העתק" : "Copy"}</>}
                        </button>
                        <button
                          onClick={() => handleDownloadCreation(c)}
                          className="flex-1 flex items-center justify-center gap-2 py-3 luxury-glass rounded-lg luxury-body-small font-medium text-luxury-gray-700 hover:text-luxury-black luxury-transition"
                        >
                          <Download size={14} />{isHe ? "הורד" : "Download"}
                        </button>
                        <button
                          onClick={() => handleDeleteCreation(c.id)}
                          className="px-4 py-3 luxury-glass rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 luxury-transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default DashboardPage;
