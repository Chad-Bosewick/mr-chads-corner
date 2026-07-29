# CHATGPT QA REVIEW REQUEST

## Review ID

A11Y-PERF-001-QA

## Feature

Accessibility and animation perfection batch — pause controls, timeline screen-reader access, carousel preload verification, CoverScroll geometry/pause-resume fix

## Review objective

Determine whether the implementation meets WCAG 2.2 AA requirements for animation control and content accessibility, whether the visual/interaction quality is production-ready, and whether any blocking or critical issues prevent release.

## Approved requirement

### P1-4: Visible animation pause/stop controls (WCAG 2.2.2)

Add a reusable 32x32 `AnimationPauseButton` with play/pause icons, toggled `aria-label`, `aria-pressed`, keyboard focus ring, and reduced-motion-safe styling. Wire it into three sites:

1. **Global ASCII canvas** — fixed-position control in bottom-right viewport corner, connected to a new `AnimationProvider` context that owns the pause state
2. **Timeline hero** — in-context control in lower-right area above the canvas, local pause state
3. **CoverScroll auto-scroll** — in-frame control, only rendered when `autoScroll` is true; manual-scroll case studies intentionally have no button

Each animation site has independent pause state. The global control pauses only the ASCII background. Timeline and CoverScroll have their own spatially-bound controls.

### P1-5: Career timeline screen-reader alternative

Add a visually-hidden `<ul className="sr-only">` inside the existing `role="group"` container. Each `<li>` contains the milestone year and note from `TIMELINE_MILESTONES`. Group label is "Career timeline". No `aria-live` feed — the static list is the primary AT representation. Canvas retains `aria-hidden="true"`.

### P2-3: Carousel preload verification

Verified that no carousel `next/image` uses `priority`, `preload`, or `fetchPriority="high"`. No code change was needed — the existing code already omits `priority` on carousel images.

### P2-4: CoverScroll geometry + pause-resume fix

- Frame height measured via `ResizeObserver`; auto-scroll animation does not start until both `imageHeight > 0` and `frameHeight > 0`
- Pause timing uses `performance.now()` delta freezing: on pause, record timestamp; on resume, offset `phaseStartRef` by paused duration and reset tick baseline
- Section offsets are scaled against the actual rendered scroll range, not a fixed 600px

## Design source

- Figma file: N/A (accessibility/performance task, not visual design)
- TASTE.md principles: "All motion must respect reduced-motion preferences"
- WCAG 2.2.2 Pause, Stop, Hide
- WCAG 2.4.7 Focus Visible
- WCAG 1.3.1 Info and Relationships (timeline SR alternative)
- Site design language: controls minimal, small, rounded, muted colours, `#A43718` accent on focus

## Environment

- Preview URL: Local dev server (`npm run dev`)
- Routes to test:
  - `/` — global ASCII control, career timeline, auto-scrolling project covers
  - `/featured-case-studies/draftly` — manual CoverScroll and product carousel
  - `/featured-case-studies/credlane` — regression check
  - `/featured-case-studies/todo-app` and `/featured-case-studies/letters-app` — carousel/image regression check
- Device sizes to test: 375px mobile, 768px tablet, 1280px desktop
- Browser: Chrome, Safari, Firefox

## Evidence provided

### Automated checks (all passed)

- `npm run typecheck` — zero errors
- `npm run lint` — zero warnings or errors
- `npm run build` — passed (Next.js 15.5.20)

### Manual verification performed

- Homepage exposes `aria-label="Pause background animation"` on the global control
- Homepage exposes `role="group"` with `aria-label="Career timeline"` and `sr-only` milestone list
- Auto-scroll CoverScroll controls appear with "Pause cover preview animation"
- Draftly rendered HTML contains no carousel image preload or `fetchPriority="high"`
- Desktop screenshot confirms global pause button visible in lower-right viewport corner

### Files changed

