# Claude Code Handoff — UI-003 Device Layout Visual QA

Date: 2026-07-26

Prepared by: Codex  
Role: Senior UI Design Engineer  
Audience: Claude Code (Technical Product Manager)

## Corrected verdict

Claude Code's earlier `STATUS: DONE` conclusion was not visually correct.

The Owner-provided screenshot `mobile bezel screenshot.png` shows the actual desktop result:

- both phones share essentially the same left edge
- the phones stack vertically instead of forming a side-by-side editorial overlap
- the front phone extends below the project row
- the device overlaps the divider and testimonial content in the following section

The earlier `md:w-[200px]` and `md:w-[190px]` change fixed a width ambiguity, but it did not fix the rendered positioning conflict.

## Root cause confirmed from screenshot and source

`renderPhoneShell()` previously added these base utilities to every phone wrapper:

- `relative`
- `w-full`
- `max-w-[220px]`

The desktop callers simultaneously added:

- `absolute`
- fixed desktop width and max-width utilities

This repository's `cn()` function only joins class strings; it does not use `tailwind-merge`. The resulting wrapper therefore contained conflicting layout utilities such as `relative absolute`. Tailwind's generated stylesheet order—not the order of class names in the JSX—determined the winner.

In the captured desktop screenshot, `relative` won. Both phones remained in normal document flow, producing the vertical stack and section overflow.

## Implementation

`src/components/ui/DeviceMockup.tsx` now keeps the shared phone shell neutral. Position and dimensions are assigned explicitly by each layout context:

- mobile dual-phone fallback: `relative mx-auto w-full max-w-[220px]`
- normal single phone: `relative w-full max-w-[220px]`
- desktop front phone: `absolute left-0 top-0 z-10 w-[240px]`
- desktop back phone: `absolute right-0 top-12 z-0 w-[225px]`

The desktop stage is now left-aligned, `relative`, `max-w-[440px]`, and `h-[540px]`. With both children unambiguously absolute, they no longer contribute vertical flow height or escape into the following section. At full stage width, the two shells overlap by approximately 25px, giving the composition more breadth and visual weight comparable to the 480px laptop bezel.

## UI review changes

### Layout integrity

| Before | After |
| --- | --- |
| Shared helper emitted `relative`, while desktop callers also emitted `absolute`; the screenshot showed `relative` winning and stacking the phones vertically. | Removed positioning from the shared helper and assigned one explicit position mode to every caller. |
| Shared helper emitted `w-full max-w-[220px]`, while desktop callers supplied competing width constraints. | Removed shared sizing; desktop shells now use exact `w-[240px]` and `w-[225px]` widths. |
| Front phone crossed the project divider and obscured the testimonial below. | Both desktop phones are contained by the fixed-height relative stage through absolute positioning. |
| Earlier QA relied on source-code layout math and declared the composition correct. | QA now incorporates the Owner's actual rendered screenshot, which disproved that conclusion. |
| The 350px device stage was horizontally centered and visually narrower than the other case-study bezel frames. | Stage is left-aligned and widened to 440px; phone widths are 240px and 225px with a lighter 25px overlap. |

### Data integration

| Before | After |
| --- | --- |
| Homepage and featured case studies page did not forward the secondary phone source. | Both routes pass `coverSrcSecondary={project.coverSrcSecondary}` into `ProjectRow`. |

## Validation

- Owner screenshot reviewed: failed state confirmed
- Source conflict identified: `relative` versus `absolute`
- Fix implemented in `src/components/ui/DeviceMockup.tsx`
- Automated tests: 32/32 passing
- Production build: passing (`npm run build`)

## Required follow-up

After restarting or refreshing the local development server, capture a new desktop screenshot of the Letters App row. The acceptance criteria are:

1. front phone is anchored to the left edge of the media column
2. back phone is anchored to the right and offset 48px downward
3. phones overlap horizontally by approximately 25px at the full 440px stage width
4. neither phone crosses the project-row divider
5. testimonial text below remains unobstructed
6. below 768px, only the single centered front phone is displayed

## Files changed in the corrected pass

- `src/components/ui/DeviceMockup.tsx`
- `src/app/page.tsx`
- `src/app/featured-case-studies/page.tsx`
- `docs/qa/2026-07-26-codex-ui-003-device-width-qa-report.md`
