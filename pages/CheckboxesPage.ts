/**
 * CheckboxesPage - Page Object for the Checkboxes demo page
 *
 * This class encapsulates all interactions with the checkbox elements,
 * including checking, unchecking, toggling, and state validation.
 *
 * TypeScript Features Demonstrated:
 * - Interface implementation (ICheckboxesPage)
 * - Array types (boolean[])
 * - Numeric parameter types for index-based operations
 * - Promise.all with typed arrays
 * - Conditional logic with type safety
 */
import { type Locator, type Page, expect } from '@playwright/test';

import type { ICheckboxesPage } from '../types/pages.types';
import CommonActions from '../utils/CommonActions';

/**
 * Page Object representing the Checkboxes demo page at /checkboxes
 *
 * This page contains multiple checkboxes that can be toggled,
 * demonstrating various checkbox interaction patterns.
 *
 *
 * @example
 * ```typescript
 * const checkboxesPage = new CheckboxesPage(page);
 * await checkboxesPage.actions.navigate('/checkboxes');
 * await checkboxesPage.checkAll();
 * const states = await checkboxesPage.getCheckboxStates();
 * ```
 */
export default class CheckboxesPage implements ICheckboxesPage {
  /** Playwright Page instance for browser interaction */
  public readonly page: Page;

  /** CommonActions utility instance for reusable browser actions */
  public readonly actions: CommonActions;

  /** Locator for the container element holding all checkboxes */
  public readonly checkboxesContainer: Locator;

  /** Locator that matches all checkbox input elements */
  public readonly checkboxes: Locator;

  /**
   * Create a new CheckboxesPage instance
   *
   * @param page - The Playwright Page object to interact with
   */
  constructor(page: Page) {
    this.page = page;
    this.actions = new CommonActions(page);

    // Define locators for the checkbox elements
    // The container helps scope the checkboxes to this specific component
    this.checkboxesContainer = this.page.locator('#checkboxes');

    // This locator matches all checkbox inputs within the container
    this.checkboxes = this.checkboxesContainer.locator('input[type="checkbox"]');
  }

  /**
   * Check a specific checkbox by its 1-based index.
   *
   * Uses :nth-of-type CSS pseudo-selector for index-based selection.
   *
   * @param index - The position of the checkbox (1 for first, 2 for second, etc.)
   *
   * @example
   * ```typescript
   * await checkboxesPage.checkCheckbox(1); // Check the first checkbox
   * ```
   */
  async checkCheckbox(index: number): Promise<void> {
    // Build a CSS selector targeting the nth checkbox
    const selector = `input[type="checkbox"]:nth-of-type(${index})`;
    await this.actions.check(selector);
  }

  /**
   * Uncheck a specific checkbox by its 1-based index.
   *
   * @param index - The position of the checkbox (1 for first, 2 for second, etc.)
   */
  async uncheckCheckbox(index: number): Promise<void> {
    const selector = `input[type="checkbox"]:nth-of-type(${index})`;
    await this.actions.uncheck(selector);
  }

  /**
   * Check all checkboxes on the page.
   *
   * This method iterates through all checkboxes and checks any
   * that are currently unchecked.
   */
  async checkAll(): Promise<void> {
    // Get all checkbox locators as an array
    const allCheckboxes = await this.checkboxes.all();

    // Iterate and check each unchecked checkbox
    for (const checkbox of allCheckboxes) {
      // Only check if not already checked to avoid unnecessary operations
      if (!(await checkbox.isChecked())) {
        await this.actions.check(checkbox);
      }
    }
  }

  /**
   * Uncheck all checkboxes on the page.
   *
   * This method iterates through all checkboxes and unchecks any
   * that are currently checked.
   */
  async uncheckAll(): Promise<void> {
    const allCheckboxes = await this.checkboxes.all();

    for (const checkbox of allCheckboxes) {
      // Only uncheck if currently checked
      if (await checkbox.isChecked()) {
        await this.actions.uncheck(checkbox);
      }
    }
  }

  /**
   * Get the current checked state of all checkboxes.
   *
   * Returns an array of boolean values where each element
   * represents the checked state of the corresponding checkbox.
   *
   * @returns Array of boolean values representing checked states
   *
   * @example
   * ```typescript
   * const states = await checkboxesPage.getCheckboxStates();
   * // states = [false, true] means first is unchecked, second is checked
   * ```
   */
  async getCheckboxStates(): Promise<boolean[]> {
    const allCheckboxes = await this.checkboxes.all();

    // Use Promise.all to efficiently get all states in parallel
    // map() creates an array of promises, each resolving to a boolean
    return Promise.all(allCheckboxes.map((checkbox: Locator) => checkbox.isChecked()));
  }

  /**
   * Validate that a specific checkbox is in the expected state.
   *
   * Uses Playwright's expect for assertion with clear error messages.
   *
   * @param index - The position of the checkbox (1-based)
   * @param expectedState - The expected checked state (true = checked)
   * @throws {Error} If the checkbox is not in the expected state
   */
  async validateCheckboxState(index: number, expectedState: boolean): Promise<void> {
    const selector = `input[type="checkbox"]:nth-of-type(${index})`;
    const actualState = await this.actions.isChecked(selector);
    expect(actualState).toBe(expectedState);
  }

  /**
   * Validate that all checkboxes match the expected states.
   *
   * @param expectedStates - Array of expected checked states
   * @throws {Error} If any checkbox doesn't match its expected state
   *
   * @example
   * ```typescript
   * await checkboxesPage.validateAllCheckboxStates([true, false]);
   * ```
   */
  async validateAllCheckboxStates(expectedStates: boolean[]): Promise<void> {
    const actualStates = await this.getCheckboxStates();
    expect(actualStates).toEqual(expectedStates);
  }

  /**
   * Toggle a checkbox's state (check if unchecked, uncheck if checked).
   *
   * @param index - The position of the checkbox (1-based)
   */
  async toggleCheckbox(index: number): Promise<void> {
    const selector = `input[type="checkbox"]:nth-of-type(${index})`;
    const isCurrentlyChecked = await this.actions.isChecked(selector);

    // Toggle based on current state
    if (isCurrentlyChecked) {
      await this.actions.uncheck(selector);
    } else {
      await this.actions.check(selector);
    }
  }

  /**
   * Get the total count of checkboxes on the page.
   *
   * @returns The number of checkbox elements
   */
  async getCheckboxCount(): Promise<number> {
    return this.actions.count('input[type="checkbox"]');
  }
}
