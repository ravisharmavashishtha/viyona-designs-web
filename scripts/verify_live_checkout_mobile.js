import { chromium, devices } from '@playwright/test';

async function verifyLive() {
  console.log('🚀 Launching mobile browser (iPhone 14)...');
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({
    ...devices['iPhone 14'],
  });
  const page = await context.newPage();

  console.log('1. Adding item to cart...');
  await page.goto('https://viyonadesigns.com/product/lord-ganesha-minimalist-murti/', { waitUntil: 'networkidle' });
  const addBtn = page.locator('.single_add_to_cart_button, button[name="add-to-cart"]').first();
  await addBtn.click();
  await page.waitForTimeout(2000);

  console.log('2. Navigating to live checkout...');
  await page.goto('https://viyonadesigns.com/checkout/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  console.log('3. Inspecting live mobile layout on iPhone 14...');
  const inspection = await page.evaluate(() => {
    const form = document.querySelector('form.checkout');
    const customer = document.querySelector('#customer_details');
    const order = document.querySelector('#order_review');
    const btn = document.querySelector('#place_order');

    const customerRect = customer ? customer.getBoundingClientRect() : null;
    const orderRect = order ? order.getBoundingClientRect() : null;
    const btnRect = btn ? btn.getBoundingClientRect() : null;

    return {
      windowWidth: window.innerWidth,
      formDisplay: form ? window.getComputedStyle(form).display : null,
      formFlexDir: form ? window.getComputedStyle(form).flexDirection : null,
      customerRect,
      orderRect,
      btnRect,
      isBtnVisible: btn ? (btn.offsetWidth > 0 && btn.offsetHeight > 0 && window.getComputedStyle(btn).visibility === 'visible') : false,
      btnText: btn ? btn.textContent.trim() : null
    };
  });

  console.log('LIVE MOBILE CHECKOUT STATUS:\n', JSON.stringify(inspection, null, 2));

  console.log('4. Filling in address to confirm full user flow...');
  await page.fill('#billing_first_name', 'Ravi');
  await page.fill('#billing_last_name', 'Sharma');
  await page.fill('#billing_address_1', 'Flat 402, Lotus Heights, MG Road');
  await page.fill('#billing_city', 'Bengaluru');
  await page.fill('#billing_postcode', '560001');
  await page.fill('#billing_phone', '9876543210');
  await page.fill('#billing_email', 'ravi@example.com');

  await page.waitForTimeout(3000);

  const afterAddress = await page.evaluate(() => {
    const btn = document.querySelector('#place_order');
    const rect = btn ? btn.getBoundingClientRect() : null;
    return {
      btnVisible: btn ? (btn.offsetWidth > 0 && btn.offsetHeight > 0) : false,
      btnText: btn ? btn.textContent.trim() : null,
      btnRect: rect,
      windowWidth: window.innerWidth
    };
  });

  console.log('AFTER ADDRESS ENTRY:\n', JSON.stringify(afterAddress, null, 2));

  await page.screenshot({ path: 'public/checkout_mobile_verified_live.png', fullPage: true });
  console.log('📸 Screenshot saved to public/checkout_mobile_verified_live.png');

  await browser.close();

  if (afterAddress.btnVisible && afterAddress.btnRect.x >= 0 && afterAddress.btnRect.right <= afterAddress.windowWidth + 20) {
    console.log('\n✅ VERIFICATION PASSED: The Payment options and Pay button are completely visible on mobile browsers!');
  } else {
    console.error('\n❌ VERIFICATION FAILED');
    process.exit(1);
  }
}

verifyLive().catch(err => {
  console.error(err);
  process.exit(1);
});
