# Learn Playwright with pnpm

A comprehensive Playwright testing project using pnpm as the package manager for improved performance and faster test execution. This project demonstrates end-to-end testing with Playwright, featuring HTML and Allure reporting capabilities.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Playwright Codegen](#playwright-codegen)
- [Screenshots and Visual Testing](#screenshots-and-visual-testing)
- [Reporting](#reporting)
- [pnpm Commands Reference](#pnpm-commands-reference)
- [Configuration](#configuration)
- [Browser Management](#browser-management)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)
- [Performance Tips](#performance-tips)
- [Migration Notes](#migration-notes)
- [Contributing](#contributing)
- [Additional Resources](#additional-resources)

## Prerequisites

- **pnpm**: Fast, disk space efficient package manager
  ```bash
  npm install -g pnpm
  ```
- **Node.js**: Version 18+ for compatibility
- **Git**: For repository management
- **Allure CLI**: For advanced reporting (installed as dev dependency)

[↑ Back to Top](#learn-playwright-with-pnpm-)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd LearnPlaywright
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Install Playwright browsers:**
   ```bash
   pnpm install:browsers
   ```

[↑ Back to Top](#learn-playwright-with-pnpm-)

## Quick Start

```bash
# Run all tests
pnpm test

# View HTML report
pnpm report
# (Note: Playwright may suggest "npx playwright show-report" - use "pnpm exec" instead!)

# Generate and view Allure report
pnpm allure:gen
pnpm allure:open
```

> **💡 Tip**: If Playwright's CLI suggests using `npx` commands in its output messages, replace `npx` with `pnpm` since this project uses pnpm instead of npm.
> 
> **Key Command Formats**:
> - `pnpm test` - Run all tests via npm script (uses config)
> - `pnpm playwright test` - Run Playwright directly (works with individual files!)
> - `pnpx playwright` - Alias for `pnpm exec playwright` (also works)
> 
> **Best Practice**: Use `pnpm playwright test <file>` for running individual test files.

[↑ Back to Top](#learn-playwright-with-pnpm-)

## Project Structure

```
LearnPlaywright/
├── 📄 package.json              # Project configuration and npm scripts
├── 🔒 pnpm-lock.yaml            # pnpm lock file
├── ⚙️  playwright.config.js      # Playwright test configuration
├── 📝 how_to.md                 # Detailed migration guide (npm/bun → pnpm)
├── 📖 README.md                 # This file
│
├── 📁 tests/                    # Test files directory
│   ├── example.spec.js          # Example test suite
│   ├── login.spec.js            # Login functionality tests
│   ├── selectors.spec.js        # CSS/XPath selector tests
│   └── codegen.spec.js          # Code generation tests
│
├── 📁 tests-examples/           # Playwright example tests
│   └── demo-todo-app.spec.js    # Demo todo application tests
│
├── 📁 allure-results/           # Raw test results (JSON)
├── 📁 allure-report/            # Generated Allure HTML reports
├── 📁 playwright-report/        # Playwright HTML reports
└── 📁 test-results/             # Test artifacts (screenshots, videos, traces)
```

[↑ Back to Top](#learn-playwright-with-pnpm-)

## Running Tests

### All Tests

Run all test files matching the pattern `tests/**/*.spec.{js,ts}`:

```bash
pnpm test
```

**What happens:**
- Tests run in parallel with 10 workers (optimized for your 20-thread system)
- Both HTML and Allure reports are generated
- Screenshots/videos captured for failures
- Traces recorded for retry attempts

### Individual Test Files

Run a single test file (since `testDir: './tests'`, just use the filename):

```bash
# Run specific test file (RECOMMENDED)
pnpm playwright test example.spec.js

# Run create-article tests
pnpm playwright test create-article.spec.js

# Run login tests
pnpm playwright test ccwlogin.spec.js

# Also works with pnpx
pnpx playwright test example.spec.js
```

Run multiple specific files:

```bash
pnpm playwright test example.spec.js create-article.spec.js
```

**Alternative - Using grep to filter:**
```bash
# Filter by test name
pnpm playwright test --grep "has title"
pnpm playwright test --grep "Create a new article"
```</search>
</search_and_replace>

### Running Tests with pnpm (All Options)

> **💡 Tip**: Since `testDir: './tests'` is configured, just use filenames without the `tests/` prefix!

**Basic execution:**
```bash
# Run all tests via npm script
pnpm test

# Run all tests directly
pnpm playwright test

# Run specific test file (no tests/ prefix needed!)
pnpm playwright test example.spec.js

# Run multiple files
pnpm playwright test example.spec.js create-article.spec.js
```

**Headed mode (visible browser):**
```bash
# Run all tests with visible browser
pnpm test:headed

# Run specific file with visible browser
pnpm playwright test example.spec.js --headed

# Slow down execution for visibility
pnpm playwright test --headed --slow-mo=1000
```

**Debug mode:**
```bash
# Debug all tests (step-by-step)
pnpm test:debug

# Debug specific file
pnpm playwright test example.spec.js --debug

# Debug with grep filter
pnpm playwright test --debug --grep "has title"
```

**Browser selection:**
```bash
# Run in specific browser
pnpm playwright test --project=chromium
pnpm playwright test --project=firefox
pnpm playwright test --project=webkit

# Run specific file in specific browser
pnpm playwright test example.spec.js --project=chromium

# Run in multiple browsers
pnpm playwright test --project=chromium --project=firefox
```

**Worker configuration:**
```bash
# Use specific number of workers
pnpm playwright test --workers=4
pnpm playwright test --workers=1  # Sequential execution

# Maximum workers (use all threads)
pnpm playwright test --workers=20

# Specific file with custom workers
pnpm playwright test example.spec.js --workers=1
```

**Test filtering:**
```bash
# Filter by test name
pnpm playwright test --grep "login"
pnpm playwright test --grep "@smoke"

# Exclude tests
pnpm playwright test --grep-invert "slow"

# Run only failed tests from last run
pnpm playwright test --last-failed

# Combine file and grep
pnpm playwright test example.spec.js --grep "has title"
```

**Retries and timeouts:**
```bash
# Run with retries
pnpm playwright test --retries=3

# Set timeout
pnpm playwright test --timeout=60000

# Set maximum failures
pnpm playwright test --max-failures=5

# Specific file with retries
pnpm playwright test create-article.spec.js --retries=2
```

**Reporting and traces:**
```bash
# Generate trace for all tests
pnpm playwright test --trace=on

# Generate trace only on failures
pnpm playwright test --trace=on-first-retry

# Update snapshots
pnpm playwright test --update-snapshots

# Trace for specific file
pnpm playwright test example.spec.js --trace=on
```

**Interactive UI mode:**
```bash
# Open interactive test UI
pnpm playwright test --ui

# Open UI for specific file
pnpm playwright test example.spec.js --ui
```

**Combined options:**
```bash
# Headed mode with specific worker count
pnpm playwright test --headed --workers=2

# Debug specific file with browser
pnpm playwright test example.spec.js --debug --project=chromium

# Headed mode with grep filter
pnpm playwright test --headed --grep "login"

# Multiple options combined
pnpm playwright test example.spec.js --headed --workers=1 --timeout=30000
```

### Test Patterns and Filtering

**Filter by test name:**
```bash
# Run tests matching "login"
pnpm playwright test --grep "login"

# Exclude tests matching a pattern
pnpm playwright test --grep-invert "slow"

# Combine file and grep
pnpm playwright test example.spec.js --grep "has title"
```

**Filter by tags:**
```bash
# Run only smoke tests (if using @smoke tags)
pnpm playwright test --grep "@smoke"

# Run critical tests
pnpm playwright test --grep "@critical"
```

**Run only failed tests:**
```bash
# Re-run tests that failed in the last run
pnpm playwright test --last-failed
```

### Browser-Specific Tests

```bash
# Run in Chromium only (default)
pnpm playwright test --project=chromium

# Run specific file in Firefox
pnpm playwright test example.spec.js --project=firefox

# Run in WebKit (if enabled in config)
pnpm playwright test --project=webkit

# Run in multiple browsers
pnpm playwright test --project=chromium --project=firefox
```

### npm Script Shortcuts

For convenience, use these npm scripts defined in [`package.json`](package.json:5):

```bash
# Run all tests (uses 10 workers)
pnpm test

# Run with visible browser
pnpm test:headed

# Run in debug mode
pnpm test:debug

# View last HTML report
pnpm report
```

[↑ Back to Top](#learn-playwright-with-pnpm-)

## Playwright Codegen

Playwright Codegen (Code Generator) is a powerful tool that records your browser interactions and automatically generates test code. It's perfect for quickly creating test scripts, learning Playwright syntax, or prototyping test scenarios.

### What is Codegen?

Codegen opens a browser window and a code inspector that records your actions in real-time. Every click, input, navigation, and interaction is converted into Playwright test code that you can copy and use in your test files.

### Basic Usage

**Launch Codegen with a URL:**
```bash
# Open Codegen at a specific URL
pnpx playwright codegen https://example.com

# Open Codegen at a local file
pnpx playwright codegen file:///home/user/project/index.html

# Open Codegen at localhost
pnpx playwright codegen http://localhost:3000
```

**Start recording without a URL:**
```bash
# Opens blank browser - navigate manually
pnpx playwright codegen
```

### How to Use Codegen

1. **Launch the tool:**
   ```bash
   pnpx playwright codegen https://playwright.dev
   ```

2. **Interact with the page:**
   - Click buttons, links, and elements
   - Fill forms and input fields
   - Navigate between pages
   - Hover over elements
   - Select dropdown options

3. **Watch the code generate:**
   - The inspector window shows the generated code in real-time
   - Code is written in your default language (JavaScript)
   - Includes proper locators and assertions

4. **Copy and use the code:**
   - Copy the generated code from the inspector
   - Paste it into your test file
   - Refactor and enhance as needed

### Advanced Codegen Options

**Specify browser:**
```bash
# Use specific browser
pnpx playwright codegen --browser=chromium https://example.com
pnpx playwright codegen --browser=firefox https://example.com
pnpx playwright codegen --browser=webkit https://example.com
```

**Mobile emulation:**
```bash
# Emulate iPhone 13
pnpx playwright codegen --device="iPhone 13" https://example.com

# Emulate Pixel 5
pnpx playwright codegen --device="Pixel 5" https://example.com

# Emulate iPad Pro
pnpx playwright codegen --device="iPad Pro" https://example.com
```

**Viewport size:**
```bash
# Custom viewport size
pnpx playwright codegen --viewport-size=1280,720 https://example.com
```

**Color scheme:**
```bash
# Dark mode
pnpx playwright codegen --color-scheme=dark https://example.com

# Light mode
pnpx playwright codegen --color-scheme=light https://example.com
```

**Timezone and locale:**
```bash
# Set timezone
pnpx playwright codegen --timezone="America/New_York" https://example.com

# Set locale
pnpx playwright codegen --lang=fr-FR https://example.com
```

**Save trace:**
```bash
# Record trace for debugging
pnpx playwright codegen --save-trace=trace.zip https://example.com
```

**Record video:**
```bash
# Record video of session
pnpx playwright codegen --save-video=video.mp4 https://example.com
```

### Codegen Best Practices

1. **Use as a starting point:** Codegen creates basic test code - always refactor for better readability and maintainability.

2. **Improve selectors:** Generated selectors may be fragile. Replace with more stable selectors:
   ```javascript
   // Generated (fragile)
   await page.locator('div:nth-child(3) > button').click();
   
   // Improved (stable)
   await page.getByRole('button', { name: 'Submit' }).click();
   ```

3. **Add assertions:** Codegen records actions but doesn't add validation. Add assertions:
   ```javascript
   // Generated
   await page.click('button');
   
   // Enhanced with assertion
   await page.click('button');
   await expect(page.locator('.success-message')).toBeVisible();
   ```

4. **Extract reusable functions:** Convert repeated patterns into helper functions.

5. **Add proper test structure:** Wrap generated code in proper test blocks:
   ```javascript
   import { test, expect } from '@playwright/test';
   
   test.describe('Feature Name', () => {
     test('should perform action', async ({ page }) => {
       // Paste your generated code here
     });
   });
   ```

### Common Use Cases

**Form Testing:**
```bash
# Record filling out a form
pnpx playwright codegen https://example.com/form
```

**Navigation Testing:**
```bash
# Record multi-page workflows
pnpx playwright codegen https://example.com
```

**Responsive Testing:**
```bash
# Test mobile layout
pnpx playwright codegen --device="iPhone 13" https://example.com
```

**Authentication Flow:**
```bash
# Record login process
pnpx playwright codegen https://example.com/login
```

### Codegen Limitations

- **No complex logic:** Codegen records actions, not conditional logic or loops
- **No data-driven testing:** Can't generate parameterized tests
- **Basic assertions only:** May add simple visibility checks but not comprehensive validation
- **May produce verbose code:** Generated code often needs refactoring
- **Selector stability:** Generated selectors may break with UI changes

### Tips for Effective Code Generation

1. **Plan your scenario** before starting Codegen
2. **Perform actions slowly** for cleaner code generation
3. **Use Codegen in combination** with manual test writing
4. **Test generated code** before committing
5. **Refactor immediately** while interactions are fresh in mind

[↑ Back to Top](#learn-playwright-with-pnpm-)

## Screenshots and Visual Testing

Playwright provides comprehensive screenshot and visual testing capabilities to capture page states, compare visual changes, and detect UI regressions.

### Full Page Screenshots

Capture the entire visible page (including scrollable areas):

```javascript
import { test } from '@playwright/test';

test('capture full page screenshot', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Full page screenshot
  await page.screenshot({
    path: 'screenshots/full-page.png',
    fullPage: true
  });
});
```

### Element Screenshots

Capture specific elements instead of the entire page:

```javascript
test('capture element screenshot', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Screenshot of specific element
  const header = page.locator('header');
  await header.screenshot({
    path: 'screenshots/header.png'
  });
  
  // Screenshot of button
  await page.getByRole('button', { name: 'Submit' }).screenshot({
    path: 'screenshots/submit-button.png'
  });
});
```

### Screenshot Options

**Full configuration:**
```javascript
await page.screenshot({
  path: 'screenshots/custom.png',     // Save path (optional)
  fullPage: true,                      // Capture full scrollable page
  clip: { x: 0, y: 0, width: 800, height: 600 }, // Crop to specific area
  omitBackground: false,               // Transparent background
  type: 'png',                         // 'png' or 'jpeg'
  quality: 100,                        // JPEG quality (0-100)
  timeout: 30000,                      // Timeout in milliseconds
  animations: 'disabled',              // Disable animations
  caret: 'hide',                       // Hide text cursor
  scale: 'css',                        // 'css' or 'device'
  mask: [page.locator('.ad')],        // Hide elements in screenshot
});
```

### Visual Comparison Testing

Playwright can compare screenshots to detect visual regressions:

```javascript
import { test, expect } from '@playwright/test';

test('visual regression test', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Compare with baseline screenshot
  await expect(page).toHaveScreenshot('homepage.png');
});
```

**First run:** Generates baseline screenshot (golden image)
**Subsequent runs:** Compares against baseline and fails if differences exceed threshold

### Element Visual Comparison

```javascript
test('compare specific element', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Compare specific element
  const header = page.locator('header');
  await expect(header).toHaveScreenshot('header.png');
  
  // With options
  await expect(header).toHaveScreenshot('header.png', {
    maxDiffPixels: 100,        // Allow up to 100 different pixels
    threshold: 0.2,             // Pixel color threshold (0-1)
  });
});
```

### Configuring Visual Comparisons

**In playwright.config.js:**
```javascript
export default {
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,           // Allowed pixel difference
      threshold: 0.2,               // Color difference threshold
      animations: 'disabled',       // Disable animations
      caret: 'hide',               // Hide text cursor
      scale: 'css',                // Scale method
    },
  },
};
```

### Updating Baselines

When UI changes are intentional, update baseline screenshots:

```bash
# Update all screenshots
pnpm playwright test --update-snapshots

# Update specific test
pnpm playwright test tests/example.spec.js --update-snapshots

# Update with grep filter
pnpm playwright test --grep "visual" --update-snapshots
```

### Handling Dynamic Content

**Mask changing elements:**
```javascript
test('mask dynamic content', async ({ page }) => {
  await page.goto('https://example.com');
  
  await expect(page).toHaveScreenshot({
    mask: [
      page.locator('.timestamp'),    // Hide timestamps
      page.locator('.ad'),           // Hide ads
      page.locator('.user-avatar'),  // Hide user images
    ],
  });
});
```

**Wait for stability:**
```javascript
test('wait for animations', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Wait for animations to complete
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);  // Additional buffer
  
  await expect(page).toHaveScreenshot();
});
```

### Screenshot Testing Best Practices

1. **Use visual tests for critical UI:**
   - Login pages
   - Landing pages
   - Checkout flows
   - Navigation headers/footers

2. **Mask dynamic content:**
   - Timestamps and dates
   - User-generated content
   - Random IDs
   - Advertisements

3. **Set appropriate thresholds:**
   - Stricter for static content (0.1-0.2)
   - Looser for dynamic content (0.3-0.5)

4. **Organize screenshots:**
   ```javascript
   // Use descriptive paths
   await page.screenshot({
     path: 'screenshots/homepage/header-desktop.png'
   });
   ```

5. **Test multiple viewports:**
   ```javascript
   test('responsive screenshots', async ({ page }) => {
     // Desktop
     await page.setViewportSize({ width: 1920, height: 1080 });
     await expect(page).toHaveScreenshot('desktop.png');
     
     // Tablet
     await page.setViewportSize({ width: 768, height: 1024 });
     await expect(page).toHaveScreenshot('tablet.png');
     
     // Mobile
     await page.setViewportSize({ width: 375, height: 667 });
     await expect(page).toHaveScreenshot('mobile.png');
   });
   ```

6. **Handle fonts and rendering:**
   - Use `waitForLoadState('load')` to ensure fonts load
   - Disable animations for consistent screenshots
   - Consider using `webfontloader` for font control

### Screenshot Comparison Workflow

```javascript
import { test, expect } from '@playwright/test';

test.describe('Visual Regression Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.com');
    await page.waitForLoadState('networkidle');
  });

  test('homepage visual test', async ({ page }) => {
    // Full page comparison
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      mask: [page.locator('.timestamp')],
    });
  });

  test('navigation visual test', async ({ page }) => {
    // Element comparison
    const nav = page.locator('nav');
    await expect(nav).toHaveScreenshot('navigation.png');
  });

  test('responsive visual test', async ({ page }) => {
    // Test multiple breakpoints
    const breakpoints = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' },
    ];

    for (const bp of breakpoints) {
      await page.setViewportSize({
        width: bp.width,
        height: bp.height
      });
      await expect(page).toHaveScreenshot(`homepage-${bp.name}.png`);
    }
  });
});
```

### Viewing Screenshot Diffs

When visual tests fail, Playwright generates diff images:

```
test-results/
  example-spec/
    homepage-visual-test/
      homepage-full-actual.png    # Current screenshot
      homepage-full-expected.png  # Baseline screenshot
      homepage-full-diff.png      # Difference highlighted
```

View diffs in:
- **HTML Report:** Shows side-by-side comparison with differences highlighted
- **File System:** Navigate to test-results folder
- **VS Code:** Use image diff extensions

### Advanced Screenshot Techniques

**PDF Screenshots:**
```javascript
test('generate PDF', async ({ page }) => {
  await page.goto('https://example.com');
  await page.pdf({
    path: 'output/page.pdf',
    format: 'A4',
    printBackground: true,
  });
});
```

**Buffer Screenshots (no file save):**
```javascript
test('screenshot to buffer', async ({ page }) => {
  await page.goto('https://example.com');
  const buffer = await page.screenshot();
  // Process buffer (upload, compare, etc.)
});
```

**Multiple elements in one test:**
```javascript
test('capture multiple elements', async ({ page }) => {
  await page.goto('https://example.com');
  
  const elements = [
    { locator: 'header', name: 'header' },
    { locator: 'main', name: 'content' },
    { locator: 'footer', name: 'footer' },
  ];
  
  for (const el of elements) {
    await page.locator(el.locator).screenshot({
      path: `screenshots/${el.name}.png`
    });
  }
});
```

[↑ Back to Top](#learn-playwright-with-pnpm-)

## Reporting

> **⚠️ Important Note About CLI Messages**: Playwright's CLI will output messages suggesting `npx playwright show-report`. Since this project uses pnpm, **always use `pnpm exec` instead of `npx`**. The commands work identically, and `pnpm exec` aligns with this project's setup.

### HTML Reports

Playwright automatically generates HTML reports after test runs.

**View the latest HTML report:**
```bash
pnpm report
# or
pnpm exec playwright show-report
```

**After running tests, you'll see:**
```
To open last HTML report run:
  npx playwright show-report
```

**⚠️ Use `pnpm exec` instead:**
```bash
pnpm exec playwright show-report
```

This opens an interactive report in your default browser showing:
- Test results and status
- Execution timeline
- Error messages and stack traces
- Screenshots and videos
- Traces for failed tests

**Manual HTML report access:**
Open `playwright-report/index.html` directly in your browser.

### Allure Reports

Allure provides advanced, enterprise-grade test reporting with historical data and trends.

#### Generate Allure Report

Create the HTML report from test results:

```bash
pnpm allure:gen
```

This command:
- Reads results from `allure-results/`
- Generates HTML report in `allure-report/`
- Cleans previous report data
- Preserves historical trends

#### Open Allure Report

Start a local server and view the report:

```bash
pnpm allure:open
```

The server runs on a random available port (typically in the 40000-50000 range).

#### Alternative: Manual Report Access

Generate the report and open it manually:

```bash
pnpm allure:gen
# Then open allure-report/index.html in your browser
```

#### Allure Report Features

- **📊 Test History**: Track test results over multiple runs
- **📈 Trends**: Visualize test stability and performance metrics
- **🏷️  Categories**: Group tests by severity, features, or custom tags
- **📎 Attachments**: View screenshots, videos, logs, and traces
- **🌳 Suites**: Hierarchical test organization and navigation
- **⏱️  Timeline**: See test execution timeline and parallelization
- **🔄 Retries**: Track flaky tests and retry patterns
- **📉 Duration**: Analyze test execution times

#### Stopping the Allure Server

**Method 1: Kill all Allure processes**
```bash
pkill -f "allure"
```

**Method 2: Kill by port number**
```bash
# Replace 46363 with your actual port
kill -9 $(lsof -t -i:46363)
```

**Method 3: Find and kill by process ID**
```bash
ps aux | grep allure
kill -9 <PID>
```

**Method 4: VS Code terminal**
- Click the trash can icon next to the terminal tab
- Or right-click terminal tab → "Kill Terminal"

**Method 5: Background jobs**
```bash
jobs                    # List background jobs
kill %<job_number>      # Kill specific job
```

[↑ Back to Top](#learn-playwright-with-pnpm-)

## pnpm Commands Reference

> **💡 CLI Message Translation**: When Playwright CLI suggests `npx` commands, use `pnpm exec` or `pnpx`:
> - Playwright says: `npx playwright show-report` → You use: `pnpx playwright show-report`
> - Playwright says: `npx playwright test` → You use: `pnpx playwright test`
>
> **Note**: `pnpx` is a convenient shorthand for `pnpm exec` - they work identically!

### Package Management

```bash
# Install all dependencies
pnpm install

# Install with frozen lockfile (CI/CD)
pnpm install --frozen-lockfile

# Add new dependency
pnpm add package-name

# Add dev dependency
pnpm add -D package-name

# Remove dependency
pnpm remove package-name

# Update dependencies
pnpm update

# Check outdated packages
pnpm outdated
```

### Test Execution Scripts

```bash
# Install Playwright browsers
pnpm install:browsers

# Run all tests (parallel, 2 workers)
pnpm test

# Run tests with browser UI visible
pnpm test:headed

# Run tests in debug mode
pnpm test:debug

# View Playwright HTML report
pnpm report

# Generate Allure report from results
pnpm allure:gen

# Open Allure report in browser
pnpm allure:open
```

### Direct Playwright Commands

```bash
# Run all tests
pnpm playwright test

# Run specific file (no tests/ prefix needed!)
pnpm playwright test example.spec.js

# Run with options
pnpm playwright test --headed --project=chromium

# Run specific file with options
pnpm playwright test create-article.spec.js --headed --workers=1

# Open test UI
pnpm playwright test --ui

# Generate code from browser actions
pnpx playwright codegen <url>

# Show last test report
pnpx playwright show-report

# Install/update browsers
pnpx playwright install

# Install specific browser
pnpx playwright install chromium
```

### Key Differences: `pnpm` vs `pnpx` vs `npx`

- **`pnpm install`**: Manages package dependencies
- **`pnpm <script>`**: Runs npm scripts from [`package.json`](package.json:1)
- **`pnpm playwright test`**: Runs Playwright directly - **BEST for individual files**
- **`pnpx <command>`**: Shorthand for `pnpm exec` - executes packages
- **`pnpm exec <command>`**: Full form of pnpx - executes packages
- **`npx <command>`**: npm's package executor (use `pnpm` instead)

⚠️ **Important Notes:**
- **For running tests**: Use `pnpm playwright test` or `pnpm test`
- **For individual files**: `pnpm playwright test tests/example.spec.js` ✅
- **For codegen/tools**: `pnpx playwright codegen` ✅
- **For reports**: `pnpx playwright show-report` ✅
- When Playwright CLI suggests `npx`, replace with `pnpm` or `pnpx`

[↑ Back to Top](#learn-playwright-with-pnpm-)

## Configuration

Configuration is managed in [`playwright.config.js`](playwright.config.js:1).

### Key Settings

```javascript
{
  testDir: './tests',                     // Test files directory
  testMatch: '**/*.spec.{js,ts}',         // Test file pattern
  fullyParallel: true,                    // Run tests in parallel
  workers: undefined,                     // AUTO-SCALING - Playwright optimizes based on CPU
  retries: 0,                             // Local: 0, CI: 2
  timeout: 30000,                         // Aggressive 30s timeout
  expect: { timeout: 8000 },              // Aggressive 8s assertion timeout
  reporter: [
    ['html', { open: 'never' }],          // HTML report
    ['allure-playwright'],                // Allure report
    ['list']                              // Console output
  ],
  trace: 'retain-on-failure',             // Capture traces on failure
  use: {
    actionTimeout: 8000,                  // Aggressive action timeout
    navigationTimeout: 30000,             // Aggressive navigation timeout
    // NVIDIA T600 GPU acceleration enabled
  }
}
```

**Auto-Scaling Explained:**
- `workers: undefined` = Playwright automatically uses ~50% of CPU cores
- On your system: Auto-scales to ~10 workers (optimal balance)
- Scales up/down based on system load and available resources
- **Best for growing test suites** - no manual adjustment needed!

**Important**: Since `testDir: './tests'`, you can run tests using just the filename:
```bash
pnpm playwright test example.spec.js  # ✅ Correct
pnpm playwright test tests/example.spec.js  # ❌ Unnecessary
```

**Your System Specs:**
- CPU: 14 cores / 20 logical processors
- RAM: 32GB
- GPU: NVIDIA T600 Laptop GPU (4GB VRAM)
- Workers: **Auto-scaling** (Playwright dynamically adjusts based on CPU cores)
- Performance Mode: AGGRESSIVE - All optimizations enabled

### Available Projects

Currently configured browsers:
- ✅ **Chromium** (enabled)
- ⬜ Firefox (commented out)
- ⬜ WebKit (commented out)

### Customizing Configuration

**Change worker count:**
```javascript
// In playwright.config.js
workers: 4, // Adjust based on CPU cores and system resources
```

**Enable additional browsers:**
```javascript
// Uncomment in playwright.config.js
{
  name: 'firefox',
  use: { ...devices['Desktop Firefox'] },
},
{
  name: 'webkit',
  use: { ...devices['Desktop Safari'] },
}
```

**Set up local dev server:**
```javascript
// Uncomment and configure in playwright.config.js
webServer: {
  command: 'python3 -m http.server 5500',
  url: 'http://127.0.0.1:5500',
  reuseExistingServer: !process.env.CI,
  timeout: 120 * 1000,
}
```

### Worker Configuration Guide

Your system has **14 cores / 20 logical processors and 32GB RAM** - excellent for parallel testing!

**Current Configuration: Auto-Scaling (undefined) - SMART PERFORMANCE**

- **undefined**: **Current setting** - Playwright auto-scales to ~50% of CPU cores (~10 workers)
- **1 worker**: Sequential execution (debugging only)
- **6 workers**: Conservative parallel testing
- **10 workers**: Manual setting (same as auto-scale default)
- **15 workers**: Aggressive parallel testing
- **20 workers**: Maximum (100% CPU - use for massive suites)

**Why Auto-Scaling (undefined) is BEST:**
- ✅ **Automatically adjusts** based on system load
- ✅ **Scales with test suite growth** - no manual changes needed
- ✅ **Optimal balance** - leaves headroom for browser processes
- ✅ **Prevents system overload** - adapts to available resources
- ✅ **Best for 300+ tests** - Playwright knows the optimal worker count

**Performance Scaling with Auto-Workers:**
- 7 tests: ~16-17s (uses 7 workers)
- 100 tests: ~2-3 minutes (uses ~10 workers)
- 300 tests: ~6-8 minutes (uses ~10 workers, batched efficiently)

**Override when needed:**
```bash
# Force maximum workers for one-time speed boost
pnpm playwright test --workers=20

# Force single worker for debugging
pnpm playwright test --workers=1
```

**Override Auto-Scaling When Needed:**
```bash
# Force maximum workers (100% CPU) for one-time speed boost
pnpm playwright test --workers=20

# Use single worker for debugging
pnpm playwright test --workers=1 --headed

# Use moderate workers for stability
pnpm playwright test --workers=6

# Specific file with custom workers
pnpm playwright test example.spec.js --workers=1

# Let auto-scaling work (default - RECOMMENDED)
pnpm playwright test  # Uses ~10 workers automatically
```

**CI environments:** Keep at 1-2 workers for stability regardless of specs

[↑ Back to Top](#learn-playwright-with-pnpm-)

## Browser Management

### Initial Browser Installation

```bash
pnpm install:browsers
```

### Update/Reinstall Browsers

```bash
# Force reinstall all browsers
pnpx playwright install --force

# Install specific browser
pnpx playwright install chromium
pnpx playwright install firefox
pnpx playwright install webkit

# Install browsers with system dependencies
pnpx playwright install --with-deps
```

### Check Browser Versions

```bash
pnpx playwright --version
```

[↑ Back to Top](#learn-playwright-with-pnpm-)

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Install Playwright Browsers
        run: pnpm install:browsers
      
      - name: Run Playwright tests
        run: pnpm test
      
      - name: Generate Allure Report
        if: always()
        run: pnpm allure:gen
      
      - name: Upload Allure Report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: allure-report
          path: allure-report/
          retention-days: 30
      
      - name: Upload Playwright Report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### GitLab CI Example

```yaml
image: node:18

stages:
  - test
  - report

test:
  stage: test
  before_script:
    - pnpm install --frozen-lockfile
    - pnpm install:browsers
  script:
    - pnpm test
  artifacts:
    when: always
    paths:
      - allure-results/
      - playwright-report/
      - test-results/
    expire_in: 1 week

allure-report:
  stage: report
  dependencies:
    - test
  script:
    - pnpm allure:gen
  artifacts:
    paths:
      - allure-report/
    expire_in: 1 month
```

### CI/CD Best Practices

```bash
# Use frozen lockfile for reproducible builds
pnpm install --frozen-lockfile

# Install browsers with dependencies
pnpx playwright install --with-deps

# Run tests with CI configuration
CI=true pnpm test

# Reduce workers for CI environments
# (configured automatically in playwright.config.js)

# Generate reports even on failure
pnpm allure:gen || true
```

[↑ Back to Top](#learn-playwright-with-pnpm-)

## Troubleshooting

### Installation Issues

**Problem: "pnpm: command not found"**
```bash
# Solution: Install pnpm
npm install -g pnpm

# Or using corepack (Node.js 16.13+)
corepack enable
corepack prepare pnpm@latest --activate
```

**Problem: "Cannot find module @playwright/test" or "Playwright Test did not expect test() to be called here"**
```bash
# Solution: Clean pnpm store and reinstall
pnpm store prune
rm -rf node_modules
pnpm install
```

### Browser Issues

**Problem: "Browser not found" error**
```bash
# Solution 1: Install browsers
pnpm install:browsers

# Solution 2: Force reinstall
pnpx playwright install --force

# Solution 3: Install with system dependencies
pnpx playwright install --with-deps chromium
```

**Problem: Browser crashes or hangs**
```bash
# Solution: Reduce workers
# Edit playwright.config.js: workers: 1

# Or run with single worker
pnpm test -- --workers=1
```

### Test Execution Issues

**Problem: Tests running too slowly**
```bash
# Check current worker configuration
# Increase workers in playwright.config.js if you have resources

# Or temporarily increase
pnpm playwright test --workers=15
```

**Problem: Tests flaky or failing randomly**
```bash
# Run with retries
pnpm playwright test --retries=3

# Enable traces to debug
pnpm playwright test --trace=on

# Run specific test in debug mode
pnpm playwright test example.spec.js --debug
```

**Problem: Timeout errors**
```bash
# Increase timeout for slow tests
pnpm playwright test --timeout=60000

# Or configure in playwright.config.js
```

### Report Generation Issues

**Problem: Allure report not generating**
```bash
# Solution 1: Ensure allure-playwright is installed
pnpm add -D allure-playwright

# Solution 2: Check allure-results directory exists
ls -la allure-results/

# Solution 3: Regenerate results
pnpm test
pnpm allure:gen
```

**Problem: Allure server won't stop**
```bash
# Force kill all Allure processes
pkill -f allure

# Or kill by port
kill -9 $(lsof -t -i:XXXXX)  # Replace XXXXX with port number
```

**Problem: Port conflicts**
```bash
# Specify custom port
pnpx allure open allure-report --port 9999
```

### Lock File Issues

**Problem: Lock file conflicts or corruption**
```bash
# Remove old lock files
rm -f package-lock.json pnpm-lock.yaml bun.lockb

# Reinstall
pnpm install
```

### Debug Mode

Use these commands for detailed troubleshooting:

```bash
# Run with debug output
DEBUG=pw:api pnpm test

# Pause before each action
pnpm test:debug

# Add manual pause points in test code
await page.pause();

# View trace file
pnpx playwright show-trace test-results/example-test/trace.zip

# Generate trace for all tests
pnpm test -- --trace=on
```

[↑ Back to Top](#learn-playwright-with-pnpm-)

## Performance Tips

### 1. Optimize pnpm Usage

```bash
# Use pnpm for faster dependency installation
# Efficient disk usage with content-addressable storage
pnpm install

# Use pnpm playwright instead of npx
# Better caching and faster execution
pnpm playwright test

# Run specific files efficiently
pnpm playwright test tests/example.spec.js
```

### 2. Parallel Execution

```javascript
// Your system: 14 cores / 20 threads, 32GB RAM
// MAXIMUM PERFORMANCE configuration for 300+ test suite:

### Additional Performance Optimizations for 300+ Test Suite

**1. Use Test Sharding for Massive Suites:**
```bash
# Split tests across multiple machines/processes
pnpm playwright test --shard=1/4  # Run 1st quarter
pnpm playwright test --shard=2/4  # Run 2nd quarter
pnpm playwright test --shard=3/4  # Run 3rd quarter
pnpm playwright test --shard=4/4  # Run 4th quarter
```

**2. Optimize Test Organization:**
```bash
# Group related tests in describe blocks for better parallelization
# Run critical tests first with --grep
pnpm playwright test --grep "@critical"

# Run smoke tests separately
pnpm playwright test --grep "@smoke"
```

**3. Use Selective Test Execution:**
```bash
# During development, run only affected tests
pnpm playwright test --grep "field validation"

# Run only failed tests to save time
pnpm playwright test --last-failed

# Run specific test file during development
pnpm playwright test create-article.spec.js
```

**4. Current Optimizations Already Enabled:**
- ✅ 20 workers (100% CPU utilization)
- ✅ NVIDIA T600 GPU acceleration enabled
- ✅ Aggressive timeouts (30s test, 8s assertions)
- ✅ Parallel execution enabled
- ✅ 6GB Node.js heap size
- ✅ All Chrome performance flags enabled

**5. Expected Performance for Your 300+ Test Suite:**
- **With 20 workers**: ~6-8 minutes for full suite
- **With grep filtering**: ~30s-2min for subset
- **Individual file**: ~5-30s depending on test count

workers: 20,  // 100% of threads - MAXIMUM speed for large test suites

// Alternative configurations for different scenarios:
workers: 15,  // 75% - good balance for medium suites (50-200 tests)
workers: 10,  // 50% - optimal for small suites (<50 tests)
workers: 6,   // 30% - conservative for debugging
workers: 1,   // Sequential (debugging only)
```

**Performance with 20 workers (for 300+ tests):**
- Small suite (7 tests): ~17-20s (auto-limited to 7 workers)
- Medium suite (100 tests): ~2-3 minutes
- Large suite (300 tests): ~6-8 minutes
- **Massive time savings** compared to lower worker counts

**Why 20 workers is optimal for your use case:**
- You're planning 300+ tests with multiple validation scenarios
- 20 workers = 20 tests running simultaneously
- With 300 tests: 15 batches of 20 = much faster than 10 workers (30 batches)

### 3. Selective Testing

```bash
# Run only specific test file
pnpm playwright test example.spec.js

# Run only failed tests
pnpm playwright test --last-failed

# Run with grep to filter by name
pnpm playwright test --grep "login"

# Run specific file with grep
pnpm playwright test create-article.spec.js --grep "article"
```

### 4. Browser Selection

```bash
# Test only in Chromium during development
pnpm playwright test --project=chromium

# Test specific file in specific browser
pnpm playwright test example.spec.js --project=chromium

# Enable multiple browsers only for CI/pre-release
# Commented out in playwright.config.js by default
```

### 5. Resource Management

```bash
# Close browsers properly after tests
# Playwright handles this automatically

# Monitor system resources
htop  # or top on macOS

# Reduce parallel workers if system struggles
pnpm playwright test --workers=1
```

### 6. Caching

```bash
# pnpm caches dependencies automatically
# Content-addressable storage saves disk space

# Clear cache if needed
pnpm store prune
```

### Performance Benchmarks

**Installation Speed:**
- pnpm uses content-addressable storage for efficient disk usage
- Faster than npm due to hard-linking instead of copying
- Saves significant disk space across projects

**Test Execution Speed:**
- Similar to npm/bun for test execution
- Benefits from efficient dependency resolution

[↑ Back to Top](#learn-playwright-with-pnpm-)

## Migration Notes

This project has been successfully migrated from npm/bun to pnpm due to stability issues with bun. Key changes:

### What Changed

- ✅ **Package Manager**: npm/bun → pnpm
- ✅ **Scripts**: Updated to use `pnpm exec` instead of `npx`
- ✅ **Lock File**: `package-lock.json`/`bun.lockb` → `pnpm-lock.yaml`
- ✅ **Performance**: Faster installation and efficient disk usage

### What Stayed the Same

- ✅ All Playwright test code (no changes needed)
- ✅ Configuration files ([`playwright.config.js`](playwright.config.js:1))
- ✅ Test file structure and organization
- ✅ Allure reporting integration
- ✅ Browser compatibility

### Benefits of pnpm

1. **⚡ Speed**: Faster package installation and efficient disk usage
2. **🔄 Compatibility**: Works with all npm packages
3. **💾 Disk Efficiency**: Uses hard links to save disk space
4. **🚀 Strict**: Better dependency management with strict node_modules structure
5. **📦 Better Caching**: Content-addressable storage for dependencies

For detailed migration information, see [`how_to.md`](how_to.md).

[↑ Back to Top](#learn-playwright-with-pnpm-)

## Contributing

1. Write tests in the [`tests/`](tests/) directory
2. Follow naming convention: `*.spec.js` or `*.spec.ts`
3. Use descriptive test names with `describe` blocks
4. Add appropriate test tags for categorization
5. Run tests before committing: `pnpm test`
6. Ensure tests pass in all configured browsers

### Test Structure Example

```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code
  });

  test('should perform expected action', async ({ page }) => {
    // Test implementation
  });

  test('should handle edge cases', async ({ page }) => {
    // Edge case testing
  });
});
```

[↑ Back to Top](#learn-playwright-with-pnpm-)

## Additional Resources

- 📘 [Playwright Documentation](https://playwright.dev/)
- 📦 [pnpm Documentation](https://pnpm.io/)
- 📊 [Allure Documentation](https://docs.qameta.io/allure/)
- 🧪 [Playwright Test Runner](https://playwright.dev/docs/test-runner)
- 🎭 [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- 🔍 [Playwright Selectors](https://playwright.dev/docs/selectors)
- 📸 [Visual Comparisons](https://playwright.dev/docs/test-snapshots)

---

[↑ Back to Top](#learn-playwright-with-pnpm-)

---

**Project Maintained with ❤️ using pnpm + Playwright**

For detailed pnpm migration guide and advanced usage, see [`how_to.md`](how_to.md:1).