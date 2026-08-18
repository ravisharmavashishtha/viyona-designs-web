// Comprehensive Analytics Utility for Viyona Designs
// Supports Google Analytics 4 (GA4) + Meta Pixel (react-facebook-pixel + Direct SDK + Image Beacon Fallback)

import ReactPixel from 'react-facebook-pixel';

export const GA_MEASUREMENT_ID = 'G-R2FR44J83H';
export const META_PIXEL_ID = '2533819650389389';

let isPixelInitialized = false;

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
      send_page_view: false, // Handled dynamically in SPA by RouteAnalyticsTracker
    });
  }
};

/**
 * Initialize Meta Pixel via react-facebook-pixel
 */
export const initMetaPixel = (pixelId = META_PIXEL_ID) => {
  if (typeof window === 'undefined' || !pixelId) return;
  if (!isPixelInitialized) {
    try {
      ReactPixel.init(pixelId, {}, {
        autoConfig: true,
        debug: true
      });
      isPixelInitialized = true;
    } catch (e) {
      console.warn('[Meta Pixel Init Notice]', e);
    }
  }
};

/**
 * Direct HTTP Beacon Dispatcher (Guarantees network request directly to Facebook's tracking servers)
 */
const sendMetaBeacon = (eventName, params = {}) => {
  if (typeof window === 'undefined') return;
  try {
    const queryParts = [
      `id=${encodeURIComponent(META_PIXEL_ID)}`,
      `ev=${encodeURIComponent(eventName)}`,
      `dl=${encodeURIComponent(window.location.href)}`,
      `rl=${encodeURIComponent(document.referrer || '')}`,
      `if=false`,
      `ts=${Date.now()}`,
      `v=2.9.150`
    ];

    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          queryParts.push(`cd[${encodeURIComponent(key)}]=${encodeURIComponent(JSON.stringify(val))}`);
        } else if (typeof val === 'object' && val !== null) {
          queryParts.push(`cd[${encodeURIComponent(key)}]=${encodeURIComponent(JSON.stringify(val))}`);
        } else if (val !== undefined && val !== null) {
          queryParts.push(`cd[${encodeURIComponent(key)}]=${encodeURIComponent(val)}`);
        }
      });
    }

    const beacon = new Image(1, 1);
    beacon.style.display = 'none';
    beacon.src = `https://www.facebook.com/tr/?${queryParts.join('&')}`;
  } catch (err) {
    // Non-critical fallback suppression
  }
};

/**
 * Track Page Views on SPA route change
 */
export const trackPageView = (path, title) => {
  if (typeof window === 'undefined') return;

  // 1. Google Analytics 4
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.href,
    });
  }

  // 2. Meta Pixel PageView
  trackMetaEvent('PageView');
};

/**
 * Track Custom Events in GA4
 */
export const trackEvent = (action, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params);
  }
};

/**
 * Track Meta Pixel Standard & Custom Events
 */
export const trackMetaEvent = (eventName, params = {}) => {
  if (typeof window === 'undefined') return;

  // 1. React Facebook Pixel Module
  try {
    if (!isPixelInitialized) {
      initMetaPixel();
    }
    if (eventName === 'PageView') {
      ReactPixel.pageView();
    } else {
      ReactPixel.track(eventName, params);
    }
  } catch (err) {
    // Handled by next layers
  }

  // 2. Window fbq Native Fallback
  if (window.fbq) {
    try {
      if (params && Object.keys(params).length > 0) {
        window.fbq('track', eventName, params);
      } else {
        window.fbq('track', eventName);
      }
    } catch (e) {
      // Handled by next layers
    }
  }

  // 3. Direct Network Beacon (Physical network hit to https://www.facebook.com/tr/)
  sendMetaBeacon(eventName, params);
};
