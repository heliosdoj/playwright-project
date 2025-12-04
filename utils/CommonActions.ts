/**
 * CommonActions - Reusable browser action utility class
 *
 * This class provides a type-safe wrapper around common Playwright actions,
 * with consistent timeout handling, waiting strategies, and error handling.
 *
 * TypeScript Features Demonstrated:
 * - Strong typing for all parameters and return values
 * - Union types for flexible selector input (string | Locator)
 * - Interface-based options for each action method
 * - Readonly page property for immutability
 * - Private helper methods with underscore convention
 */
import type { Locator, Page } from '@playwright/test';

import type {
  CheckOptions,
  ClickOptions,
  FillOptions,
  GetAttributeOptions,
  GetTextOptions,
  LoadState,
  NavigateOptions,
  SelectOptions,
  SelectorOrLocator,
  TypeOptions,
  VisibilityOptions,
  WaitForUrlOptions,
  WaitOptions,
} from '../types/actions.types';

/**
 * CommonActions provides reusable, type-safe browser interaction methods.
 *
 * All page objects should instantiate this class to ensure consistent
 * behavior across the test suite.
 *
 * @example
 * ```typescript
 * class LoginPage implements ILoginPage {
 *   public readonly actions: CommonActions;
 *
 *   constructor(page: Page) {
 *     this.actions = new CommonActions(page);
 *   }
 * }
 * ```
 */
export default class CommonActions {
  /**
   * The Playwright Page instance for browser interaction.
   * Marked as readonly to prevent accidental reassignment.
   */
  public readonly page: Page;

