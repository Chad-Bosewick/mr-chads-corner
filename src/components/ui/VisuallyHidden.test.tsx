import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { VisuallyHidden } from "./VisuallyHidden";

describe("VisuallyHidden", () => {
  it("renders children", () => {
    const { getByText } = render(
      <VisuallyHidden>Screen reader only text</VisuallyHidden>
    );
    expect(getByText("Screen reader only text")).toBeInTheDocument();
  });

  it("applies visually hidden styles", () => {
    const { container } = render(<VisuallyHidden>Hidden</VisuallyHidden>);
    const span = container.firstChild as HTMLElement;
    expect(span.style.position).toBe("absolute");
    expect(span.style.width).toBe("1px");
    expect(span.style.height).toBe("1px");
    expect(span.style.overflow).toBe("hidden");
  });

  it("renders as div when as prop is div", () => {
    const { container } = render(
      <VisuallyHidden as="div">Hidden</VisuallyHidden>
    );
    expect(container.firstChild?.nodeName).toBe("DIV");
  });
});
