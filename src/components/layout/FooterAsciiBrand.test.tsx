import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FooterAsciiBrand,
  pairParticleAnchors,
  type ParticlePoint,
} from "./FooterAsciiBrand";

const motionPreference = vi.hoisted(() => ({ reduced: false }));

vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => motionPreference.reduced,
}));

describe("FooterAsciiBrand", () => {
  beforeEach(() => {
    motionPreference.reduced = false;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
  });

  afterEach(() => {
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

    const { container } = render(<FooterAsciiBrand />);

    await waitFor(() => {
      expect(container.querySelectorAll("[data-wordmark-particle]").length).toBeGreaterThan(0);
    });
    expect(document.querySelector("canvas")).toBeNull();
    expect(container.textContent).not.toMatch(/[#%&*+.:=?@]/);
  });
});