  /**
   * Create a new CommonActions instance
   * @param page - The Playwright Page object to wrap
   */
  constructor(page: Page) {
    this.page = page;
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Resolve a selector string or Locator to a Playwright Locator.
   * This allows action methods to accept either format for flexibility.
   *
   * @param selectorOrLocator - A CSS selector string or existing Locator
   * @returns A Playwright Locator instance
   * @private
   */
  private _getLocator(selectorOrLocator: SelectorOrLocator): Locator {
    return typeof selectorOrLocator === 'string'
      ? this.page.locator(selectorOrLocator)
      : selectorOrLocator;
  }

  // ============================================================================
  // Navigation Methods
  // ============================================================================

  /**
   * Navigate to a URL and wait for the page to load.
   *
   * @param url - The URL to navigate to (can be relative if baseURL is set)
   * @param options - Navigation options
   *
   * @example
   * ```typescript
   * await actions.navigate('/login');
   * await actions.navigate('https://example.com', { waitUntil: 'networkidle' });
   * ```
   */
  async navigate(url: string, options: NavigateOptions = {}): Promise<void> {
    const { waitUntil = 'domcontentloaded', timeout = 30_000 } = options;
    await this.page.goto(url, { waitUntil, timeout });
  }

  // ============================================================================
  // Click & Interaction Methods
  // ============================================================================

  /**
   * Click on an element after waiting for it to be visible.
   *
   * @param selectorOrLocator - Element selector or Locator
   * @param options - Click options
   *
   * @example
   * ```typescript
   * await actions.click('#submit-button');
   * await actions.click(page.getByRole('button', { name: 'Submit' }));
   * ```
   */
  async click(selectorOrLocator: SelectorOrLocator, options: ClickOptions = {}): Promise<void> {
    const { force = false, timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    await locator.waitFor({ state: 'visible', timeout });
    await locator.click({ force, timeout });
  }

  /**
   * Double-click on an element.
   *
   * @param selectorOrLocator - Element selector or Locator
   */
  async dblClick(selectorOrLocator: SelectorOrLocator): Promise<void> {
    const locator = this._getLocator(selectorOrLocator);
    await locator.dblclick();
  }

  /**
   * Hover over an element.
   *
   * @param selectorOrLocator - Element selector or Locator
   */
  async hover(selectorOrLocator: SelectorOrLocator): Promise<void> {
    const locator = this._getLocator(selectorOrLocator);
    await locator.hover();
  }

  // ============================================================================
  // Form Input Methods
  // ============================================================================

  /**
   * Fill a text input with a value (clears existing content first).
   *
   * @param selectorOrLocator - Input element selector or Locator
   * @param text - The text to fill
   * @param options - Fill options
   *
   * @example
   * ```typescript
   * await actions.fill('#username', 'testuser');
   * await actions.fill(usernameInput, 'admin', { timeout: 5000 });
   * ```
   */
  async fill(
    selectorOrLocator: SelectorOrLocator,
    text: string,
    options: FillOptions = {},
  ): Promise<void> {
    const { timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    await locator.fill(text, { timeout });
  }

  /**
   * Type text character by character with a delay between keystrokes.
   * Useful for inputs that have character-by-character validation.
   *
   * @param selectorOrLocator - Input element selector or Locator
   * @param text - The text to type
   * @param options - Type options
   *
   * @example
   * ```typescript
   * await actions.type('#username', 'testuser', { delay: 50 });
   * ```
   */
  async type(
    selectorOrLocator: SelectorOrLocator,
    text: string,
    options: TypeOptions = {},
  ): Promise<void> {
    const { delay = 100, timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    await locator.pressSequentially(text, { delay, timeout });
  }

  /**
   * Clear the contents of an input field.
   *
   * @param selectorOrLocator - Input element selector or Locator
   */
  async clear(selectorOrLocator: SelectorOrLocator): Promise<void> {
    const locator = this._getLocator(selectorOrLocator);
    await locator.fill('');
  }

  // ============================================================================
  // Select & Checkbox Methods
  // ============================================================================

  /**
   * Select an option from a dropdown/select element.
   *
   * @param selectorOrLocator - Select element selector or Locator
   * @param valueOrText - The value or visible text of the option to select
   * @param options - Select options
   *
   * @example
   * ```typescript
   * await actions.selectOption('#country', 'US');
   * await actions.selectOption(countrySelect, { value: 'US', label: 'United States' });
   * ```
   */
  async selectOption(
    selectorOrLocator: SelectorOrLocator,
    valueOrText: string | string[] | { value?: string; label?: string; index?: number },
    options: SelectOptions = {},
  ): Promise<void> {
    const { timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    await locator.selectOption(valueOrText, { timeout });
  }

  /**
   * Check a checkbox or radio button.
   *
   * @param selectorOrLocator - Checkbox element selector or Locator
   * @param options - Check options
   *
   * @example
   * ```typescript
   * await actions.check('#agree-checkbox');
   * await actions.check(agreeCheckbox, { timeout: 5000 });
   * ```
   */
  async check(selectorOrLocator: SelectorOrLocator, options: CheckOptions = {}): Promise<void> {
    const { timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    await locator.check({ timeout });
  }

  /**
   * Uncheck a checkbox.
   *
   * @param selectorOrLocator - Checkbox element selector or Locator
   */
  async uncheck(selectorOrLocator: SelectorOrLocator): Promise<void> {
    const locator = this._getLocator(selectorOrLocator);
    await locator.uncheck();
  }

  /**
   * Get the checked state of a checkbox.
   *
   * @param selectorOrLocator - Checkbox element selector or Locator
   * @param options - Options
   * @returns True if checked, false otherwise
   *
   * @example
   * ```typescript
   * const isChecked = await actions.isChecked('#agree-checkbox');
   * ```
   */
  async isChecked(
    selectorOrLocator: SelectorOrLocator,
    options: CheckOptions = {},
  ): Promise<boolean> {
    const { timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    await locator.waitFor({ state: 'attached', timeout });
    return locator.isChecked();
  }

  // ============================================================================
  // Read & Assert Methods
  // ============================================================================

  /**
   * Get the text content of an element.
   *
   * @param selectorOrLocator - Element selector or Locator
   * @param options - Options
   * @returns The text content of the element, or undefined if not found
   *
   * @example
   * ```typescript
   * const text = await actions.getText('#welcome-message');
   * const rawText = await actions.getText('#welcome-message', { trim: false });
   * ```
   */
  async getText(
    selectorOrLocator: SelectorOrLocator,
    options: GetTextOptions = {},
  ): Promise<string | undefined> {
    const { timeout = 10_000, trim = true } = options;
    const locator = this._getLocator(selectorOrLocator);
    await locator.waitFor({ state: 'visible', timeout });
    const text = await locator.textContent({ timeout });
    return trim ? text?.trim() : (text ?? undefined);
  }

  /**
   * Get an attribute value from an element.
   *
   * @param selectorOrLocator - Element selector or Locator
   * @param attribute - The attribute name to get
   * @param options - Options
   * @returns The attribute value, or null if not found
   *
   * @example
   * ```typescript
   * const href = await actions.getAttribute('#link', 'href');
   * ```
   */
  async getAttribute(
    selectorOrLocator: SelectorOrLocator,
    attribute: string,
    options: GetAttributeOptions = {},
  ): Promise<string | null> {
    const { timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    await locator.waitFor({ state: 'attached', timeout });
    return locator.getAttribute(attribute);
  }

  /**
   * Check if an element is visible.
   *
   * @param selectorOrLocator - Element selector or Locator
   * @param options - Options
   * @returns True if visible, false otherwise
   *
   * @example
   * ```typescript
   * const isVisible = await actions.isVisible('#submit-button');
   * ```
   */
  async isVisible(
    selectorOrLocator: SelectorOrLocator,
    options: VisibilityOptions = {},
  ): Promise<boolean> {
    const { timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    return locator.isVisible({ timeout });
  }

  /**
   * Check if an element is hidden.
   *
   * @param selectorOrLocator - Element selector or Locator
   * @param options - Options
   * @returns True if hidden, false otherwise
   *
   * @example
   * ```typescript
   * const isHidden = await actions.isHidden('#loading-spinner');
   * ```
   */
  async isHidden(
    selectorOrLocator: SelectorOrLocator,
    options: VisibilityOptions = {},
  ): Promise<boolean> {
    const { timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    return locator.isHidden({ timeout });
  }

  /**
   * Check if an element is enabled.
   *
   * @param selectorOrLocator - Element selector or Locator
   * @param options - Options
   * @returns True if enabled, false otherwise
   *
   * @example
   * ```typescript
   * const isEnabled = await actions.isEnabled('#submit-button');
   * ```
   */
  async isEnabled(
    selectorOrLocator: SelectorOrLocator,
    options: VisibilityOptions = {},
  ): Promise<boolean> {
    const { timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    return locator.isEnabled({ timeout });
  }

  /**
   * Check if an element is disabled.
   *
   * @param selectorOrLocator - Element selector or Locator
   * @param options - Options
   * @returns True if disabled, false otherwise
   *
   * @example
   * ```typescript
   * const isDisabled = await actions.isDisabled('#submit-button');
   * ```
   */
  async isDisabled(
    selectorOrLocator: SelectorOrLocator,
    options: VisibilityOptions = {},
  ): Promise<boolean> {
    const { timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    return locator.isDisabled({ timeout });
  }

  // ============================================================================
  // Wait Methods
  // ============================================================================

  /**
   * Wait for an element to reach a specific state.
   *
   * @param selectorOrLocator - Element selector or Locator
   * @param options - Wait options
   * @returns Promise that resolves when the element reaches the desired state
   *
   * @example
   * ```typescript
   * await actions.waitFor('#loading-spinner', { state: 'hidden' });
   * ```
   */
  async waitFor(selectorOrLocator: SelectorOrLocator, options: WaitOptions = {}): Promise<void> {
    const { state = 'visible', timeout = 10_000 } = options;
    await this._getLocator(selectorOrLocator).waitFor({ state, timeout });
  }

  /**
   * Wait for the page URL to match an expected value.
   *
   * @param expectedUrl - The expected URL (string or RegExp)
   * @param options - Wait options
   * @returns Promise that resolves when the URL matches the expected value
   *
   * @example
   * ```typescript
   * await actions.waitForUrl('https://example.com/success');
   * await actions.waitForUrl(/success/);
   * ```
   */
  async waitForUrl(expectedUrl: string | RegExp, options: WaitForUrlOptions = {}): Promise<void> {
    const { timeout = 30_000 } = options;
    await this.page.waitForURL(expectedUrl, { timeout });
  }

  /**
   * Wait for the page to reach a specific load state.
   *
   * @param state - The load state to wait for (default: 'networkidle')
   * @param timeout - Maximum time to wait in ms (default: 30000)
   */
  async waitForLoadState(
    state: LoadState = 'networkidle',
    timeout: number = 30_000,
  ): Promise<void> {
    await this.page.waitForLoadState(state, { timeout });
  }

  // ============================================================================
  // File Upload Methods
  // ============================================================================

  /**
   * Upload a file to a file input element.
   *
   * @param selectorOrLocator - File input element selector or Locator
   * @param filePath - Path to the file to upload (or array of paths)
   */
  async uploadFile(
    selectorOrLocator: SelectorOrLocator,
    filePath: string | string[],
  ): Promise<void> {
    const locator = this._getLocator(selectorOrLocator);
    await locator.setInputFiles(filePath);
  }

  // ============================================================================
  // Count Methods
  // ============================================================================

  /**
   * Count the number of elements matching a selector.
   *
   * @param selectorOrLocator - Element selector or Locator
   * @returns The number of matching elements
   */
  async count(selectorOrLocator: SelectorOrLocator): Promise<number> {
    return this._getLocator(selectorOrLocator).count();
  }
}
