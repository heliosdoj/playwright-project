import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://ccwstg.int.doj.ca.gov/');
  await page.getByRole('link', { name: 'Processing Queues' }).click();
  await page.getByRole('button', { name: 'New IAR Queue' }).click();
  await page.getByRole('textbox', { name: 'CII Number' }).fill('90123456');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('row', { name: 'CII Number 90123456 Application Type CA Resident Applicant Applicant\'s Name Torres, Carter Date Of Birth 12-25-1985 Folder Condition Electronic Date Queued 09-24-2025', exact: true }).getByRole('link').click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'AFEC Result' }).click();
  const page1 = await page1Promise;
  await expect(page1.getByText('AFEC Result')).toBeVisible();
});