import { test, expect, type Page } from '@playwright/test';

/**
 * @fileoverview Comprehensive article CRUD test demonstrating test.step() for
 * organized test structure. This test covers creating, editing, and deleting
 * articles on https://conduit.bondaracademy.com with proper step-based reporting.
 */

test('Create Article on Conduit', async ({ page }: { page: Page }) => {
  // Test data
  // Conduit enforces unique titles; using a static title will eventually fail with
  // "title must be unique" and the Publish action will not navigate away from /editor.
  const articleTitle = `This is a test title ${Date.now()}`;
  const updatedArticleTitle = `${articleTitle} (UPDATED)`;

  await test.step('Navigate to website', async () => {
    await page.goto('https://conduit.bondaracademy.com');
  });

  await test.step('Login to application', async () => {
    await page.getByText('Sign in').click();
    await page.getByRole('textbox', { name: 'Email' }).fill('tester26@test.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Testing123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Wait for login to complete
    await expect(page.getByRole('link', { name: 'tester26' })).toBeVisible();
  });

  await test.step('Create a new article', async () => {
    await page.getByText('New Article').click();

    // The editor's title field is exposed with the accessible name "Article Title"
    // (see error-context.md snapshot). The previous locator used a non-existent name.
    const articleTitleInput = page.getByRole('textbox', { name: 'Article Title' });
    await expect(articleTitleInput).toBeVisible();
    await articleTitleInput.fill(articleTitle);

    await page.getByRole('textbox', { name: "What's this article about?" }).fill('This is an article about testing bugs and reptiles and squashing ants.');
    await page.getByRole('textbox', { name: 'Write your article (in markdown)' }).fill('## Test Content\n\nThis is test content with some reptiles.');
    await page.getByRole('button', { name: 'Publish Article' }).click();

    // Publishing should navigate to the article details page
    await page.waitForURL(/\/article\//);
  });

  await test.step('Verify article was created', async () => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText(articleTitle);
  });

  await test.step('Edit the article', async () => {
    // "Edit Article" is rendered as a link, not a button, on the article page.
    await page.getByRole('link', { name: /Edit Article/ }).first().click();
    await page.getByRole('textbox', { name: 'Article Title' }).fill(updatedArticleTitle);
    await page.getByRole('button', { name: 'Publish Article' }).click();

    // Publishing the edit navigates back to the article details page
    await page.waitForURL(/\/article\//);
  });

  await test.step('Verify article was updated', async () => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText(updatedArticleTitle);
  });

  await test.step('Delete the article', async () => {
    // There can be multiple "Delete Article" buttons (e.g., header + footer).
    await page.getByRole('button', { name: /Delete Article/ }).first().click();
    
    // Verify we're back on the home page or profile page
    await expect(page.getByText('Global Feed')).toBeVisible();
  });
});
