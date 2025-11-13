 import {test, expect} from '@playwright/test';

 test.describe.only("Learn Assertions", () =>{
    test('Verify web page behavior', async ({page}) => {
        await page.goto('https://the-internet.herokuapp.com/')
        // 1. Does this page exist?
        await expect(page).toHaveURL('https://the-internet.herokuapp.com/')
        //2. Does it have a title?
        await expect(page).toHaveTitle('The Internet')
    })
    test('Continue with Assertions', async ({page}) => {
        await page.goto('https://the-internet.herokuapp.com/')
        //3.  Assert visibility
        await expect(page.locator('h1')).toBeVisible()
        //4. Assert Element to have text
        const locator = page.locator('h2')
        await expect(locator).toHaveText('Available Examples')
        await expect(page.getByText('Welcome to the-internet')).toBeVisible()
        //5. Assert Contains some text
        await expect(page.locator('body')).toContainText('WYSIWYG')
    })
    test('Continue with Assertions Part 2', async ({page}) => {
        await page.goto('https://the-internet.herokuapp.com/')
        //6. Assert count
        await expect(page.locator('a')).toHaveCount(46)
        //7. To be Checked & Unchecked
        await page.goto('https://the-internet.herokuapp.com/checkboxes')
        await page.getByRole('checkbox').nth(0).check()
        await page.getByRole('checkbox').nth(1).uncheck()
        // Now verify that the 1st one is checked and the 2nd one is unchecked
        await expect(page.getByRole('checkbox').nth(0)).toBeChecked()
        await expect(page.getByRole('checkbox').nth(1)).not.toBeChecked()
    })
    test('Continue with Assertions Part 3', async ({page}) => {
        await page.goto('https://the-internet.herokuapp.com/login')
        //8. Have Value
        await page.locator('#username').fill('tomsmith')
        await expect(page.locator('#username')).toHaveValue('tomsmith')
        //9. Element is enabled
        await expect(page.locator('button[type="submit"]')).toBeEnabled()
    })    
    test('Continue with Assertions Part 4', async ({page}) => {
        await page.goto('https://the-internet.herokuapp.com/')
        //8. Verify Text was stored in variable
        const headerText = await page.locator('h1').textContent()
        expect(headerText).toBe('Welcome to the-internet')
    })    
 })