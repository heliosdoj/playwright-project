import { type Page, test } from '@playwright/test';

/**
 * @fileoverview Parallel execution stress test generating 50 dummy tests.
 * This file is used to validate the parallel worker configuration and
 * ensure the test framework can handle multiple concurrent tests efficiently.
 *
 * Each test navigates to example.com and waits briefly, simulating a minimal test load.
 * This is useful for benchmarking test execution time with different worker configurations.
 */

for (let i = 1; i <= 50; i++) {
  test(`dummy test @smoke ${i}`, async ({ page }: { page: Page }) => {
    await page.goto('https://example.com');
    await page.waitForTimeout(100);
  });
}
