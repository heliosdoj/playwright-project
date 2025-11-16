import LoginPage from './LoginPage.js';
import SecurePage from './SecurePage.js';
import CheckboxesPage from './CheckboxesPage.js';

/*
 * ===================================================================================
 * A NOTE FOR BEGINNERS:
 * Any text between "/**" and "* /" is a comment. It's here to explain the code.
 * Computers ignore comments; they are for humans to read. The lines starting with
 * 'import', 'export', 'class', 'constructor', 'return', etc., are the actual code
 * that the computer runs.
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
 * @class PomManager
 * @description
 * This is the Page Object Manager. Its main job is to create and manage all the
 * different page objects in our project (like LoginPage, SecurePage, etc.).
 *
 * WHY USE A MANAGER?
 * Instead of creating page objects directly in our test files, we ask this manager
 * for them. This gives us one central place to control how and when pages are created.
 *
 * This class uses "lazy loading". It means it doesn't create a page object until it's
 * actually needed. This saves memory and makes our tests start faster.
 */
export default class PomManager {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page
   * @description
   * The constructor is a special method that runs when we create a new PomManager.
   * It takes the main Playwright 'page' object as a parameter, which is needed
   * by all the page objects it will manage.
   */
  constructor(page) {
    /**
     * This is the main Playwright page object. We store it so we can pass it
     * to our page objects when we create them.
     */
    this.page = page;

    /**
     * These properties will store our page objects once they are created.
     * We use a '_' prefix (e.g., _loginPage) as a convention to show that
     * these are "private" and shouldn't be accessed directly from outside.
     * They are initialized to 'null' because they don't exist yet.
     */
    this._loginPage = null;
    this._securePage = null;
    this._checkboxesPage = null;
  }

  /**
   * @method getLoginPage
   * @description
   * This method gives us the LoginPage object.
   * If the LoginPage hasn't been created yet, it creates a new one.
   * If it already exists, it just returns the existing one.
   * @returns {LoginPage} The LoginPage object.
   */
  getLoginPage() {
    // The '!' sign means "not". So, this 'if' statement checks:
    // "If this._loginPage does NOT exist (i.e., it is null)..."
    if (!this._loginPage) {
      // "...then create a new LoginPage and store it in this._loginPage."
      this._loginPage = new LoginPage(this.page);
    }
    // Finally, return the LoginPage object (either the new one or the existing one).
    return this._loginPage;
  }

  /**
   * @method getSecurePage
   * @description
   * This method gives us the SecurePage object.
   * It works the same way as getLoginPage, but for the SecurePage.
   * @returns {SecurePage} The SecurePage object.
   */
  getSecurePage() {
    if (!this._securePage) {
      this._securePage = new SecurePage(this.page);
    }
    return this._securePage;
  }

  /**
   * @method getCheckboxesPage
   * @description
   * This method gives us the CheckboxesPage object.
   * It works the same way as getLoginPage, but for the CheckboxesPage.
   * @returns {CheckboxesPage} The CheckboxesPage object.
   */
  getCheckboxesPage() {
    if (!this._checkboxesPage) {
      this._checkboxesPage = new CheckboxesPage(this.page);
    }
    return this._checkboxesPage;
  }
}