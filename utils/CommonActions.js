// utils/CommonActions.js
export default class CommonActions {
  constructor(page) {
    this.page = page;
  }
  
  /**
   * A private helper method to allow action methods to accept either a selector string or a Playwright Locator object.
   * This centralizes the locator resolution logic.
   * @param {string | import('@playwright/test').Locator} selectorOrLocator - A css selector string or a Playwright Locator
   * @returns {import('@playwright/test').Locator} - A Playwright Locator
   * @private
   */
  _getLocator(selectorOrLocator) {
    return typeof selectorOrLocator === 'string'
      ? this.page.locator(selectorOrLocator)
      : selectorOrLocator;
  }

  // ——————————————————————— NAVIGATION ———————————————————————
  async navigate(url, options = {}) {
    const { waitUntil = 'domcontentloaded', timeout = 30_000 } = options;
    await this.page.goto(url, { waitUntil, timeout });
  }

  // ——————————————————————— CLICK & INTERACTIONS ———————————————————————
  async click(selectorOrLocator, options = {}) {
    const { force = false, timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    await locator.waitFor({ state: 'visible', timeout });
    await locator.click({ force, timeout });
  }

  async dblClick(selectorOrLocator) {
    const locator = this._getLocator(selectorOrLocator);
    await locator.dblclick();
  }

  async hover(selectorOrLocator) {
    const locator = this._getLocator(selectorOrLocator);
    await locator.hover();
  }

  // ——————————————————————— FORM INPUTS ———————————————————————
  async fill(selectorOrLocator, text, options = {}) {
    const { timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    await locator.fill(text, { timeout });
  }
  
  async type(selectorOrLocator, text, options = {}) {
    const { delay = 100, timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    await locator.pressSequentially(text, { delay, timeout });
  }

  async clear(selectorOrLocator) {
    const locator = this._getLocator(selectorOrLocator);
    await locator.fill(''); // Playwright's clear
  }

  // ——————————————————————— SELECT & CHECKBOX ———————————————————————
  async selectOption(selectorOrLocator, valueOrText, options = {}) {
    const { timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    await locator.selectOption(valueOrText, { timeout });
  }

  async check(selectorOrLocator, options = {}) {
    const { timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    await locator.check({ timeout });
  }

  async uncheck(selectorOrLocator) {
    const locator = this._getLocator(selectorOrLocator);
    await locator.uncheck();
  }

  async isChecked(selectorOrLocator, options = {}) {
    const { timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    await locator.waitFor({ state: 'attached', timeout });
    return await locator.isChecked();
  }

  // ——————————————————————— READ & ASSERT ———————————————————————
  async getText(selectorOrLocator, options = {}) {
    const { timeout = 10_000, trim = true } = options;
    const locator = this._getLocator(selectorOrLocator);
    await locator.waitFor({ state: 'visible', timeout });
    const text = await locator.textContent({ timeout });
    return trim ? text?.trim() : text;
  }

  async getAttribute(selectorOrLocator, attribute, options = {}) {
    const { timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    await locator.waitFor({ state: 'attached', timeout });
    return await locator.getAttribute(attribute);
  }

  async isVisible(selectorOrLocator, options = {}) {
    const { timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    return await locator.isVisible({ timeout });
  }

  async isHidden(selectorOrLocator, options = {}) {
    const { timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    return await locator.isHidden({ timeout });
  }

  async isEnabled(selectorOrLocator, options = {}) {
    const { timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    return await locator.isEnabled({ timeout });
  }

  async isDisabled(selectorOrLocator, options = {}) {
    const { timeout = 10_000 } = options;
    const locator = this._getLocator(selectorOrLocator);
    return await locator.isDisabled({ timeout });
  }

  // ——————————————————————— WAIT ———————————————————————
  async waitFor(selectorOrLocator, options = {}) {
    const { state = 'visible', timeout = 10_000 } = options;
    await this._getLocator(selectorOrLocator).waitFor({ state, timeout });
  }

  async waitForUrl(expectedUrl, options = {}) {
    const { timeout = 30_000 } = options;
    await this.page.waitForURL(expectedUrl, { timeout });
  }

  async waitForLoadState(state = 'networkidle', timeout = 30_000) {
    await this.page.waitForLoadState(state, { timeout });
  }

  // ——————————————————————— UPLOAD ———————————————————————
  async uploadFile(selectorOrLocator, filePath) {
    const locator = this._getLocator(selectorOrLocator);
    await locator.setInputFiles(filePath);
  }

  // ——————————————————————— COUNT ———————————————————————
  async count(selectorOrLocator) {
    return await this._getLocator(selectorOrLocator).count();
  }
}