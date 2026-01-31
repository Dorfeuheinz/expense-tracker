// Setup DOM environment for Bun tests using happy-dom
import { Window } from 'happy-dom';
import '@testing-library/jest-dom';

// Suppress React Router future flag warnings in tests
// These are informational warnings about v7 changes, not errors
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  const message = args[0]?.toString() || '';
  if (
    message.includes('React Router Future Flag Warning') ||
    message.includes('v7_startTransition') ||
    message.includes('v7_relativeSplatPath')
  ) {
    // Suppress these specific warnings
    return;
  }
  originalWarn.apply(console, args);
};

const window = new Window({
  url: 'http://localhost:3000',
  width: 1024,
  height: 768,
});

// Mock ResizeObserver for Ant Design components
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Assign to global scope for React Testing Library
Object.assign(globalThis, {
  window: window as any,
  document: window.document as any,
  navigator: window.navigator as any,
  HTMLElement: window.HTMLElement as any,
  Element: window.Element as any,
  Node: window.Node as any,
  Event: window.Event as any,
  EventTarget: window.EventTarget as any,
  CustomEvent: window.CustomEvent as any,
  MouseEvent: window.MouseEvent as any,
  ShadowRoot: window.ShadowRoot as any,
  SVGElement: window.SVGElement as any,
  SVGSVGElement: window.SVGSVGElement as any,
  ResizeObserver: ResizeObserver,
  // Add other missing APIs
  getComputedStyle: window.getComputedStyle.bind(window),
  requestAnimationFrame: (cb: FrameRequestCallback) => setTimeout(cb, 0),
  cancelAnimationFrame: (id: number) => clearTimeout(id),
  // Add Range for Ant Design
  Range: window.Range as any,
  Selection: window.Selection as any,
});
