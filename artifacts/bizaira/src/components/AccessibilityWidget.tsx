import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Accessibility, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const ACCESSIBILITY_KEY = 'accessibilitySettings';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  highlightLinks: boolean;
  readableFont: boolean;
  stopAnimations: boolean;
  grayscale: boolean;
  lineHeight: number;
  letterSpacing: number;
  nightMode: boolean;
  hideWidget: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 1,
  highContrast: false,
  highlightLinks: false,
  readableFont: false,
  stopAnimations: false,
  grayscale: false,
  lineHeight: 1,
  letterSpacing: 1,
  nightMode: false,
  hideWidget: false,
};

const AccessibilityWidget = () => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  useEffect(() => {
    const stored = localStorage.getItem(ACCESSIBILITY_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setSettings({ ...defaultSettings, ...parsed });
      applySettings({ ...defaultSettings, ...parsed });
    }
  }, []);

  const applySettings = (newSettings: AccessibilitySettings) => {
    document.documentElement.style.setProperty('--font-size-multiplier', newSettings.fontSize.toString());
    document.documentElement.style.setProperty('--line-height-multiplier', newSettings.lineHeight.toString());
    document.documentElement.style.setProperty('--letter-spacing-multiplier', (newSettings.letterSpacing - 1).toString());

    document.body.classList.toggle('accessibility-high-contrast', newSettings.highContrast);
    document.body.classList.toggle('accessibility-highlight-links', newSettings.highlightLinks);
    document.body.classList.toggle('accessibility-readable-font', newSettings.readableFont);
    document.body.classList.toggle('accessibility-stop-animations', newSettings.stopAnimations);
    document.body.classList.toggle('accessibility-grayscale', newSettings.grayscale);
    document.body.classList.toggle('accessibility-night-mode', newSettings.nightMode);
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
    localStorage.setItem(ACCESSIBILITY_KEY, JSON.stringify(newSettings));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    localStorage.setItem(ACCESSIBILITY_KEY, JSON.stringify(defaultSettings));
  };

  if (settings.hideWidget) return null;

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 bg-primary hover:bg-primary/90"
        onClick={() => setOpen(true)}
        aria-label={t('accessibility.widget', 'תפריט נגישות / Accessibility Menu')}
      >
        <Accessibility size={20} />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('accessibility.title', 'הגדרות נגישות / Accessibility Settings')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Font Size */}
            <div>
              <label className="text-sm font-medium">{t('accessibility.fontSize', 'גודל טקסט / Font Size')}</label>
              <div className="flex items-center gap-2 mt-2">
                <Button onClick={() => updateSetting('fontSize', Math.max(0.8, settings.fontSize - 0.1))}>-</Button>
                <span className="flex-1 text-center">{Math.round(settings.fontSize * 100)}%</span>
                <Button onClick={() => updateSetting('fontSize', Math.min(2, settings.fontSize + 0.1))}>+</Button>
              </div>
            </div>

            {/* Line Height */}
            <div>
              <label className="text-sm font-medium">{t('accessibility.lineHeight', 'גובה שורות / Line Height')}</label>
              <Slider
                value={[settings.lineHeight]}
                onValueChange={([value]) => updateSetting('lineHeight', value)}
                min={1}
                max={2}
                step={0.1}
                className="mt-2"
              />
            </div>

            {/* Letter Spacing */}
            <div>
              <label className="text-sm font-medium">{t('accessibility.letterSpacing', 'רווח אותיות / Letter Spacing')}</label>
              <Slider
                value={[settings.letterSpacing]}
                onValueChange={([value]) => updateSetting('letterSpacing', value)}
                min={1}
                max={2}
                step={0.1}
                className="mt-2"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">{t('accessibility.highContrast', 'ניגודיות גבוהה / High Contrast')}</label>
                <Switch checked={settings.highContrast} onCheckedChange={(checked) => updateSetting('highContrast', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">{t('accessibility.highlightLinks', 'הדגשת קישורים / Highlight Links')}</label>
                <Switch checked={settings.highlightLinks} onCheckedChange={(checked) => updateSetting('highlightLinks', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">{t('accessibility.readableFont', 'גופן קריא / Readable Font')}</label>
                <Switch checked={settings.readableFont} onCheckedChange={(checked) => updateSetting('readableFont', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">{t('accessibility.stopAnimations', 'עצירת אנימציות / Stop Animations')}</label>
                <Switch checked={settings.stopAnimations} onCheckedChange={(checked) => updateSetting('stopAnimations', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">{t('accessibility.grayscale', 'גווני אפור / Grayscale')}</label>
                <Switch checked={settings.grayscale} onCheckedChange={(checked) => updateSetting('grayscale', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">{t('accessibility.nightMode', 'מצב לילה / Night Mode')}</label>
                <Switch checked={settings.nightMode} onCheckedChange={(checked) => updateSetting('nightMode', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">{t('accessibility.hideWidget', 'הסתר ווידג\'ט / Hide Widget')}</label>
                <Switch checked={settings.hideWidget} onCheckedChange={(checked) => updateSetting('hideWidget', checked)} />
              </div>
            </div>

            <Button onClick={resetSettings} variant="outline" className="w-full">
              {t('accessibility.reset', 'איפוס הגדרות / Reset Settings')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccessibilityWidget;