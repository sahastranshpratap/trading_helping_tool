// Jest setup file
import '@testing-library/jest-dom';

// Mock for ResizeObserver that's used in many components but not available in jest-dom
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock for window.matchMedia which is not available in jest-dom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock for IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: '',
  thresholds: []
}));

// Mock for requestAnimationFrame
global.requestAnimationFrame = callback => setTimeout(callback, 0);

// Suppress console errors during tests to keep output clean
// Useful especially during chart tests which often trigger deprecation warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filter out specific expected warnings if needed
  if (args[0] && args[0].includes('Warning: ReactDOM.render is no longer supported')) {
    return;
  }
  
  originalConsoleError(...args);
}; 