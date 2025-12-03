/**
 * PomManager - Page Object Manager
 * 
 * This class implements the Factory pattern for creating and managing
 * page object instances. It provides lazy-loaded, cached access to
 * all page objects in the framework.
 * 
 * TypeScript Features Demonstrated:
 * - Interface implementation with return type covariance
 * - Nullable properties with strict null checks
 * - Type-safe getters with guaranteed non-null returns
 * - Readonly properties for immutability
 * - Private fields with underscore convention
 */

import type { Page } from '@playwright/test';
import LoginPage from './LoginPage';
import SecurePage from './SecurePage';
import CheckboxesPage from './CheckboxesPage';
import type { ILoginPage, ISecurePage, ICheckboxesPage, IPomManager } from '../types/pages.types';


/**
 * Page Object Manager - Factory for creating and caching page objects
 * 
 * This class follows the Singleton-per-test pattern: each test gets its own
 * PomManager instance which then manages page object creation and caching.
 * 
 * Benefits of this approach:
 * - **Lazy Loading**: Page objects are only created when first requested
 * - **Caching**: Subsequent requests return the same instance (saves memory)
 * - **Centralized Creation**: All page objects are created through one place
 * - **Type Safety**: Getter methods return properly typed interfaces
 * 
 * 
 * @example
 * ```typescript
 * // In a test file
 * test('login test', async ({ page }) => {
 *   const pomManager = new PomManager(page);
 *   const loginPage = pomManager.getLoginPage();
 *   await loginPage.navigate();
 *   await loginPage.login('user', 'pass');
 * });
 * ```
 */
export default class PomManager implements IPomManager {
  /**
   * The Playwright Page instance shared by all page objects.
   * Marked as readonly to prevent accidental reassignment.
   */
  public readonly page: Page;

  /**
   * Cached LoginPage instance.
   * Private with underscore convention to indicate internal use.
   * Null until first requested via getLoginPage().
   */
  private _loginPage: LoginPage | null = null;

  /**
   * Cached SecurePage instance.
   * Null until first requested via getSecurePage().
   */
  private _securePage: SecurePage | null = null;

  /**
   * Cached CheckboxesPage instance.
   * Null until first requested via getCheckboxesPage().
   */
  private _checkboxesPage: CheckboxesPage | null = null;

  /**
   * Create a new PomManager instance
   * 
   * @param page - The Playwright Page object to pass to all page objects
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Get the LoginPage instance.
   * 
   * Creates a new LoginPage on first call and caches it for subsequent calls.
   * This lazy-loading pattern helps with:
   * - Memory efficiency (only create what's needed)
   * - Faster test startup (don't create unused page objects)
   * 
   * @returns The LoginPage instance (type-safe, never null)
   * 
   * @example
   * ```typescript
   * const loginPage = pomManager.getLoginPage();
   * await loginPage.login('tomsmith', 'SuperSecretPassword!');
   * ```
   */
  getLoginPage(): ILoginPage {
    // Only create if not already cached
    if (!this._loginPage) {
      this._loginPage = new LoginPage(this.page);
    }
    // TypeScript now knows this is non-null due to the check above
    return this._loginPage;
  }

  /**
   * Get the SecurePage instance.
   * 
   * Creates a new SecurePage on first call and caches it for subsequent calls.
   * 
   * @returns The SecurePage instance (type-safe, never null)
   */
  getSecurePage(): ISecurePage {
    if (!this._securePage) {
      this._securePage = new SecurePage(this.page);
    }
    return this._securePage;
  }

  /**
   * Get the CheckboxesPage instance.
   * 
   * Creates a new CheckboxesPage on first call and caches it for subsequent calls.
   * 
   * @returns The CheckboxesPage instance (type-safe, never null)
   */
  getCheckboxesPage(): ICheckboxesPage {
    if (!this._checkboxesPage) {
      this._checkboxesPage = new CheckboxesPage(this.page);
    }
    return this._checkboxesPage;
  }
}