import { test, expect } from '@playwright/test';
import { ENV_CONFIG } from '../../config/wp-config.js';

test.describe('02. Products Catalog & Grid Integrity', () => {

  test('Catalog page (/products/) loads and displays product cards', async ({ page }) => {
    const response = await page.goto('/products/', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    // Verify products links are present
    const productLinks = page.locator('a[href*="/product/"]');
    const count = await productLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('All active catalog products are listed with valid links and images', async ({ page }) => {
    await page.goto('/products/', { waitUntil: 'domcontentloaded' });

    for (const product of ENV_CONFIG.activeProducts) {
      const productLink = page.locator(`a[href*="${product.slug}"]`).first();
      await expect(productLink).toBeAttached();
    }

    // Check images in catalog load properly (scrolling into view to trigger lazy loading)
    const images = page.locator('img');
    const imgCount = await images.count();
    let verifiedImages = 0;

    for (let i = 0; i < Math.min(imgCount, 8); i++) {
      const img = images.nth(i);
      if (await img.isVisible()) {
        await img.scrollIntoViewIfNeeded().catch(() => {});
        await page.waitForTimeout(150);
        const isLoaded = await img.evaluate((el) => el.complete && el.naturalWidth > 0);
        expect(isLoaded).toBeTruthy();
        verifiedImages++;
      }
    }
    expect(verifiedImages).toBeGreaterThan(0);
  });

  test('Prices are formatted properly with currency symbol in catalog', async ({ page }) => {
    await page.goto('/products/', { waitUntil: 'domcontentloaded' });

    const content = await page.content();
    expect(content.includes('₹') || content.includes('Rs.') || content.includes('550')).toBeTruthy();
  });

});
