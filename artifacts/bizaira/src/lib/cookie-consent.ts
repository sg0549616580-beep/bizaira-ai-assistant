export interface CookieConsent {
  analytics: boolean;
  marketing: boolean;
}

export const COOKIE_CONSENT_KEY = 'cookieConsent';

export const getCookieConsent = (): CookieConsent | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const setCookieConsent = (consent: CookieConsent) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
};

export const loadScript = (src: string, id?: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id || src)) {
      resolve(); // Already loaded
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    if (id) script.id = id;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

export const loadGoogleAnalytics = async (measurementId: string) => {
  try {
    await loadScript(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`, 'ga-script');
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) { (window as any).dataLayer.push(args); }
    gtag('js', new Date());
    gtag('config', measurementId);
  } catch (error) {
    console.error('Failed to load Google Analytics:', error);
  }
};

export const loadMetaPixel = async (pixelId: string) => {
  try {
    await loadScript(`https://connect.facebook.net/en_US/fbevents.js`, 'meta-pixel-script');
    (window as any).fbq = (window as any).fbq || function() {
      (window as any).fbq.callMethod ? (window as any).fbq.callMethod.apply(window as any.fbq, arguments) : (window as any).fbq.queue.push(arguments);
    };
    (window as any).fbq.push = (window as any).fbq;
    (window as any).fbq.loaded = true;
    (window as any).fbq.version = '2.0';
    (window as any).fbq.queue = [];
    (window as any).fbq('init', pixelId);
    (window as any).fbq('track', 'PageView');
  } catch (error) {
    console.error('Failed to load Meta Pixel:', error);
  }
};

export const loadGoogleTagManager = async (gtmId: string) => {
  try {
    await loadScript(`https://www.googletagmanager.com/gtm.js?id=${gtmId}`, 'gtm-script');
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });
  } catch (error) {
    console.error('Failed to load Google Tag Manager:', error);
  }
};

export const loadHotjar = async (hjid: string, hjsv: string) => {
  try {
    await loadScript(`https://static.hotjar.com/c/hotjar-${hjid}.js?sv=${hjsv}`, 'hotjar-script');
  } catch (error) {
    console.error('Failed to load Hotjar:', error);
  }
};

// Function to load all tracking scripts based on consent
export const loadTrackingScripts = async (consent: CookieConsent) => {
  // Load analytics if consented
  if (consent.analytics) {
    // Replace with actual IDs
    await loadGoogleAnalytics('GA_MEASUREMENT_ID');
    await loadHotjar('HJID', 'HJSV');
  }

  // Load marketing if consented
  if (consent.marketing) {
    await loadMetaPixel('PIXEL_ID');
    await loadGoogleTagManager('GTM_ID');
  }
};