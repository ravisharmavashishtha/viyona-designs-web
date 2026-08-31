import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env
dotenv.config({ path: path.join(rootDir, '.env') });

/**
 * Supported Environments: 'staging' | 'production'
 */
const targetEnv = (process.env.TARGET_ENV || process.env.NODE_ENV || 'staging').toLowerCase();
const isProd = targetEnv === 'production' || targetEnv === 'prod';

export const ENV_CONFIG = {
  environment: isProd ? 'production' : 'staging',
  isProduction: isProd,
  isStaging: !isProd,

  // Base URLs
  baseUrl: isProd 
    ? (process.env.WP_PROD_URL || 'https://viyonadesigns.com')
    : (process.env.WP_STAGING_URL || 'https://mintcream-antelope-246402.hostingersite.com'),

  stagingUrl: process.env.WP_STAGING_URL || 'https://mintcream-antelope-246402.hostingersite.com',
  prodUrl: process.env.WP_PROD_URL || 'https://viyonadesigns.com',

  // Authentication credentials
  auth: {
    user: isProd 
      ? (process.env.WP_PROD_USER || 'viyonadesigns@gmail.com')
      : (process.env.WP_STAGING_USER || 'viyonadesigns@gmail.com'),
    appPassword: isProd
      ? (process.env.WP_PROD_APP_PASSWORD || 'mfRI HA5c R81A hCu3 KbTi xvYs')
      : (process.env.WP_STAGING_APP_PASSWORD || 'mfRI HA5c R81A hCu3 KbTi xvYs'),
  },

  // Active product catalogue definitions for automated testing
  activeProducts: [
    {
      id: 'ganesha',
      name: 'Lord Ganesha Minimalist Murti',
      slug: 'lord-ganesha-minimalist-murti',
      asin: 'B0HF5124YZ',
      sku: 'VD-GANESHA-WHT-01',
      expectedPrice: 550,
      urlPath: '/product/lord-ganesha-minimalist-murti/'
    },
    {
      id: 'puppy',
      name: 'Sleeping Puppy Desk Organizer',
      slug: 'sleeping-puppy-desk-organizer-catchall-tray',
      asin: 'B0HC36C861',
      sku: 'GEN-PUPPY-TRAY-WHT',
      expectedPrice: 499,
      urlPath: '/product/sleeping-puppy-desk-organizer-catchall-tray/'
    },
    {
      id: 'phone-stand',
      name: 'Minimalist Mobile Phone Stand',
      slug: 'minimalist-mobile-phone-stand-desk-cradle',
      asin: 'B0HC36C861',
      sku: 'VD-PHONE-STAND-BLK-01',
      expectedPrice: 349,
      urlPath: '/product/minimalist-mobile-phone-stand-desk-cradle/'
    }
  ],

  // Core policy pages to verify
  corePages: [
    { name: 'Homepage', path: '/' },
    { name: 'Shop / Products', path: '/products/' },
    { name: 'Cart', path: '/cart/' },
    { name: 'Checkout', path: '/checkout/' },
    { name: 'About Us', path: '/about/' },
    { name: 'Contact Us', path: '/contact/' },
    { name: 'Shipping & Delivery', path: '/shipping-policy/' }
  ],

  // Tracking & Pixels
  tracking: {
    metaPixelId: process.env.META_PIXEL_ID || '1367098485202863'
  }
};

/**
 * Returns Basic Authorization header string for the active environment
 */
export function getAuthHeader() {
  const { user, appPassword } = ENV_CONFIG.auth;
  return 'Basic ' + Buffer.from(`${user}:${appPassword}`).toString('base64');
}

/**
 * Guard function to prevent accidental production mutations without explicit confirmation
 */
export function assertMutationAllowed(operationName = 'Deploy') {
  if (ENV_CONFIG.isProduction) {
    const isExplicitlyAllowed = process.env.ALLOW_PROD_MUTATION === 'true' || process.argv.includes('--confirm-prod');
    if (!isExplicitlyAllowed) {
      throw new Error(
        `🚨 PRODUCTION SAFETY GUARD TRIGGERED:\n` +
        `Operation "${operationName}" was blocked from modifying LIVE production (${ENV_CONFIG.baseUrl}).\n` +
        `To run on production, you must explicitly provide --confirm-prod or set ALLOW_PROD_MUTATION=true after user approval.`
      );
    }
  }
}
