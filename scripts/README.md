# Adhoc Scripts Directory

This directory contains script templates, examples, and utility scripts that demonstrate various Playwright usage patterns and TypeScript best practices.

## Purpose

The `scripts/` directory is designed to store:
- **Script Templates**: Reusable code patterns for common automation tasks
- **Examples**: Demonstrations of Playwright API usage with TypeScript
- **Utility Scripts**: Helper scripts for development and debugging
- **Migration Examples**: JavaScript to TypeScript conversion examples

## Contents

### solution.js
- **Type**: JavaScript script template
- **Purpose**: Original JavaScript version demonstrating web scraping with Playwright
- **Features**: Page validation, error handling, table data extraction

### solution.ts
- **Type**: TypeScript script template
- **Purpose**: TypeScript conversion of solution.js with comprehensive type annotations
- **Features**: Interfaces, explicit types, null safety, type-only imports

## Usage

These scripts are not part of the main test suite but serve as:
1. **Learning Resources**: Examples for team members learning Playwright/TypeScript
2. **Code Templates**: Starting points for new automation scripts
3. **Best Practices**: Demonstrations of proper TypeScript patterns
4. **Migration Guides**: JavaScript to TypeScript conversion examples

## Running Scripts - Flexible Approach

### Individual Script Execution (Choose Any Script)

```bash
# Run ANY JavaScript script by name (without extension)
pnpm script:run solution

# Run ANY TypeScript script by name (without extension)
pnpm script:ts solution

# Build and run ANY compiled TypeScript script by name
pnpm script:build solution
```

### List Available Scripts

```bash
# List all available scripts (shows base names)
pnpm script:list
```

### Examples with Current Scripts

```bash
# Run the solution.js script
pnpm script:run solution

# Run the solution.ts script directly
pnpm script:ts solution

# Build and run the compiled solution.ts
pnpm script:build solution
```

## Key Differences from Test Files

| Feature | Test Files | Script Files |
|---------|------------|--------------|
| **Location** | `tests/` directory | `scripts/` directory |
| **Purpose** | Automated testing | Automation examples/templates |
| **Execution** | Playwright test runner | Node.js/TS-Node |
| **Structure** | Test suites with assertions | Standalone scripts |
| **Dependencies** | Playwright test framework | Core Playwright library |

## Best Practices

1. **Naming**: Use descriptive names ending in `.js` or `.ts`
2. **Documentation**: Include JSDoc/TSDoc comments explaining purpose and usage
3. **Type Safety**: TypeScript files should demonstrate proper typing patterns
4. **Error Handling**: Include robust error handling examples
5. **Modularity**: Keep scripts focused on single responsibilities

## Production-Grade Integration

### CI/CD Pipeline Usage
```yaml
# Example GitHub Actions workflow
- name: Run automation scripts
  run: pnpm script:run solution  # Run any script by name
```

### Security Considerations
- **Permissions**: Scripts should have minimal required permissions
- **Secrets Management**: Use environment variables for sensitive data
- **Validation**: Include input validation for script parameters

### Performance Optimization
- **Caching**: Cache compiled TypeScript outputs
- **Parallel Execution**: Design scripts to run concurrently where possible
- **Resource Cleanup**: Ensure proper browser/process cleanup

## Script Management Pattern

As the project grows, you can add more scripts and run them using the same pattern:

```bash
# For a new script called "health-check.js"
pnpm script:run health-check    # JavaScript version
pnpm script:ts health-check     # TypeScript version
pnpm script:build health-check  # Compiled version
```

## Key Benefits of This Approach

✅ **Flexibility**: Run any script by name without hardcoding
✅ **Scalability**: Add new scripts without modifying package.json
✅ **Consistency**: Uniform command pattern for all scripts
✅ **Discovery**: List available scripts with `pnpm script:list`
✅ **PNPM-Only**: All commands use pnpm exclusively

This pattern provides **complete control** over script execution while maintaining **clean, maintainable** package.json configuration.