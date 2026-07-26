export interface Milestone {
  id: number;
  year: string;
  note: string;
  type: "career" | "life" | "education";
}

export const TIMELINE_MILESTONES: Milestone[] = [
  {
    id: 1,
    year: "H1 2023",
    note: "Finished Biochemistry, then started intentionally moving toward product design.",
    type: "education",
  },
  {
    id: 2,
    year: "H2 2023",
    note: "Later in 2023, completed the Google UX Design Certificate and built my design foundation.",
    type: "education",
  },
  {
    id: 3,
    year: "2024",
    note: "Became an HNG Design Finalist and proved I could grow quickly.",
    type: "career",
  },
  {
    id: 4,
    year: "2025",
    note: "Joined Candidote for my first product design role on a hiring platform.",
    type: "career",
  },
  {
    id: 5,
    year: "2026",
    note: "Started leading design at Enviodeck, shaping logistics tools with product clarity.",
    type: "career",
  },
];

/** Inset from the canvas edge to the first/last marker. The line itself
 *  obeys the page margin; markers sit slightly inside so active dots,
 *  labels, and the standalone tooltip have optical breathing room. */
export const TIMELINE_PADDING = 28;

export function getTimelineMarkerPositions(
  width: number,
  count = TIMELINE_MILESTONES.length,
  padding = TIMELINE_PADDING,
) {
  if (count <= 1) return [width / 2];
  const available = Math.max(0, width - padding * 2);
  const step = available / (count - 1);
  return Array.from({ length: count }, (_, i) => padding + i * step);
}
