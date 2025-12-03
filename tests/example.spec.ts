import { test, expect, type Page } from '@playwright/test';

/**
 * @fileoverview Basic example tests demonstrating Playwright fundamentals.
 * These tests navigate to Playwright.dev and verify basic page properties.
 */

test('Has title @smoke', async ({ page }: { page: Page }) => {
  // Navigate to Playwright homepage
  await page.goto('https://playwright.dev/');

  // Verify the page has the expected title containing "Playwright"
  await expect(page).toHaveTitle(/Playwright/);
});

test('Get started link @smoke', async ({ page }: { page: Page }) => {
  // Navigate to Playwright homepage
  await page.goto('https://playwright.dev/');

  // Click on the "Get started" link
  await page.getByRole('link', { name: 'Get started' }).click();

  // Verify the URL now contains "intro" (introduction page)
  await expect(page).toHaveURL(/.*intro/);
});