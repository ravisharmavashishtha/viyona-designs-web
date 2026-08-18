// Comprehensive Analytics Utility for Viyona Designs
// Supports Google Analytics 4 (GA4) + Meta Pixel (react-facebook-pixel + Direct SDK + Image Beacon + Conversions API CAPI)

import ReactPixel from 'react-facebook-pixel';

export const GA_MEASUREMENT_ID = 'G-R2FR44J83H';
export const META_PIXEL_ID = '2533819650389389';
export const META_CAPI_ACCESS_TOKEN = 'EAAaGdKZA1XlgBSRshp7cqawo60cvOmJGSZBnXikNeynvGDLsGdUUXfKdE4JkDTbeF7bFVZALiYBODYZAvP6JV3Uzj5PUcfWqAqIALnzVD04SHir7VTg21cjkz82yOboYXToV4v7BpsgmLXEF4ZAianUPCAyXzsjLBZCZCaGwKD4ZA0YkAq7ZAnioGUZBfX63g4gAZDZD';

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
        debug: false
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
const sendMetaBeacon = (eventName, params = {}, eventId) => {
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

    if (eventId) {
      queryParts.push(`eid=${encodeURIComponent(eventId)}`);
    }

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
 * Meta Conversions API (CAPI) Direct Graph API POST Dispatcher
 * Directly reaches Meta servers with event deduplication (event_id)
 */
const sendMetaConversionsAPI = (eventName, params = {}, eventId) => {
  if (typeof window === 'undefined' || !META_CAPI_ACCESS_TOKEN) return;

  try {
    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: window.location.href,
          action_source: 'website',
          user_data: {
            client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          },
          custom_data: params && Object.keys(params).length > 0 ? params : undefined
        }
      ],
      access_token: META_CAPI_ACCESS_TOKEN
    };

    fetch(`https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      mode: 'cors',
      keepalive: true
    }).catch(() => {
      // Non-critical background suppression
    });
  } catch (err) {
    // Non-critical background suppression
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
 * Dispatches synchronously across Browser SDK, Native fbq, Image Beacon, and Conversions API (CAPI)
 */
export const trackMetaEvent = (eventName, params = {}) => {
  if (typeof window === 'undefined') return;

  // Generate unique eventId for exact Meta Pixel + CAPI deduplication
  const eventId = `vd-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

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
        window.fbq('track', eventName, params, { eventID: eventId });
      } else {
        window.fbq('track', eventName, {}, { eventID: eventId });
      }
    } catch (e) {
      // Handled by next layers
    }
  }

  // 3. Direct Network Beacon (Physical network hit to https://www.facebook.com/tr/)
  sendMetaBeacon(eventName, params, eventId);

  // 4. Meta Conversions API (CAPI) Direct Graph API POST (Bypasses ad-blockers / Safari ITP)
  sendMetaConversionsAPI(eventName, params, eventId);
};
