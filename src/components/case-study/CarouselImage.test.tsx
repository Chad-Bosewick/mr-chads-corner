import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CarouselImage } from "./CarouselImage";

const motionPreference = vi.hoisted(() => ({ reduced: false }));

vi.mock("next/image", () => ({
  default: ({ fill: _fill, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={alt ?? ""} />
  ),
}));

vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => motionPreference.reduced,
}));

const slides = [
  {
    src: "/one.png",
    alt: "First full-height screen",
    width: 1360,
    height: 1100,
    scroll: true,
  },
  {
    src: "/two.png",
    alt: "Second full-height screen",
    width: 1360,
    height: 1200,
    scroll: true,
  },
  {
    src: "/three.png",
    alt: "Static screen",
    width: 1360,
    height: 850,
  },
];

describe("CarouselImage", () => {
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
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("uses native overflow only for full-height slides", () => {
    render(<CarouselImage slides={slides} heading="Workflow" />);

    expect(screen.getByLabelText(/Slide 1 of 3/)).toHaveClass("overflow-y-auto");
    expect(screen.getByLabelText(/Slide 2 of 3/)).toHaveClass("overflow-y-auto");
    expect(screen.getByLabelText(/Slide 3 of 3/)).toHaveClass("overflow-hidden");
  });

  it("resets each slide to the top whenever it becomes active", () => {
    vi.useFakeTimers();
    render(<CarouselImage slides={slides} heading="Workflow" />);

    const first = screen.getByLabelText(/Slide 1 of 3/) as HTMLDivElement;
    const second = screen.getByLabelText(/Slide 2 of 3/) as HTMLDivElement;

    first.scrollTop = 120;
    fireEvent.click(screen.getByLabelText("Next slide"));
    second.scrollTop = 180;

    act(() => vi.advanceTimersByTime(600));

    fireEvent.click(screen.getByLabelText("Previous slide"));
    expect(first.scrollTop).toBe(0);

    act(() => vi.advanceTimersByTime(600));

    fireEvent.click(screen.getByLabelText("Next slide"));
    expect(second.scrollTop).toBe(0);
  });

  it("uses direction-aware positions and ignores navigation during transitions", () => {
    vi.useFakeTimers();
    render(<CarouselImage slides={slides} heading="Workflow" />);

    fireEvent.click(screen.getByLabelText("Next slide"));
    fireEvent.click(screen.getByLabelText("Next slide"));

    expect(screen.getByText("2 / 3")).toBeInTheDocument();
    expect(screen.getByLabelText(/Slide 1 of 3/)).toHaveClass(
      "-translate-x-full",
    );
    expect(screen.getByLabelText(/Slide 2 of 3/)).toHaveClass("translate-x-0");

    act(() => vi.advanceTimersByTime(600));
    fireEvent.click(screen.getByLabelText("Previous slide"));

    expect(screen.getByLabelText(/Slide 1 of 3/)).toHaveClass("translate-x-0");
    expect(screen.getByLabelText(/Slide 2 of 3/)).toHaveClass(
      "translate-x-full",
    );
  });

  it("swaps instantly without an interaction lock for reduced motion", () => {
    motionPreference.reduced = true;
    render(<CarouselImage slides={slides} heading="Workflow" />);

    fireEvent.click(screen.getByLabelText("Next slide"));
    fireEvent.click(screen.getByLabelText("Next slide"));

    expect(screen.getByText("3 / 3")).toBeInTheDocument();
    expect(screen.getByLabelText(/Slide 3 of 3/)).toHaveClass("duration-0");
  });

  it("keeps horizontal arrow keys assigned to slide navigation", () => {
    render(<CarouselImage slides={slides} heading="Workflow" />);

    fireEvent.keyDown(screen.getByLabelText(/Slide 1 of 3/), {
      key: "ArrowRight",
    });

    expect(screen.getByText("2 / 3")).toBeInTheDocument();
    expect(screen.getByLabelText(/Slide 2 of 3/)).toHaveAttribute("tabindex", "0");
  });

  it("slides a single active pill to the current dot", () => {
    vi.useFakeTimers();
    const { container } = render(<CarouselImage slides={slides} heading="Workflow" />);
    const pill = container.querySelector(".carousel-pill") as HTMLElement;
    expect(pill).not.toBeNull();
    expect(pill.style.transform).toContain("translateX(2px)");

    fireEvent.click(screen.getByLabelText("Next slide"));
    expect(pill.style.transform).toContain("translateX(34px)");

    // The carousel intentionally ignores navigation during its 600ms slide
    // transition (see the existing "ignores navigation during transitions"
    // test) — advance the lock timer before the second click; do NOT remove
    // the interaction lock.
    act(() => vi.advanceTimersByTime(600));
    fireEvent.click(screen.getByLabelText("Next slide"));
    expect(pill.style.transform).toContain("translateX(66px)");
  });

  it("renders the pill without sliding under reduced motion", () => {
    motionPreference.reduced = true;
    const { container } = render(<CarouselImage slides={slides} heading="Workflow" />);
    const pill = container.querySelector(".carousel-pill") as HTMLElement;
    expect(pill).toHaveClass("transition-none");
    expect(pill.style.transform).toContain("translateX(2px)");
  });
});
