import { describe, expect, it } from "vitest";
import {
  computeHeartAlpha,
  computeScrollFactor,
  isInteractiveControl,
} from "./useAsciiShader";

describe("computeScrollFactor", () => {
  it("returns 0 at the top of the page", () => {
    expect(computeScrollFactor(0, 800, 1.15)).toBe(0);
  });

  it("returns 1 at full recession distance", () => {
    expect(computeScrollFactor(800 * 1.15, 800, 1.15)).toBe(1);
  });

  it("clamps past full recession", () => {
    expect(computeScrollFactor(800 * 2, 800, 1.15)).toBe(1);
  });

  it("uses ease-out cubic progression", () => {
    const mid = computeScrollFactor((800 * 1.15) / 2, 800, 1.15);
    expect(mid).toBeGreaterThan(0.5);
    expect(mid).toBeLessThan(1);
  });
});

describe("computeHeartAlpha", () => {
  it("is 1 while the hero bottom is at the viewport bottom", () => {
    expect(computeHeartAlpha(800, 800)).toBe(1);
  });

  it("is 0 once the hero bottom clears the viewport top", () => {
    expect(computeHeartAlpha(0, 800)).toBe(0);
    expect(computeHeartAlpha(-120, 800)).toBe(0);
  });

  it("scales linearly between", () => {
    expect(computeHeartAlpha(400, 800)).toBe(0.5);
  });
});

describe("isInteractiveControl", () => {
  const make = (html: string) => {
    const el = document.createElement("div");
    el.innerHTML = html;
    return el.firstElementChild as Element;
  };

  it("rejects null and plain elements", () => {
    expect(isInteractiveControl(null)).toBe(false);
    expect(isInteractiveControl(document.createElement("div"))).toBe(false);
  });

  it("matches interactive controls", () => {
    expect(isInteractiveControl(make("<a>link</a>"))).toBe(true);
    expect(isInteractiveControl(make("<button>b</button>"))).toBe(true);
    expect(isInteractiveControl(make("<input />"))).toBe(true);
    expect(isInteractiveControl(make("<textarea />"))).toBe(true);
    expect(isInteractiveControl(make("<select />"))).toBe(true);
    expect(isInteractiveControl(make('<div role="button">x</div>'))).toBe(true);
    expect(isInteractiveControl(make('<div contenteditable="true">x</div>'))).toBe(true);
  });
});
