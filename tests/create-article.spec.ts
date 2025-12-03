import { test, expect, type Page } from '@playwright/test';

/**
 * @fileoverview Comprehensive article CRUD test demonstrating test.step() for
 * organized test structure. This test covers creating, editing, and deleting
 * articles on https://conduit.bondaracademy.com with proper step-based reporting.
 */

test('Create Article on Conduit', async ({ page }: { page: Page }) => {
  // Test data
  const articleTitle = 'This is a test title';
  const updatedArticleTitle = 'This is an UPDATED edited test title';

  await test.step('Navigate to website', async () => {
    await page.goto('https://conduit.bondaracademy.com');
  });

  await test.step('Login to application', async () => {
    await page.getByText('Sign in').click();
    await page.getByRole('textbox', { name: 'Email' }).fill('tester25@test.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Testing123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Wait for login to complete
    await expect(page.getByRole('link', { name: 'tester25' })).toBeVisible();
  });

  await test.step('Create a new article', async () => {
    await page.getByText('New Article').click();
    await page.getByRole('textbox', { name: 'Article Title' }).fill(articleTitle);
    await page.getByRole('textbox', { name: "What's this article about?" }).fill('This is a test article');
    await page.getByRole('textbox', { name: 'Write your article (in markdown)' }).fill('## Test Content\n\nThis is test content.');
    await page.getByRole('button', { name: 'Publish Article' }).click();
  });

  await test.step('Verify article was created', async () => {
    await expect(page.locator('h1')).toContainText(articleTitle);
  });

  await test.step('Edit the article', async () => {
    await page.getByRole('button', { name: 'Edit Article' }).click();
    await page.getByRole('textbox', { name: 'Article Title' }).fill(updatedArticleTitle);
    await page.getByRole('button', { name: 'Publish Article' }).click();
  });

  await test.step('Verify article was updated', async () => {
    await expect(page.locator('h1')).toContainText(updatedArticleTitle);
  });

  await test.step('Delete the article', async () => {
    await page.getByRole('button', { name: 'Delete Article' }).click();
    
    // Verify we're back on the home page or profile page
    await expect(page.getByText('Global Feed')).toBeVisible();
  });
});