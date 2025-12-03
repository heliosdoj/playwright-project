import { test, expect, Page } from '@playwright/test';

/**
 * TodoMVC E2E Test Suite
 * 
 * This test suite validates the functionality of a TodoMVC application
 * using Playwright for end-to-end testing.
 */

// Navigate to the TodoMVC demo app before each test
test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
});

// Sample todo items used throughout the test suite
const TODO_ITEMS = [
  'buy some cheese',
  'feed the cat',
  'book a doctors appointment'
] as const;

// Define the structure of a todo item in localStorage
interface TodoItem {
  title: string;
  completed: boolean;
}

test.describe('New Todo', () => {
  test('should allow me to add todo items', async ({ page }) => {
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create first todo item
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Verify only one todo item exists
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0]]);

    // Create second todo item
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Verify both todo items exist
    await expect(page.getByTestId('todo-title')).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[1]
    ]);

    await checkNumberOfTodosInLocalStorage(page, 2);
  });

  test('should clear text input field when an item is added', async ({ page }) => {
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create a todo item
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Verify input field is cleared after submission
    await expect(newTodo).toBeEmpty();
    await checkNumberOfTodosInLocalStorage(page, 1);
  });

  test('should append new items to the bottom of the list', async ({ page }) => {
    await createDefaultTodos(page);

    const todoCount = page.getByTestId('todo-count');
  
    // Verify the todo count is displayed correctly using multiple assertion methods
    await expect(page.getByText('3 items left')).toBeVisible();
    await expect(todoCount).toHaveText('3 items left');
    await expect(todoCount).toContainText('3');
    await expect(todoCount).toHaveText(/3/);

    // Verify all items are present in the correct order
    await expect(page.getByTestId('todo-title')).toHaveText(TODO_ITEMS);
    await checkNumberOfTodosInLocalStorage(page, 3);
  });
});

test.describe('Mark all as completed', () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test.afterEach(async ({ page }) => {
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test('should allow me to mark all items as completed', async ({ page }) => {
    // Toggle all todos to completed state
    await page.getByLabel('Mark all as complete').check();

    // Verify all todos have the 'completed' CSS class
    await expect(page.getByTestId('todo-item')).toHaveClass([
      'completed',
      'completed',
      'completed'
    ]);
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);
  });

  test('should allow me to clear the complete state of all items', async ({ page }) => {
    const toggleAll = page.getByLabel('Mark all as complete');
    
    // Toggle all items to completed, then immediately toggle back
    await toggleAll.check();
    await toggleAll.uncheck();

    // Verify no items have the 'completed' class
    await expect(page.getByTestId('todo-item')).toHaveClass(['', '', '']);
  });

  test('complete all checkbox should update state when items are completed / cleared', async ({ page }) => {
    const toggleAll = page.getByLabel('Mark all as complete');
    
    // Mark all items as complete
    await toggleAll.check();
    await expect(toggleAll).toBeChecked();
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);

    // Uncheck the first todo item
    const firstTodo = page.getByTestId('todo-item').nth(0);
    await firstTodo.getByRole('checkbox').uncheck();

    // Verify toggle all checkbox is now unchecked (since not all items are complete)
    await expect(toggleAll).not.toBeChecked();

    // Re-check the first todo item
    await firstTodo.getByRole('checkbox').check();
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);

    // Verify toggle all checkbox is checked again
    await expect(toggleAll).toBeChecked();
  });
});

test.describe('Item', () => {
  test('should allow me to mark items as complete', async ({ page }) => {
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create two todo items
    for (const item of TODO_ITEMS.slice(0, 2)) {
      await newTodo.fill(item);
      await newTodo.press('Enter');
    }

    // Mark first item as complete
    const firstTodo = page.getByTestId('todo-item').nth(0);
    await firstTodo.getByRole('checkbox').check();
    await expect(firstTodo).toHaveClass('completed');

    // Verify second item is not completed, then mark it as complete
    const secondTodo = page.getByTestId('todo-item').nth(1);
    await expect(secondTodo).not.toHaveClass('completed');
    await secondTodo.getByRole('checkbox').check();

    // Verify both items are now completed
    await expect(firstTodo).toHaveClass('completed');
    await expect(secondTodo).toHaveClass('completed');
  });

  test('should allow me to un-mark items as complete', async ({ page }) => {
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create two todo items
    for (const item of TODO_ITEMS.slice(0, 2)) {
      await newTodo.fill(item);
      await newTodo.press('Enter');
    }

    const firstTodo = page.getByTestId('todo-item').nth(0);
    const secondTodo = page.getByTestId('todo-item').nth(1);
    const firstTodoCheckbox = firstTodo.getByRole('checkbox');

    // Mark first item as complete
    await firstTodoCheckbox.check();
    await expect(firstTodo).toHaveClass('completed');
    await expect(secondTodo).not.toHaveClass('completed');
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);

    // Unmark first item
    await firstTodoCheckbox.uncheck();
    await expect(firstTodo).not.toHaveClass('completed');
    await expect(secondTodo).not.toHaveClass('completed');
    await checkNumberOfCompletedTodosInLocalStorage(page, 0);
  });

  test('should allow me to edit an item', async ({ page }) => {
    await createDefaultTodos(page);

    const todoItems = page.getByTestId('todo-item');
    const secondTodo = todoItems.nth(1);
    
    // Double-click to enter edit mode
    await secondTodo.dblclick();
    
    // Verify the edit textbox contains the original value
    await expect(secondTodo.getByRole('textbox', { name: 'Edit' })).toHaveValue(TODO_ITEMS[1]);
    
    // Edit the todo item
    await secondTodo.getByRole('textbox', { name: 'Edit' }).fill('buy some sausages');
    await secondTodo.getByRole('textbox', { name: 'Edit' }).press('Enter');

    // Verify the edited text is displayed
    await expect(todoItems).toHaveText([
      TODO_ITEMS[0],
      'buy some sausages',
      TODO_ITEMS[2]
    ]);
    await checkTodosInLocalStorage(page, 'buy some sausages');
  });
});

