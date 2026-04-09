import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useI18n } from '@/lib/i18n';
import { CookieConsent, setCookieConsent, loadTrackingScripts } from '@/lib/cookie-consent';

interface CookieConsentPopupProps {
  onConsent: (consent: CookieConsent) => void;
}

const CookieConsentPopup = ({ onConsent }: CookieConsentPopupProps) => {
  const { t } = useI18n();
  const [showCustomize, setShowCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const handleAcceptAll = () => {
    const consent: CookieConsent = { analytics: true, marketing: true };
    setCookieConsent(consent);
    loadTrackingScripts(consent);
    onConsent(consent);
  };

  const handleRejectNonEssential = () => {
    const consent: CookieConsent = { analytics: false, marketing: false };
    setCookieConsent(consent);
    onConsent(consent);
  };

  const handleCustomize = () => {
    setShowCustomize(true);
  };

  const handleSaveCustom = () => {
    const consent: CookieConsent = { analytics, marketing };
    setCookieConsent(consent);
    loadTrackingScripts(consent);
    onConsent(consent);
    setShowCustomize(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md mx-auto">
      <div className="text-sm text-gray-700 mb-4">
        {t('cookie.consent.message', 'We use cookies to enhance your experience. Please choose your preferences.')}
      </div>
      <div className="flex flex-col gap-2">
        <Button onClick={handleAcceptAll} className="w-full">
          {t('cookie.consent.acceptAll', 'Accept All')}
        </Button>
        <Button onClick={handleRejectNonEssential} variant="outline" className="w-full">
          {t('cookie.consent.rejectNonEssential', 'Reject Non-Essential')}
        </Button>
        <Button onClick={handleCustomize} variant="ghost" className="w-full">
          {t('cookie.consent.customize', 'Customize')}
        </Button>
      </div>

      <Dialog open={showCustomize} onOpenChange={setShowCustomize}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('cookie.consent.customizeTitle', 'Cookie Preferences')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="analytics"
                checked={analytics}
                onCheckedChange={(checked) => setAnalytics(!!checked)}
              />
              <label htmlFor="analytics" className="text-sm">
                {t('cookie.consent.analytics', 'Analytics cookies (Google Analytics, Hotjar)')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="marketing"
                checked={marketing}
                onCheckedChange={(checked) => setMarketing(!!checked)}
              />
              <label htmlFor="marketing" className="text-sm">
                {t('cookie.consent.marketing', 'Marketing cookies (Meta Pixel, Google Tag Manager)')}
              </label>
            </div>
            <p className="text-xs text-gray-500">
              {t('cookie.consent.strictlyNecessary', 'Strictly necessary cookies are always enabled for authentication and security.')}
            </p>
          </div>
          <Button onClick={handleSaveCustom} className="w-full">
            {t('cookie.consent.save', 'Save Preferences')}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CookieConsentPopup;