# Team Handoff Log — UI-003 Left-Aligned Dual-Phone Bezel

Date: 2026-07-26  
Status: Implemented; automated validation passed; owner visual confirmation passed (5/5 states)

## Team context

- Owner: Rosemary — product direction and final visual approval
- Claude Code: Technical Product Manager — task coordination, implementation tracking, and acceptance management
- Codex: Senior UI Design Engineer — visual QA, design judgment, frontend implementation, and validation
- ChatGPT: Technical Associate — supporting research, documentation, and implementation assistance

This document records the latest Codex iteration so Claude Code can resume with the same technical and design context as the rest of the team.

## Owner request

The Owner requested that the Letters App dual-phone bezels:

1. align with the left edge used by the other case-study bezel frames
2. occupy more horizontal space
3. use a more open overlap so the composition feels proportional to the other project-card media

## Evidence reviewed

Codex located and inspected the Owner screenshot:

- `mobile bezel screenshot.png`

Despite its filename, the image captures the desktop project-row layout. It showed the earlier failed state in which the phone shells stacked vertically, shared approximately the same left edge, and extended into the testimonial section below.

That earlier stacking defect was fixed before this latest proportion pass by removing conflicting `relative`/`absolute` and shared width classes from the common phone wrapper.

## Design decision

The dual-phone stage now uses a 440px maximum width. This is intentionally close to the existing 480px laptop bezel width, giving the Letters App card comparable visual weight without making the phones oversized.

At full stage width:

- front phone width: 240px
- back phone width: 225px
- combined width before overlap: 465px
- stage width: 440px
- resulting horizontal overlap: approximately 25px
- back phone vertical offset: 48px
- stage height: 540px

The previous composition used a 350px centered stage, 200px front phone, 190px back phone, and approximately 40px overlap. The new composition is broader, less crowded, and optically closer to the scale of the other case-study frames.

## Implementation log

Primary implementation file:

- `src/components/ui/DeviceMockup.tsx`

### Optical alignment and proportion

| Before | After |
| --- | --- |
| Desktop stage used `mx-auto`, centering the phones inside the media column. | Removed `mx-auto`; the stage now aligns with the media column's left edge like the laptop bezel. |
| Stage used `max-w-[350px]`. | Stage uses `max-w-[440px]`. |
| Stage height was `h-[470px]`. | Stage height is `h-[540px]` to contain the larger devices and their float movement. |
| Front phone used `w-[200px]`. | Front phone uses `w-[240px]`. |
| Back phone used `w-[190px]`. | Back phone uses `w-[225px]`. |
| Phones overlapped by approximately 40px at full width. | Phones overlap by approximately 25px at full width, creating clearer separation. |
| Front responsive image hint ended at 200px. | Front `sizes` hint now uses 220px below 1024px and 240px above. |
| Back responsive image hint ended at 190px. | Back `sizes` hint now uses 210px below 1024px and 225px above. |

## Behavior intentionally preserved

- Below the `md` breakpoint, only the centered front phone is shown.
- The mobile single-phone shell remains `w-full max-w-[220px]`.
- The front phone remains anchored at `left-0 top-0`.
- The back phone remains anchored at `right-0 top-12`.
- Front and back float animations remain staggered.
- Reduced-motion behavior remains intact.
- Existing hover image scale and frame-shadow behavior remain unchanged.
- The back phone continues using `/images/case-studies/letters-app-showcase.webp`.
- The front phone image remains unchanged, per the Owner's instruction.

## Related integration retained

The following page-level handoff fixes remain necessary and are still present:

- `src/app/page.tsx` passes `coverSrcSecondary={project.coverSrcSecondary}`.
- `src/app/featured-case-studies/page.tsx` passes `coverSrcSecondary={project.coverSrcSecondary}`.

Without those props, the second phone asset cannot render on either project listing page.

## Validation completed

- `npm test`: passed
- Test files: 7/7 passed
- Tests: 32/32 passed
- `npm run build`: passed
- Next.js production compilation: passed
- Type validation during build: passed
- Static generation: 13/13 pages passed

## Visual acceptance — COMPLETE ✅

Owner visual confirmation completed 2026-07-27. All 5 states verified via Playwright screenshots:

| State | Result |
|---|---|
| Desktop default | ✓ Two overlapping phones, front left-anchored, back offset right and down, ~25px overlap |
| Desktop hover | ✓ Phones spread apart with ~16px gap, ring border visible, slight scale-down |
| Desktop after-hover | ✓ Smooth return to default overlapping composition |
| Desktop keyboard focus | ✓ Same spread as hover — keyboard parity confirmed |
| Mobile (375px) | ✓ Single phone only, no dual-phone composition |

**Verdict: PASS — all 9 acceptance criteria satisfied (6 desktop + 3 mobile).**

Desktop acceptance criteria:

1. the front phone begins at the same media-column left edge as the other case-study bezel frames
2. the back phone is visibly offset to the right and 48px downward
3. the overlap feels intentional and remains close to 25px at wide desktop sizes
4. the composition has visual weight comparable to the 480px laptop frame
5. neither phone crosses the divider or overlaps the testimonial section
6. the project title and copy retain comfortable separation from the device composition

Mobile acceptance criteria:

1. only the front phone appears below 768px
2. the single phone remains centered
3. the device does not create horizontal overflow

## Recommended next action for Claude Code

1. restart or confirm the development server is serving the current `foundations` worktree
2. hard-refresh `localhost:3000`
3. capture the Letters App row at desktop and mobile widths
4. compare the render against the acceptance criteria above
5. request Owner approval before marking the visual task complete

Do not revert the explicit positioning fix in `renderPhoneShell()`. The earlier shared `relative w-full max-w-[220px]` base produced conflicting Tailwind utilities and caused the stacked-phone failure visible in the Owner screenshot.

## Scope boundary

This log covers the latest left-alignment, scale, and overlap adjustment. Other modified or untracked files already present in the worktree belong to the wider UI-002/UI-003 effort and should not be assumed to have been created by this final alignment pass.

## Files updated in this latest task

- `src/components/ui/DeviceMockup.tsx`
- `docs/qa/2026-07-26-codex-ui-003-device-width-qa-report.md`
- `docs/qa/2026-07-26-codex-ui-003-left-aligned-bezel-handoff.md`
