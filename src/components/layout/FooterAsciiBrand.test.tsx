import React from "react";
import { render, screen } from "@testing-library/react";
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
});
