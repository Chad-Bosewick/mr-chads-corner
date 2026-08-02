import React from "react";
import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FooterAsciiBrand, scrambleWord } from "./FooterAsciiBrand";

const motionPreference = vi.hoisted(() => ({ reduced: false }));

vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => motionPreference.reduced,
}));

describe("FooterAsciiBrand", () => {
  beforeEach(() => {
    motionPreference.reduced = false;
    vi.restoreAllMocks();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
  });

  it("renders a static Temi Adekunle wordmark under reduced motion", () => {
    motionPreference.reduced = true;
    render(<FooterAsciiBrand />);

    expect(screen.getByText("Temi Adekunle")).toBeInTheDocument();
    expect(document.querySelector("canvas")).toBeNull();
  });

  it("never produces a blank word during a scramble", () => {
    expect(scrambleWord("Temi Adekunle", "Chad Bosewick", 0, 0)).toBe(
      "Temi Adekunle",
    );

    const middle = scrambleWord(
      "Temi Adekunle",
      "Chad Bosewick",
      0.5,
      8,
    );
    expect(middle).toHaveLength("Temi Adekunle".length);
    expect(middle.trim()).not.toBe("");
    expect(middle).not.toBe("Temi Adekunle");

    expect(scrambleWord("Temi Adekunle", "Chad Bosewick", 1, 20)).toBe(
      "Chad Bosewick",
    );
  });

  it("loops from Temi through a scramble to Chad when visible", () => {
    let intersectionCallback: IntersectionObserverCallback | undefined;
    let animationFrame: FrameRequestCallback | undefined;

    vi.spyOn(performance, "now").mockReturnValue(0);
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          intersectionCallback = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      animationFrame = callback;
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});

    render(<FooterAsciiBrand />);
    expect(screen.getByText("Temi Adekunle")).toBeInTheDocument();

    act(() => {
      intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    act(() => animationFrame?.(2_850));
    expect(screen.queryByText("Temi Adekunle")).not.toBeInTheDocument();
    expect(screen.queryByText("Chad Bosewick")).not.toBeInTheDocument();

    act(() => animationFrame?.(3_700));
    expect(screen.getByText("Chad Bosewick")).toBeInTheDocument();
  });
});
