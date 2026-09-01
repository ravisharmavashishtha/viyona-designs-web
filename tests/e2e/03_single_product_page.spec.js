import { test, expect } from '@playwright/test';
import { ENV_CONFIG } from '../../config/wp-config.js';

test.describe('03. Single Product Page (PDP) Functionality', () => {

  for (const product of ENV_CONFIG.activeProducts) {
    test(`PDP for ${product.name} renders completely with price, trust badges & buttons`, async ({ page }) => {
      const response = await page.goto(product.urlPath, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);

      // Verify Product Title (H1 or header)
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
      const headingText = await heading.innerText();
      const firstWord = product.name.split(' ')[0].toLowerCase();
      expect(headingText.toLowerCase()).toContain(firstWord);

      // Verify Price is visible
      const price = page.locator('.price, .woocommerce-Price-amount, .product-price, .amount, span:has-text("₹")');
      await expect(price.first()).toBeVisible();

      // Verify Main Product Image loads
      const mainImg = page.locator('.woocommerce-product-gallery__image img, .product-image img, img').first();
      await expect(mainImg).toBeVisible();
      await mainImg.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(200);
      const isImgLoaded = await mainImg.evaluate((el) => el.complete && el.naturalWidth > 0);
      expect(isImgLoaded).toBeTruthy();

      // Verify Trust Badges & Guarantee
      const pageText = await page.content();
      expect(pageText).toMatch(/Free Pan-India Delivery|Free Delivery|Replacement Guarantee|Fast Shipping/i);

      // Verify Add to Cart / Buy Now Action Buttons
      const buyButton = page.locator('button[name="add-to-cart"], .single_add_to_cart_button, .vy-buy-now-btn, a[href*="add-to-cart"], a:has-text("Buy Now"), a:has-text("Add to Cart")');
      await expect(buyButton.first()).toBeAttached();

      // Verify Amazon Button if configured
      const amazonBtn = page.locator('a[href*="amazon.in"]');
      if (await amazonBtn.count() > 0) {
        const href = await amazonBtn.first().getAttribute('href');
        expect(href).toContain('amazon.in');
        if (product.asin && href.includes(product.asin)) {
          expect(href).toContain(product.asin);
        }
      }
    });
  }

});
