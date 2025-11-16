// You need hooks when:

// Multiple tests share the same setup (login, navigation, etc.)
// You need one-time expensive operations (database setup, API tokens)
// You need cleanup after tests (delete files, reset database)
// You DON'T need hooks for:

// Browser/page creation and cleanup (fixture handles it)
// Simple tests with unique setup
// Anything the { page } fixture already provides

import { test, expect } from '@playwright/test';

test.describe('Basic Auth Tests', () => {
    test.beforeEach(async ({ page }) => {
        // HTTP Basic Auth requires credentials in the URL
        // Format: https://username:password@domain.com/path
        await page.goto('https://admin:admin@the-internet.herokuapp.com/basic_auth');
        
        // Verify successful authentication
        await expect(page.locator('h3')).toContainText('Basic Auth');
        await expect(page.locator('.example p')).toContainText('Congratulations! You must have the proper credentials.');
    });

    test('Verify authentication success message', async ({ page }) => {
        // Test that we're authenticated and can see the success message
        await expect(page.locator('h3')).toBeVisible();
        await expect(page.locator('.example p')).toContainText('Congratulations');
    });

    test('Verify page title', async ({ page }) => {
        // Test that the page has the correct title
        await expect(page).toHaveTitle('The Internet');
    });
});
