import { useState } from "react";
import { Send, ChevronDown, ChevronUp, MessageCircle, HelpCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const NAVY   = "#0D2344";
const PURPLE = "#0D2344";

const SupportPage = () => {
  const { t, lang } = useI18n();
  const isHe = lang === "he";
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent]       = useState(false);

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
  ];

  const handleSend = () => {
    if (!name || !email || !message) return;
    setSent(true);
    setName(""); setEmail(""); setMessage("");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="px-5 pt-8 pb-28 max-w-xl mx-auto" dir={isHe ? "rtl" : "ltr"}>

      {/* Header */}
      <div className="mb-8 animate-float-up">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
          {isHe ? "מרכז עזרה" : "Help Center"}
        </p>
        <h1 className="text-2xl font-black mb-2" style={{ color: NAVY }}>
          {t("support.title")}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("support.subtitle")}
        </p>
      </div>

      {/* ── FAQ Accordion ── */}
      <section className="mb-10 animate-float-up" style={{ animationDelay: "60ms" }}>
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "hsl(252 73% 96%)" }}
          >
            <HelpCircle size={15} strokeWidth={1.5} style={{ color: PURPLE }} />
          </div>
          <h2 className="text-base font-bold" style={{ color: NAVY }}>
            {t("support.faq")}
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="glass-card rounded-2xl overflow-hidden transition-all duration-200"
                style={{ borderColor: isOpen ? "hsl(252 73% 60% / 0.3)" : undefined }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-4 text-start"
                >
                  <span
                    className="font-semibold text-sm leading-snug flex-1"
                    style={{ color: NAVY }}
                  >
                    {faq.q}
                  </span>
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ms-3 transition-all duration-200"
                    style={{ background: isOpen ? "hsl(252 73% 96%)" : "hsl(220 18% 95%)" }}
                  >
                    {isOpen
                      ? <ChevronUp   size={14} strokeWidth={2} style={{ color: PURPLE }} />
                      : <ChevronDown size={14} strokeWidth={2} className="text-muted-foreground" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 animate-fade-in">
                    <div className="h-px bg-border mb-3" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section className="animate-float-up" style={{ animationDelay: "120ms" }}>
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "hsl(252 73% 96%)" }}
          >
            <MessageCircle size={15} strokeWidth={1.5} style={{ color: PURPLE }} />
          </div>
          <h2 className="text-base font-bold" style={{ color: NAVY }}>
            {t("support.contact")}
          </h2>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground block">
              {t("support.name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={isHe ? "השם שלך" : "Your name"}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground block">
              {t("support.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              dir="ltr"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground block">
              {t("support.message")}
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={isHe ? "כתוב את הפנייה שלך כאן..." : "Write your message here..."}
              rows={4}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
            />
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!name || !email || !message}
            className="w-full gradient-glow glow-shadow text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Send size={16} />
            {sent
              ? (isHe ? "נשלח! ✓" : "Sent! ✓")
              : t("support.send")}
          </button>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
