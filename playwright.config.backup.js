// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.{js,ts}',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* DYNAMIC SCALING - automatically uses optimal workers based on CPU cores */
  workers: process.env.CI ? 2 : undefined, // undefined = auto-scale to 50% of CPU cores (recommended by Playwright)
  
  /* Aggressive timeout settings for faster execution */
  timeout: 30 * 1000, // 30 seconds per test (aggressive)
  expect: {
    timeout: 8 * 1000, // 8 seconds for assertions (aggressive)
  },
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }], // Don't auto-open report
    ['allure-playwright'], // Allure reporting for advanced analytics
    ['list'], // Console output for CI/CD
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL for relative navigation */
    // baseURL: 'http://localhost:3000',
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    
    /* Screenshot on failure for debugging */
    screenshot: 'only-on-failure',
    
    /* Video on failure for better debugging */
    video: 'retain-on-failure',
    
    /* Aggressive action and navigation timeouts */
    actionTimeout: 8 * 1000, // 8 seconds for actions (aggressive for speed)
    navigationTimeout: 30 * 1000, // 30 seconds for page loads (aggressive for speed)
    
    /* Browser context options for performance */
    viewport: { width: 1920, height: 1080 }, // Full HD viewport
    
    /* Ignore HTTPS errors for local development */
    ignoreHTTPSErrors: true,
    
    /* MAXIMUM PERFORMANCE - GPU acceleration enabled, all optimizations */
    launchOptions: {
      // BLAZING FAST - All performance optimizations enabled
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--enable-features=NetworkService,NetworkServiceInProcess',
        // NVIDIA T600 GPU ACCELERATION - Maximum performance
        '--enable-gpu-rasterization',
        '--enable-zero-copy',
        '--ignore-gpu-blocklist',
        '--enable-accelerated-2d-canvas',
        '--enable-accelerated-video-decode',
        '--enable-native-gpu-memory-buffers',
        '--enable-gpu-memory-buffer-video-frames',
        // Aggressive memory and performance optimizations
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-background-networking',
        '--disable-breakpad',
        '--disable-component-extensions-with-background-pages',
        '--disable-extensions',
        '--disable-features=TranslateUI,BlinkGenPropertyTrees',
        '--disable-ipc-flooding-protection',
        '--disable-hang-monitor',
        '--disable-prompt-on-repost',
        '--disable-sync',
        '--force-color-profile=srgb',
        '--metrics-recording-only',
        '--no-first-run',
        '--password-store=basic',
        '--use-mock-keychain',
        '--disable-notifications',
        // MAXIMUM performance flags (optimized for 32GB RAM, 20 threads)
        '--js-flags=--expose-gc --max-old-space-size=6144 --max-semi-space-size=128',
        // Additional speed optimizations
        '--disable-default-apps',
        '--disable-component-update',
        '--disable-domain-reliability',
        '--disable-background-downloads',
      ],
      // Reduced timeout for faster browser launch
      timeout: 30000,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

   // Optional: avoid scanning junk
  testIgnore: ['**/node_modules/**', '**/venv/**', '**/allure-results/**', '**/allure-report/**', '**/playwright-report/**', '**/test-results/**'],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'python3 -m http.server 5500',
  //   url: 'http://127.0.0.1:5500',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});

