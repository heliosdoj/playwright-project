import { test, expect } from '@playwright/test';

test.only('This is a login test', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
    await page.locator('#username').click();
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').click();
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.locator('#flash')).toContainText(/You logged into a secure area/);
    await expect(page.locator('h4.subheader')).toContainText(/Welcome to the Secure Area. When you are done click logout below./);
    await page.locator('a.button.secondary.radius:has-text("Logout")').click();
    await page.locator('#username').click();
    await page.locator('#username').fill('11');
});