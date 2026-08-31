import { test, expect } from '@playwright/test';
import { ENV_CONFIG } from '../../config/wp-config.js';

test.describe('06. Tracking Pixels, Analytics & SEO Integrity', () => {

  test('Meta Pixel and Analytics scripts are present in page source', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const content = await page.content();

    // Check Meta Pixel injection
    const hasMetaPixel = content.includes(ENV_CONFIG.tracking.metaPixelId) || 
                         content.includes('connect.facebook.net') || 
                         content.includes('fbq(');
    expect(hasMetaPixel).toBeTruthy();
  });

  test('Essential SEO meta tags are configured properly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Viewport tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toBeAttached();

    // Title tag
    const title = await page.title();
    expect(title.length).toBeGreaterThan(5);

    // Canonical link or OpenGraph tags
    const canonicalOrOg = page.locator('link[rel="canonical"], meta[property^="og:"]');
    const count = await canonicalOrOg.count();
    expect(count).toBeGreaterThan(0);
  });

});
