// Analytics Tracking Utility for Viyona Designs (GA4 + Meta Pixel)

export const GA_MEASUREMENT_ID = 'G-R2FR44J83H';
export const META_PIXEL_ID = '2533819650389389';

/**
 * Initialize Meta Pixel script dynamically
 */
export const initMetaPixel = (pixelId = META_PIXEL_ID) => {
  if (typeof window === 'undefined' || !pixelId) return;

  if (!window.fbq) {
    (function(f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  } else if (!window.fbq.loaded) {
    window.fbq('init', pixelId);
  }
};

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

