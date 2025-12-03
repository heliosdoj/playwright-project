# Technologies and Setup

## Core Technologies
- **Test Framework**: Playwright (`@playwright/test` v1.56.1) - The primary framework for end-to-end testing.
- **Language**: TypeScript (strict mode enabled) - Primary language for the `Project-TSnotJS/` folder.
- **Runtime**: Node.js (v24.3.0 or higher) - The JavaScript runtime environment.
- **Package Manager**: pnpm - Used for fast and efficient dependency management, chosen for stability over other package managers like bun.

## TypeScript Configuration
- **Target**: ES2022 with ESNext modules
- **Strict Mode**: Enabled with `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`
- **Path Aliases**: `@pages/*`, `@utils/*`, `@types/*` for clean imports
- **Type Definitions**: Custom interfaces in `types/` directory for CommonActions and Page Objects

## Reporting
- **Allure**: A comprehensive reporting tool (`allure-playwright` v3.3.3, `allure-commandline` v2.34.1) used for generating detailed, historical test reports.
- **Playwright HTML Reporter**: The built-in reporter for quick, local test summaries.
- **List Reporter**: Provides minimalist console output, suitable for CI/CD environments.

## Development and Tooling
- **TypeScript**: Full native TypeScript support with strict compilation
- **Git**: The version control system for the project.

## Test Environment & Configuration
- **Base URL**: Tests are configured to run against `https://the-internet.herokuapp.com`.
- **Browsers**:
    - **Chromium**: The primary browser for testing, heavily optimized for performance with GPU acceleration enabled for NVIDIA T600 GPUs.
    - Firefox and Webkit are configured but currently disabled.
- **Parallel Execution**: Tests run in parallel for speed. The number of workers is dynamically calculated as 50% of the available CPU cores (capped at 15) to optimize performance.
- **Timeouts**: The configuration uses aggressive timeouts (30s for tests, 8s for assertions and actions) to ensure a fast feedback loop.
- **Continuous Integration (CI)**: The configuration is CI-aware, with settings for retries (`2`) and trace recording (`on-first-retry`) when `process.env.CI` is true.

## Code and Project Structure (TypeScript Version - Project-TSnotJS/)
- **Page Object Model (POM)**: The primary design pattern, with page objects located in the `pages/` directory.
- **Test Entry Point**: All tests are located in the `tests/` directory and follow the `*.spec.ts` naming convention.
- **Utilities**: Shared functions and helpers are in the `utils/` directory.
- **Type Definitions**: Centralized in `types/` directory with:
  - `actions.types.ts` - CommonActions method parameter interfaces
  - `pages.types.ts` - Page object interfaces (ILoginPage, ISecurePage, etc.)
  - `index.ts` - Re-exports all types

## Key Scripts
```bash
pnpm test           # Run all tests
pnpm test:smoke     # Run smoke tests only
pnpm test:regression # Run regression tests
pnpm test:pom       # Run POM tests
pnpm allure:generate # Generate Allure reports
pnpm allure:open    # Open Allure reports in browser