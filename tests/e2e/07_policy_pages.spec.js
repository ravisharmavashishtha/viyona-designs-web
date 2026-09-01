import { test, expect } from '@playwright/test';
import { ENV_CONFIG } from '../../config/wp-config.js';

test.describe('07. Legal Policies & Brand Compliance Pages', () => {

  const testPages = ENV_CONFIG.corePages.filter(p => p.path !== '/' && p.path !== '/cart/' && p.path !== '/checkout/');

  for (const pageItem of testPages) {
    test(`Page "${pageItem.name}" (${pageItem.path}) loads with HTTP 200 and renders content`, async ({ page }) => {
      const response = await page.goto(pageItem.path, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);

      // Verify page body content is rendered
      const bodyText = await page.locator('body').innerText();
      expect(bodyText.trim().length).toBeGreaterThan(50);
    });
  }

});
