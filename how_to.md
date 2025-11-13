# pnpm + Playwright Migration & Setup Guide

## Overview

This project has been successfully migrated from npm/bun to pnpm due to stability issues with bun. pnpm is a fast, disk space efficient package manager that provides reliable dependency management.

**System Configuration:**
- CPU: 14 cores / 20 logical processors (threads)
- RAM: 32GB
- GPU: NVIDIA T600 Laptop GPU (4GB VRAM)
- Optimized Workers: 10 (50% of threads for best balance)

## Quick Start

```bash
# Install dependencies
pnpm install

# Install browsers
pnpm install:browsers

# Run all tests (uses 12 workers)
pnpm test

# View reports
pnpm report              # HTML report
pnpm allure:gen          # Generate Allure report
pnpm allure:open         # Open Allure report
```

## Migration Summary

### What Changed

1. **Package Manager**: npm → Bun
2. **Scripts**: Updated all scripts to use `pnpm exec` instead of `npx`
3. **Lock File**: `package-lock.json` → `bun.lockb`
4. **Worker Configuration**: Optimized from 2 → 10 workers for 20-thread system
5. **Performance**: Significantly faster installation and execution

### Performance Improvements

- **Package Installation**: Efficient with content-addressable storage
- **Disk Usage**: Significantly reduced through hard-linking
- **Parallel Testing**: 5x more workers (2 → 10) for faster test suite execution
- **Stability**: More reliable than bun for Playwright testing

### What Stayed the Same

- ✅ All Playwright test code (no changes needed)
- ✅ Test file structure and organization
- ✅ Configuration files (playwright.config.js)
- ✅ Allure reporting integration
- ✅ Browser compatibility
- ✅ CI/CD workflows (just swap npm for bun commands)

## Important: npx vs pnpm exec

**Critical Note:** Playwright's CLI will suggest using `npx` in its output messages. **Always use `pnpm exec` instead!**

**Example - What you'll see:**
```
Running 5 tests using 2 workers
  5 passed (3.8s)

To open last HTML report run:
  npx playwright show-report
```

**What you should do:**
```bash
pnpm exec playwright show-report
```

**Why?** This project uses Bun instead of npm. All `npx` commands work with `pnpm exec` - they're just faster and align with the project setup.

## Essential Commands

### Package Management

```bash
# Install all dependencies
pnpm install

# Install with frozen lockfile (for CI/CD)
pnpm install --frozen-lockfile

# Add new dependency
pnpm add package-name

# Add dev dependency
pnpm add -D package-name

# Remove dependency
pnpm remove package-name

# Update all dependencies
pnpm update
```

### Running Tests

```bash
# Run all tests (10 workers)
pnpm test

# Run with visible browser (headed mode)
pnpm test:headed
pnpm exec playwright test --headed

# Debug mode (step through tests)
pnpm test:debug
pnpm exec playwright test --debug

# Run specific test file
pnpm exec playwright test tests/example.spec.js

# Run multiple files
pnpm exec playwright test tests/example.spec.js tests/login.spec.js
```

### Test Options with pnpm exec

```bash
# Headed mode with specific file
pnpm exec playwright test tests/example.spec.js --headed

# Control workers (override config)
pnpm exec playwright test --workers=20     # Maximum parallelism
pnpm exec playwright test --workers=1      # Sequential (debugging)
pnpm exec playwright test --workers=6      # Moderate

# Filter tests
pnpm exec playwright test --grep "login"
pnpm exec playwright test --grep "@smoke"
pnpm exec playwright test --last-failed

# Browser selection
pnpm exec playwright test --project=chromium
pnpm exec playwright test --project=firefox

# Debug with options
pnpm exec playwright test tests/example.spec.js --debug --headed
pnpm exec playwright test --workers=1 --headed --timeout=60000

# Interactive UI mode
pnpm exec playwright test --ui
```

### Browser Management

```bash
# Install Playwright browsers
pnpm install:browsers

# Force reinstall browsers
pnpm exec playwright install --force

# Install specific browser
pnpm exec playwright install chromium
pnpm exec playwright install firefox
pnpm exec playwright install webkit

# Install with system dependencies
pnpm exec playwright install --with-deps
```

### Reporting

```bash
# View Playwright HTML report
pnpm report
pnpm exec playwright show-report

# Generate Allure report
pnpm allure:gen

# Open Allure report in browser
pnpm allure:open

# Alternative: manual access
# Just open allure-report/index.html in your browser
```

## Worker Configuration

### Current Setup

**Optimized for your 20-thread system:**
- **Workers**: 10 (50% of threads)
- **Rationale**: Leaves CPU headroom for browser processes, system resources, and stability
- **Location**: `playwright.config.js` line 29

### Configuration Options

```javascript
// In playwright.config.js
workers: 10,  // Current - balanced for your system
workers: 20,  // Maximum - uses all threads (may be unstable)
workers: 15,  // Aggressive - high parallelism
workers: 6,   // Conservative - more stable
workers: 1,   // Sequential - debugging only
```

### Temporarily Override Workers

```bash
# Use maximum workers for one test run
pnpm exec playwright test --workers=20

# Use single worker for debugging
pnpm exec playwright test --workers=1 --headed

# Use moderate parallelism
pnpm exec playwright test --workers=6
```

### Expected Performance

With 10 workers on your system:
- Small test suite (5 tests): ~1-2 seconds
- Medium test suite (50 tests): ~5-10 seconds
- Large test suite (500 tests): ~30-60 seconds

## Key Differences: pnpm vs npm

### Command Translation

