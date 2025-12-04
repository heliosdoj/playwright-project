import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.w3schools.com/html/html_tables.asp', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  // Check page title
  const expectedTitle = 'HTML Tables';
  const actualTitle = await page.title();
  if (actualTitle !== expectedTitle) {
    console.error(`\x1b[31m Error: Page title mismatch! Expected '${expectedTitle}', but got '${actualTitle}'. \x1b[0m`);
  }

  // Check page URL
  const expectedURL = 'https://www.w3schools.com/html/html_tables.asp';
  const actualURL = page.url();
  if (actualURL !== expectedURL) {
    console.error(`\x1b[31m Error: Page URL mismatch! Expected '${expectedURL}', but got '${actualURL}'. \x1b[0m`);
  }

  // Check for JavaScript errors
  page.on('pageerror', (error) => {
    console.error(`\x1b[31m Error: JavaScript error! ${error.message} \x1b[0m`);
  });

  const expectedColumns = ['Company', 'Contact', 'Country'];

  // Check if table exists
  const tableSelector = 'table#customers';
  const tableExists = await page.$(tableSelector);
  if (!tableExists) {
    console.error(`\x1b[31m Error: Table not found! Selector '${tableSelector}' may have changed. \x1b[0m`);
    await browser.close();
    return;
  }

  // Extract column headers
  const columnHeadersSelector = 'table#customers th';
  const columnHeaders = await page.$$eval(columnHeadersSelector, headers =>
    headers.map(header => header.textContent?.trim() || '')
  );

  if (columnHeaders.length === 0) {
    console.error(`\x1b[31m Error: No column headers found! Selector '${columnHeadersSelector}' may have changed. \x1b[0m`);
    await browser.close();
    return;
  }

  // Check if column headers match expected columns
  if (JSON.stringify(columnHeaders.sort()) !== JSON.stringify(expectedColumns.sort())) {
    console.log(`\x1b[31m Warning: Table structure has changed! \x1b[0m`);
    console.log(`Expected columns: ${expectedColumns.join(', ')}`);
    console.log(`Actual columns: ${columnHeaders.join(', ')}`);

    // Check for added or deleted columns
    const addedColumns = columnHeaders.filter(column => !expectedColumns.includes(column));
    const deletedColumns = expectedColumns.filter(column => !columnHeaders.includes(column));

    if (addedColumns.length > 0) {
      console.log(`\x1b[32m Added columns: ${addedColumns.join(', ')} \x1b[0m`);
    }

    if (deletedColumns.length > 0) {
      console.log(`\x1b[31m Deleted columns: ${deletedColumns.join(', ')} \x1b[0m`);
    }
  } else {
    console.log(`\x1b[32m Table structure is intact! \x1b[0m`);
  }

  // Extract table data
  const rowsSelector = 'table#customers tr';
  const rows = await page.$$eval(rowsSelector, rows =>
    rows.map(r => {
      const [company, contact, country] = r.querySelectorAll('td');
      return company && contact && country
        ? { company: company.textContent?.trim() || '', contact: contact.textContent?.trim() || '', country: country.textContent?.trim() || '' }
        : null;
    }).filter(Boolean)
  );

  if (rows.length === 0) {
    console.error(`\x1b[31m Error: No rows found! Selector '${rowsSelector}' may have changed. \x1b[0m`);
  }

  console.log(JSON.stringify(rows, null, 2));
  await browser.close();
})();
// Sample for production CCW error check consistency with new CJIS codes.