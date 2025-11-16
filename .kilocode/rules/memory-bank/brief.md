# Playwright Testing Framework Project

## Overview
A high-performance end-to-end testing framework built with Playwright, designed to automate web application testing against the-internet.herokuapp.com. The project emphasizes performance optimization, maintainability, and comprehensive test coverage through the Page Object Model pattern.

## Main Objectives
- Provide automated end-to-end testing for web applications
- Achieve maximum test execution speed through parallel processing and GPU acceleration
- Maintain clean, maintainable test code using Page Object Model architecture
- Generate detailed test reports (HTML and Allure) for comprehensive test analysis

## Key Features
- **Page Object Model (POM)**: Structured page classes in `pages/` directory (LoginPage, CheckboxesPage, SecurePage, PomManager)
- **Performance Optimization**: Dynamic worker scaling (50% of CPU cores, max 15), GPU acceleration enabled, aggressive timeout settings
- **Dual Reporting**: HTML reports (Playwright native) and Allure reports for advanced analytics
- **CommonActions Utility**: Reusable helper methods for common browser actions
- **Base URL Configuration**: Centralized URL management (`https://the-internet.herokuapp.com`)
- **Test Categories**: Smoke and regression test organization with grep-based filtering

## Technologies Used
- **Test Framework**: Playwright (@playwright/test v1.56.1)
- **Package Manager**: pnpm (migrated from bun for stability)
- **Runtime**: Node.js (ESM modules)
- **Reporting**: Allure (allure-playwright v3.3.3, allure-commandline v2.34.1)
- **Browser**: Chromium with NVIDIA T600 GPU acceleration
- **System**: Enhanced for 32GB RAM, 20-thread CPU, Full HD viewport (1920x1080)

## Project Structure
```
├── pages/           # Page Object Model classes
├── tests/           # Test specification files
├── utils/           # Helper utilities (CommonActions)
├── playwright.config.js   # Optimized test configuration
└── package.json     # Dependencies and scripts
```

## Significance
This project serves as a robust, scalable testing framework that balances speed and maintainability. The aggressive performance optimizations (dynamic workers, GPU acceleration, optimized timeouts) enable rapid test execution for growing test suites, while the Page Object Model ensures long-term maintainability and code reusability across test scenarios.

## Quality
This project will exhibit top industry standards for 2025 leveraging latest technlogies available and providing a top of the line quality production grade code that Fortune 500 companies use.

## Prospective Planning
This project is an ongoing project that will bring further tests to leverage Playwright's full command usage.