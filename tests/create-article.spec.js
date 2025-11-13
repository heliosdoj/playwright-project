import { test, expect } from '@playwright/test';

test('Create a new article', async ({ page }) => {
  // Generate a unique article title using timestamp
  const timestamp = Date.now();
  const articleTitle = `Test Automation with Playwright ${timestamp}`;
  const articleDescription = 'Learn how to automate web applications using Playwright framework';
  const articleBody = 'Playwright is a powerful framework for web testing and automation. It supports multiple browsers and provides excellent developer experience with auto-waiting and reliable selectors.';

  // Step 1: Navigate to the application
  await test.step('Navigate to Conduit application', async () => {
    await page.goto('https://conduit.bondaracademy.com/');
    await expect(page).toHaveTitle(/conduit/i);
  });

  // Step 2: Click Sign In button and verify login page
  await test.step('Navigate to Sign In page', async () => {
    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  // Step 3: Login with credentials
  await test.step('Login with valid credentials', async () => {
    await page.getByPlaceholder('Email').fill('pwtest@test.com');
    await page.getByPlaceholder('Password').fill('Welcome2');
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Verify user is logged in and redirected to home page
    await expect(page.getByRole('link', { name: 'pwtest' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'New Article' })).toBeVisible();
  });

  // Step 4: Navigate to New Article page
  await test.step('Navigate to New Article editor', async () => {
    await page.getByRole('link', { name: 'New Article' }).click();
    await expect(page.getByPlaceholder('Article Title')).toBeVisible();
    await page.pause()
  });

  // Step 5: Fill out the article form and publish
  await test.step('Create and publish new article', async () => {
    await page.getByPlaceholder('Article Title').fill(articleTitle);
    await page.getByPlaceholder("What's this article about?").fill(articleDescription);
    await page.getByPlaceholder('Write your article (in markdown)').fill(articleBody);
    await page.getByRole('button', { name: 'Publish Article' }).click();
    
    // Verify article details page is displayed
    await expect(page.getByRole('heading', { name: articleTitle })).toBeVisible();
    await expect(page.getByText(articleBody)).toBeVisible();
    
    // Verify Edit and Delete buttons are visible
    await expect(page.getByRole('link', { name: 'Edit Article' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete Article' }).first()).toBeVisible();
    
    // Verify comments section is visible
    await expect(page.getByPlaceholder('Write a comment...')).toBeVisible();
  });

  // Step 6: Navigate to Home and verify article is in Global Feed
  await test.step('Verify article appears in Global Feed', async () => {
    await page.getByRole('link', { name: 'Home' }).click();
    
    // Verify Global Feed tab is visible
    await expect(page.getByText('Global Feed')).toBeVisible();
    
    // Verify the newly created article is the first in the list
    const firstArticle = page.locator('.article-preview').first();
    await expect(firstArticle.getByRole('heading', { name: articleTitle })).toBeVisible();
    await expect(firstArticle.getByText(articleDescription)).toBeVisible();
  });

  // Step 7: Click on the newly created article
  await test.step('Navigate to article details page', async () => {
    await page.locator('.article-preview').first().getByRole('heading', { name: articleTitle }).click();
    
    // Verify article details page is opened
    await expect(page.getByRole('heading', { name: articleTitle })).toBeVisible();
    await expect(page.getByText(articleBody)).toBeVisible();
  });

  // Step 8: Delete the article
  await test.step('Delete the article', async () => {
    await page.getByRole('button', { name: 'Delete Article' }).first().click();
    
    // Verify redirected to home page
    await expect(page.getByText('Global Feed')).toBeVisible();
    
    // Verify the article is no longer in the list
    await expect(page.getByRole('heading', { name: articleTitle })).not.toBeVisible();
  });
});