test.describe('Editing', () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test('should hide other controls when editing', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item').nth(1);
    
    // Enter edit mode
    await todoItem.dblclick();
    
    // Verify checkbox and label are hidden during edit
    await expect(todoItem.getByRole('checkbox')).not.toBeVisible();
    await expect(todoItem.locator('label', {
      hasText: TODO_ITEMS[1],
    })).not.toBeVisible();
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test('should save edits on blur', async ({ page }) => {
    const todoItems = page.getByTestId('todo-item');
    
    // Enter edit mode and change text
    await todoItems.nth(1).dblclick();
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('buy some sausages');
    
    // Trigger blur event to save changes
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).dispatchEvent('blur');

    // Verify changes were saved
    await expect(todoItems).toHaveText([
      TODO_ITEMS[0],
      'buy some sausages',
      TODO_ITEMS[2],
    ]);
    await checkTodosInLocalStorage(page, 'buy some sausages');
  });

  test('should trim entered text', async ({ page }) => {
    const todoItems = page.getByTestId('todo-item');
    
    // Enter edit mode with text containing leading and trailing whitespace
    await todoItems.nth(1).dblclick();
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('    buy some sausages    ');
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Enter');

    // Verify whitespace was trimmed
    await expect(todoItems).toHaveText([
      TODO_ITEMS[0],
      'buy some sausages',
      TODO_ITEMS[2],
    ]);
    await checkTodosInLocalStorage(page, 'buy some sausages');
  });

  test('should remove the item if an empty text string was entered', async ({ page }) => {
    const todoItems = page.getByTestId('todo-item');
    
    // Enter edit mode and clear the text
    await todoItems.nth(1).dblclick();
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('');
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Enter');

    // Verify the item was removed
    await expect(todoItems).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[2],
    ]);
  });

  test('should cancel edits on escape', async ({ page }) => {
    const todoItems = page.getByTestId('todo-item');
    
    // Enter edit mode and change text
    await todoItems.nth(1).dblclick();
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('buy some sausages');
    
    // Press Escape to cancel editing
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Escape');
    
    // Verify original text is unchanged
    await expect(todoItems).toHaveText(TODO_ITEMS);
  });
});

test.describe('Counter', () => {
  test('should display the current number of todo items', async ({ page }) => {
    const newTodo = page.getByPlaceholder('What needs to be done?');
    const todoCount = page.getByTestId('todo-count');

    // Add first item and verify count
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');
    await expect(todoCount).toContainText('1');

    // Add second item and verify count
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');
    await expect(todoCount).toContainText('2');

    await checkNumberOfTodosInLocalStorage(page, 2);
  });
});

test.describe('Clear completed button', () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
  });

  test('should display the correct text', async ({ page }) => {
    // Mark first item as complete
    await page.locator('.todo-list li .toggle').first().check();
    
    // Verify "Clear completed" button is visible
    await expect(page.getByRole('button', { name: 'Clear completed' })).toBeVisible();
  });

  test('should remove completed items when clicked', async ({ page }) => {
    const todoItems = page.getByTestId('todo-item');
    
    // Mark second item as complete
    await todoItems.nth(1).getByRole('checkbox').check();
    
    // Click "Clear completed" button
    await page.getByRole('button', { name: 'Clear completed' }).click();
    
    // Verify only uncompleted items remain
    await expect(todoItems).toHaveCount(2);
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test('should be hidden when there are no items that are completed', async ({ page }) => {
    // Mark an item as complete
    await page.locator('.todo-list li .toggle').first().check();
    
    // Clear completed items
    await page.getByRole('button', { name: 'Clear completed' }).click();
    
    // Verify button is now hidden
    await expect(page.getByRole('button', { name: 'Clear completed' })).toBeHidden();
  });
});

