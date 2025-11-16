import { expect } from '@playwright/test';
import CommonActions from '../utils/CommonActions.js';

/*
 * ===================================================================================
 * A NOTE FOR BEGINNERS:
 * This file is a "page object". It's a class that represents the "Checkboxes" page
 * on the website. All the code for finding and interacting with elements on this
 * specific page goes here. This helps keep our tests clean and organized.
 *
 * --- About The Comments In This File ---
 * The blocks of text starting with `/**` are special comments called JSDoc.
 * YES, this is all still a comment and is ignored when the code runs.
 * The lines with `@` symbols (like `@constructor`, `@param`) are part of the JSDoc
 * format. They are metadata that code editors (like VS Code) can read to give you
 * helpful pop-ups and auto-complete suggestions. They are for developers, not for
 * the computer running the program.
 * ===================================================================================
 */

/**
 * @class CheckboxesPage
 * @description This is a page object for the Checkboxes page.
 */
export default class CheckboxesPage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page
   * @description
   * The constructor creates a new CheckboxesPage object. It needs the main
   * Playwright 'page' so it can interact with the browser.
   */
  constructor(page) {
    this.page = page;
    this.actions = new CommonActions(page);

    /**
     * These are "locators". They are recipes for finding elements on the page.
     * Storing them here makes them easy to update if the website changes.
     */
    // This finds the main container that holds the checkboxes.
    this.checkboxesContainer = this.page.locator('#checkboxes');
    // This finds all the checkbox input elements inside that container.
    this.checkboxes = this.checkboxesContainer.locator('input[type="checkbox"]');
  }

  /**
   * @method checkCheckbox
   * @param {number} index - The position of the checkbox to check (1 for the first, 2 for the second).
   * @description Checks a specific checkbox.
   */
  async checkCheckbox(index) {
    // This creates a specific CSS selector to find the checkbox by its position.
    const selector = `input[type="checkbox"]:nth-of-type(${index})`;
    // We use our 'actions' helper to perform the check action.
    await this.actions.check(selector);
  }

  /**
   * @method uncheckCheckbox
   * @param {number} index - The position of the checkbox to uncheck.
   * @description Unchecks a specific checkbox.
   */
  async uncheckCheckbox(index) {
    const selector = `input[type="checkbox"]:nth-of-type(${index})`;
    await this.actions.uncheck(selector);
  }

  /**
   * @method checkAll
   * @description Checks all checkboxes on the page if they are not already checked.
   */
  async checkAll() {
    // First, get a list of all checkbox locators.
    const checkboxes = await this.checkboxes.all();
    // Loop through each checkbox in the list.
    for (const checkbox of checkboxes) {
      // Check if the current checkbox is NOT checked.
      if (!(await checkbox.isChecked())) {
        // If it's not checked, use our action to check it.
        await this.actions.check(checkbox);
      }
    }
  }

  /**
   * @method uncheckAll
   * @description Unchecks all checkboxes on the page if they are currently checked.
   */
  async uncheckAll() {
    const checkboxes = await this.checkboxes.all();
    for (const checkbox of checkboxes) {
      if (await checkbox.isChecked()) {
        await this.actions.uncheck(checkbox);
      }
    }
  }

  /**
   * @method getCheckboxStates
   * @description Gets the current state (checked or unchecked) of all checkboxes.
   * @returns {Promise<boolean[]>} A list of true/false values, e.g., [true, false].
   */
  async getCheckboxStates() {
    const checkboxes = await this.checkboxes.all();
    // .map() creates a new list. Here, we're creating a list of promises,
    // where each promise will resolve to the checked state (true/false) of a checkbox.
    // Promise.all() waits for all of those promises to finish.
    return Promise.all(checkboxes.map(checkbox => checkbox.isChecked()));
  }

  /**
   * @method validateCheckboxState
   * @param {number} index - The position of the checkbox to validate.
   * @param {boolean} expectedState - The state we expect the checkbox to be in (true for checked, false for unchecked).
   * @description Checks if a specific checkbox is in the expected state. Fails the test if not.
   */
  async validateCheckboxState(index, expectedState) {
    const selector = `input[type="checkbox"]:nth-of-type(${index})`;
    // Get the actual state of the checkbox from the page.
    const actualState = await this.actions.isChecked(selector);
    // Assert that the actual state is equal to the expected state.
    expect(actualState).toBe(expectedState);
  }

  /**
   * @method validateAllCheckboxStates
   * @param {boolean[]} expectedStates - A list of the expected states, e.g., [true, false].
   * @description Checks if all checkboxes on the page match the expected states.
   */
  async validateAllCheckboxStates(expectedStates) {
    const actualStates = await this.getCheckboxStates();
    // Assert that the list of actual states is equal to the list of expected states.
    expect(actualStates).toEqual(expectedStates);
  }

  /**
   * @method toggleCheckbox
   * @param {number} index - The position of the checkbox to toggle.
   * @description Flips the state of a checkbox. If it's checked, it becomes unchecked. If it's unchecked, it becomes checked.
   */
  async toggleCheckbox(index) {
    const selector = `input[type="checkbox"]:nth-of-type(${index})`;
    // First, find out if the checkbox is currently checked.
    const isCurrentlyChecked = await this.actions.isChecked(selector);

    // If it is checked, uncheck it. Otherwise, check it.
    if (isCurrentlyChecked) {
      await this.actions.uncheck(selector);
    } else {
      await this.actions.check(selector);
    }
  }

  /**
   * @method getCheckboxCount
   * @description Counts how many checkboxes are on the page.
   * @returns {Promise<number>} The total number of checkboxes.
   */
  async getCheckboxCount() {
    return this.actions.count('input[type="checkbox"]');
  }
}