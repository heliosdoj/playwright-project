# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Playwright-based end-to-end testing framework using **pnpm** as the package manager. The project implements a Page Object Model (POM) architecture with TypeScript, featuring comprehensive type safety, reusable utilities, and advanced reporting capabilities (HTML + Allure).

**Key Tech Stack:**
- Playwright 1.56.1 with TypeScript
- pnpm for package management
- TypeScript with strict mode enabled
- Page Object Model pattern with Factory pattern (PomManager)
- Allure reporting for test analytics

## Common Commands

### Running Tests

```bash
# Run all tests (uses auto-scaled workers based on CPU)
pnpm test

# Run specific test file (testDir is ./tests, so no prefix needed)
pnpm exec playwright test example.spec.ts
pnpm exec playwright test pomTests.spec.ts

# Run single test in debug mode
pnpm exec playwright test example.spec.ts --debug

# Run tests with visible browser
pnpm test:headed

# Interactive UI mode
pnpm run test:ui

# Run filtered tests
pnpm exec playwright test --grep "@smoke"
pnpm run test:smoke
pnpm run test:regression
```

### Linting and Type Checking

```bash
# Lint TypeScript/JavaScript files
pnpm lint

# Auto-fix lint issues
pnpm lint:fix

# Format with Prettier
pnpm format

# Check formatting
pnpm format:check

# Run both linting and formatting checks
pnpm lint:all

# Type check without emitting files
pnpm typecheck

# Type check in watch mode
pnpm typecheck:watch
```

### Build and Development

```bash
# Compile TypeScript to dist/
pnpm build

# Watch mode compilation
pnpm dev

# Generate TypeDoc documentation
pnpm generate:docs

# Install Playwright browsers
pnpm install:browsers
```

### Reports

```bash
# View Playwright HTML report
pnpm report

# Generate and open Allure report
pnpm allure:gen
pnpm allure:open
```

### Running Scripts

```bash
# Run JavaScript script
pnpm run script:run <script-name>

# Run TypeScript script with ts-node
pnpm run script:ts <script-name>

# Build and run compiled script
pnpm run script:build <script-name>

# List available scripts
pnpm run script:list
```

### Important CLI Notes

**ALWAYS use `pnpm exec` instead of `npx`** - Playwright's CLI messages will suggest `npx`, but this project uses pnpm. Replace any `npx playwright` commands with `pnpm exec playwright`.

## Architecture Overview

### Directory Structure

