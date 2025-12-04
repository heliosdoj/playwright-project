/**
 * SecurePage - Page Object for the Secure Area
 *
 * This class represents the protected page shown after successful login.
 * It encapsulates the logic for reading and validating the flash message.
 *
 * TypeScript Features Demonstrated:
 * - Interface implementation (ISecurePage)
 * - Readonly properties
 * - String type for CSS selector (vs Locator)
 * - Async methods with Promise return types
 */
import { type Page, expect } from '@playwright/test';

import type { ISecurePage } from '../types/pages.types';
import CommonActions from '../utils/CommonActions';

/**
 * Page Object representing the Secure Area page
 *
 * This is the page displayed after a successful login at /secure.
 * It contains a flash message confirming the login status.
 *
 *
 * @example
 * ```typescript
 * const securePage = new SecurePage(page);
 * await securePage.assertLoggedInMessage('You logged into a secure area!');
 * ```
 */
export default class SecurePage implements ISecurePage {
  /** Playwright Page instance for browser interaction */
  public readonly page: Page;

  /** CommonActions utility instance for reusable browser actions */
  public readonly actions: CommonActions;

  /**
   * CSS selector for the flash message element.
   *
   * Note: This is stored as a string selector rather than a Locator
   * because the element might not exist when the page object is created.
   * The selector is used with CommonActions which handles the conversion.
   */
  public readonly flashMessage: string;

  /**
   * Create a new SecurePage instance
   *
   * @param page - The Playwright Page object to interact with
   */
  constructor(page: Page) {
    // Store the page instance
    this.page = page;

    // Initialize CommonActions for consistent action handling
    this.actions = new CommonActions(page);

    // Define the flash message selector
    // Using a CSS selector with ID for reliable element identification
    this.flashMessage = '#flash';
  }

  /**
   * Get the text content of the flash message.
   *
   * This method waits for the flash element to be visible before
   * reading its text content.
   *
   * @returns The message text, or empty string if not found
   */
  async getMessage(): Promise<string> {
    // Use CommonActions getText which handles visibility waiting and trimming
    // The timeout is extended to 8000ms to account for potential page transitions
    const message = await this.actions.getText(this.flashMessage, { timeout: 8000 });
    return message ?? '';
  }

  /**
   * Assert that the logged-in message contains the expected text.
   *
   * This is a convenience method that combines getMessage() with
   * Playwright's expect assertion.
   *
   * @param passedMessage - The text expected to be in the message
   * @throws {Error} If the message doesn't contain the expected text
   *
   * @example
   * ```typescript
   * // Will pass if message contains the expected text
   * await securePage.assertLoggedInMessage('You logged into a secure area!');
   *
   * // Will fail with assertion error if text not found
   * await securePage.assertLoggedInMessage('Wrong message');
   * ```
   */
  async assertLoggedInMessage(passedMessage: string): Promise<void> {
    // Get the actual message from the page
    const message = await this.getMessage();

    // Use Playwright's expect for clear assertion errors
    expect(message).toContain(passedMessage);
  }
}
