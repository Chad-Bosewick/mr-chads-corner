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

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  observe() {}

  disconnect() {}

  unobserve() {}

  takeRecords() {
    return [];
  }

  trigger(entry: Partial<IntersectionObserverEntry>) {
    this.callback(
      [
        {
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 0,
          intersectionRect: {} as DOMRectReadOnly,
          isIntersecting: false,
          rootBounds: null,
          target: document.createElement("div"),
          time: 0,
          ...entry,
        } as IntersectionObserverEntry,
      ],
      this as unknown as IntersectionObserver,
    );
  }

  static reset() {
    MockIntersectionObserver.instances = [];
  }
}

class MockResizeObserver {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback(
      [
        {
          target,
          contentRect: {
            width: 680,
            height: 425,
            x: 0,
            y: 0,
            top: 0,
            left: 0,
            right: 680,
            bottom: 425,
            toJSON() {
              return {};
            },
          } as DOMRectReadOnly,
        } as ResizeObserverEntry,
      ],
      this as unknown as ResizeObserver,
    );
  }

  disconnect() {}

  unobserve() {}
}

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

function stubMatchMedia(matches = false) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation(() => ({
      matches,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

describe("CoverScroll — manual mode (default)", () => {
  beforeEach(() => {
    MockIntersectionObserver.reset();
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal("ResizeObserver", MockResizeObserver);
    stubMatchMedia(false);
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
    MockIntersectionObserver.reset();
    vi.useFakeTimers();
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal("ResizeObserver", MockResizeObserver);
    stubMatchMedia(false);
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((cb: FrameRequestCallback) => window.setTimeout(() => cb(Date.now()), 16)),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn((id: number) => clearTimeout(id)));
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it("does not start auto-scroll until the frame is sufficiently visible", () => {
    const { container } = render(
      <CoverScroll src="/img.png" alt="Preview" sections={sections} autoScroll />,
    );
    simulateImageLoad(container);
    const frame = screen.getByTestId("cover-scroll-frame");
    const inner = frame.firstElementChild as HTMLElement;
    const observer = MockIntersectionObserver.instances[0];

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(inner.style.transform).toBe("");

    act(() => {
      observer.trigger({
        isIntersecting: true,
        intersectionRatio: 0.5,
        target: frame,
      });
      vi.advanceTimersByTime(5000);
    });
    expect(inner.style.transform).toBe("");

    act(() => {
      observer.trigger({
        isIntersecting: true,
        intersectionRatio: 0.8,
        target: frame,
      });
      vi.advanceTimersByTime(1400);
    });
    expect(inner.style.transform).toBe("");

    act(() => {
      vi.advanceTimersByTime(1600);
    });
    expect(inner.style.transform).not.toBe("");
  });

  it("respects reduced motion and never starts auto-scroll", () => {
    vi.unstubAllGlobals();
    MockIntersectionObserver.reset();
    vi.useFakeTimers();
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal("ResizeObserver", MockResizeObserver);
    stubMatchMedia(true);
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((cb: FrameRequestCallback) => window.setTimeout(() => cb(Date.now()), 16)),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn((id: number) => clearTimeout(id)));

    const { container } = render(
      <CoverScroll src="/img.png" alt="Preview" sections={sections} autoScroll />,
    );
    simulateImageLoad(container);
    const frame = screen.getByTestId("cover-scroll-frame");
    const inner = frame.firstElementChild as HTMLElement;
    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(inner.style.transform).toBe("");
  });
});
