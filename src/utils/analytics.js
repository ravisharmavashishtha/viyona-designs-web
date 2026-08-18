/**
 * Analytics Utility — Viyona Designs
 * Tracks GA4 and Meta Pixel (Facebook) events cleanly across all SPA routes.
 *
 * Architecture:
 *  - GA4:        Google Analytics 4 via gtag (initialised in index.html)
 *  - Meta Pixel: react-facebook-pixel SDK (single entry point, no duplicate beacons)
 *  - EventID:    UUID-based deduplication for server-side attribution compatibility
 */

import ReactPixel from 'react-facebook-pixel';

// ─── Constants ───────────────────────────────────────────────────────────────
export const GA_MEASUREMENT_ID  = 'G-R2FR44J83H';
export const META_PIXEL_ID      = '2533819650389389';

// ─── Internal State ───────────────────────────────────────────────────────────
let isPixelInitialized = false;
const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generate a short unique event ID for deduplication.
 * Prevents the same event from being double-counted if server-side
 * Conversions API is added in future.
 */
const generateEventId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// ─── Initialisation ───────────────────────────────────────────────────────────

/**
 * Initialise Google Analytics 4.
 * Safe to call multiple times — only attaches the script once.
 */
export const initGA = (measurementId = GA_MEASUREMENT_ID) => {
  if (typeof window === 'undefined' || !measurementId) return;
  // gtag script is already injected in index.html — nothing more needed here
  // This call is kept for backwards compatibility in redirect pages
};

/**
 * Initialise Meta Pixel via react-facebook-pixel.
 * Safe to call multiple times — initialises only once.
 * Debug logging enabled only in local development.
 */
export const initMetaPixel = (pixelId = META_PIXEL_ID) => {
  if (typeof window === 'undefined' || !pixelId || isPixelInitialized) return;
  try {
    ReactPixel.init(
      pixelId,
      {}, // advancedMatching — left empty; Automatic Advanced Matching is ON from Meta dashboard
      {
        autoConfig: true,
        debug: isDev,  // Silent in production, verbose in local dev
      }
    );
    isPixelInitialized = true;
    if (isDev) console.log('[Meta Pixel] Initialised — Pixel ID:', pixelId);
  } catch (e) {
    if (isDev) console.warn('[Meta Pixel] Init error:', e);
  }
};

// ─── Page View Tracking ───────────────────────────────────────────────────────

/**
 * Track a GA4 page_view event on SPA route change.
 * Should be called from RouteAnalyticsTracker on every location change.
 */
export const trackPageView = (path, title) => {
  if (typeof window === 'undefined') return;
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path:     path,
      page_title:    title || document.title,
      page_location: window.location.href,
    });
  }
};

/**
 * Track a Meta Pixel PageView on SPA route change.
 * Should only be called on navigation — NOT on initial load
 * (index.html base code already sends the first PageView).
 */
export const trackMetaPageView = () => {
  if (typeof window === 'undefined') return;
  if (!isPixelInitialized) initMetaPixel();
  try {
    ReactPixel.pageView();
    if (isDev) console.log('[Meta Pixel] PageView fired');
  } catch (e) {
    // ReactPixel not available — fbq base code still captures it
  }
};

// ─── Standard Event Tracking ─────────────────────────────────────────────────

/**
 * Track a GA4 custom event.
 */
export const trackEvent = (action, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params);
  }
};

/**
 * Track any Meta Pixel standard event with full deduplication support.
 * Uses react-facebook-pixel as primary layer, window.fbq as safety fallback.
 *
 * @param {string} eventName  - Standard Meta event name e.g. 'ViewContent'
 * @param {object} params     - Standard event parameters
 * @param {string} [eventId]  - Optional custom eventID for deduplication
 */
export const trackMetaEvent = (eventName, params = {}, eventId) => {
  if (typeof window === 'undefined') return;
  if (!isPixelInitialized) initMetaPixel();

  const eid = eventId || generateEventId();
  const hasParams = params && Object.keys(params).length > 0;

  // Primary: react-facebook-pixel
  try {
    if (eventName === 'PageView') {
      ReactPixel.pageView();
    } else if (hasParams) {
      ReactPixel.track(eventName, params);
    } else {
      ReactPixel.track(eventName);
    }
  } catch (err) {
    // Fallback to native fbq if ReactPixel fails
    if (window.fbq) {
      try {
        if (hasParams) {
          window.fbq('track', eventName, params, { eventID: eid });
        } else {
          window.fbq('track', eventName, {}, { eventID: eid });
        }
      } catch (e) { /* non-critical */ }
    }
  }

  if (isDev) {
    console.log(`[Meta Pixel] ${eventName}`, hasParams ? params : '(no params)', `eventID: ${eid}`);
  }
};

// ─── Convenience Trackers ─────────────────────────────────────────────────────

/**
 * Track ViewContent — fires when a visitor views a product detail page.
 */
export const trackViewContent = (product) => {
  trackMetaEvent('ViewContent', {
    content_name: product.displayName || product.name,
    content_ids:  [product.id],
    content_type: 'product',
    value:        parseFloat(product.price?.replace(/[^0-9.]/g, '')) || 550,
    currency:     'INR',
  });
  trackEvent('view_item', {
    currency:  'INR',
    value:     parseFloat(product.price?.replace(/[^0-9.]/g, '')) || 550,
    items:     [{ item_id: product.id, item_name: product.name, price: parseFloat(product.price?.replace(/[^0-9.]/g, '')) || 550 }],
  });
};

/**
 * Track InitiateCheckout — fires when a visitor taps "Buy on Amazon".
 */
export const trackInitiateCheckout = (product, location = 'unknown') => {
  const price = typeof product.price === 'number'
    ? product.price
    : parseFloat((product.price || '').replace(/[^0-9.]/g, '')) || 550;

  trackMetaEvent('InitiateCheckout', {
    content_name: product.displayName || product.name,
    content_ids:  [product.id],
    content_type: 'product',
    value:        price,
    currency:     'INR',
    num_items:    1,
  });
  trackEvent('begin_checkout', {
    currency:    'INR',
    value:       price,
    items:       [{ item_id: product.id, item_name: product.name, price }],
    click_location: location,
  });
};

/**
 * Track Contact — fires when a visitor submits the contact form.
 */
export const trackContact = () => {
  trackMetaEvent('Contact');
  trackEvent('generate_lead', { method: 'contact_form' });
};

/**
 * Track Lead — fires when a visitor clicks WhatsApp or Email CTA.
 * @param {'whatsapp'|'email'|'instagram'|'facebook'} method
 */
export const trackLead = (method) => {
  trackMetaEvent('Lead', { lead_type: method });
  trackEvent('generate_lead', { method });
};
