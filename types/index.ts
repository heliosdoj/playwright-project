/**
 * Barrel export file for all type definitions
 * Import from '@types' or 'types' to access all types
 */

// Action types for CommonActions utility
export type {
  SelectorOrLocator,
  WaitState,
  LoadState,
  NavigationWaitUntil,
  NavigateOptions,
  ClickOptions,
  FillOptions,
  TypeOptions,
  SelectOptions,
  CheckOptions,
  GetTextOptions,
  GetAttributeOptions,
  VisibilityOptions,
  WaitOptions,
  WaitForUrlOptions,
} from './actions.types';

export { DEFAULT_TIMEOUTS, DEFAULT_TYPE_DELAY } from './actions.types';

// Page object interfaces
export type {
  IBasePage,
  ILoginPage,
  ISecurePage,
  ICheckboxesPage,
  PageConstructor,
  AnyPageObject,
  PageRegistry,
  PageName,
  IPomManager,
} from './pages.types';