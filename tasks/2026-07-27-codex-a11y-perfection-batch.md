# CODEX IMPLEMENTATION TASK

## Task ID

A11Y-PERF-001

## Title

Accessibility and animation perfection batch — pause controls, timeline a11y, carousel/CoverScroll fixes

## Objective

Address three outstanding quality issues in a single coordinated batch:

1. **P1-4** — Add visible, keyboard-accessible play/pause controls for all looping animations (WCAG 2.2.2)
2. **P1-5** — Make the career timeline accessible to screen readers
3. **P2-3 + P2-4** — Fix offscreen carousel image preloading and CoverScroll geometry/pause-resume bugs

After implementation, produce a single review handoff document (`tasks/2026-07-27-a11y-perfection-handoff.md`) covering all three changes so ChatGPT or Claude Code can run QA.

## Product context

The portfolio site has three looping canvas/animation elements that run continuously with no visible way to pause them. This violates WCAG 2.2.2 (Pause, Stop, Hide). The career timeline renders entirely on a canvas element that is hidden from assistive tech (`aria-hidden="true"`), making five years of career history invisible to screen-reader users. Additionally, carousel images are force-preloaded even when offscreen, and the CoverScroll component has a fixed 600px frame height that doesn't match its actual rendered size, causing a visible jump when resuming after hover.

## User story

As a visitor using assistive technology or who is sensitive to motion, I need visible controls to pause animations and access to all content, so that the site is usable regardless of my abilities or preferences.

## Scope

### In scope

- P1-4: Play/pause toggle for CoverScroll (manual mode), timeline hero, and global ASCII canvas
- P1-5: Screen-reader-accessible career timeline alternative
- P2-3: Remove `priority` from offscreen carousel images
- P2-4: Fix CoverScroll frame height measurement and pause-resume offset
- Review handoff document covering all changes

### Out of scope

- Redesigning the timeline visual appearance
- Changing the ASCII shader aesthetic or particle behaviour
- Adding new animation effects
- Restructuring the case study content model (P2-5)
- Test coverage (P2-11) — separate task

## Dependencies

- `src/hooks/useReducedMotion.ts` — already exists, reused for reduced-motion checks
- `src/hooks/useTimelineHero.ts` — timeline animation hook, needs pause capability
- `src/hooks/useAsciiShader.ts` — global ASCII canvas hook, needs pause capability
- `src/components/case-study/CoverScroll.tsx` — cover scroll component, needs pause + geometry fix
- `src/components/case-study/CarouselImage.tsx` — carousel, needs `priority` removal
- `src/components/effects/TimelineHero.tsx` — timeline component, needs accessible alternative

## Design source

- TASTE.md: "All motion must respect reduced-motion preferences" — extends to visible controls
- WCAG 2.2.2 Pause, Stop, Hide: "For moving, blinking, scrolling, or auto-updating information, the user must be able to pause, stop, or hide it"
- Site design language: controls should be minimal, consistent with the existing UI vocabulary (small, rounded, muted colours, `#A43718` accent on interaction)

## Technical context

- Framework: Next.js 15, React, TypeScript, Tailwind CSS
- Animation hooks: `useTimelineHero` (rAF loop at 18fps), `useAsciiShader` (rAF loop at 15fps)
- CoverScroll: manual scroll mode (no auto-scroll on the Draftly/Travecs case studies)
- Global canvas: mounted in `src/app/layout.tsx`, runs the ASCII particle shader on every route
- All animations already check `prefers-reduced-motion` via `useReducedMotion` hook

---

## P1-4: Animation pause/stop controls

### What to build

A reusable `AnimationPauseButton` component that provides a visible play/pause toggle for any looping animation. Plus wiring it into the three animation sites.

### Component spec: `AnimationPauseButton`

