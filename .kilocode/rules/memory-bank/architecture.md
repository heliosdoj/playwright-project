# System Architecture

## Overview
This project is a test automation framework built on Node.js and Playwright. It follows the Page Object Model (POM) design pattern to ensure scalability and maintainability. The architecture is designed for high-performance, parallel test execution.

**Active Project**: `Project-TSnotJS/` (TypeScript version - recommended for ongoing development)

## Source Code Paths (TypeScript - Project-TSnotJS/)
- `Project-TSnotJS/tests/`: Contains all test specification files (`.spec.ts`). This is the entry point for test execution.
- `Project-TSnotJS/pages/`: Holds the Page Object Model classes (`.ts` files). Each file corresponds to a specific page or major component.
- `Project-TSnotJS/utils/`: Includes reusable utility functions and helper classes, such as `CommonActions.ts`.
- `Project-TSnotJS/types/`: TypeScript type definitions for actions and page objects.
- `Project-TSnotJS/playwright.config.ts`: The central configuration file for Playwright.

## Legacy Source Code Paths (JavaScript - Root folder)
- `tests/`: Contains legacy JavaScript test specification files (`.spec.js`).
- `pages/`: Legacy JavaScript Page Object Model classes.
- `utils/`: Legacy JavaScript utility functions including `CommonActions.js`.
- `playwright.config.js`: Legacy JavaScript configuration file.

## Design Patterns
- **Page Object Model (POM)**: This is the core design pattern used in the framework.
    - **Abstraction**: It abstracts page-specific selectors and methods away from the test scripts.
    - **Maintainability**: UI changes only require updates in the corresponding page object file, not in every test that uses it.
    - **Reusability**: Page objects can be reused across multiple tests.
    - **Interface-based Design (TypeScript)**: `IPomManager`, `ILoginPage`, `ISecurePage`, `ICheckboxesPage` interfaces enforce contracts.
    - `PomManager.ts` acts as a lazy-loading factory to create and provide instances of page objects to the tests.

## Component Relationships
```mermaid
graph TD
    A[Tests (*.spec.ts)] --> B{PomManager};
    B --> C[LoginPage];
    B --> D[SecurePage];
    B --> E[CheckboxesPage];
    C --> F[CommonActions];
    D --> F;
    E --> F;
    A --> G[playwright.config.ts];
    F --> H[Type Definitions];
    C --> H;
    D --> H;
    E --> H;
    subgraph "Test Execution"
        A
    end
    subgraph "Page Objects"
        B
        C
        D
        E
    end
    subgraph "Utilities"
        F
    end
    subgraph "Configuration"
        G
    end
    subgraph "Types"
        H
    end
```

## Critical Implementation Paths
1.  **Test Execution Flow**: A test in the `tests/` directory is initiated. It uses the `PomManager` to get an instance of a required page object.
2.  **Page Interaction**: The test calls methods on the page object (e.g., `loginPage.login('user', 'pass')`).
3.  **Action Execution**: The page object's method uses Playwright locators and actions (often via `CommonActions`) to interact with the web page.
4.  **Assertions**: The test file makes assertions using Playwright's `expect` to validate the application's state.

## Key Technical Decisions
- **TypeScript for Scalability**: Migrated to TypeScript for better type safety, IDE support, and maintainability when scaling to 100s-1000s of tests.
- **pnpm for Package Management**: Chosen over npm/bun for performance, stability, and efficient disk space usage.
- **Dynamic Worker Scaling**: The number of parallel test workers is dynamically calculated based on the CPU cores, optimizing test execution time without manual configuration.
- **GPU Acceleration**: Enabled for Chromium to improve rendering performance during tests.
- **Dual Reporting Strategy**: Utilizes both Playwright's native HTML reporter for quick local feedback and Allure for comprehensive, historical reports.