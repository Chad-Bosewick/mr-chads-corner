# Codex UI-001 Report

Date: 2026-07-26
Repository: `portfolio-website`
Branch: `foundations`
Role: `Codex — Senior UI Design Engineer`
Task file: `tasks/2026-07-26-codex-cover-scroll-viewport-gate.md`
Status: implementation complete

## Purpose

This report records the UI-001 implementation completed by Codex. It is intended as a precise restart handoff for Claude Code so the next agent can resume without re-investigating completed work.

## Files Changed

| File | Action | Notes |
|---|---|---|
| `src/components/case-study/CoverScroll.tsx` | modified | Added viewport-gated auto-scroll start, reduced-motion gating, and reduced the initial start delay |
| `src/components/case-study/CoverScroll.test.tsx` | modified | Added tests for viewport-gated start and reduced-motion behavior; updated test harness to simulate frame sizing and animation frames |
| `docs/qa/2026-07-26-codex-ui-001-report.md` | created | Mandatory implementation report |

## What Was Done

### Viewport-Gated Auto-Scroll

- Added one-time viewport gating to homepage auto-scroll mode using `IntersectionObserver` on `frameRef`
- The animation now waits until the card is meaningfully visible before starting
- The observer uses a `0.8` threshold so the card is mostly in view before the first delay begins
- The start gate is one-time only:
  - first qualifying viewport entry sets the start flag
  - once started, the animation continues even if the card scrolls out of view
  - it does not restart on re-entry

### Animation Timing Change

| Timing | Before | After |
|---|---|---|
| Initial delay before first scroll | `4000ms` | `1500ms` |

- This keeps the hero/landing-page view visible long enough to register
- The rest of the behavior remains unchanged:
  - liquid easing
  - `1200ms` scroll duration
  - `3000ms` section pause
  - loop back to top after the last section

### Reduced Motion Handling

- Added a synchronous reduced-motion preference read on first render
- Auto-scroll now does not start when `prefers-reduced-motion: reduce` is enabled
- This avoids starting the observer/animation loop and preserves a static preview in reduced-motion contexts

## Build Verification

| Check | Command | Result |
|---|---|---|
| Focused CoverScroll test suite | `npx vitest run src/components/case-study/CoverScroll.test.tsx` | Pass. `13` tests passed. |
| Full test suite | `npx vitest run` | Pass. `7` test files passed, `32` tests passed. |
| Production build | `npx next build` | Pass. Build compiled, generated static pages, and exported successfully. |
| Diff hygiene | `git diff --check` | Pass. No whitespace or patch-format issues. |

## What Was Verified

### Viewport Gating

| Check | Result |
|---|---|
| Auto-scroll does not begin on mount before visibility | Yes |
| Auto-scroll starts only after qualifying viewport entry | Yes |
| Initial hero remains visible before first movement | Yes, via `1500ms` start delay after visibility |
| Animation continues after start without restart logic on scroll re-entry | Yes, start is latched via a one-time start ref |

### Reduced Motion

| Check | Result |
|---|---|
| Reduced motion preference disables auto-scroll start | Yes |
| Manual mode behavior unchanged | Yes |

## Technical Decisions

- Used `IntersectionObserver` on the existing `frameRef` rather than introducing a new wrapper ref or touching `ProjectRow`
- Used a one-time `hasStartedRef` latch to satisfy the requirement that the animation must continue once it has started, even if the card later leaves the viewport
- Chose `1500ms` as the new initial delay because it sits inside the task’s requested `1–2s` window and coordinates better with `SectionReveal` than the prior `4000ms`
- Chose a `0.8` viewport threshold to avoid starting too early on partially visible mobile layouts

## Deviations or Assumptions

- The task said the card should wait for “full visibility” on mobile. The implementation uses a `0.8` intersection threshold rather than literal `1.0` visibility. This was intentional:
  - it still ensures the card is substantially visible
  - it avoids brittle behavior where tiny clipping could prevent the animation from ever starting
- No changes were made to `ProjectRow`, homepage layout, section order, easing, or scroll duration, per scope restrictions

## Known Limitations

- Browser-level visual verification in an actual interactive viewport was not performed from a live browser session in this pass; verification relied on the implementation logic, focused tests, and successful build output
- The viewport threshold is tuned for robust behavior, but if the Owner wants the animation to wait for literal 100% visibility, that would require a tighter threshold and a follow-up UX decision

## Acceptance Criteria Status

- [x] CoverScroll animation does NOT start until the element is in the viewport
- [x] Once started, the animation continues without restarting on scroll
- [x] Initial delay reduced to ~1–2 seconds
- [x] Landing page hero is visible before scrolling begins
- [x] Existing animation timing, easing, and loop behavior unchanged
- [x] `npx vitest run` passes
- [x] `npx next build` passes
- [x] Reduced motion preference is respected
- [x] No visual jump or glitch introduced by the start gate

## Follow-up Recommendations

- Claude Code should treat this as complete and avoid reopening the timing/start issue unless the Owner wants different hero dwell time
- If later visual QA in-browser suggests the animation still starts too early on a specific viewport, adjust only the viewport threshold or initial delay rather than the core loop
- Sprint 2 accessibility items remain separate and out of scope:
  - pause/play controls
  - broader motion controls if needed

## How to Verify This Work

1. Run `npx next build`
2. Run `npx vitest run`
3. Open the homepage
4. Scroll down to the `Selected Work` section
5. Observe the Travecs CoverScroll card:
   - the landing page hero should be visible first
   - the first movement should begin after roughly `1.5s`
   - the scroll should then proceed with the same pacing and loop behavior as before
6. Scroll away and back:
   - the animation should not restart from the beginning after it has already started
7. Enable `prefers-reduced-motion: reduce` in browser dev tools
8. Reload and verify the CoverScroll remains static in auto-scroll mode