- Location: `src/components/ui/AnimationPauseButton.tsx`
- Props: `isPaused: boolean`, `onToggle: () => void`, `label?: string`
- Appearance: 32×32px button, `rounded-full`, `bg-white/80` with `border border-[#151515]/10`, icon-only with `aria-label`
- Icons: pause icon (two vertical bars) when playing, play icon (triangle) when paused
- Focus state: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]`
- Positioning: absolute, bottom-right corner of the animation container (12px inset)
- Screen reader: `aria-label="Pause animation"` / `aria-label="Resume animation"`

### Wiring

#### 1. CoverScroll (`src/components/case-study/CoverScroll.tsx`)

- Add `isPaused` state (default: false)
- Pass `isPaused` to the auto-scroll effect — when paused, stop the rAF loop
- For manual scroll mode (the current default): the pause button is not needed since the user controls scrolling. Only add the button when `autoScroll` is true.
- Position the button inside the frame container, bottom-right

#### 2. Timeline Hero (`src/components/effects/TimelineHero.tsx` + `src/hooks/useTimelineHero.ts`)

- Add `isPaused` state to `TimelineHero`
- Pass `isPaused` to `useTimelineHero` — when paused, stop advancing `activeIndex`
- The canvas still renders the current frame (frozen), but the heart stops moving
- Position the button inside the wrapper, bottom-right, above the tooltip area
- When paused, the tooltip should remain visible showing the current milestone

#### 3. Global ASCII Canvas (`src/hooks/useAsciiShader.ts` + `src/app/layout.tsx`)

- Add a global `isPaused` state. The simplest approach: a React context or a module-level `MutationObserver`-style pattern.
- **Recommended**: Create a small `AnimationContext` provider in `layout.tsx` that wraps the app, exposing `{ isPaused, togglePause }`. The ASCII shader hook reads from this context. The pause button renders once in the layout.
- The button should be fixed-position, bottom-right of the viewport, with a low z-index so it doesn't interfere with page content
- On routes where the canvas is not visible (case study pages), the button could be hidden — but for simplicity, keep it globally visible since the canvas runs globally

### Acceptance criteria

- [ ] `AnimationPauseButton` renders at 32×32px with correct icons
- [ ] Button is keyboard-focusable with visible focus ring
- [ ] `aria-label` toggles between "Pause animation" and "Resume animation"
- [ ] CoverScroll auto-scroll pauses and resumes correctly
- [ ] Timeline hero freezes at current milestone when paused
- [ ] ASCII canvas stops animating when paused
- [ ] All animations respect `prefers-reduced-motion` as before (pause button is additive, not a replacement)
- [ ] Button does not appear over non-animation content

---

## P1-5: Career timeline screen reader access

### What to build

A visually-hidden but screen-reader-accessible listing of all five career milestones, placed alongside the canvas timeline.

### Implementation

In `src/components/effects/TimelineHero.tsx`:

- Add a `<ul>` element with `className="sr-only"` (visually hidden, accessible to screen readers)
- Each `<li>` contains the milestone year and note text from `TIMELINE_MILESTONES`
- The `<ul>` is a sibling of the canvas, inside the same `role="group"` container
- The existing `aria-label` on the group ("Career timeline with auto-play milestones") should be updated to "Career timeline" (remove "auto-play" since the screen-reader version is static)
- Optionally add `aria-live="polite"` to announce the current milestone as the animation advances — but this should be secondary to the static list, not the primary access method

### Acceptance criteria

- [ ] Screen readers announce all five milestones (year + note)
- [ ] The static list is invisible on screen (`sr-only`)
- [ ] The canvas remains `aria-hidden="true"`
- [ ] Group `aria-label` is "Career timeline"
- [ ] Heading structure is correct (the timeline sits under the "Experience" section heading)

---

## P2-3: Remove force-preload on carousel images

### What to change

In `src/components/case-study/CarouselImage.tsx`:

- Line ~199: The non-scrollable `<Image>` uses `fill` with no `priority` — this is already correct
- Line ~200: The scrollable `<Image>` uses explicit `width`/`height` without `priority` — also correct
- **Verify** that no carousel images in the rendered HTML have `fetchPriority="high"` or `<link rel="preload">` for offscreen carousel slides
- If the scrollable variant does set `priority` anywhere, remove it. Only the hero/cover image should use `priority`.

### Acceptance criteria

- [ ] No carousel image has `priority` prop
- [ ] CoverScroll and hero images retain `priority`
- [ ] Page load does not preload offscreen carousel images

---

## P2-4: CoverScroll geometry + pause-resume fix

### Problem

1. The frame height is measured via `ResizeObserver` (`frameHeight` state), but the scroll distance calculation at line 75 (`totalScrollDistance = imageHeight - frameHeight`) can produce incorrect values if the image loads before the frame is measured.
2. After hover-pause in auto-scroll mode, the resume jumps because the elapsed time from the pause is not accounted for — `phaseStartRef` is not reset on resume.

### Fixes

#### Geometry fix

- Guard `totalScrollDistance` calculation: only compute when both `imageHeight > 0` and `frameHeight > 0`
- Add a loading state: don't start the auto-scroll animation until both measurements are available
- Verify that `sectionOffsets` are correctly scaled to the actual scroll range

#### Pause-resume fix

- In the `isHovered` effect (line 77): when the user hovers, record the current scroll position. When they unhover, set `scrollFromRef.current` to that position and reset `phaseStartRef.current` to 0 so the next animation frame starts fresh.
- Alternatively: when paused, simply freeze the rAF loop (don't advance `phaseStartRef`). On resume, the existing `dt` calculation will naturally continue from where it left off because `lastTickRef` is also frozen.

### Acceptance criteria

- [ ] CoverScroll frame renders at the correct 16:10 aspect ratio without clipping
- [ ] Auto-scroll does not start until image and frame measurements are both available
- [ ] Hovering pauses the scroll smoothly at the current position
- [ ] Unhovering resumes from the exact position without jumping
- [ ] Section labels align with the visible content at each scroll position

---

## Likely files affected

- `src/components/ui/AnimationPauseButton.tsx` (new)
- `src/components/case-study/CoverScroll.tsx`
- `src/components/case-study/CarouselImage.tsx`
- `src/components/effects/TimelineHero.tsx`
- `src/hooks/useTimelineHero.ts`
- `src/hooks/useAsciiShader.ts`
- `src/app/layout.tsx`

## Acceptance criteria (batch-level)

- [ ] All three P1/P2 items implemented
- [ ] TypeScript compiles with zero errors
- [ ] ESLint passes
- [ ] Production build passes
- [ ] No regressions on Travecs, Letters App, or TODO++ case studies
- [ ] Pause button works on homepage (ASCII canvas) and case study pages (CoverScroll + timeline)
- [ ] Screen reader announces all five timeline milestones
- [ ] Review handoff document written at `tasks/2026-07-27-a11y-perfection-handoff.md`

## Required output

Return:

1. Implementation summary
2. Files changed (with before/after descriptions)
3. Important technical decisions
4. Deviations or assumptions
5. Tests performed (manual verification steps)
6. Preview instructions (which routes to check)
7. Known limitations
8. The review handoff document content (so it can be committed)

## QA handoff instructions

After completing all three items, write a QA handoff document at `tasks/2026-07-27-a11y-perfection-handoff.md` following the standard template. Include:

- What was built and why
- Exact file changes with line numbers
- Manual test steps for each fix
- Accessibility verification steps (keyboard, screen reader, reduced motion)
- Any regressions observed
- Screenshots or visual evidence where possible
