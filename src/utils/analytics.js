// Analytics Tracking Utility for Viyona Designs (GA4 + Meta Pixel)

export const GA_MEASUREMENT_ID = 'G-R2FR44J83H';
export const META_PIXEL_ID = '2533819650389389';

// Extract test_event_code if user is testing inside Meta Events Manager
const getTestEventCode = () => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const code = params.get('test_event_code') || params.get('_fb_test_code') || params.get('fb_test_code');
  if (code) {
    try {
      sessionStorage.setItem('meta_test_event_code', code);
    } catch (e) {}
    return code;
  }
  try {
    return sessionStorage.getItem('meta_test_event_code');
  } catch (e) {
    return null;
  }
};

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
    trackMetaEvent('PageView');
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
 * Track Meta Pixel Events (e.g. ViewContent, InitiateCheckout, PageView)
 * Uses both standard fbq() and direct image beacon fallback for 100% deliverability
 */
export const trackMetaEvent = (eventName, params = {}) => {
  if (typeof window === 'undefined') return;

  initMetaPixel();

  const testCode = getTestEventCode();
  const options = testCode ? { test_event_code: testCode } : undefined;

  // 1. Standard Meta Pixel SDK Dispatch
  if (window.fbq) {
    if (options) {
      window.fbq('track', eventName, params, options);
    } else {
      window.fbq('track', eventName, params);
    }
  }

  // 2. Direct Fallback Beacon to Facebook Collection Server
  try {
    const beaconParams = new URLSearchParams({
      id: META_PIXEL_ID,
      ev: eventName,
      dl: window.location.href,
      rl: document.referrer || '',
      if: 'false',
      ts: String(Date.now()),
      v: '2.9.150',
      r: 'stable',
      noscript: '1',
    });

    if (testCode) {
      beaconParams.append('test_event_code', testCode);
    }

    if (params.content_name) beaconParams.append('cd[content_name]', params.content_name);
    if (params.content_ids) beaconParams.append('cd[content_ids]', JSON.stringify(params.content_ids));
    if (params.content_type) beaconParams.append('cd[content_type]', params.content_type);
    if (params.value) beaconParams.append('cd[value]', String(params.value));
    if (params.currency) beaconParams.append('cd[currency]', params.currency);

    const beaconUrl = `https://www.facebook.com/tr/?${beaconParams.toString()}`;
    const img = new Image();
    img.src = beaconUrl;
  } catch (err) {
    // Fail silently in production
  }

  if (import.meta.env.DEV) {
    console.log(`[Meta Pixel Event: ${eventName}]`, params, options || '');
  }
};


