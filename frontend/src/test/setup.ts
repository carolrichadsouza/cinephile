import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
  document.documentElement.className = '';
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { value: vi.fn(), writable: true });
Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', { value: vi.fn(() => false), writable: true });
Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', { value: vi.fn(), writable: true });
Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', { value: vi.fn(), writable: true });
