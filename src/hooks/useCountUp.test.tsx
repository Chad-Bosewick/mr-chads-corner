import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCountUp } from "./useCountUp";

const motionPreference = vi.hoisted(() => ({ reduced: false }));

vi.mock("./useReducedMotion", () => ({
  useReducedMotion: () => motionPreference.reduced,
}));

describe("useCountUp", () => {
  let frameTime: number;

  beforeEach(() => {
    motionPreference.reduced = false;
    frameTime = 0;
    vi.useFakeTimers();
    vi.spyOn(performance, "now").mockReturnValue(0);
    vi.stubGlobal(
      "requestAnimationFrame",
      (callback: FrameRequestCallback) =>
        window.setTimeout(() => callback((frameTime += 16)), 16),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("waits for its delay and eases to the target", () => {
    const { result } = renderHook(() => useCountUp(100, 100, 50));

    act(() => vi.advanceTimersByTime(49));
    expect(result.current).toBe(0);

    for (let frame = 0; frame < 8; frame += 1) {
      act(() => vi.advanceTimersByTime(16));
    }
    expect(result.current).toBe(100);
  });

  it("returns the final value immediately for reduced motion", () => {
    motionPreference.reduced = true;
    const { result } = renderHook(() => useCountUp(72));

    expect(result.current).toBe(72);
  });
});
