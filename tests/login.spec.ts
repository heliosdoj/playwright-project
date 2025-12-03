import { test, expect, type Page } from '@playwright/test';

/**
 * @fileoverview Direct login test demonstrating a complete login flow
 * including successful login, verification, logout, and field interaction.
 * Uses direct Playwright locators without Page Object Model for simplicity.
 */

test('This is a login test @smoke @regression', async ({ page }: { page: Page }) => {
  // Navigate to login page
  await page.goto('https://the-internet.herokuapp.com/login');

  // Enter username
  await page.locator('#username').click();
  await page.locator('#username').fill('tomsmith');

  // Enter password
  await page.locator('#password').click();
  await page.locator('#password').fill('SuperSecretPassword!');

  // Click login button
  await page.getByRole('button', { name: /login/i }).click();

  // Verify successful login - flash message
  await expect(page.locator('#flash')).toContainText(/You logged into a secure area/);

  // Verify secure area subheader
  await expect(page.locator('h4.subheader')).toContainText(
    /Welcome to the Secure Area. When you are done click logout below./
  );

  // Logout
  await page.locator('a.button.secondary.radius:has-text("Logout")').click();

  // Interact with username field again (demonstrating post-logout state)
  await page.locator('#username').click();
  await page.locator('#username').fill('11');
});