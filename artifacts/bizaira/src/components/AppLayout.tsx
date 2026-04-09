import { ReactNode, useState } from "react";
import BottomNav from "./BottomNav";
import CookieSettings from "./CookieSettings";
import { LanguageToggle } from "@/lib/i18n";
import { Link } from "react-router-dom";
import { Menu, X, Home, Wand2, User, HelpCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { to: "/", icon: Home, label: t("nav.home") },
    { to: "/create", icon: Wand2, label: t("nav.create") },
    { to: "/dashboard", icon: User, label: t("nav.dashboard") },
    { to: "/support", icon: HelpCircle, label: t("nav.support") },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50"
      >
        דלג לתוכן העיקרי / Skip to main content
      </a>

      {/* Mobile hamburger menu */}
      <div className="lg:hidden fixed top-3 right-3 z-50">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-2 shadow-sm"
          aria-label={menuOpen ? "סגור תפריט" : "פתח תפריט"}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile side menu */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={closeMenu}>
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">תפריט</h2>
                <button onClick={closeMenu} className="p-1">
                  <X size={20} />
                </button>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeMenu}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Language toggle — floating top corner */}
      <div className="fixed top-3 left-3 z-50">
        <LanguageToggle />
      </div>
      <main id="main-content" className="flex-1 pb-20">{children}</main>
      <footer className="bg-white border-t border-gray-100 py-2 px-4 text-center">
        <div className="flex justify-center items-center gap-4">
          <Link to="/accessibility" className="text-xs text-gray-500 hover:text-gray-700">
            הצהרת נגישות
          </Link>
          <CookieSettings />
        </div>
      </footer>
      <BottomNav />
    </div>
  );
};

export default Layout;
