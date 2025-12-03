/**
 * Playwright Configuration - TypeScript Version
 * 
 * This configuration file defines all test execution settings,
 * browser configurations, and reporting options.
 * 
 * TypeScript Features Demonstrated:
 * - Typed configuration using PlaywrightTestConfig
 * - Type-safe project definitions
 * - Conditional configuration based on environment
 */

import { defineConfig, devices } from '@playwright/test';
import type { PlaywrightTestConfig } from '@playwright/test';
import os from 'os';

/**
 * Calculate optimal worker count based on system resources.
 * Uses 75% of available CPU cores, capped at 20 for stability.
 */
const calculateWorkers = (): number => {
  const cpuCount = os.cpus().length;
  return Math.min(Math.floor(cpuCount * 0.75), 20);
};

/**
 * Playwright test configuration
 * 
 * @see https://playwright.dev/docs/test-configuration
 */

const config: PlaywrightTestConfig = defineConfig({
  // Test directory containing all spec files
  testDir: './tests',
  
  // Match both .js and .ts test files (for migration period)
  testMatch: '**/*.spec.{js,ts}',
  
  // Run tests in files in parallel for maximum speed
  fullyParallel: true,
  
  // Fail the build on CI if test.only is accidentally left in
  forbidOnly: !!process.env['CI'],
  
  // Retry configuration: more retries in CI for flaky test handling
  retries: process.env['CI'] ? 2 : 0,
  
  // Dynamic worker scaling based on CPU cores
  workers: process.env['CI'] ? 2 : calculateWorkers(),
  
  // Aggressive timeout for fast feedback (30 seconds per test)
  timeout: 30 * 1000,
  
  // Assertion timeout (8 seconds - aggressive for speed)
  expect: {
    timeout: 8 * 1000,
  },
  
  // Reporter configuration: HTML for local, Allure for advanced analytics
  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright'],
    ['list'],
  ],
  
  // Shared settings applied to all projects
  use: {
    // Base URL for relative navigation
    baseURL: 'https://the-internet.herokuapp.com',
    
    // Trace recording configuration
    trace: process.env['CI'] ? 'on-first-retry' : 'retain-on-failure',
    
    // Screenshot on test failure for debugging
    screenshot: 'only-on-failure',
    
    // Video recording on failure
    video: 'retain-on-failure',
    
    // Aggressive action timeout (8 seconds)
    actionTimeout: 8 * 1000,
    
    // Navigation timeout (30 seconds for page loads)
    navigationTimeout: 30 * 1000,
    
    // Full HD viewport for consistent rendering
    viewport: { width: 1920, height: 1080 },
    
    // Ignore HTTPS errors for development environments
    ignoreHTTPSErrors: true,
  },

  // Browser project configurations
  projects: [
    {
      name: 'Chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            // Disable automation detection
            '--disable-blink-features=AutomationControlled',
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--enable-features=NetworkService,NetworkServiceInProcess',
            
            // Performance optimizations
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
            '--password-store=basic',
            '--use-mock-keychain',
            '--disable-notifications',
            
            // Memory optimizations
            '--js-flags=--expose-gc --max-old-space-size=6144 --max-semi-space-size=128',
            '--disable-default-apps',
            '--disable-component-update',
            '--disable-domain-reliability',
            '--disable-background-downloads',
            
            // GPU acceleration (Windows-specific)
            ...(os.platform() === 'win32' ? [
              '--enable-gpu-rasterization',
              '--enable-zero-copy',
              '--ignore-gpu-blocklist',
              '--enable-accelerated-2d-canvas',
              '--enable-accelerated-video-decode',
              '--enable-native-gpu-memory-buffers',
              '--enable-gpu-memory-buffer-video-frames',
            ] : []),
          ],
          timeout: 30000,
        },
      },
    },
    
    // Firefox and WebKit configurations (commented out but available)
    // Uncomment to enable multi-browser testing
    
    // {
    //   name: 'Firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     launchOptions: {
    //       firefoxUserPrefs: {
    //         'browser.cache.disk.enable': false,
    //         'browser.cache.memory.enable': true,
    //         'browser.sessionhistory.max_total_viewers': 0,
    //         'network.http.pipelining': true,
    //         'network.http.proxy.pipelining': true,
    //         'network.http.pipelining.maxrequests': 8,
    //       },
    //       timeout: 30000,
    //     },
    //   },
    // },
    
    // {
    //   name: 'WebKit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Directories to ignore during test discovery
  testIgnore: [
    '**/node_modules/**',
    '**/venv/**',
    '**/allure-results/**',
    '**/allure-report/**',
    '**/playwright-report/**',
    '**/test-results/**',
  ],
});

export default config;