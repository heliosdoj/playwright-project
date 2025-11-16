import { test, expect } from '@playwright/test';
import PomManager from '../pages/PomManager.js';

test.describe('Login Page Tests (POM)', () => {
  let pomManager;
  let loginPage;
  let securePage;

  test.beforeEach(async ({ page }) => {
    pomManager = new PomManager(page);
    loginPage = pomManager.getLoginPage();
    securePage = pomManager.getSecurePage();
    await loginPage.navigate();
  });

  test('Login with valid credentials shows success message', async () => {
    await loginPage.login('tomsmith', 'SuperSecretPassword!');
    await securePage.assertLoggedInMessage('You logged into a secure area!');
  });

  test('Login with invalid password credentials shows error message', async () => {
    await loginPage.login('tomsmith', 'WrongPassword');
    await loginPage.assertErrorMessage('Your password is invalid!');
  });

  test('Login with invalid username credentials shows error message', async () => {
    await loginPage.login('WrongUsername', 'SuperSecretPassword!');
    await loginPage.assertErrorMessage('Your username is invalid!');
  });
});

test.describe('Checkboxes Page Tests (POM)', () => {
  let pomManager;
  let checkboxesPage;

  test.beforeEach(async ({ page }) => {
    pomManager = new PomManager(page);
    checkboxesPage = pomManager.getCheckboxesPage();
    await checkboxesPage.actions.navigate('/checkboxes');
  });

  test('Uncheck all checkboxes', async () => {
    await checkboxesPage.checkAll();
    await checkboxesPage.uncheckAll();
    const states = await checkboxesPage.getCheckboxStates();
    expect(states).toEqual([false, false]);
  });

  test('Toggle checkbox state by index', async () => {
    await checkboxesPage.toggleCheckbox(1);
    await checkboxesPage.validateCheckboxState(1, true);

    await checkboxesPage.toggleCheckbox(1);
    await checkboxesPage.validateCheckboxState(1, false);
  });

  test('Check individual checkbox by index and validate', async () => {
    await checkboxesPage.checkCheckbox(1);
    await checkboxesPage.validateCheckboxState(1, true);

    await checkboxesPage.checkCheckbox(2);
    await checkboxesPage.validateCheckboxState(2, true);
  });

  test('Test checkbox states when starting from unknown state', async () => {
    const initialStates = await checkboxesPage.getCheckboxStates();

    if (initialStates[0] === false) {
      await checkboxesPage.checkCheckbox(1);
    }

    if (initialStates[1] === true) {
      await checkboxesPage.uncheckCheckbox(2);
    }

    await checkboxesPage.validateCheckboxState(1, true);
    await checkboxesPage.validateCheckboxState(2, false);
  });

  test('Validate all checkbox states together', async () => {
    await checkboxesPage.checkCheckbox(1);
    await checkboxesPage.uncheckCheckbox(2);
    await checkboxesPage.validateAllCheckboxStates([true, false]);
  });
});