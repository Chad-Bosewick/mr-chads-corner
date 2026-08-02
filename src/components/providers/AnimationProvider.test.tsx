import React from "react";
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AnimationProvider,
  computePauseControlVisible,
  GlobalAnimationPauseControl,
} from "./AnimationProvider";

const pathname = vi.hoisted(() => ({ value: "/" }));
const motionPreference = vi.hoisted(() => ({ reduced: false }));

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.value,
}));

vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => motionPreference.reduced,
}));

let observer: { trigger: (target: Element, isIntersecting: boolean) => void } | undefined;

function PauseControlFixture({ showHero = true }: { showHero?: boolean }) {
  return (
    <AnimationProvider>
      {showHero && <div data-hero-band />}
      <footer />
      <GlobalAnimationPauseControl />
    </AnimationProvider>
  );
}

describe("computePauseControlVisible", () => {
  it("shows for either governed effect unless reduced motion is preferred", () => {
    expect(computePauseControlVisible({ heroInView: true, footerInView: false, prefersReducedMotion: false })).toBe(true);
    expect(computePauseControlVisible({ heroInView: false, footerInView: true, prefersReducedMotion: false })).toBe(true);
    expect(computePauseControlVisible({ heroInView: true, footerInView: true, prefersReducedMotion: false })).toBe(true);
    expect(computePauseControlVisible({ heroInView: false, footerInView: false, prefersReducedMotion: false })).toBe(false);
    expect(computePauseControlVisible({ heroInView: true, footerInView: true, prefersReducedMotion: true })).toBe(false);
  });
});

describe("GlobalAnimationPauseControl", () => {
  beforeEach(() => {
    pathname.value = "/";
    motionPreference.reduced = false;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        private readonly callback: IntersectionObserverCallback;

        constructor(callback: IntersectionObserverCallback) {
          this.callback = callback;
          observer = {
            trigger: (target, isIntersecting) => {
              act(() => {
                this.callback(
                  [{ target, isIntersecting } as IntersectionObserverEntry],
                  this as unknown as IntersectionObserver,
                );
              });
            },
          };
        }

        observe() {}
        disconnect() {}
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("mounts only while an observed hero or footer is in view", () => {
    const { container, rerender } = render(<PauseControlFixture />);
    const hero = container.querySelector("[data-hero-band]") as HTMLElement;
    const footer = container.querySelector("footer") as HTMLElement;

    expect(screen.queryByRole("button", { name: /pause background animation/i })).toBeNull();

    observer?.trigger(hero, true);
    expect(screen.getByRole("button", { name: /pause background animation/i })).toBeInTheDocument();

    observer?.trigger(hero, false);
    expect(screen.queryByRole("button", { name: /pause background animation/i })).toBeNull();

    pathname.value = "/about-temi";
    rerender(<PauseControlFixture showHero={false} />);
    observer?.trigger(footer, true);
    expect(screen.getByRole("button", { name: /pause background animation/i })).toBeInTheDocument();

    observer?.trigger(footer, false);
    expect(screen.queryByRole("button", { name: /pause background animation/i })).toBeNull();
  });

  it("never renders under reduced motion", () => {
    motionPreference.reduced = true;
    render(<PauseControlFixture />);

    expect(screen.queryByRole("button", { name: /pause background animation/i })).toBeNull();
  });
});
