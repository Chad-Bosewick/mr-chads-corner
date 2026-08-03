import React from "react";
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FooterAsciiBrand } from "./FooterAsciiBrand";

const motionPreference = vi.hoisted(() => ({ reduced: false }));
const animationPreference = vi.hoisted(() => ({ paused: false }));

vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => motionPreference.reduced,
}));

vi.mock("@/components/providers/AnimationProvider", () => ({
  useAnimationContext: () => ({ isAsciiPaused: animationPreference.paused }),
}));

let intersectionCallback: IntersectionObserverCallback | undefined;

describe("FooterAsciiBrand", () => {
  beforeEach(() => {
    motionPreference.reduced = false;
    animationPreference.paused = false;
    vi.stubGlobal("IntersectionObserver", class {
      constructor(callback: IntersectionObserverCallback) { intersectionCallback = callback; }
      observe() {}
      disconnect() {}
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("keeps the original static Temi wordmark under reduced motion", () => {
    motionPreference.reduced = true;
    render(<FooterAsciiBrand />);
    expect(screen.getByText("Temi Adekunle").closest("svg")).toHaveClass("w-full");
    expect(document.querySelectorAll("rect")).toHaveLength(1);
  });

  it("renders 13 lightweight segments for each wordmark state", () => {
    render(<FooterAsciiBrand />);
    expect(document.querySelectorAll("rect")).toHaveLength(26);
    expect(document.querySelectorAll("circle")).toHaveLength(1);
  });

  it("changes wordmark state only while visible and unpaused", () => {
    vi.useFakeTimers();
    const { container, rerender } = render(<FooterAsciiBrand />);
    const first = container.querySelectorAll("rect")[0] as SVGRectElement;
    expect(first.style.opacity).toBe("1");

    act(() => intersectionCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    act(() => vi.advanceTimersByTime(2200));
    expect(first.style.opacity).toBe("0");

    animationPreference.paused = true;
    rerender(<FooterAsciiBrand />);
    act(() => vi.advanceTimersByTime(5000));
    expect(first.style.opacity).toBe("0");
  });
});
