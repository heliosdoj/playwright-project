/**
 * LoginPage - Page Object for the Login page
 *
 * This class encapsulates all interactions with the login form,
 * including navigation, credential entry, and message validation.
 *
 * TypeScript Features Demonstrated:
 * - Interface implementation (ILoginPage)
 * - Readonly properties for immutability
 * - Strongly typed method parameters and returns
 * - Promise-based async methods with proper return types
 */
import { type Locator, type Page, expect } from '@playwright/test';

import type { ILoginPage } from '../types/pages.types';
import CommonActions from '../utils/CommonActions';

/**
 * Page Object representing the Login page at /login
 *
 *
 * @example
 * ```typescript
 * const loginPage = new LoginPage(page);
 * await loginPage.navigate();
 * await loginPage.login('tomsmith', 'SuperSecretPassword!');
 * ```
 */
export default class LoginPage implements ILoginPage {
  /** Playwright Page instance for browser interaction */
  public readonly page: Page;

  /** CommonActions utility instance for reusable browser actions */
  public readonly actions: CommonActions;

  /** Locator for the username input field */
  public readonly usernameInput: Locator;

  /** Locator for the password input field */
  public readonly passwordInput: Locator;

  /** Locator for the login submit button */
  public readonly loginButton: Locator;

  /** Locator for error/flash messages */
  public readonly errorMessage: Locator;

  /**
   * Create a new LoginPage instance
   *
   * @param page - The Playwright Page object to interact with
   */
  constructor(page: Page) {
    // Store the page instance for direct access when needed
    this.page = page;

    // Initialize CommonActions for consistent action handling
    // This wraps all Playwright interactions with robust defaults
    this.actions = new CommonActions(page);

    // Define all locators used on this page
    // Storing them as class properties makes maintenance easier
    // and provides IntelliSense support in tests
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('#flash');
  }

  /**
   * Navigate to the login page.
   *
   * Uses the baseURL from playwright.config.ts, so only the
   * relative path is needed.
   */
  async navigate(): Promise<void> {
    await this.actions.navigate('/login');
  }

  /**
   * Perform a login with the provided credentials.
   *
   * This method:
   * 1. Fills the username field
   * 2. Fills the password field
   * 3. Clicks the submit button
   *
   * @param username - The username to enter
   * @param password - The password to enter
   *
   * @example
   * ```typescript
   * await loginPage.login('tomsmith', 'SuperSecretPassword!');
   * ```
   */
  async login(username: string, password: string): Promise<void> {
    // Use CommonActions helpers which automatically:
    // - Wait for elements to be ready
    // - Apply consistent timeouts
    // - Keep all low-level Playwright calls centralized
    await this.actions.fill(this.usernameInput, username);
    await this.actions.fill(this.passwordInput, password);
    await this.actions.click(this.loginButton);
  }

  /**
   * Get the text content of the error/flash message element.
   *
   * @returns The trimmed message text, or undefined if not found
   */
  async getErrorMessage(): Promise<string | undefined> {
    // getText() will wait for visibility, apply a timeout, and trim whitespace
    return this.actions.getText(this.errorMessage);
  }

  /**
   * Assert that the error message contains the expected text.
   *
   * This method fetches the current message and uses Playwright's
   * expect to verify it contains the expected substring.
   *
   * @param expectedMessage - The text expected to be in the error message
   * @throws {Error} If the message doesn't contain the expected text
   */
  async assertErrorMessage(expectedMessage: string): Promise<void> {
    const actualMessage = await this.getErrorMessage();
    expect(actualMessage).toContain(expectedMessage);
  }

  /**
   * Assert that the success message contains the expected text.
   *
   * Note: In this demo app, success messages appear in the same
   * #flash element as error messages.
   *
   * @param expectedMessage - The text expected to be in the success message
   * @throws {Error} If the message doesn't contain the expected text
   */
  async assertSuccessMessage(expectedMessage: string): Promise<void> {
    const actualMessage = await this.getErrorMessage();
    expect(actualMessage).toContain(expectedMessage);
  }
}
