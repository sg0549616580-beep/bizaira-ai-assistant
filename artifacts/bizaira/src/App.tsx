import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import CookieConsentPopup from "@/components/CookieConsentPopup";
import LandingPage from "./pages/LandingPage";
import CreatePage from "./pages/CreatePage";
import JournalPage from "./pages/JournalPage";

import ProductPhotoStudioPage from "./pages/ProductPhotoStudioPage";
import AIMessagesPage from "./pages/AIMessagesPage";
import BusinessAnalyticsPage from "./pages/BusinessAnalyticsPage";
import TimeOptimizerPage from "./pages/TimeOptimizerPage";
import PricingStrategistPage from "./pages/PricingStrategistPage";
import ImageStudioPage from "./pages/ImageStudioPage";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import PricingPage from "./pages/PricingPage";
import SupportPage from "./pages/SupportPage";
import VideoStudioPage from "./pages/VideoStudioPage";
import NotFound from "./pages/NotFound";
import AccessibilityStatement from "./pages/AccessibilityStatement";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminPagesPage from "./pages/admin/AdminPagesPage";
import AdminMediaPage from "./pages/admin/AdminMediaPage";
import AdminComponentsPage from "./pages/admin/AdminComponentsPage";
import AdminAIPage from "./pages/admin/AdminAIPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

import { CookieConsent, getCookieConsent, loadTrackingScripts } from "@/lib/cookie-consent";
import AccessibilityWidget from "@/components/AccessibilityWidget";

const queryClient = new QueryClient();

const App = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) {
      setShowConsent(true);
    } else {
      loadTrackingScripts(consent);
    }
  }, []);

  const handleConsent = (consent: CookieConsent) => {
    setShowConsent(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <I18nProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />

                <Route path="/admin/pages" element={<AdminLayout><AdminPagesPage /></AdminLayout>} />
                <Route path="/admin/media" element={<AdminLayout><AdminMediaPage /></AdminLayout>} />
                <Route path="/admin/components" element={<AdminLayout><AdminComponentsPage /></AdminLayout>} />
                <Route path="/admin/ai" element={<AdminLayout><AdminAIPage /></AdminLayout>} />
                <Route path="/admin/users" element={<AdminLayout><AdminUsersPage /></AdminLayout>} />
                <Route path="/admin/settings" element={<AdminLayout><AdminSettingsPage /></AdminLayout>} />

                <Route path="/" element={<AppLayout><LandingPage /></AppLayout>} />
                <Route path="/create" element={<AppLayout><CreatePage /></AppLayout>} />
                <Route path="/journal" element={<AppLayout><JournalPage /></AppLayout>} />
                
                <Route path="/create/product-photos" element={<AppLayout><ProductPhotoStudioPage /></AppLayout>} />
                <Route path="/create/messages" element={<AppLayout><AIMessagesPage /></AppLayout>} />
                <Route path="/create/analytics" element={<AppLayout><BusinessAnalyticsPage /></AppLayout>} />
                <Route path="/create/time" element={<AppLayout><TimeOptimizerPage /></AppLayout>} />
                <Route path="/create/pricing" element={<AppLayout><PricingStrategistPage /></AppLayout>} />
                <Route path="/create/image-studio" element={<AppLayout><ImageStudioPage /></AppLayout>} />
                <Route path="/create/video" element={<AppLayout><VideoStudioPage /></AppLayout>} />
                <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
                <Route path="/pricing" element={<AppLayout><PricingPage /></AppLayout>} />
                <Route path="/support" element={<AppLayout><SupportPage /></AppLayout>} />
              <Route path="/accessibility" element={<AppLayout><AccessibilityStatement /></AppLayout>} />
              <Route path="/privacy" element={<AppLayout><PrivacyPolicy /></AppLayout>} />
              <Route path="/terms" element={<AppLayout><TermsOfUse /></AppLayout>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              {showConsent && <CookieConsentPopup onConsent={handleConsent} />}
            </BrowserRouter>
          </AuthProvider>
        </I18nProvider>
      </TooltipProvider>
      <AccessibilityWidget />
    </QueryClientProvider>
  );
};

export default App;
