import { describe, expect, it } from "vitest";
import { buttonVariants } from "./buttonVariants";

describe("buttonVariants", () => {
  it("keeps hierarchy in fill while sharing timing and keyboard focus treatment", () => {
    expect(buttonVariants.primary).toContain("rounded-full");
    expect(buttonVariants.secondary).toContain("rounded-full");
    expect(buttonVariants.tertiary).not.toContain("rounded-full");

    for (const variant of Object.values(buttonVariants)) {
      expect(variant).toContain("duration-[var(--duration-fast)]");
      expect(variant).toContain("focus-visible:outline-2");
      expect(variant).toContain("focus-visible:outline-offset-2");
      expect(variant).toContain("focus-visible:outline-[#A43718]");
    }
  });
});
