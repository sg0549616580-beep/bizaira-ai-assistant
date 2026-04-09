import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { CookieConsent, getCookieConsent, setCookieConsent, loadTrackingScripts } from '@/lib/cookie-consent';

const CookieSettings = () => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [consent, setConsentState] = useState<CookieConsent>(getCookieConsent() || { analytics: false, marketing: false });

  const handleSave = () => {
    setCookieConsent(consent);
    loadTrackingScripts(consent);
    setOpen(false);
    // Optionally reload page to ensure scripts are loaded/unloaded properly
    window.location.reload();
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-xs text-gray-500 hover:text-gray-700"
      >
        <Settings size={14} className="mr-1" />
        {t('cookie.settings', 'Cookie Settings')}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('cookie.consent.customizeTitle', 'Cookie Preferences')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="analytics"
                checked={consent.analytics}
                onCheckedChange={(checked) => setConsentState(prev => ({ ...prev, analytics: !!checked }))}
              />
              <label htmlFor="analytics" className="text-sm">
                {t('cookie.consent.analytics', 'Analytics cookies (Google Analytics, Hotjar)')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="marketing"
                checked={consent.marketing}
                onCheckedChange={(checked) => setConsentState(prev => ({ ...prev, marketing: !!checked }))}
              />
              <label htmlFor="marketing" className="text-sm">
                {t('cookie.consent.marketing', 'Marketing cookies (Meta Pixel, Google Tag Manager)')}
              </label>
            </div>
            <p className="text-xs text-gray-500">
              {t('cookie.consent.strictlyNecessary', 'Strictly necessary cookies are always enabled for authentication and security.')}
            </p>
          </div>
          <Button onClick={handleSave} className="w-full">
            {t('cookie.consent.save', 'Save Preferences')}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieSettings;