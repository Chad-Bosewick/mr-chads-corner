import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FooterAsciiBrand } from "./FooterAsciiBrand";

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
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
    // jsdom has no canvas 2d context; the component must guard with getContext null check.
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as never;
  });

  it("renders the static wordmark under reduced motion", () => {
    motionPreference.reduced = true;
    render(<FooterAsciiBrand />);
    expect(screen.getByText("Temi Adekunle")).toBeInTheDocument();
  });

  it("renders a canvas wordmark when motion is allowed", () => {
    render(<FooterAsciiBrand />);
    expect(document.querySelector("canvas")).not.toBeNull();
  });

  it("keeps the static wordmark available until canvas drawing succeeds", () => {
    render(<FooterAsciiBrand />);
    expect(document.querySelector("canvas")).not.toBeNull();
    expect(screen.getByText("Temi Adekunle")).toBeInTheDocument();
  });

  it("sizes the canvas once it mounts so the animation initialises", () => {
    // Fake 2D context so the effect's resize()/build() actually run. jsdom
    // has no canvas context; returning null is what let this regression slip.
    HTMLCanvasElement.prototype.getContext = vi.fn(() => {
      const data = new Uint8ClampedArray(1_000_000);
      return {
        setTransform: vi.fn(),
        clearRect: vi.fn(),
        fillText: vi.fn(),
        getImageData: vi.fn(() => ({ data })),
        set fillStyle(_v: string) {},
        set font(_v: string) {},
        set textAlign(_v: string) {},
        set textBaseline(_v: string) {},
        set globalAlpha(_v: number) {},
      };
    }) as never;
    vi.stubGlobal("requestAnimationFrame", () => 1);
    vi.stubGlobal("cancelAnimationFrame", () => {});

    render(<FooterAsciiBrand />);

    const canvas = document.querySelector("canvas");
    expect(canvas).not.toBeNull();
    // Before the fix the effect ran while the static SVG was still mounted,
    // exited early on the null ref, and never re-ran: the canvas stayed at
    // the jsdom default 300x150 with no inline style — i.e. blank forever.
    expect(canvas!.style.width).not.toBe("");
    expect(canvas!.width).not.toBe(300);
  });

  it("hands off from the static fallback after the first successful draw", async () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      setTransform: vi.fn(),
      clearRect: vi.fn(),
      fillText: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray([0, 0, 0, 255]),
      })),
      set fillStyle(_v: string) {},
      set font(_v: string) {},
      set textAlign(_v: string) {},
      set textBaseline(_v: string) {},
      set globalAlpha(_v: number) {},
    })) as never;
    vi.stubGlobal("requestAnimationFrame", () => 1);
    vi.stubGlobal("cancelAnimationFrame", () => {});
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(private callback: IntersectionObserverCallback) {}
        observe(target: Element) {
          this.callback(
            [{ isIntersecting: true, target } as IntersectionObserverEntry],
            this as never,
          );
        }
        disconnect() {}
      },
    );

    const { container } = render(<FooterAsciiBrand />);

    await waitFor(() => {
      expect(container.querySelector("[data-wordmark-fallback]")).toHaveStyle({
        opacity: "0",
      });
      expect(container.querySelector("canvas")).toHaveStyle({ opacity: "1" });
    });
  });
});
