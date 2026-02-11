/**
 * Type definitions for Page Object Model classes
 * These interfaces define the contract for all page objects in the framework
 */
import type { Locator, Page } from '@playwright/test';

// ============================================================================
// Base Page Interface
// ============================================================================

/**
 * Base interface that all page objects must implement
 * Provides the core dependencies needed for page interaction
 *
 * Note: The actions property uses 'any' type to avoid circular import issues.
 * The actual implementation uses CommonActions class from utils.
 * This is a pragmatic choice - TypeScript strict typing is enforced in the
 * actual page class implementations.
 */
export interface IBasePage {
  /** The Playwright Page instance for browser interaction */
  readonly page: Page;
  /**
   * CommonActions utility instance for reusable browser actions.
   * Typed as 'any' to avoid circular import issues with CommonActions class.
   * @see CommonActions in utils/CommonActions.ts for actual methods available
   */
  readonly actions: any;
}

// ============================================================================
// Login Page Interface
// ============================================================================

/**
 * Interface for the Login page object
 * Represents the login functionality at /login
 */
export interface ILoginPage extends IBasePage {
  /** Locator for the username input field */
  readonly usernameInput: Locator;
  /** Locator for the password input field */
  readonly passwordInput: Locator;
  /** Locator for the login submit button */
  readonly loginButton: Locator;
  /** Locator for error/flash messages */
  readonly errorMessage: Locator;

  /**
   * Navigate to the login page
   */
  navigate(): Promise<void>;

  /**
   * Perform login with the given credentials
   * @param username - The username to enter
   * @param password - The password to enter
   */
  login(username: string, password: string): Promise<void>;

  /**
   * Get the current error/flash message text
   * @returns The trimmed message text, or undefined if not found
   */
  getErrorMessage(): Promise<string | undefined>;

  /**
   * Assert that an error message contains the expected text
   * @param expectedMessage - The text expected to be in the error message
   */
  assertErrorMessage(expectedMessage: string): Promise<void>;

  /**
   * Assert that a success message contains the expected text
   * @param expectedMessage - The text expected to be in the success message
   */
  assertSuccessMessage(expectedMessage: string): Promise<void>;
}

// ============================================================================
// Secure Page Interface
// ============================================================================

/**
 * Interface for the Secure Area page object
 * Represents the protected page shown after successful login
 */
export interface ISecurePage extends IBasePage {
  /** CSS selector for the flash message element */
  readonly flashMessage: string;

  /**
   * Get the current flash message text
   * @returns The message text, or empty string if not found
   */
  getMessage(): Promise<string>;

  /**
   * Assert that the logged-in message contains the expected text
   * @param passedMessage - The text expected to be in the message
   */
  assertLoggedInMessage(passedMessage: string): Promise<void>;
}

// ============================================================================
// Checkboxes Page Interface
// ============================================================================

/**
 * Interface for the Checkboxes page object
 * Represents the checkbox demo page at /checkboxes
 */
export interface ICheckboxesPage extends IBasePage {
  /** Locator for the checkboxes container element */
  readonly checkboxesContainer: Locator;
  /** Locator for all checkbox input elements */
  readonly checkboxes: Locator;

  /**
   * Check a specific checkbox by its 1-based index
   * @param index - The position of the checkbox (1 for first, 2 for second, etc.)
   */
  checkCheckbox(index: number): Promise<void>;

  /**
   * Uncheck a specific checkbox by its 1-based index
   * @param index - The position of the checkbox (1 for first, 2 for second, etc.)
   */
  uncheckCheckbox(index: number): Promise<void>;

  /**
   * Check all checkboxes on the page
   */
  checkAll(): Promise<void>;

  /**
   * Uncheck all checkboxes on the page
   */
  uncheckAll(): Promise<void>;

  /**
   * Get the checked state of all checkboxes
   * @returns Array of boolean values representing checked states
   */
  getCheckboxStates(): Promise<boolean[]>;

  /**
   * Validate that a specific checkbox is in the expected state
   * @param index - The position of the checkbox (1-based)
   * @param expectedState - The expected checked state
   */
  validateCheckboxState(index: number, expectedState: boolean): Promise<void>;

  /**
   * Validate that all checkboxes match the expected states
   * @param expectedStates - Array of expected checked states
   */
  validateAllCheckboxStates(expectedStates: boolean[]): Promise<void>;

  /**
   * Toggle a checkbox (check if unchecked, uncheck if checked)
   * @param index - The position of the checkbox (1-based)
   */
  toggleCheckbox(index: number): Promise<void>;

  /**
   * Get the total count of checkboxes on the page
   * @returns The number of checkboxes
   */
  getCheckboxCount(): Promise<number>;
}

// ============================================================================
// Page Constructor Types
// ============================================================================

/**
 * Generic constructor type for page objects
 * Used for type-safe page instantiation in PomManager
 */
export type PageConstructor<T extends IBasePage> = new (page: Page) => T;

/**
 * Union type of all page objects in the framework
 */
export type AnyPageObject = ILoginPage | ISecurePage | ICheckboxesPage;

// ============================================================================
// Page Object Map (for type-safe page retrieval)
// ============================================================================

/**
 * Registry mapping page names to their interfaces
 * Enables type-safe page retrieval from PomManager
 */
export interface PageRegistry {
  login: ILoginPage;
  secure: ISecurePage;
  checkboxes: ICheckboxesPage;
}

/**
 * Valid page names that can be requested from PomManager
 */
export type PageName = keyof PageRegistry;

// ============================================================================
// PomManager Interface
// ============================================================================

/**
 * Interface for the PomManager class
 *
 * This interface defines the contract for the Page Object Manager,
 * which provides lazy-loaded, cached access to all page objects in the framework.
 */
export interface IPomManager {
  /** The Playwright Page instance shared by all page objects */
  readonly page: Page;

  /**
   * Get the LoginPage instance
   * @returns The LoginPage instance
   */
  getLoginPage(): ILoginPage;

  /**
   * Get the SecurePage instance
   * @returns The SecurePage instance
   */
  getSecurePage(): ISecurePage;

  /**
   * Get the CheckboxesPage instance
   * @returns The CheckboxesPage instance
   */
  getCheckboxesPage(): ICheckboxesPage;
}
