import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InterestCard, type InterestItem } from "./InterestCard";

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

const interest: InterestItem = {
  category: "Education",
  emoji: "🎓",
  items: ["University of Lagos", "Google UX Design (Coursera)"],
  imageSrc: "/images/interests/education.jpg",
  alt: "Shelves of books in a warmly lit library",
};

describe("InterestCard", () => {
  it("toggles the heart without opening the popover", () => {
    render(<InterestCard interest={interest} />);

    const heart = screen.getByRole("button", { name: /Like this interest/ });
    const card = screen.getByRole("button", { name: /Education:/ });

    expect(heart).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(heart);
    expect(heart).toHaveAttribute("aria-pressed", "true");
    expect(card).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(heart);
    expect(heart).toHaveAttribute("aria-pressed", "false");
  });

  it("keeps the popover toggle independent from the heart", () => {
    render(<InterestCard interest={interest} />);

    const heart = screen.getByRole("button", { name: /Like this interest/ });
    const card = screen.getByRole("button", { name: /Education:/ });

    fireEvent.click(card);
    expect(card).toHaveAttribute("aria-expanded", "true");
    expect(heart).toHaveAttribute("aria-pressed", "false");
  });
});
