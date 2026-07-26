# CODEX IMPLEMENTATION TASK

## Task ID

UI-CLEANUP-001

## Title

Remove border radius from the Travecs landing page screenshot inside the homepage CoverScroll card

## Objective

Remove the rounded corner appearance from the Travecs landing page screenshot image as it appears inside the CoverScroll frame on the homepage project card. The screenshot itself should render with sharp, rectangular corners. The CoverScroll frame container keeps its current `rounded-xl` styling.

## Product context

The homepage project card uses a CoverScroll component to auto-scroll through the Travecs landing page screenshot. The image currently inherits the rounded corner appearance from the parent frame. For the editorial, clean aesthetic we are targeting, the landing page screenshot should present as a crisp rectangular image — sharp corners, no visual softening on the image itself.

This is part of the Perfect UI cleanup phase. The Travecs case study is at ~95% completion. We are polishing details, not rebuilding features.

## User story

As a portfolio visitor viewing the homepage, I see the Travecs project card with a CoverScroll preview of the landing page. The screenshot image should appear as a clean, sharp rectangle inside the rounded frame — not as a rounded image.

## Scope

- Remove the inherited or applied border radius from the `<Image>` element inside the CoverScroll component specifically when it renders in auto-scroll mode on the homepage card.
- Ensure the CoverScroll frame container (`rounded-xl`) is not modified.
- Ensure this does not affect the manual-mode CoverScroll on the Travecs case study page unless the same visual issue exists there.

## Out of scope

- Modifying the CoverScroll frame container's `rounded-xl` styling.
- Modifying the CarouselImage component or any other carousel behavior.
- Changing auto-scroll timing, easing, sections, or interaction logic.
- Any other homepage or case-study visual changes.

## Dependencies

- CoverScroll component: `src/components/case-study/CoverScroll.tsx`
- Homepage project row: `src/components/sections/ProjectRow.tsx`

## Design source

- Owner observation during visual review.
- No Figma frame required for this change — it is a direct cleanup.

## Technical context

- Framework: Next.js, React, TypeScript, Tailwind CSS
- The CoverScroll frame container at line 216 of `CoverScroll.tsx` has classes including `rounded-xl` which creates the rounded appearance.
- The image is rendered as a Next.js `<Image>` with `className="pointer-events-none block h-auto w-full max-w-none select-none"` — no explicit `rounded-none` override.
- The frame has `overflow: hidden` via the container, so the image corners are clipped by the parent's border radius.
- The `rounded-xl` on the frame is visually correct and must stay. The fix is to ensure the image itself does not present rounded corners — likely by adding `rounded-none` to the Image className to override any inherited radius.

## Functional requirements

1. The Travecs landing page screenshot inside the homepage CoverScroll card renders with sharp, rectangular corners.
2. The CoverScroll frame container retains its `rounded-xl` styling.
3. The auto-scroll behavior is unaffected.
4. The manual-mode CoverScroll on the case study page is unaffected (unless the same issue is observed there).

## Visual requirements

1. Screenshot image: zero border radius — crisp rectangular corners.
2. CoverScroll frame: unchanged — `rounded-xl` remains.
3. No visual artifacts at the image edges (e.g., no exposed background color between image edge and frame corner).

## Interaction requirements

None. This is a visual-only change.

## Responsive requirements

The change should be verified at desktop (1440px, 1280px) and mobile (390px) widths. The image should appear sharp-cornered at all breakpoints.

## Accessibility requirements

No accessibility impact expected. This is a purely visual change.

## Performance requirements

No performance impact expected.

## Likely files affected

- `src/components/case-study/CoverScroll.tsx` — add `rounded-none` to the Image className (approximately line 248).

## Acceptance criteria

- [ ] The Travecs landing page screenshot in the homepage CoverScroll card has sharp, rectangular corners (no border radius).
- [ ] The CoverScroll frame container retains `rounded-xl`.
- [ ] No visual artifacts at the image-to-frame boundary.
- [ ] Auto-scroll behavior is unchanged.
- [ ] Manual-mode CoverScroll on the case study page is unaffected.
- [ ] Responsive behavior verified at 1440px, 1280px, and 390px.
- [ ] TypeScript passes: `npx tsc --noEmit`.
- [ ] Tests pass: `npx vitest run`.
- [ ] Production build passes: `npx next build`.

## Required tests

- Existing CoverScroll tests must continue to pass.
- Optionally: add a test asserting the Image element in auto-scroll mode has `rounded-none` in its className.

## Required output

Return:

1. Implementation summary
2. Files changed
3. Before/after comparison (description or screenshot)
4. Any deviations or assumptions
5. Tests performed
6. Known limitations
