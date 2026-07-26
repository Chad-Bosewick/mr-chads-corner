import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CoverScroll } from "./CoverScroll";

vi.mock("next/image", () => ({
  default: ({
    alt,
    priority: _priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={alt ?? ""} />
  ),
}));

const sections = [
  { label: "Meet Travecs", start: 0 },
  { label: "Talent experience", start: 0.31 },
  { label: "Employer experience", start: 0.49 },
  { label: "FAQ", start: 0.78 },
  { label: "CTA", start: 0.9 },
  { label: "Footer", start: 0.97 },
];

/** Simulate image load so the component calculates imageHeight. */
function simulateImageLoad(container: HTMLElement) {
  const img = container.querySelector("img") as HTMLImageElement;
  Object.defineProperty(img, "naturalWidth", { value: 1200, configurable: true });
  Object.defineProperty(img, "naturalHeight", { value: 3600, configurable: true });
  Object.defineProperty(img.parentElement as HTMLElement, "clientWidth", {
    value: 680,
    configurable: true,
  });
  fireEvent.load(img);
}

describe("CoverScroll — manual mode (default)", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
    vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the frame with scroll-to-explore label", () => {
    render(<CoverScroll src="/img.png" alt="Preview" sections={sections} />);
    const frame = screen.getByTestId("cover-scroll-frame");
    expect(frame).toHaveAttribute("aria-label", "Preview preview — scroll to explore");
  });

  it("frame is scrollable with overflow-y-auto", () => {
    render(<CoverScroll src="/img.png" alt="Preview" sections={sections} />);
    const frame = screen.getByTestId("cover-scroll-frame");
    expect(frame.className).toContain("overflow-y-auto");
    expect(frame.className).toContain("cover-scroll-frame");
  });

  it("does not have will-change on inner div (no JS animation)", () => {
    render(<CoverScroll src="/img.png" alt="Preview" sections={sections} />);
    const frame = screen.getByTestId("cover-scroll-frame");
    const inner = frame.querySelector("[style*='will-change']");
    expect(inner).toBeNull();
  });

  it("hides horizontal overflow", () => {
    render(<CoverScroll src="/img.png" alt="Preview" sections={sections} />);
    const frame = screen.getByTestId("cover-scroll-frame");
    expect(frame.className).toContain("overflow-x-hidden");
  });

  it("injects scrollbar styles via style tag", () => {
    const { container } = render(
      <CoverScroll src="/img.png" alt="Preview" sections={sections} />,
    );
    const styleEl = container.querySelector("style");
    expect(styleEl?.textContent).toContain("cover-scroll-frame");
    expect(styleEl?.textContent).toContain("scrollbar-width: thin");
  });
});

describe("CoverScroll — auto-scroll mode", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
    vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders with auto-scroll aria-label (no scroll hint)", () => {
    const { container } = render(
      <CoverScroll src="/img.png" alt="Preview" sections={sections} autoScroll />,
    );
    const frame = screen.getByTestId("cover-scroll-frame");
    expect(frame).toHaveAttribute("aria-label", "Preview preview");
    simulateImageLoad(container);
  });

  it("frame is NOT scrollable in auto-scroll mode", () => {
    const { container } = render(
      <CoverScroll src="/img.png" alt="Preview" sections={sections} autoScroll />,
    );
    const frame = screen.getByTestId("cover-scroll-frame");
    expect(frame.className).not.toContain("overflow-y-auto");
    expect(frame.className).not.toContain("cover-scroll-frame");
    simulateImageLoad(container);
  });

  it("inner div gets will-change: transform in auto-scroll mode", () => {
    const { container } = render(
      <CoverScroll src="/img.png" alt="Preview" sections={sections} autoScroll />,
    );
    simulateImageLoad(container);
    const frame = screen.getByTestId("cover-scroll-frame");
    const inner = frame.querySelector("[style*='will-change']");
    expect(inner).toBeTruthy();
  });

  it("has 16:10 aspect ratio on the frame", () => {
    const { container } = render(
      <CoverScroll src="/img.png" alt="Preview" sections={sections} autoScroll />,
    );
    simulateImageLoad(container);
    const frame = screen.getByTestId("cover-scroll-frame");
    expect(frame.style.aspectRatio).toBe("16 / 10");
  });

  it("renders the image with the correct src", () => {
    const { container } = render(
      <CoverScroll src="/landing.png" alt="Landing" sections={sections} autoScroll />,
    );
    simulateImageLoad(container);
    const img = screen.getByRole("img", { name: "Landing" });
    expect(img).toHaveAttribute("src", "/landing.png");
  });

  it("does not inject scrollbar styles in auto-scroll mode", () => {
    const { container } = render(
      <CoverScroll src="/img.png" alt="Preview" sections={sections} autoScroll />,
    );
    simulateImageLoad(container);
    const styleEl = container.querySelector("style");
    expect(styleEl).toBeNull();
  });
});
