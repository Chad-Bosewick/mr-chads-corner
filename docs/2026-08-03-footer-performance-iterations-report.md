# Footer Performance Iterations Report

**Date:** 2026-08-03  
**Owner:** Codex  
**Status:** Implemented locally and committed; not yet deployed to Netlify.

## Trigger

The live site exhibited delayed hover feedback, severe footer scroll jank, and browser “wait/close page” prompts on some desktop devices. The requested goal was to retain the footer’s authored character while removing the sustained rendering work causing the lag.

## Diagnosis

The issue was client-side main-thread rendering, not slow page delivery or an intentionally slow navigation transition.

- Navigation hover transitions are authored at 150ms. Delayed hover feedback therefore indicated that the browser was too busy to process interaction promptly.
- `FooterAscii.tsx` maintained a full-footer canvas grid at 6px spacing, updated and redrawn at 15fps. On a typical desktop footer this meant roughly 28,000 text-particle draws per frame (more than 400,000 per second), including while the footer was offscreen.
- `useAsciiShader.ts` also maintained a root-level, fixed canvas that ran on every route and throughout page scrolling.
- The footer wordmark morph used up to 720 independently animated SVG circles. This was much lighter than the footer canvas, but still unnecessary work for a textual change.

The original live deployment remains unaffected until the commits below are deployed.

## Iteration 1 — Replace the footer canvas

**Commit:** `2dd6a50` — `fix: replace expensive footer canvas with static texture`

### Change

- Removed `src/components/effects/FooterAscii.tsx`.
- Replaced the animated canvas in `Footer.tsx` with a static CSS radial-dot texture.
- Retained the footer content and existing wordmark component.

### Reason

The canvas was the dominant footer cost: it simulated and painted a dense particle field continuously, regardless of visibility. A CSS background texture preserves the quiet woven atmosphere while requiring no JavaScript animation loop, no per-particle calculations, and no canvas text painting.

## Iteration 2 — Scope the hero field and simplify the wordmark

**Commit:** `e2a1bf7` — `fix: scope ascii animation and simplify footer wordmark`

### Global ASCII field

- The fixed ASCII canvas remains available behind the hero.
- `AsciiShader` now passes the current route into `useAsciiShader`.
- `useAsciiShader` observes `[data-hero-band]` and starts the animation only while that hero is in view.
- When the hero leaves the viewport, it cancels its animation frame and removes its pointer and scroll listeners.

### Reason

This preserves the hero’s interactive background effect while preventing it from consuming main-thread time during long-page reading and at the footer. Route-aware setup ensures the canvas is recalculated after navigation.

### Footer wordmark

- Replaced the 720-circle particle morph with a 13-segment SVG wordmark transition.
- The two names, “Temi Adekunle” and “Chad Bosewick,” transition in a left-to-right sequence using 26 SVG rectangles total.
- Each segment uses a short 280ms `opacity` and `transform` transition; the next name is selected every 2.2 seconds only while the footer is visible and the global animation control is not paused.
- The reduced-motion fallback remains a static “Temi Adekunle” dotted wordmark.

### Reason

The requested sequential text change is retained without per-particle physics, continuous animation, or a large SVG animation set. The resulting “segment dissolve” is a lightweight CSS-transition-based text swap that remains visually related to the dot-matrix wordmark.

## Iteration 3 — Concentrate the texture behind the wordmark

**Commit:** `cd17aeb` — `style: fade footer texture into wordmark`

### Change

- Added a static top-to-bottom linear-gradient layer above the CSS dot texture.
- The footer base color fully masks dots at the top, retains approximately 97% masking through 42% of the footer, then fades to transparent at the bottom.
- Increased the texture layer opacity from `0.2` to `0.38` so the revealed lower field remains legible behind the wordmark.

### Reason

The texture should support the footer’s finale rather than compete with the quote, navigation, and availability content. The gradient keeps the upper footer visually calm and lets the texture emerge where the wordmark sits.

## Files changed

- `src/components/layout/Footer.tsx`
- `src/components/effects/FooterAscii.tsx` — removed
- `src/styles/globals.css`
- `src/components/effects/AsciiShader.tsx`
- `src/hooks/useAsciiShader.ts`
- `src/components/layout/FooterAsciiBrand.tsx`
- `src/components/layout/FooterAsciiBrand.test.tsx`

## Validation evidence

Completed after the changes:

- `npm run typecheck` — passed.
- `npm run lint` — passed with no warnings or errors.
- `npm run build` — compiled successfully and completed type/lint validation.
- Focused tests: `FooterAsciiBrand` and `useAsciiShader` — 12/12 passed.
- `git diff --check` — passed before each commit.

## Deployment and QA follow-up

1. Deploy commits `2dd6a50`, `e2a1bf7`, and `cd17aeb` to the Netlify production branch before judging the live-site result.
2. Perform independent browser QA at 375px, 768px, and 1440px.
3. Verify that the hero ASCII interaction starts on entry, stops after leaving the hero, and restarts correctly after navigation.
4. Verify the footer wordmark sequence, global pause control, and `prefers-reduced-motion` fallback.
5. Capture a Chrome Performance trace on the affected laptop to verify that footer scrolling has no long tasks from canvas text rendering.

## Scope boundary

No dependency changes, broad refactors, or deployment actions were performed. Pre-existing working-tree changes (`tsconfig.tsbuildinfo` and untracked local files) were preserved and excluded from the commits.
