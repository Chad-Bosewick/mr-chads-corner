import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CaseStudyNav } from "./CaseStudyNav";

const items = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "results", label: "Results" },
];

function intersectionEntry(id: string, top: number): IntersectionObserverEntry {
  return {
    isIntersecting: true,
    target: { id } as Element,
    boundingClientRect: { top } as DOMRectReadOnly,
  } as IntersectionObserverEntry;
}

describe("CaseStudyNav", () => {
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn((callback: IntersectionObserverCallback) => {
        observerCallback = callback;
        return {
          observe: vi.fn(),
          disconnect: vi.fn(),
          unobserve: vi.fn(),
          root: null,
          rootMargin: "0px",
          thresholds: [],
          takeRecords: () => [],
        };
      }),
    );
  });

  it("uses stable dash markers and keeps every desktop target at least 40px tall", () => {
    const { container } = render(<CaseStudyNav items={items} />);

    const overview = screen.getByRole("link", { name: "Overview" });
    expect(overview).toHaveAttribute("aria-current", "location");
    expect(overview).toHaveClass("min-h-10", "font-medium");
    expect(overview.querySelector("span")).toHaveClass("bg-[#A43718]");
    expect(container.querySelector(".transition-all")).not.toBeInTheDocument();
  });

  it("activates the visible section closest to the reading line", () => {
    render(<CaseStudyNav items={items} />);

    act(() => {
      observerCallback(
        [intersectionEntry("problem", 80), intersectionEntry("results", 24)],
        {} as IntersectionObserver,
      );
    });

    expect(screen.getByRole("link", { name: "Results" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(screen.getByRole("link", { name: "Problem" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("preserves native hash links and provides an explicit return destination", () => {
    render(<CaseStudyNav items={items} />);

    expect(screen.getByRole("link", { name: "Problem" })).toHaveAttribute(
      "href",
      "#problem",
    );
    expect(screen.getByRole("link", { name: "All case studies" })).toHaveAttribute(
      "href",
      "/featured-case-studies",
    );
  });

  it("renders a compact 44px mobile navigator instead of the vertical sidebar", () => {
    render(<CaseStudyNav items={items} variant="mobile" />);

    expect(
      screen.getByRole("link", { name: "Back to all case studies" }),
    ).toHaveClass("size-11");
    expect(screen.getByRole("link", { name: "Overview" })).toHaveClass("h-11");
    expect(screen.getByRole("navigation")).toHaveClass("flex", "items-stretch");
  });
});
