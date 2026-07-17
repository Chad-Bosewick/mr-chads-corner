import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useScrollReveal } from "./useScrollReveal";

describe("useScrollReveal", () => {
  beforeEach(() => {
    // Mock window.matchMedia for useReducedMotion
    Object.defineProperty(window, "matchMedia", {
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

    // Mock IntersectionObserver
    const mockObserve = vi.fn();
    const mockDisconnect = vi.fn();
    vi.stubGlobal("IntersectionObserver", vi.fn(() => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: vi.fn(),
    })));
  });

  it("returns a ref and isVisible boolean", () => {
    const { result } = renderHook(() => useScrollReveal());
    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.isVisible).toBe("boolean");
  });

  it("initialises isVisible as false", () => {
    const { result } = renderHook(() => useScrollReveal());
    expect(result.current.isVisible).toBe(false);
  });
});
