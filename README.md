# Playwright + TypeScript E2E Framework (pnpm)

High-performance end-to-end test automation built with Playwright and TypeScript, targeting `https://the-internet.herokuapp.com`.

This repository is **fully migrated to TypeScript** (root directory) and follows the **Page Object Model (POM)** for maintainable, scalable test suites.

## What’s in here

- **POM architecture** in [`pages/`](pages/PomManager.ts:1) with a lazy-loaded manager ([`PomManager`](pages/PomManager.ts:1)).
- **Reusable actions** in [`utils/CommonActions.ts`](utils/CommonActions.ts:1).
- **Strong typing** via interfaces in [`types/`](types/index.ts:1).
- **Parallel + performance-focused config** (dynamic workers + Chromium flags + Full HD viewport).
- **Dual reporting**: Playwright HTML + Allure.

## Prerequisites

- Node.js **22+** recommended
- pnpm (or enable Corepack)

## Install

```bash
pnpm install
pnpm install:browsers
```

## Quick start

```bash
# Run all tests
pnpm test

# Interactive UI runner
pnpm test:ui

# Headed mode
pnpm test:headed

# Debug mode
pnpm test:debug

# Type-check only
pnpm typecheck
```

## Running specific tests

Run by file:

```bash
pnpm exec playwright test tests/login.spec.ts
```

Run by tag:

```bash
pnpm test:smoke
pnpm test:regression
```

Run by grep:

```bash
pnpm exec playwright test --grep "login"
pnpm exec playwright test --grep "@smoke"
```

## Reporting

Playwright HTML report:

```bash
pnpm report
```

Allure report:

```bash
pnpm allure:gen
pnpm allure:open
```

Generated artifact folders (created on demand):

- `playwright-report/`
- `test-results/`
- `allure-results/`
- `allure-report/`

## Playwright codegen

```bash
pnpm exec playwright codegen https://the-internet.herokuapp.com
```

## Project structure

```text
pages/                 # Page Objects (POM) - see pages/PomManager.ts
tests/                 # Test specs (*.spec.ts)
types/                 # Shared TypeScript interfaces/types
utils/                 # Utilities (CommonActions)
playwright.config.ts   # Playwright configuration
tsconfig.json          # TypeScript configuration
package.json           # Scripts + devDependencies
how_to.md              # Detailed setup / migration notes
```

Quick links:

- [`pages/`](pages/PomManager.ts:1)
- [`tests/`](tests/login.spec.ts:1)
- [`types/`](types/index.ts:1)
- [`utils/`](utils/CommonActions.ts:1)
- [`playwright.config.ts`](playwright.config.ts:1)
- [`tsconfig.json`](tsconfig.json:1)
- [`package.json`](package.json:1)
- [`how_to.md`](how_to.md:1)

## Configuration notes

Key settings live in [`playwright.config.ts`](playwright.config.ts:1):

- `baseURL`: `https://the-internet.herokuapp.com`
- `workers`: dynamic scaling (75% of CPU cores, capped at 20; CI uses 2)
- `reporter`: `html` + `allure-playwright` + `list`
- `trace`: `retain-on-failure` locally, `on-first-retry` in CI
- Chromium launch args include Windows GPU acceleration flags

## Writing tests (POM example)

Minimal example showing POM usage:

```ts
import { test, expect } from '@playwright/test';
import { PomManager } from '@pages/PomManager';

test('login works', async ({ page }) => {
  const pom = new PomManager(page);
  const login = pom.getLoginPage();
  const secure = pom.getSecurePage();

  await login.goto();
  await login.login('tomsmith', 'SuperSecretPassword!');
  await expect(secure.flashAlert).toContainText('You logged into a secure area!');
});
```

## Documentation

Setup, workflows, and performance notes are maintained in [`how_to.md`](how_to.md:1).