test.describe('Persistence', () => {
  test('should persist its data', async ({ page }) => {
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create two todo items
    for (const item of TODO_ITEMS.slice(0, 2)) {
      await newTodo.fill(item);
      await newTodo.press('Enter');
    }

    const todoItems = page.getByTestId('todo-item');
    const firstTodoCheck = todoItems.nth(0).getByRole('checkbox');
    
    // Mark first item as complete
    await firstTodoCheck.check();
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await expect(firstTodoCheck).toBeChecked();
    await expect(todoItems).toHaveClass(['completed', '']);

    // Verify state in localStorage
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);

    // Reload the page
    await page.reload();
    
    // Verify state persisted after reload
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await expect(firstTodoCheck).toBeChecked();
    await expect(todoItems).toHaveClass(['completed', '']);
  });
});

test.describe('Routing', () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
    // Ensure the app has persisted todos to localStorage before navigating
    // to prevent data loss in some frameworks like Durandal
    await checkTodosInLocalStorage(page, TODO_ITEMS[0]);
  });

  test('should allow me to display active items', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item');
    
    // Mark second item as complete
    await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);
    
    // Navigate to Active filter
    await page.getByRole('link', { name: 'Active' }).click();
    
    // Verify only active (uncompleted) items are displayed
    await expect(todoItem).toHaveCount(2);
    await expect(todoItem).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test('should respect the back button', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item');
    
    // Mark second item as complete
    await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);

    // Navigate through different filters
    await test.step('Showing all items', async () => {
      await page.getByRole('link', { name: 'All' }).click();
      await expect(todoItem).toHaveCount(3);
    });

    await test.step('Showing active items', async () => {
      await page.getByRole('link', { name: 'Active' }).click();
    });

    await test.step('Showing completed items', async () => {
      await page.getByRole('link', { name: 'Completed' }).click();
    });

    // Verify browser back button navigation works correctly
    await expect(todoItem).toHaveCount(1);
    await page.goBack();
    await expect(todoItem).toHaveCount(2);
    await page.goBack();
    await expect(todoItem).toHaveCount(3);
  });

  test('should allow me to display completed items', async ({ page }) => {
    // Mark second item as complete
    await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);
    
    // Navigate to Completed filter
    await page.getByRole('link', { name: 'Completed' }).click();
    
    // Verify only completed items are displayed
    await expect(page.getByTestId('todo-item')).toHaveCount(1);
  });

  test('should allow me to display all items', async ({ page }) => {
    // Mark second item as complete
    await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);
    
    // Navigate through filters back to All
    await page.getByRole('link', { name: 'Active' }).click();
    await page.getByRole('link', { name: 'Completed' }).click();
    await page.getByRole('link', { name: 'All' }).click();
    
    // Verify all items are displayed
    await expect(page.getByTestId('todo-item')).toHaveCount(3);
  });

  test('should highlight the currently applied filter', async ({ page }) => {
    // Verify "All" filter is selected by default
    await expect(page.getByRole('link', { name: 'All' })).toHaveClass('selected');

    const activeLink = page.getByRole('link', { name: 'Active' });
    const completedLink = page.getByRole('link', { name: 'Completed' });
    
    // Navigate to Active filter
    await activeLink.click();
    await expect(activeLink).toHaveClass('selected');
    
    // Navigate to Completed filter
    await completedLink.click();
    await expect(completedLink).toHaveClass('selected');
  });
});

/**
 * Helper function to create the default set of todo items
 * 
 * @param page - Playwright Page object
 */
async function createDefaultTodos(page: Page): Promise<void> {
  const newTodo = page.getByPlaceholder('What needs to be done?');

  for (const item of TODO_ITEMS) {
    await newTodo.fill(item);
    await newTodo.press('Enter');
  }
}

/**
 * Helper function to verify the number of todos in localStorage
 * 
 * @param page - Playwright Page object
 * @param expected - Expected number of todos
 */
async function checkNumberOfTodosInLocalStorage(page: Page, expected: number): Promise<void> {
  await page.waitForFunction((expectedCount: number) => {
    const todos = JSON.parse(localStorage['react-todos']) as TodoItem[];
    return todos.length === expectedCount;
  }, expected);
}

/**
 * Helper function to verify the number of completed todos in localStorage
 * 
 * @param page - Playwright Page object
 * @param expected - Expected number of completed todos
 */
async function checkNumberOfCompletedTodosInLocalStorage(page: Page, expected: number): Promise<void> {
  await page.waitForFunction((expectedCount: number) => {
    const todos = JSON.parse(localStorage['react-todos']) as TodoItem[];
    return todos.filter(item => item.completed).length === expectedCount;
  }, expected);
}

/**
 * Helper function to verify a specific todo exists in localStorage
 * 
 * @param page - Playwright Page object
 * @param title - Title of the todo to check for
 */
async function checkTodosInLocalStorage(page: Page, title: string): Promise<void> {
  await page.waitForFunction((todoTitle: string) => {
    const todos = JSON.parse(localStorage['react-todos']) as TodoItem[];
    return todos.map(item => item.title).includes(todoTitle);
  }, title);
}