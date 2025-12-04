import { chromium } from '@playwright/test';
import type { Browser, Page } from '@playwright/test';

/**
 * TypeScript version of solution.js with comprehensive type annotations and interfaces.
 * This file demonstrates the conversion from JavaScript to TypeScript, highlighting
 * key TypeScript concepts for beginners to understand.
 */

/**
 * Interface defining the structure of table row data
 * This replaces the implicit object structure in JavaScript with explicit typing
 */
interface TableRow {
  company: string;
  contact: string;
  country: string;
}

/**
 * Main asynchronous function that performs web scraping and validation
 * This is the TypeScript equivalent of the original JavaScript IIFE
 */
(async () => {
  // Explicit type annotations for browser and page variables
  let browser: Browser | null = null;
  let page: Page;

  try {
    // Launch browser with explicit type - Browser type from Playwright
    browser = await chromium.launch({ headless: true });

    // Create new page with explicit type - Page type from Playwright
    page = await browser.newPage();

    // Navigate to target URL with explicit navigation options
    await page.goto('https://www.w3schools.com/html/html_tables.asp', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // =============================================
    // PAGE VALIDATION SECTION
    // =============================================

    // Check page title with explicit string types
    const expectedTitle: string = 'HTML Tables';
    const actualTitle: string = await page.title();

    if (actualTitle !== expectedTitle) {
      console.error(`\x1b[31m Error: Page title mismatch! Expected '${expectedTitle}', but got '${actualTitle}'. \x1b[0m`);
    }

    // Check page URL with explicit string types
    const expectedURL: string = 'https://www.w3schools.com/html/html_tables.asp';
    const actualURL: string = page.url() || '';

    if (actualURL !== expectedURL) {
      console.error(`\x1b[31m Error: Page URL mismatch! Expected '${expectedURL}', but got '${actualURL}'. \x1b[0m`);
    }

    // =============================================
    // ERROR HANDLING SECTION
    // =============================================

    // Set up JavaScript error listener with explicit error type
    page.on('pageerror', (error: Error) => {
      console.error(`\x1b[31m Error: JavaScript error! ${error.message} \x1b[0m`);
    });

    // Define expected columns as const array of strings
    const expectedColumns: string[] = ['Company', 'Contact', 'Country'];

    // =============================================
    // TABLE VALIDATION SECTION
    // =============================================

    // Check if table exists with explicit type annotation
    const tableSelector: string = 'table#customers';
    const tableExists: boolean = await page.$(tableSelector) !== null;

    if (!tableExists) {
      console.error(`\x1b[31m Error: Table not found! Selector '${tableSelector}' may have changed. \x1b[0m`);
      await browser.close();
      return;
    }

    // =============================================
    // COLUMN HEADER EXTRACTION
    // =============================================

    // Extract column headers with explicit type annotations
    const columnHeadersSelector: string = 'table#customers th';
    const columnHeaders: string[] = await page.$$eval(columnHeadersSelector, headers =>
      headers.map(header => (header as HTMLElement).textContent?.trim() || '')
    );

    if (columnHeaders.length === 0) {
      console.error(`\x1b[31m Error: No column headers found! Selector '${columnHeadersSelector}' may have changed. \x1b[0m`);
      await browser.close();
      return;
    }

    // =============================================
    // COLUMN STRUCTURE VALIDATION
    // =============================================

    // Check if column headers match expected columns
    // Using JSON.stringify for deep comparison of arrays
    if (JSON.stringify(columnHeaders.sort()) !== JSON.stringify(expectedColumns.sort())) {
      console.log(`\x1b[31m Warning: Table structure has changed! \x1b[0m`);
      console.log(`Expected columns: ${expectedColumns.join(', ')}`);
      console.log(`Actual columns: ${columnHeaders.join(', ')}`);

      // TypeScript array methods with explicit type inference
      const addedColumns: string[] = columnHeaders.filter(column => !expectedColumns.includes(column));
      const deletedColumns: string[] = expectedColumns.filter(column => !columnHeaders.includes(column));

      if (addedColumns.length > 0) {
        console.log(`\x1b[32m Added columns: ${addedColumns.join(', ')} \x1b[0m`);
      }

      if (deletedColumns.length > 0) {
        console.log(`\x1b[31m Deleted columns: ${deletedColumns.join(', ')} \x1b[0m`);
      }
    } else {
      console.log(`\x1b[32m Table structure is intact! \x1b[0m`);
    }

    // =============================================
    // TABLE DATA EXTRACTION
    // =============================================

    // Extract table data with explicit TableRow interface
    const rowsSelector: string = 'table#customers tr';
    const rows: TableRow[] = await page.$$eval(rowsSelector, rows =>
      rows.map(r => {
        const cells = r.querySelectorAll('td');
        return cells.length >= 3
          ? {
              company: (cells[0] as HTMLElement).textContent?.trim() || '',
              contact: (cells[1] as HTMLElement).textContent?.trim() || '',
              country: (cells[2] as HTMLElement).textContent?.trim() || ''
            }
          : null;
      }).filter((row): row is TableRow => row !== null)
    );

    if (rows.length === 0) {
      console.error(`\x1b[31m Error: No rows found! Selector '${rowsSelector}' may have changed. \x1b[0m`);
    }

    // =============================================
    // OUTPUT RESULTS
    // =============================================

    // Output the extracted data with proper formatting
    console.log(JSON.stringify(rows, null, 2));

  } catch (error) {
    // TypeScript error handling with explicit error type
    console.error(`\x1b[31m Unexpected error occurred: ${(error as Error).message} \x1b[0m`);
  } finally {
    // Ensure browser is always closed, even if errors occur
    if (browser) {
      await browser.close();
    }
  }
})();

/**
 * KEY TYPESCRIPT CONCEPTS DEMONSTRATED IN THIS CONVERSION:
 *
 * 1. INTERFACES: The TableRow interface defines the structure of table data,
 *    providing compile-time type checking and better code documentation.
 *
 * 2. EXPLICIT TYPES: Variables are annotated with specific types (string, boolean, arrays)
 *    instead of relying on JavaScript's dynamic typing.
 *
 * 3. TYPE INFERENCE: TypeScript can infer types in many cases, but explicit annotations
 *    make the code more readable and maintainable.
 *
 * 4. ERROR HANDLING: Proper try-catch-finally structure with typed Error objects.
 *
 * 5. IMPORTS: TypeScript imports include type information from Playwright.
 *
 * 6. NULL SAFETY: Explicit null checks and proper handling of potentially null values.
 *
 * 7. ARRAY METHODS: Type-safe array operations with proper type inference.
 *
 * This conversion maintains the exact same functionality as the JavaScript version
 * while adding TypeScript's type safety features for better maintainability
 * and developer experience.
 */