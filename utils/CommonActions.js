// utils/CommonActions.js
export default class CommonActions {
  constructor(page) {
    this.page = page;
  }

  // ——————————————————————— NAVIGATION ———————————————————————
  async navigate(url, options = {}) {
    const { waitUntil = 'domcontentloaded', timeout = 30_000 } = options;
    await this.page.goto(url, { waitUntil, timeout });
  }

  // ——————————————————————— CLICK & INTERACTIONS ———————————————————————
  async click(selector, options = {}) {
    const { force = false, timeout = 10_000 } = options;
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout });
    await locator.click({ force, timeout });
  }

  async dblClick(selector) {
    const locator = this.page.locator(selector);
    await locator.dblclick();
  }

  async hover(selector) {
    const locator = this.page.locator(selector);
    await locator.hover();
  }

  // ——————————————————————— FORM INPUTS ———————————————————————
  async fill(selector, text, options = {}) {
    const { timeout = 10_000 } = options;
    const locator = this.page.locator(selector);
    await locator.fill(text, { timeout });
  }

  async type(selector, text, options = {}) {
    const { delay = 100, timeout = 10_000 } = options;
    const locator = this.page.locator(selector);
    await locator.pressSequentially(text, { delay, timeout });
  }

  async clear(selector) {
    const locator = this.page.locator(selector);
    await locator.fill(''); // Playwright's clear
  }

  // ——————————————————————— SELECT & CHECKBOX ———————————————————————
  async selectOption(selector, valueOrText, options = {}) {
    const { timeout = 10_000 } = options;
    const locator = this.page.locator(selector);
    await locator.selectOption(valueOrText, { timeout });
  }

  async check(selector, options = {}) {
    const { timeout = 10_000 } = options;
    const locator = this.page.locator(selector);
    await locator.check({ timeout });
  }

  async uncheck(selector) {
    const locator = this.page.locator(selector);
    await locator.uncheck();
  }

  async isChecked(selector, options = {}) {
    const { timeout = 10_000 } = options;
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'attached', timeout });
    return await locator.isChecked();
  }

  // ——————————————————————— READ & ASSERT ———————————————————————
  async getText(selector, options = {}) {
    const { timeout = 10_000, trim = true } = options;
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout });
    const text = await locator.textContent({ timeout });
    return trim ? text?.trim() : text;
  }

  async getAttribute(selector, attribute, options = {}) {
    const { timeout = 10_000 } = options;
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'attached', timeout });
    return await locator.getAttribute(attribute);
  }

  async isVisible(selector, options = {}) {
    const { timeout = 10_000 } = options;
    const locator = this.page.locator(selector);
    return await locator.isVisible({ timeout });
  }

  async isHidden(selector, options = {}) {
    const { timeout = 10_000 } = options;
    const locator = this.page.locator(selector);
    return await locator.isHidden({ timeout });
  }

  async isEnabled(selector, options = {}) {
    const { timeout = 10_000 } = options;
    const locator = this.page.locator(selector);
    return await locator.isEnabled({ timeout });
  }

  async isDisabled(selector, options = {}) {
    const { timeout = 10_000 } = options;
    const locator = this.page.locator(selector);
    return await locator.isDisabled({ timeout });
  }

  // ——————————————————————— WAIT ———————————————————————
  async waitFor(selector, options = {}) {
    const { state = 'visible', timeout = 10_000 } = options;
    await this.page.locator(selector).waitFor({ state, timeout });
  }

  async waitForUrl(expectedUrl, options = {}) {
    const { timeout = 30_000 } = options;
    await this.page.waitForURL(expectedUrl, { timeout });
  }

  async waitForLoadState(state = 'networkidle', timeout = 30_000) {
    await this.page.waitForLoadState(state, { timeout });
  }

  // ——————————————————————— UPLOAD ———————————————————————
  async uploadFile(selector, filePath) {
    const locator = this.page.locator(selector);
    await locator.setInputFiles(filePath);
  }

  // ——————————————————————— COUNT ———————————————————————
  async count(selector) {
    return await this.page.locator(selector).count();
  }
}