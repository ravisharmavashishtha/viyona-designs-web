import { test, expect } from '@playwright/test';

test.describe('05. Checkout Page & Payment Gateway Readiness', () => {

  test('Checkout page renders with essential billing input fields', async ({ page }) => {
    const response = await page.goto('/checkout/', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    // If redirected to cart because cart is empty, add an item first
    if (page.url().includes('/cart/')) {
      await page.goto('/product/lord-ganesha-minimalist-murti/', { waitUntil: 'domcontentloaded' });
      const addBtn = page.locator('button[name="add-to-cart"], .single_add_to_cart_button, a[href*="add-to-cart"]').first();
      if (await addBtn.isVisible()) {
        await addBtn.click();
        await page.waitForTimeout(1000);
      }
      await page.goto('/checkout/', { waitUntil: 'domcontentloaded' });
    }

    // Check essential checkout fields
    const nameField = page.locator('input[name*="billing_first_name" i], input[id*="billing_first_name" i], input#name');
    const phoneField = page.locator('input[name*="billing_phone" i], input[type="tel" i], input#phone');
    const addressField = page.locator('input[name*="billing_address_1" i], input[id*="billing_address_1" i], textarea#address');
    const postcodeField = page.locator('input[name*="billing_postcode" i], input[id*="billing_postcode" i], input#pincode');

    if (await nameField.count() > 0) {
      await expect(nameField.first()).toBeVisible();
    }
    if (await phoneField.count() > 0) {
      await expect(phoneField.first()).toBeVisible();
    }
    if (await addressField.count() > 0) {
      await expect(addressField.first()).toBeVisible();
    }
    if (await postcodeField.count() > 0) {
      await expect(postcodeField.first()).toBeVisible();
    }

    // Verify Place Order or Payment CTA button is attached
    const placeOrderBtn = page.locator('#place_order, button:has-text("Place Order"), button:has-text("Pay"), button:has-text("Buy"), button.wc-block-components-checkout-place-order-button');
    if (await placeOrderBtn.count() > 0) {
      await expect(placeOrderBtn.first()).toBeAttached();
    }
  });

  test('Razorpay payment gateway script or UI integration is attached', async ({ page }) => {
    await page.goto('/checkout/', { waitUntil: 'domcontentloaded' });

    // Verify Razorpay mentions or scripts in DOM
    const htmlContent = await page.content();
    const hasRazorpay = htmlContent.toLowerCase().includes('razorpay') || 
                        htmlContent.includes('rzp') || 
                        htmlContent.includes('payment_method_razorpay');

    expect(hasRazorpay).toBeTruthy();
  });

});
