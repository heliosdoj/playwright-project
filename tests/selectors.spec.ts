import { type Page, expect, test } from '@playwright/test';
import * as path from 'path';

/**
 * @fileoverview Demonstrates various Playwright selector strategies.
 * This test uses a local HTML file (clickme.html) to showcase different
 * ways to locate and interact with elements on a page.
 *
 * Selector strategies covered:
 * 1. ID selector
 * 2. Class selector
 * 3. Tag and class combination
 * 4. Attribute value selector
 * 5. Partial attribute selector
 * 6. Text content selector
 * 7. Combined selectors for precision
 * 8. has-text pseudo-selector
 * 9. Attribute and text combination
 * 10. Playwright built-in locators (getByText)
 * 11. Role-based selectors
 */

test('Learning Selectors', async ({ page }: { page: Page }) => {
  // Navigate to the local HTML file
  const filePath = path.join(process.cwd(), 'clickme.html');
  await page.goto(`file://${filePath}`);

  // 1. Selecting by ID - most specific and reliable
  await page.locator('#clickButton').click();

  // 2. Selecting by Class - useful for styled elements
  await page.locator('.button-style').click();

  // 3. By Tag and Class - more specific than class alone
  await page.locator('button.button-style').click();

  // 4. By Attribute Value - useful for data attributes
  await page.locator('[data-action="increment"]').click();

  // 5. Partial attribute - matches partial attribute values
  await page.locator('[role*="but"]').click();

  // 6. By text content - finds elements containing text
  await page.locator('text=CLICK HERE').click();

  // 7. Combine selectors for precision - class and exact text match
  await page.locator('.button-style:text("CLICK HERE")').click();

  // 8. Find elements containing specific text with has-text
  await page.locator('button:has-text("click h")').click();

  // 9. Attribute and text combination - very precise
  await page.locator('[data-action="increment"]:text("CLICK HERE")').click();

  // 10. Playwright Locators - getByText (case-sensitive by default)
  // See: https://playwright.dev/docs/locators
  await page.getByText('CLICK HERE').click();

  // 11. By Role - accessibility-focused selector (recommended)
  await page.getByRole('button', { name: /click here/i }).click();

  // Assert by Counter - verify all 11 clicks were registered
  await expect(page.locator('#counter')).toHaveText('11');
  await expect(page.locator('#counter')).toContainText('11');
});
