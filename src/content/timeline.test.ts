import { describe, expect, it } from "vitest";
import { TIMELINE_MILESTONES } from "./timeline";

describe("TIMELINE_MILESTONES", () => {
  it("uses consistent, grammatically correct notes", () => {
    const h2 = TIMELINE_MILESTONES.find((m) => m.year === "H2 2023");
    expect(h2?.note).toBe(
      "Completed the Google UX Design Certificate and built my design foundation.",
    );
    const y2024 = TIMELINE_MILESTONES.find((m) => m.year === "2024");
    expect(y2024?.note).toBe(
      "Became an HNG Design Finalist and proved I could grow quickly.",
    );
  });
});