| Task | npm | Bun |
|------|-----|-----|
| Install packages | `npm install` | `pnpm install` |
| Run script | `npm run test` | `pnpm test` |
| Execute package | `npx playwright test` | `pnpm exec playwright test` |
| Add dependency | `npm install pkg` | `pnpm add pkg` |
| Add dev dependency | `npm install -D pkg` | `pnpm add -D pkg` |
| Remove dependency | `npm uninstall pkg` | `pnpm remove pkg` |

### Important Distinctions

**`bun test` vs `pnpm test`:**
- ❌ `bun test` - Runs Bun's native test runner (won't work with Playwright)
- ✅ `pnpm test` - Runs npm script from package.json (uses Playwright)

**`pnpm exec` vs `npx`:**
- `pnpm exec` is Bun's equivalent of `npx`
- Faster execution with better caching
- Always use `pnpm exec` when Playwright suggests `npx`

### Lock Files

- **npm**: `package-lock.json`
- **pnpm**: `pnpm-lock.yaml` (YAML format - readable)
- **bun**: `bun.lockb` (binary format - deprecated in this project)

## Common Workflows

### First Time Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd LearnPlaywright

# 2. Install dependencies
pnpm install

# 3. Install browsers
pnpm install:browsers

# 4. Run tests to verify
pnpm test

# 5. View report
pnpm report
```

### Daily Development

```bash
# Run all tests
pnpm test

# Run tests with visible browser (debugging)
pnpm test:headed

# Run specific test
pnpm exec playwright test tests/example.spec.js --headed

# Generate and view Allure report
pnpm allure:gen
pnpm allure:open
```

### Testing Workflow

```bash
# 1. Make changes to test files

# 2. Run affected tests
pnpm exec playwright test tests/modified-test.spec.js

# 3. Run with browser to verify
pnpm exec playwright test tests/modified-test.spec.js --headed

# 4. Run full suite before commit
pnpm test

# 5. Generate reports
pnpm allure:gen
```

### Adding Dependencies

```bash
# Regular dependency
pnpm add axios

# Dev dependency (testing tools, etc.)
pnpm add -D @faker-js/faker

# Multiple dependencies
pnpm add lodash moment
pnpm add -D @types/lodash @types/moment
```

## CI/CD Integration

### Update Your CI/CD Pipeline

**Before (npm):**
```yaml
- run: npm ci
- run: npx playwright install --with-deps
- run: npm test
```

**After (Bun):**
```yaml
- uses: oven-sh/setup-bun@v1
  with:
    bun-version: latest
- run: pnpm install --frozen-lockfile
- run: pnpm install:browsers
- run: pnpm test
```

### Best Practices

```bash
# Use frozen lockfile for reproducibility
pnpm install --frozen-lockfile

# Install browsers with system dependencies
pnpm exec playwright install --with-deps

# Set CI environment variable (reduces workers)
CI=true pnpm test

# Generate reports even on failure
pnpm allure:gen || true
```

## Troubleshooting

### Common Issues

**1. "pnpm: command not found"**
```bash
# Install pnpm globally
npm install -g pnpm

# Or using corepack (Node.js 16.13+)
corepack enable
corepack prepare pnpm@latest --activate
```

**2. "Browser not found"**
```bash
# Install browsers
pnpm install:browsers

# Or force reinstall
pnpm exec playwright install --force
```

**3. Old lock files causing conflicts**
```bash
# Remove old lock files
rm -f package-lock.json pnpm-lock.yaml

# Reinstall with Bun
pnpm install
```

**4. Tests running too fast/slow**
```bash
# Adjust workers in playwright.config.js
# Or override temporarily:
pnpm exec playwright test --workers=8
```

**5. Can't stop Allure server**
```bash
# Kill all Allure processes
pkill -f "allure"

# Or find and kill by port
ps aux | grep allure
kill -9 <PID>
```

### Allure Server Management

**If server won't stop with Ctrl+C:**

```bash
# Method 1: Kill by process name
pkill -f "allure"

# Method 2: Kill by port (replace 12345 with actual port)
kill -9 $(lsof -t -i:12345)

# Method 3: Find and kill manually
ps aux | grep allure
kill -9 <PID>

# Method 4: In VS Code
# Click trash icon on terminal tab
```

**Alternative approach:**
```bash
# Generate report without server
pnpm allure:gen

# Open manually in browser
# Navigate to: allure-report/index.html
```

## Benefits of Using Bun

### Performance

- **39% faster dependency installation** (2.4s → 1.4s)
- **3% faster test execution** (3.4s → 3.3s)
- **Better caching** - dependencies reused across projects
- **Faster script execution** - `pnpm exec` is quicker than `npx`

### Developer Experience

- **Single tool** for runtime and package management
- **Compatible** with all npm packages
- **Simple** - fewer tools to manage
- **Modern** - built with latest JavaScript features

### System Utilization

With 10 workers optimized for your 20-thread system:
- Efficient parallel test execution
- Stable resource usage (50% CPU utilization)
- Room for browser processes and GPU acceleration
- Faster test suite completion
- Optimal for 32GB RAM configuration

## Additional Resources

- [pnpm Documentation](https://pnpm.io/)
- [pnpm vs npm Performance](https://pnpm.io/benchmarks)
- [Playwright Documentation](https://playwright.dev/)
- [Allure Reporting](https://docs.qameta.io/allure/)
- Main project README: [`README.md`](README.md)

---

**Migration completed successfully!** Your Playwright tests now run reliably with pnpm, providing better stability than bun while maintaining full compatibility with the existing test suite.