```
playwright-project/
├── pages/              # Page Object classes (POM pattern)
│   ├── PomManager.ts   # Factory for creating/caching page objects
│   ├── LoginPage.ts    # Login page interactions
│   ├── SecurePage.ts   # Secure area after login
│   └── CheckboxesPage.ts
├── utils/              # Shared utilities
│   └── CommonActions.ts  # Reusable browser action wrappers
├── types/              # TypeScript type definitions
│   ├── actions.types.ts  # Action method option types
│   ├── pages.types.ts    # Page object interfaces
│   └── index.ts          # Barrel export for all types
├── tests/              # Test specifications
│   ├── pomTests.spec.ts  # POM pattern examples
│   ├── login.spec.ts
│   ├── assertions.spec.ts
│   └── ...
├── scripts/            # Utility scripts (JS/TS)
│   ├── JSwebscrape.js
│   └── TSwebscrape.ts
├── playwright.config.ts  # Playwright configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

### Page Object Model (POM) Pattern

The framework uses a **Factory Pattern** via `PomManager` to create and cache page objects:

**PomManager (Factory):**
- Centralizes page object creation
- Lazy-loads page objects (only creates when needed)
- Caches instances for reuse within a test
- Returns strongly-typed interfaces

**Example usage in tests:**
```typescript
test('example test', async ({ page }) => {
  const pomManager = new PomManager(page);
  const loginPage = pomManager.getLoginPage();
  await loginPage.navigate();
  await loginPage.login('user', 'pass');
});
```

**Page Object Structure:**
Each page object (e.g., `LoginPage`, `SecurePage`):
- Implements a typed interface (e.g., `ILoginPage`)
- Contains `public readonly page: Page`
- Contains `public readonly actions: CommonActions` for reusable utilities
- Defines all locators as class properties (e.g., `usernameInput`, `loginButton`)
- Implements page-specific action methods (e.g., `login()`, `navigate()`)

### CommonActions Utility

`CommonActions` provides type-safe wrappers around Playwright actions with:
- Consistent timeout handling (10s for actions, 30s for navigation)
- Automatic waiting for element states (visible, attached, etc.)
- Flexible selector input (accepts string selectors or Locator objects)
- Methods for all common interactions: click, fill, type, check, getText, etc.

**Usage pattern:**
```typescript
// In page objects
this.actions = new CommonActions(page);
await this.actions.fill(this.usernameInput, 'user');
await this.actions.click(this.loginButton);
```

### TypeScript Configuration

**Key features:**
- **Path aliases** configured in `tsconfig.json`:
  - `@pages/*` → `pages/*`
  - `@utils/*` → `utils/*`
  - `@types/*` → `types/*`
  - `@tests/*` → `tests/*`
- **Strict mode enabled** with additional safety flags
- **Mixed JS/TS support** during migration (`allowJs: true`, `checkJs: true`)
- **Module system:** ESNext with bundler resolution
- **Target:** ES2022 for modern features
- **Output:** Compiled to `dist/` directory

### Worker Scaling Strategy

The framework uses **dynamic worker calculation** in `playwright.config.ts`:
- Formula: `Math.min(Math.floor(os.cpus().length * 0.75), 20)`
- On 20-thread system: Uses 15 workers (75% of CPU)
- CI environment: Falls back to 2 workers for stability
- Can override per-run: `pnpm exec playwright test --workers=1`

### Test Patterns

**File naming:** `*.spec.{js,ts}` in `tests/` directory

**Test structure:**
```typescript
import { test, expect } from '@playwright/test';
import PomManager from '../pages/PomManager';

test.describe('Feature Name', () => {
  let pomManager: PomManager;
  let loginPage: ILoginPage;

  test.beforeEach(async ({ page }) => {
    pomManager = new PomManager(page);
    loginPage = pomManager.getLoginPage();
    await loginPage.navigate();
  });

  test('test case description', async () => {
    // Test implementation
  });
});
```

## Development Guidelines

### Adding New Page Objects

1. Create interface in `types/pages.types.ts`
2. Create page class in `pages/` implementing the interface
3. Add private cached property to `PomManager`
4. Add getter method to `PomManager`
5. Export interface from `types/index.ts`

### Adding New Tests

1. Create `*.spec.ts` file in `tests/`
2. Import PomManager and necessary type interfaces
3. Use `test.beforeEach()` to initialize page objects
4. Write tests using page object methods (not direct Playwright calls)

### Working with CommonActions

When page objects need new actions:
1. Check if action exists in `CommonActions`
2. If not, add to `CommonActions` with proper types
3. Define option types in `types/actions.types.ts`
4. Use the action via `this.actions.<method>()` in page objects

### TypeScript Best Practices

- Always type function parameters and return values
- Use interfaces for page objects (`ILoginPage`, etc.)
- Leverage path aliases for clean imports
- Mark properties `readonly` where appropriate
- Use `async/await` with `Promise<void>` return types

### Configuration Changes

**Playwright settings:** Edit `playwright.config.ts`
- Workers, timeouts, retries
- Browser projects (Chromium, Firefox, WebKit)
- Base URL, viewport size
- Reporter configuration

**TypeScript settings:** Edit `tsconfig.json`
- Compiler options, strictness
- Path aliases
- Include/exclude patterns

## Reporting and Debugging

**Test artifacts generated:**
- `playwright-report/` - HTML reports (view with `pnpm report`)
- `allure-results/` - Raw Allure data
- `allure-report/` - Generated Allure report (view with `pnpm allure:open`)
- `test-results/` - Screenshots, videos, traces for failed tests

**Debugging:**
- Use `--debug` flag to step through tests
- Use `--headed` to see browser actions
- Use `--trace=on` to record full trace
- View traces: `pnpm exec playwright show-trace test-results/.../trace.zip`

## Migration Context

This project was **migrated from npm to pnpm** for stability and performance:
- Previous package manager had issues with Playwright
- pnpm provides faster installs and better disk efficiency
- All npm scripts work with pnpm (just replace `npm` with `pnpm`)
- Lock file changed from `package-lock.json` to `pnpm-lock.yaml`

## CI/CD Considerations

- Use `pnpm install --frozen-lockfile` in CI
- Worker count auto-reduces to 2 in CI (`process.env.CI`)
- Retries increase from 0 to 2 in CI
- Both HTML and Allure reports generated automatically
