/**
 * POM Tests - Page Object Model Test Specifications
 *
 * This test file demonstrates the usage of TypeScript with Playwright
 * and the Page Object Model pattern.
 *
 * TypeScript Features Demonstrated:
 * - Strongly typed test fixtures (page parameter)
 * - Type-safe page object usage
 * - Typed variable declarations
 * - Async/await with proper Promise handling
 */
import { expect, test } from '@playwright/test';

import PomManager from '../pages/PomManager';
import type { ICheckboxesPage, ILoginPage, ISecurePage } from '../types/pages.types';

/**
 * Login Page Tests using Page Object Model
 *
 * These tests verify the login functionality using properly typed
 * page objects for maintainability and type safety.
 */
test.describe('Login Page Tests (POM)', () => {
  // Declare typed variables for page objects
  let pomManager: PomManager;
  let loginPage: ILoginPage;
  let securePage: ISecurePage;

  /**
   * Before each test:
   * 1. Create a new PomManager with the test's page instance
   * 2. Get the typed page objects
   * 3. Navigate to the login page
   */
  test.beforeEach(async ({ page }) => {
    pomManager = new PomManager(page);
    loginPage = pomManager.getLoginPage();
    securePage = pomManager.getSecurePage();
    await loginPage.navigate();
  });

  /**
   * Test: Valid credentials should result in successful login
   *
   * This test verifies the happy path of the login flow.
   */
  test('Login with valid credentials shows success message', async () => {
    await loginPage.login('tomsmith', 'SuperSecretPassword!');
    await securePage.assertLoggedInMessage('You logged into a secure area!');
  });

  /**
   * Test: Invalid password should show appropriate error message
   */
  test('Login with invalid password credentials shows error message', async () => {
    await loginPage.login('tomsmith', 'WrongPassword');
    await loginPage.assertErrorMessage('Your password is invalid!');
  });

  /**
   * Test: Invalid username should show appropriate error message
   */
  test('Login with invalid username credentials shows error message', async () => {
    await loginPage.login('WrongUsername', 'SuperSecretPassword!');
    await loginPage.assertErrorMessage('Your username is invalid!');
  });
});

/**
 * Checkboxes Page Tests using Page Object Model
 *
 * These tests verify checkbox functionality including checking,
 * unchecking, toggling, and state validation.
 */
test.describe('Checkboxes Page Tests (POM)', () => {
  let pomManager: PomManager;
  let checkboxesPage: ICheckboxesPage;

  /**
   * Before each test:
   * 1. Create PomManager
   * 2. Get CheckboxesPage instance
   * 3. Navigate to the checkboxes page
   */
  test.beforeEach(async ({ page }) => {
    pomManager = new PomManager(page);
    checkboxesPage = pomManager.getCheckboxesPage();
    await checkboxesPage.actions.navigate('/checkboxes');
  });

  /**
   * Test: Verify ability to uncheck all checkboxes
   */
  test('Uncheck all checkboxes', async () => {
    // First ensure all are checked
    await checkboxesPage.checkAll();

    // Then uncheck all
    await checkboxesPage.uncheckAll();

    // Verify all are unchecked
    const states = await checkboxesPage.getCheckboxStates();
    expect(states).toEqual([false, false]);
  });

  /**
   * Test: Toggle functionality should flip checkbox state
   */
  test('Toggle checkbox state by index', async () => {
    // Toggle first checkbox twice and verify state each time
    await checkboxesPage.toggleCheckbox(1);
    await checkboxesPage.validateCheckboxState(1, true);

    await checkboxesPage.toggleCheckbox(1);
    await checkboxesPage.validateCheckboxState(1, false);
  });

  /**
   * Test: Individual checkbox checking by index
   */
  test('Check individual checkbox by index and validate', async () => {
    await checkboxesPage.checkCheckbox(1);
    await checkboxesPage.validateCheckboxState(1, true);

    await checkboxesPage.checkCheckbox(2);
    await checkboxesPage.validateCheckboxState(2, true);
  });

  /**
   * Test: Handle unknown initial state gracefully
   *
   * This test demonstrates handling checkboxes that may start
   * in any state and normalizing them to a known state.
   */
  test('Test checkbox states when starting from unknown state', async () => {
    // Get current states first
    const initialStates = await checkboxesPage.getCheckboxStates();

    // Normalize to a known state based on current values
    if (initialStates[0] === false) {
      await checkboxesPage.checkCheckbox(1);
    }

    if (initialStates[1] === true) {
      await checkboxesPage.uncheckCheckbox(2);
    }

    // Verify the normalized state
    await checkboxesPage.validateCheckboxState(1, true);
    await checkboxesPage.validateCheckboxState(2, false);
  });

  /**
   * Test: Bulk validation of all checkbox states
   */
  test('Validate all checkbox states together', async () => {
    await checkboxesPage.checkCheckbox(1);
    await checkboxesPage.uncheckCheckbox(2);
    await checkboxesPage.validateAllCheckboxStates([true, false]);
  });
});
