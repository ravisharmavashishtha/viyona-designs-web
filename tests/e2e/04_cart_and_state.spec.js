import { test, expect } from '@playwright/test';
import { ENV_CONFIG } from '../../config/wp-config.js';

test.describe('04. Cart Functionality & State Management', () => {

  test('Cart page renders cleanly and shows empty/active state', async ({ page }) => {
    const response = await page.goto('/cart/', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    const content = await page.content();
    // Either cart has items or shows empty cart notice
    const hasCartTable = await page.locator('.woocommerce-cart-form, .cart, .wc-block-cart').count() > 0;
    const hasEmptyNotice = content.includes('empty') || content.includes('Return to shop') || content.includes('No products in the cart');
    
    expect(hasCartTable || hasEmptyNotice).toBeTruthy();
  });

  test('Adding product to cart updates cart state', async ({ page }) => {
    const targetProduct = ENV_CONFIG.activeProducts[0];
    await page.goto(targetProduct.urlPath, { waitUntil: 'domcontentloaded' });

    // Look for add to cart button or standard form
    const addToCartBtn = page.locator('button[name="add-to-cart"], .single_add_to_cart_button, a[href*="add-to-cart"]');
    
    if (await addToCartBtn.count() > 0 && await addToCartBtn.first().isVisible()) {
      await addToCartBtn.first().click();
      await page.waitForTimeout(1500);

      // Verify cart notification or navigate to cart
      await page.goto('/cart/', { waitUntil: 'domcontentloaded' });
      
      const cartForm = page.locator('.woocommerce-cart-form, .cart_item, .wc-block-cart');
      await expect(cartForm.first()).toBeVisible();

      // Verify Proceed to Checkout button exists
      const checkoutBtn = page.locator('a[href*="/checkout/"], .checkout-button, button:has-text("Checkout")');
      await expect(checkoutBtn.first()).toBeVisible();
    }
  });

});
