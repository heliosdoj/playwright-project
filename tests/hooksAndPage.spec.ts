import { type Page, expect, test } from '@playwright/test';

/**
 * @fileoverview Tests demonstrating Playwright hooks (beforeEach, afterEach) and
 * HTTP Basic Authentication handling. These tests show how to use test fixtures
 * and authentication strategies in Playwright.
 */

test.describe('Hooks and Authentication Examples', () => {
  /**
   * beforeEach hook runs before each test in this describe block.
   * This is useful for common setup like navigation.
   */
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Common navigation for all tests in this block
    await page.goto('https://the-internet.herokuapp.com');
  });

  test('Navigate to login page using hooks', async ({ page }: { page: Page }) => {
    // Click on the Form Authentication link
    await page.locator('ul li a[href="/login"]').click();

    // Verify we're on the login page
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h2')).toHaveText('Login Page');
  });

  test('Navigate to checkboxes page using hooks', async ({ page }: { page: Page }) => {
    // Click on the Checkboxes link
    await page.locator('ul li a[href="/checkboxes"]').click();

    // Verify we're on the checkboxes page
    await expect(page).toHaveURL(/.*checkboxes/);
    await expect(page.locator('h3')).toHaveText('Checkboxes');
  });
});

test.describe('HTTP Basic Authentication', () => {
  /**
   * Demonstrates HTTP Basic Authentication in Playwright.
   * Credentials are passed in the URL format: https://username:password@domain
   */
  test('Basic Auth with credentials in URL', async ({ page }: { page: Page }) => {
    // Navigate with basic auth credentials embedded in URL
    await page.goto('https://admin:admin@the-internet.herokuapp.com/basic_auth');

    // Verify successful authentication
    await expect(page.locator('p')).toContainText(
      'Congratulations! You must have the proper credentials.',
    );
  });
});
