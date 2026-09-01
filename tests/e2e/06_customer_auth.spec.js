import { test, expect } from '@playwright/test';

test.describe('06. Customer Authentication, Login & Logout Flow', () => {

  test('Guest can open AuthModal, enter phone and verify OTP', async ({ page }) => {
    // Start vite preview or navigate to dev server / test build
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Check Navbar has Account button
    const accountBtn = page.locator('button[aria-label*="Sign In"], button[aria-label*="Account"]').first();
    await expect(accountBtn).toBeVisible();

    // Click Account Button
    await accountBtn.click();
    await page.waitForTimeout(500);

    // AuthModal should be open
    const modalHeading = page.locator('text=Sign In to Viyona');
    await expect(modalHeading).toBeVisible();

    // Fill 10-digit mobile number
    const phoneInput = page.locator('input[type="tel"]').first();
    await phoneInput.fill('9876543210');

    // Click Send Code
    const sendBtn = page.locator('button:has-text("Send WhatsApp Verification Code")');
    await sendBtn.click();
    await page.waitForTimeout(1000);

    // Should transition to OTP step
    const verifyHeading = page.locator('text=Verify Your WhatsApp');
    await expect(verifyHeading).toBeVisible();

    // Enter 6-digit OTP
    const otpInputs = page.locator('input[inputmode="numeric"]');
    await expect(otpInputs).toHaveCount(6);

    const testOtp = ['1', '2', '3', '4', '5', '6'];
    for (let i = 0; i < 6; i++) {
      await otpInputs.nth(i).fill(testOtp[i]);
    }

    await page.waitForTimeout(1000);

    // User should now be logged in
    // Modal should close
    await expect(modalHeading).not.toBeVisible();

    // Navbar should display logged-in avatar initial 'R'
    const userAvatar = page.locator('button[title*="Collector Account"]');
    await expect(userAvatar).toBeVisible();
    await expect(userAvatar).toContainText('R');

    // Click Avatar to open Account Drawer
    await userAvatar.click();
    await page.waitForTimeout(500);

    // Account Drawer should be visible with customer name
    const drawerTitle = page.locator('text=Ravi Sharma');
    await expect(drawerTitle).toBeVisible();

    // Click Sign Out
    const logoutBtn = page.locator('button:has-text("Sign Out")');
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();
    await page.waitForTimeout(500);

    // Session should be terminated, Guest button restored
    const restoredAccountBtn = page.locator('button[aria-label="Sign In to Viyona"]');
    await expect(restoredAccountBtn).toBeVisible();
  });

});
