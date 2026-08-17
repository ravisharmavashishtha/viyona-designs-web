// Analytics Tracking Utility for Viyona Designs (GA4 + Meta Pixel)

export const GA_MEASUREMENT_ID = 'G-R2FR44J83H';
export const META_PIXEL_ID = '2533819650389389';

/**
 * Initialize Google Analytics script dynamically
 */
export const initGA = (measurementId = GA_MEASUREMENT_ID) => {
  if (typeof window === 'undefined' || !measurementId || measurementId === 'G-XXXXXXXXXX') return;

  if (!document.getElementById('ga4-script')) {
    const script = document.createElement('script');
    script.id = 'ga4-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', measurementId, {
      send_page_view: false, // Handled dynamically in SPA by AnalyticsTracker
    });
  }
};

/**
 * Track Page Views on SPA route change (GA4 + Meta Pixel)
 */
export const trackPageView = (path, title) => {
  if (typeof window !== 'undefined') {
    // GA4
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title || document.title,
        page_location: window.location.href,
      });
    }
    // Meta Pixel
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }
};

/**
 * Track Custom Events in GA4
 */
export const trackEvent = (action, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params);
  } else if (import.meta.env.DEV) {
    console.log(`[GA4 Event] ${action}`, params);
  }
};

/**
 * Track Meta Pixel Events (e.g. ViewContent, InitiateCheckout, Search)
 */
export const trackMetaEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  } else if (import.meta.env.DEV) {
    console.log(`[Meta Pixel Event] ${eventName}`, params);
  }
};

