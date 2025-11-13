import { test } from '@playwright/test';

for (let i = 1; i <= 20; i++) {
  test(`dummy test ${i}`, async ({ page }) => {
    await page.goto('https://example.com');
    await page.waitForTimeout(100);
  });
}