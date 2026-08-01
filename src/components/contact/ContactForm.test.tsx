import { describe, expect, it } from "vitest";
import { buildMailtoUrl } from "./ContactForm";

describe("buildMailtoUrl", () => {
  it("composes a name — role subject and a message body", () => {
    const url = buildMailtoUrl("Temi", "Designer", "Hello there");
    expect(url.startsWith("mailto:Addtemi270@gmail.com?")).toBe(true);
    const params = new URLSearchParams(url.split("?")[1]);
    expect(params.get("subject")).toBe("Temi — Designer");
    expect(params.get("body")).toBe("Hello there");
  });

  it("omits the role from the subject when empty", () => {
    const url = buildMailtoUrl("Temi", "", "Hi");
    const params = new URLSearchParams(url.split("?")[1]);
    expect(params.get("subject")).toBe("Temi");
  });

  it("preserves line breaks in the body", () => {
    const url = buildMailtoUrl("Temi", "Founder", "Line one\nLine two");
    const params = new URLSearchParams(url.split("?")[1]);
    expect(params.get("body")).toBe("Line one\nLine two");
  });

  it("trims the name before composing", () => {
    const url = buildMailtoUrl("  Temi  ", "Founder", "Hi");
    const params = new URLSearchParams(url.split("?")[1]);
    expect(params.get("subject")).toBe("Temi — Founder");
  });
});
