import { defineConfig, devices } from '@playwright/test';
import { ENV_CONFIG } from './config/wp-config.js';

/**
 * Playwright Configuration for Viyona Designs WooCommerce E2E Regression Suite
 * Supports on-demand execution against Staging or Live Production.
 */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45000,
  outputDir: 'test-artifacts',
  expect: {
    timeout: 10000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  use: {
    baseURL: ENV_CONFIG.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    bypassCSP: true,
    ignoreHTTPSErrors: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ViyonaBot/1.0'
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: { width: 1440, height: 900 }
      }
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 7'],
        channel: 'chrome',
        viewport: { width: 390, height: 844 }
      }
    }
  ]
});
