/**
 * Type definitions for CommonActions utility class
 * These types provide strong typing for all browser action methods
 */
import type { Locator } from '@playwright/test';

// ============================================================================
// Core Types
// ============================================================================

/**
 * Flexible selector type - accepts either a CSS selector string or a Playwright Locator
 * This allows methods to work with both raw selectors and pre-configured locators
 */
export type SelectorOrLocator = string | Locator;

/**
 * Wait states matching Playwright's waitFor state options
 */
export type WaitState = 'attached' | 'detached' | 'visible' | 'hidden';

/**
 * Page load states matching Playwright's waitForLoadState options
 */
export type LoadState = 'load' | 'domcontentloaded' | 'networkidle';

/**
 * Navigation wait conditions matching Playwright's goto waitUntil options
 */
export type NavigationWaitUntil = 'load' | 'domcontentloaded' | 'networkidle' | 'commit';

// ============================================================================
// Action Options Interfaces
// ============================================================================

/**
 * Options for page navigation
 */
export interface NavigateOptions {
  /** Wait until this load state is reached before considering navigation complete */
  waitUntil?: NavigationWaitUntil;
  /** Maximum time to wait for navigation in milliseconds */
  timeout?: number;
}

/**
 * Options for click actions
 */
export interface ClickOptions {
  /** Whether to bypass actionability checks and force the click */
  force?: boolean;
  /** Maximum time to wait for the element in milliseconds */
  timeout?: number;
}

/**
 * Options for fill actions (clearing and typing into inputs)
 */
export interface FillOptions {
  /** Maximum time to wait for the element in milliseconds */
  timeout?: number;
}

/**
 * Options for type actions (sequential key presses with delay)
 */
export interface TypeOptions {
  /** Delay between key presses in milliseconds */
  delay?: number;
  /** Maximum time to wait for the element in milliseconds */
  timeout?: number;
}

/**
 * Options for select dropdown actions
 */
export interface SelectOptions {
  /** Maximum time to wait for the element in milliseconds */
  timeout?: number;
}

/**
 * Options for check/uncheck checkbox actions
 */
export interface CheckOptions {
  /** Maximum time to wait for the element in milliseconds */
  timeout?: number;
}

/**
 * Options for getting text content from elements
 */
export interface GetTextOptions {
  /** Maximum time to wait for the element in milliseconds */
  timeout?: number;
  /** Whether to trim whitespace from the result */
  trim?: boolean;
}

/**
 * Options for getting element attributes
 */
export interface GetAttributeOptions {
  /** Maximum time to wait for the element in milliseconds */
  timeout?: number;
}

/**
 * Options for visibility checks
 */
export interface VisibilityOptions {
  /** Maximum time to wait for the visibility state in milliseconds */
  timeout?: number;
}

/**
 * Options for waiting for elements
 */
export interface WaitOptions {
  /** The state to wait for */
  state?: WaitState;
  /** Maximum time to wait in milliseconds */
  timeout?: number;
}

/**
 * Options for waiting for specific URLs
 */
export interface WaitForUrlOptions {
  /** Maximum time to wait for the URL change in milliseconds */
  timeout?: number;
}

// ============================================================================
// Default Values (for documentation and reference)
// ============================================================================

/**
 * Default timeout values used across CommonActions methods
 * These match the aggressive timeout settings in the original project
 */
export const DEFAULT_TIMEOUTS = {
  /** Default timeout for element actions (click, fill, etc.) */
  ACTION: 10_000,
  /** Default timeout for page navigation */
  NAVIGATION: 30_000,
  /** Default timeout for assertions */
  ASSERTION: 8_000,
} as const;

/**
 * Default type delay for sequential typing
 */
export const DEFAULT_TYPE_DELAY = 100;
