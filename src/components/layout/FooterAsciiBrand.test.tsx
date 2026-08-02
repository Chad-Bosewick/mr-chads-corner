import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FooterAsciiBrand,
  pairParticleAnchors,
  type ParticlePoint,
} from "./FooterAsciiBrand";

const motionPreference = vi.hoisted(() => ({ reduced: false }));
const animationPreference = vi.hoisted(() => ({ paused: false }));

vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => motionPreference.reduced,
}));

vi.mock("@/components/providers/AnimationProvider", () => ({
  useAnimationContext: () => ({
    isAsciiPaused: animationPreference.paused,
    toggleAsciiPause: vi.fn(),
  }),
}));

let intersectionCallback: IntersectionObserverCallback | undefined;

function installCanvasMock() {
  const pixels = new Uint8ClampedArray(1120 * 340 * 4);
  for (const [x, y] of [
    [99, 99],
    [201, 141],
    [303, 201],
  ]) {
    pixels[(y * 1120 + x) * 4 + 3] = 255;
  }

  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    clearRect: vi.fn(),
    fillText: vi.fn(),
    getImageData: vi.fn(() => ({ data: pixels })),
    measureText: vi.fn(() => ({ width: 640 })),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    set fillStyle(_value: string) {},
    set font(_value: string) {},
    set textAlign(_value: string) {},
    set textBaseline(_value: string) {},
  })) as never;
}

function setIntersection(isIntersecting: boolean) {
  act(() => {
    intersectionCallback?.(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
}

describe("FooterAsciiBrand", () => {
  beforeEach(() => {
    motionPreference.reduced = false;
    animationPreference.paused = false;
    intersectionCallback = undefined;
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
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("preserves the original width-led wordmark size under reduced motion", () => {
    motionPreference.reduced = true;
    render(<FooterAsciiBrand />);

    const wordmark = screen.getByText("Temi Adekunle").closest("svg");
    expect(wordmark).toHaveClass("w-full");
    expect(wordmark).not.toHaveClass("h-full");
    expect(document.querySelector("canvas")).toBeNull();
    expect(document.querySelector("[data-wordmark-particle]")).toBeNull();
  });

  it("pairs real particle anchors with a right-leading wave", () => {
    const temi: ParticlePoint[] = [
      { x: 100, y: 100 },
      { x: 900, y: 100 },
    ];
    const chad: ParticlePoint[] = [
      { x: 120, y: 120 },
      { x: 920, y: 120 },
    ];

    const particles = pairParticleAnchors(temi, chad, 10);

    expect(particles).toHaveLength(2);
    const left = particles.find((particle) => particle.ax === 100);
    const right = particles.find((particle) => particle.ax === 900);
    expect(right!.delayMs).toBeLessThan(left!.delayMs);
  });

  it("renders SVG particle nodes without substitute text symbols", async () => {
    installCanvasMock();
    const { container } = render(<FooterAsciiBrand />);

    await waitFor(() => {
      expect(container.querySelectorAll("[data-wordmark-particle]").length).toBeGreaterThan(0);
    });
    expect(document.querySelector("canvas")).toBeNull();
    expect(container.querySelector("[data-wordmark-target] text")).toBeNull();
  });

  it("creates stable dispersed anchors within the five-pixel drift", () => {
    const points: ParticlePoint[] = [
      { x: 100, y: 100 },
      { x: 900, y: 200 },
    ];

    const first = pairParticleAnchors(points, points, 10);
    const second = pairParticleAnchors(points, points, 10);

    expect(second).toEqual(first);
    for (const particle of first) {
      expect(Math.abs(particle.dx - particle.ax)).toBeLessThanOrEqual(5);
      expect(Math.abs(particle.dy - particle.ay)).toBeLessThanOrEqual(5);
    }
  });

  it("gathers once before morphing through the constellation dip", async () => {
    installCanvasMock();
    const { container } = render(<FooterAsciiBrand />);
    await waitFor(() => {
      expect(container.querySelector("[data-wordmark-target='dispersed']")).not.toBeNull();
    });

    const particle = container.querySelector("[data-wordmark-particle]") as SVGCircleElement;
    expect(particle.style.transform).not.toBe("translate(0px, 0px)");

    vi.useFakeTimers();
    setIntersection(true);
    expect(container.querySelector("[data-wordmark-phase='gather']")).not.toBeNull();
    expect(container.querySelector("[data-wordmark-target='a']")).not.toBeNull();

    act(() => vi.advanceTimersByTime(900 + 1600));
    expect(container.querySelector("[data-wordmark-target='b']")).not.toBeNull();
    expect(particle.style.transitionProperty).toBe("transform, opacity");
    expect(particle.style.animationName).toBe("footer-shared-constellation");
  });

  it("freezes the cycle while globally paused and resumes the remaining dwell", async () => {
    installCanvasMock();
    animationPreference.paused = true;
    const { container, rerender } = render(<FooterAsciiBrand />);
    await waitFor(() => {
      expect(container.querySelector("[data-wordmark-target='dispersed']")).not.toBeNull();
    });

    vi.useFakeTimers();
    vi.spyOn(performance, "now").mockImplementation(() => Date.now());
    setIntersection(true);
    expect(container.querySelector("[data-wordmark-phase='dwellA']")).not.toBeNull();
    act(() => vi.advanceTimersByTime(5000));
    expect(container.querySelector("[data-wordmark-target='a']")).not.toBeNull();

    animationPreference.paused = false;
    rerender(<FooterAsciiBrand />);
    act(() => vi.advanceTimersByTime(600));

    animationPreference.paused = true;
    rerender(<FooterAsciiBrand />);
    act(() => vi.advanceTimersByTime(5000));
    expect(container.querySelector("[data-wordmark-target='a']")).not.toBeNull();

    animationPreference.paused = false;
    rerender(<FooterAsciiBrand />);
    act(() => vi.advanceTimersByTime(1200));
    expect(container.querySelector("[data-wordmark-target='b']")).not.toBeNull();
  });

  it("does not re-gather when the wordmark re-enters the viewport", async () => {
    installCanvasMock();
    const { container } = render(<FooterAsciiBrand />);
    await waitFor(() => {
      expect(container.querySelector("[data-wordmark-target='dispersed']")).not.toBeNull();
    });

    vi.useFakeTimers();
    setIntersection(true);
    act(() => vi.advanceTimersByTime(900 + 500));
    expect(container.querySelector("[data-wordmark-phase='dwellA']")).not.toBeNull();

    setIntersection(false);
    act(() => vi.advanceTimersByTime(5000));
    setIntersection(true);

    expect(container.querySelector("[data-wordmark-phase='dwellA']")).not.toBeNull();
    expect(container.querySelector("[data-wordmark-target='dispersed']")).toBeNull();
  });
});
