// @ts-check
import { expect } from '@playwright/test';
import CommonActions from '../utils/CommonActions.js';

/*
 * ===================================================================================
 * A NOTE FOR BEGINNERS:
 * Any text between "/**" and "* /" is a comment. It's here to explain the code.
 * The lines starting with 'import', 'export', 'class', etc., are the actual code.
 *
 * --- About The Comments In This File ---
 * The blocks of text starting with `/**` are special comments called JSDoc.
 * YES, this is all still a comment and is ignored when the code runs.
 * The lines with `@` symbols (like `@class`, `@param`) are part of the JSDoc
 * format. They are metadata that code editors (like VS Code) can read to give you
 * helpful pop-ups and auto-complete suggestions. They are for developers, not for
 * the computer running the program.
 * ===================================================================================
 */

/**
 * @class SecurePage
 * @description
 * This is a page object that represents the "Secure Area" page. This is the page
 * you see after you successfully log in.
 *
 * Its job is to contain all the specific logic for interacting with this page,
 * like finding the success message and checking its text.
 */
export default class SecurePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page
   * @description
   * The constructor runs when we create a new SecurePage.
   * It receives the main Playwright 'page' object.
   */
  constructor(page) {
    /**
     * We store the 'page' object so we can use it in our methods.
     */
    this.page = page;

    /**
     * We create an instance of CommonActions. This gives us access to reusable
     * helper methods (like clicking, typing, etc.) so we don't have to
     * write the same code over and over.
     */
    this.actions = new CommonActions(page);

    /**
     * This is a locator. A locator is a recipe for finding an element on the page.
     * In this case, it finds the green message box that appears after login.
     * The string '#flash' is a CSS selector. The '#' means "find an element
     * with the ID of 'flash'".
     */
    this.flashMessage = '#flash';
  }

  /**
   * @method getMessage
   * @description
   * This method gets the text from the success message box.
   * The 'async' keyword means this method is asynchronous—it might not finish
   * instantly because it may need to wait for the message to appear on the page.
   * @returns {Promise<string>} A Promise that resolves to the message text.
   */
  async getMessage() {
    /**
     * We use our 'actions' helper to get the text from the element.
     * It will automatically wait for the element to be visible before trying
     * to read its text, which makes our test more reliable.
     */
    return this.actions.getText(this.flashMessage, { timeout: 8000 });
  }

  /**
   * @method assertLoggedInMessage
   * @description
   * This method checks if the login success message is correct.
   * It's an "assertion," which is a way of saying "I expect this to be true."
   * If it's not true, the test will fail.
   * @param {string} passedMessage - The piece of text we expect to see in the message.
   * @returns {Promise<void>}
   */
  async assertLoggedInMessage(passedMessage) {
    /**
     * First, we call our getMessage() method to get the actual text from the page.
     * The 'await' keyword tells our code to pause and wait for getMessage() to finish.
     */
    const message = await this.getMessage();

    /**
     * This is the assertion. We use Playwright's 'expect' function to check
     * if the 'message' we got from the page contains the 'passedMessage' text.
     */
    expect(message).toContain(passedMessage);
  }
}