| File | Change |
|---|---|
| `src/components/ui/AnimationPauseButton.tsx` | **New** — Reusable 32x32 accessible play/pause button |
| `src/components/providers/AnimationProvider.tsx` | **New** — ASCII pause state context + global control |
| `src/app/layout.tsx` | Wraps app in `AnimationProvider`, mounts `GlobalAnimationPauseControl` |
| `src/components/effects/AsciiShader.tsx` | Reads `isAsciiPaused` from context, passes to hook |
| `src/hooks/useAsciiShader.ts` | Skips rAF and pointer listeners while `isPaused` |
| `src/components/effects/TimelineHero.tsx` | Local `isPaused` state, `sr-only` milestone list, `AnimationPauseButton` |
| `src/hooks/useTimelineHero.ts` | Accepts `isPaused` param, skips rAF when paused, preserves elapsed state |
| `src/components/case-study/CoverScroll.tsx` | Measurement gating, `performance.now()` pause timing, auto-scroll-only button |
| `src/components/case-study/CarouselImage.tsx` | Verified no `priority` prop — no code change |

## Review areas

### Primary (must review)

- **Accessibility — animation controls:**
  - Are the pause/resume controls keyboard-focusable with visible focus rings?
  - Does `aria-pressed` correctly communicate toggle state?
  - Does `aria-label` correctly toggle between pause and resume?
  - Do controls remain accessible under `prefers-reduced-motion: reduce`?
  - Is the 32x32 target size sufficient? (WCAG 2.5.8 recommends 24x24 minimum)

- **Accessibility — timeline SR alternative:**
  - Does a screen reader announce all five milestones from the `sr-only` list?
  - Is the group label "Career timeline" announced?
  - Is the canvas correctly hidden from AT (`aria-hidden="true"`)?
  - Is the `sr-only` list truly invisible on screen?

- **Accessibility — CoverScroll:**
  - Is the `role="group"` with `aria-label` correct for the CoverScroll frame?
  - Does the pause button announce correctly?

- **Interaction quality — pause/resume:**
  - Does the global ASCII animation freeze and resume smoothly?
  - Does the timeline freeze at the current milestone with tooltip visible?
  - Does CoverScroll auto-scroll freeze at the exact pixel position and resume without jumping?
  - Does hovering a CoverScroll frame also freeze correctly?

- **Visual quality:**
  - Is the global pause button positioned correctly (fixed bottom-right)?
  - Does it overlap any important content on mobile (375px)?
  - Are the play/pause icons clear and recognizable?
  - Does the focus ring use the accent colour (`#A43718`)?

### Secondary (review if time allows)

- **Responsive behaviour:**
  - Global control placement on narrow mobile viewports
  - Timeline pause button positioning relative to tooltip
  - CoverScroll pause button inside the frame on mobile

- **Consistency:**
  - Do all three pause controls look and behave identically?
  - Is the design language consistent with the rest of the site?

- **Reduced motion:**
  - When `prefers-reduced-motion: reduce` is active, do all animations remain static?
  - Do pause controls still appear (they are additive, not a replacement)?

- **Edge cases:**
  - What happens if the user pauses the global animation and navigates to a case study page?
  - What happens if the user resizes the viewport while CoverScroll is mid-animation?

## Known constraints

- The global control renders on every route by design, because the ASCII canvas is mounted globally. Placement against dense mobile content should be verified.
- There are no automated browser tests for rAF pause/resume timing in this batch. Manual browser validation is required.
- The `next lint` command completed successfully but is deprecated by Next.js; migration to ESLint CLI is outside this task scope.
- CoverScroll auto-scroll only triggers on homepage project preview cards that have `autoScroll` enabled. Case study pages like `/featured-case-studies/draftly` use manual scroll mode and intentionally have no pause button.

## Known issues

- None identified by the implementation team.

## Required response

Return:

1. **pass, conditional pass, or fail** — with rationale
2. **Findings classified by severity** — blocker / critical / major / minor / observation
3. **Evidence and rationale** — for each finding
4. **Required corrections** — if fail or conditional pass
5. **Optional improvements** — observations and suggestions
6. **Retest criteria** — what must be re-verified after corrections
7. **Release recommendation** — whether this batch is ready for deployment
