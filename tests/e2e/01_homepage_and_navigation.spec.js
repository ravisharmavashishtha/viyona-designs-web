import { test, expect } from '@playwright/test';
import { ENV_CONFIG } from '../../config/wp-config.js';

test.describe('01. Homepage & Navigation Health', () => {

  test('Homepage loads successfully with 200 OK and valid title', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('favicon') && !msg.text().includes('Third-party cookie')) {
        consoleErrors.push(msg.text());
      }
    });

    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    // Verify Title and Brand presence
    const title = await page.title();
    expect(title.toLowerCase()).toContain('viyona');

    // Verify Header exists
    const header = page.locator('header, .site-header, .vy-header, nav');
    await expect(header.first()).toBeVisible();

    // Verify no critical JavaScript exceptions on load
    expect(consoleErrors.filter(err => err.includes('SyntaxError') || err.includes('TypeError')).length).toBe(0);
  });

  test('Header navigation links are present and accessible', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Check Products/Shop link
    const productsLink = page.locator('a[href*="/products/"], a[href*="/shop/"]');
    await expect(productsLink.first()).toBeAttached();

    // Check Cart link/button
    const cartLink = page.locator('a[href*="/cart/"], .cart-contents, .header-cart, .vy-cart-btn');
    await expect(cartLink.first()).toBeAttached();
  });

  test('Mobile navigation menu toggles correctly on small viewports', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only navigation check');

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const menuToggle = page.locator('button[aria-label*="menu" i], .menu-toggle, .hamburger, .mobile-menu-btn');
    if (await menuToggle.count() > 0 && await menuToggle.first().isVisible()) {
      await menuToggle.first().click();
      await page.waitForTimeout(300);
      const navDrawer = page.locator('.mobile-nav, .nav-menu, .drawer, nav');
      await expect(navDrawer.first()).toBeVisible();
    }
  });

});
