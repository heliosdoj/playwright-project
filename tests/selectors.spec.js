import { test, expect } from '@playwright/test';

test("Learning Selectors", async ({page}) => {
    // navigate to the webpage
    await page.goto('file://' + process.cwd() + '/clickme.html');
    
    // 1 Selecting by ID
    await page.locator('#clickButton').click();
   
    // 2 Selecting by Class
    await page.locator('.button-style').click();
   
    // 3 By Tag and Class
    await page.locator('button.button-style').click();
   
    // 4 By Attribute Value
    await page.locator('[data-action="increment"]').click();
    //await page.locator('[id="clickButton"]').click();
    //await page.locator('[class="button-style"]').click();
   
    // 5 Partial attribute
    await page.locator('[role*="but"]').click();
   
    // 6 By text content 
    await page.locator('text=CLICK HERE').click();
   
    // 7 Combine selectors for precision, class and text - find exact text match
    await page.locator('.button-style:text("CLICK HERE")').click();
    
    // 8 Find elements containing specific text, has-text
    await page.locator('button:has-text("click h")').click();
   
    // 9 Attribute and text combination 
    await page.locator('[data-action="increment"]:text("CLICK HERE")').click();
    
    // 10 Playwright Locators  https://playwright.dev/docs/locators
    // get by text
    await page.getByText('CLICK HERE').click();
   
     // 11 By Role
    await page.getByRole('button', { name: /click here/i }).click();

    // Assert by Counter
    await expect(page.locator('#counter')).toHaveText('11');
    await expect(page.locator('#counter')).toContainText('11'); 

    await page.pause()
});