import { expect } from '@playwright/test'
import CommonActions from '../utils/CommonActions.js'

export default class LoginPage {
    constructor(page) {
        // Keep a reference to the low-level Playwright Page object
        this.page = page

        // CommonActions wraps common Playwright interactions (click, fill, getText, etc.)
        // so that all tests share the same robust defaults (timeouts, waiting, trimming).
        this.actions = new CommonActions(page)
        
        // Locators: these point to the key elements on the Login page.
        // Storing them here keeps selectors in one place and makes maintenance easier.
        this.usernameInput = page.locator('#username')
        this.passwordInput = page.locator('#password')
        this.loginButton = page.locator('button[type="submit"]')
        this.errorMessage = page.locator('#flash')
    }

    async navigate() {
        // Navigate using a relative path; Playwright's baseURL from playwright.config.js
        // is automatically prepended (https://the-internet.herokuapp.com/login).
        await this.actions.navigate('/login')
    }

    async login(username, password) {
        // Use CommonActions helpers so we automatically:
        // - wait for elements to be ready
        // - apply consistent timeouts
        // - keep all low-level Playwright calls in one place (CommonActions).
        await this.actions.fill(this.usernameInput, username);
        await this.actions.fill(this.passwordInput, password);
        await this.actions.click(this.loginButton);
    }

    async getErrorMessage() {
        // Read the flash message text using CommonActions.
        // getText() will wait for visibility, apply a timeout, and trim whitespace.
        return await this.actions.getText(this.errorMessage);
    }

    async assertErrorMessage(expectedMessage) {
        // Fetch the current error message and assert that it contains the expected text.
        const actualMessage = await this.getErrorMessage()
        expect(actualMessage).toContain(expectedMessage)
    }

    async assertSuccessMessage(expectedMessage) {
        // For this demo app, success messages also appear inside the same #flash element.
        const actualMessage = await this.getErrorMessage();
        expect(actualMessage).toContain(expectedMessage);
    }

}