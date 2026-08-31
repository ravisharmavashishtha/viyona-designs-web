import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

test.describe('08. Responsive Layouts & Visual Snapshots', () => {

  const screenshotDir = path.resolve('test-results/screenshots');

  test.beforeAll(() => {
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
  });

  test('Capture visual screenshot of Homepage and verify no horizontal scroll overflow', async ({ page, isMobile }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const deviceType = isMobile ? 'mobile' : 'desktop';

    // Verify no unintended horizontal scroll overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBeFalsy();

    // Save visual snapshot
    await page.screenshot({
      path: path.join(screenshotDir, `homepage_${deviceType}.png`),
      fullPage: false
    });
  });

  test('Capture visual screenshot of Product Detail Page and verify responsiveness', async ({ page, isMobile }) => {
    await page.goto('/product/lord-ganesha-minimalist-murti/', { waitUntil: 'networkidle' });
    const deviceType = isMobile ? 'mobile' : 'desktop';

    // Check no horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBeFalsy();

    // Save visual snapshot
    await page.screenshot({
      path: path.join(screenshotDir, `pdp_ganesha_${deviceType}.png`),
      fullPage: false
    });
  });

});
