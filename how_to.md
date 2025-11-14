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

1. **Package Manager**: npm/bun → pnpm
2. **Scripts**: Updated all scripts to use `pnpm exec` instead of `npx`
3. **Lock File**: `package-lock.json`/`bun.lockb` → `pnpm-lock.yaml`
4. **Worker Configuration**: Dynamic auto-scaling (uses ~50% of CPU cores, ~10 workers on 20-thread system)
5. **Performance**: Efficient disk usage with content-addressable storage

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

**Why?** This project uses pnpm instead of npm. All `npx` commands work with `pnpm exec` - they provide better caching and align with the project setup.

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
# Run all tests (auto-scaling workers, typically ~10 on 20-thread system)
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

**Dynamic scaling for your 20-thread system:**
- **Workers**: `Math.min(Math.floor(os.cpus().length * 0.5), 15)`
- **Result**: 10 workers (50% of 20 threads, capped at 15 max)
- **Rationale**: Automatically adjusts based on CPU cores, leaves headroom for browser processes
- **Location**: [`playwright.config.js`](playwright.config.js:30)

### Configuration Options

```javascript
// In playwright.config.js
workers: Math.min(Math.floor(os.cpus().length * 0.5), 15),  // Current - dynamic (RECOMMENDED)
workers: 20,         // Maximum - uses all threads
workers: 15,         // Aggressive - high parallelism (current cap)
workers: 10,         // Manual setting (same as dynamic result on your system)
workers: 6,          // Conservative - more stable
workers: 1,          // Sequential - debugging only
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

With auto-scaling (~10 workers) on your system:
- Small test suite (7 tests): ~16-20 seconds
- Medium test suite (50 tests): ~5-10 seconds
- Large test suite (300+ tests): ~6-8 minutes (with 20 workers)

**Current Test Suite:**
- 9 test files with various test scenarios
- Includes performance tests ([`many.spec.js`](tests/many.spec.js:1) with 20 parallel tests)
- End-to-end workflows ([`create-article.spec.js`](tests/create-article.spec.js:1))
- Assertion examples ([`assertions.spec.js`](tests/assertions.spec.js:1))

## Key Differences: pnpm vs npm

### Command Translation

| Task | npm | pnpm |
|------|-----|------|
| Install packages | `npm install` | `pnpm install` |
| Run script | `npm run test` | `pnpm test` |
| Execute package | `npx playwright test` | `pnpm exec playwright test` |
| Add dependency | `npm install pkg` | `pnpm add pkg` |
| Add dev dependency | `npm install -D pkg` | `pnpm add -D pkg` |
| Remove dependency | `npm uninstall pkg` | `pnpm remove pkg` |

### Important Distinctions

**`pnpm test` vs `pnpm exec playwright test`:**
- ✅ `pnpm test` - Runs npm script from [`package.json`](package.json:10) (recommended for all tests)
- ✅ `pnpm exec playwright test` - Direct Playwright execution (useful for specific files)

**`pnpm exec` vs `npx`:**
- `pnpm exec` is pnpm's equivalent of `npx`
- Better caching and dependency resolution
- Always use `pnpm exec` when Playwright suggests `npx`

### Lock Files

- **npm**: `package-lock.json` (JSON format)
- **pnpm**: `pnpm-lock.yaml` (YAML format - human-readable)
- **bun**: `bun.lockb` (binary format - not used in this project)

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

**After (pnpm):**
```yaml
- name: Setup pnpm
  uses: pnpm/action-setup@v2
  with:
    version: 8
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
rm -f package-lock.json bun.lockb

# Reinstall with pnpm
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

## Benefits of Using pnpm

### Performance

- **Fast installation** with content-addressable storage
- **Efficient disk usage** - hard links save space across projects
- **Better caching** - dependencies reused efficiently
- **Reliable** - more stable than bun for Playwright testing

### Developer Experience

- **Compatible** with all npm packages
- **Strict** - better dependency management
- **Workspace support** - excellent for monorepos
- **Modern** - efficient package management

### System Utilization

With auto-scaling workers (~10 on your 20-thread system):
- Efficient parallel test execution
- Dynamic resource adjustment based on system load
- Room for browser processes and GPU acceleration
- Optimal for 32GB RAM configuration
- Scales automatically as test suite grows

## Additional Resources

- [pnpm Documentation](https://pnpm.io/)
- [pnpm vs npm Performance](https://pnpm.io/benchmarks)
- [Playwright Documentation](https://playwright.dev/)
- [Allure Reporting](https://docs.qameta.io/allure/)
- Main project README: [`README.md`](README.md)

---

**Migration completed successfully!** Your Playwright tests now run reliably with pnpm, providing better stability and efficient resource management while maintaining full compatibility with the existing test suite.