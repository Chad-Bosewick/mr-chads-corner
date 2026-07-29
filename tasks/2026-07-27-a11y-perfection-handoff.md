# A11Y-PERF-001 — accessibility and animation perfection QA handoff

Date: 27 July 2026  
Status: implementation complete; ready for QA

## Scope delivered

This batch addresses:

- P1-4: visitor-controlled pause/resume for looping animations.
- P1-5: a screen-reader alternative for the canvas-only career timeline.
- P2-3: verification that case-study carousel slides are not force-preloaded.
- P2-4: CoverScroll measurement gating and pause/resume timing fixes.

## What changed and why

| Area | Before | After |
| --- | --- | --- |
| Reusable motion control | No shared visible control for looping motion. | Added a 32×32 `AnimationPauseButton` with play/pause icons, toggled accessible name, `aria-pressed`, keyboard focus ring, and reduced-motion-safe styling. |
| Global ASCII canvas | The site-wide ASCII canvas ran continuously on every route. | A client `AnimationProvider` owns its paused state; a fixed, low-layer global control stops its rAF loop and resumes it on demand. |
| Timeline hero | The moving heart timeline had no visitor pause control. | Timeline now has its own in-context pause/resume button. Pausing cancels the loop without resetting elapsed progress or the current tooltip. |
| Timeline accessibility | The canvas was hidden from assistive technology, so all five career milestones were unavailable. | Added a visually hidden list of every milestone year and note inside the existing `role="group"`; the group is now simply labelled “Career timeline”. |
| CoverScroll geometry | Auto-scroll could calculate before both image and frame dimensions were known. | Animation starts only when image height and observed frame height are both available; source section offsets are scaled against the actual rendered scroll range. |
| CoverScroll pause/resume | Auto-scroll timing could jump after hover pause. | rAF timing is frozen on hover/visitor pause. Resuming offsets `phaseStart` by the paused duration and resets only the tick baseline, preserving the exact position. |
| Carousel loading | No explicit test record for offscreen image preloading. | Verified both scrollable and non-scrollable `next/image` variants have no `priority`; rendered Draftly HTML has no carousel image preload or high fetch priority. |

## Exact file changes

| File | Relevant lines | Change |
| --- | --- | --- |
| `src/components/ui/AnimationPauseButton.tsx` | 3–38 | New reusable 32×32 accessible play/pause button. |
| `src/components/providers/AnimationProvider.tsx` | 6–42 | New ASCII pause state context and fixed global control. |
| `src/app/layout.tsx` | 7, 78–87 | Wraps app content in `AnimationProvider` and mounts the global control. |
| `src/components/effects/AsciiShader.tsx` | 5–11 | Reads the global pause state and supplies it to the shader hook. |
| `src/hooks/useAsciiShader.ts` | 393–462 | Skips rAF and pointer animation listeners while visitor-paused; retains existing reduced-motion behavior. |
| `src/components/effects/TimelineHero.tsx` | 18–24, 79–105 | Owns local pause state, adds screen-reader milestone list and timeline control. |
| `src/hooks/useTimelineHero.ts` | 332–441 | Accepts `isPaused`, does not start rAF while paused, and resumes from the existing elapsed state. |
| `src/components/case-study/CoverScroll.tsx` | 60–304 | Adds measurement readiness, memoized offsets, pause timing refs, and auto-scroll pause logic. |
| `src/components/case-study/CoverScroll.tsx` | 352–410 | Adds CoverScroll control only for `autoScroll` frames; manual case-study cover scrolls remain button-free. |
| `src/components/case-study/CarouselImage.tsx` | 198–216 | Verified no `priority` prop exists on either carousel image variant. No code change was required for P2-3. |

## Manual QA steps

### Global ASCII animation

1. Open `/`.
2. Locate the 32px control fixed in the bottom-right corner.
3. Tab to it and confirm an accent focus ring is visible.
4. Confirm the initial accessible name is “Pause background animation”.
5. Activate it with Enter or Space:
   - The ASCII movement freezes.
   - Icon changes from pause bars to a play triangle.
   - Accessible name changes to “Resume background animation”.
6. Activate again and confirm the animation resumes.

### Career timeline accessibility and pause

1. On `/`, navigate to the timeline below the name heading.
2. Confirm the timeline pause control is positioned in the timeline’s lower-right area, above the canvas.
3. Activate it while the heart is moving:
   - The heart and active milestone stop at the current position.
   - The current tooltip stays visible.
   - Activating again continues rather than restarting at the first milestone.
4. With a screen reader, navigate to the group named “Career timeline”.
5. Confirm all five list items are announced, including each year and note:
   - H1 2023 — transition from Biochemistry toward product design.
   - H2 2023 — Google UX Design Certificate and foundation.
   - 2024 — HNG Design Finalist.
   - 2025 — first product-design role at Candidote.
   - 2026 — leading design at Enviodeck.
6. Confirm the canvas itself is not announced.

### CoverScroll auto-scroll

1. Open `/` and scroll to an auto-scrolling project-preview cover (e.g. Travecs or Draftly card); manual CoverScroll on `/featured-case-studies/draftly` intentionally has no pause button.
2. Wait until the cover is at least 80% visible. Confirm it begins after its initial delay and does not jump on first motion.
3. Hover the frame while it moves. Confirm it freezes exactly in place.
4. Move the pointer away. Confirm it resumes from the same pixel position rather than jumping forward or back.
5. Toggle the in-frame “Pause cover preview animation” control. Confirm it behaves the same way and its accessible name changes to “Resume cover preview animation”.
6. Resize the viewport before the image has loaded and confirm auto-scroll only begins after the 16:10 frame and image dimensions are both established.

### Carousel preload verification

1. Open `/featured-case-studies/draftly`.
2. In DevTools Network, filter by `Img` and reload.
3. Confirm the case-study hero/CoverScroll image may load eagerly, but offscreen Product Demonstrations carousel slides are not requested through a document preload/high-priority hint.
4. Advance the carousel and confirm the next image loads normally when it becomes relevant.

### Reduced motion

1. Enable `prefers-reduced-motion: reduce` in browser rendering settings.
2. Reload `/` and the case-study routes.
3. Confirm ASCII animation, timeline loop, CoverScroll auto-scroll, and carousel transitions remain reduced/static as before.
4. Confirm pause controls remain accessible; they are additive controls and must not override the visitor’s system preference.

## Automated verification completed

- `npm run typecheck` — passed.
- `npm run lint` — passed with no ESLint warnings or errors.
- `npm run build` — passed (Next.js 15.5.20).
- `git diff --check` was clean before final handoff creation.
- Local HTTP markup inspection:
  - Homepage exposed `aria-label="Pause background animation"`.
  - Homepage exposed `Career timeline` and the `sr-only` timeline list.
  - Auto-scroll CoverScroll controls appeared with “Pause cover preview animation”.
  - Draftly rendered HTML contained no carousel image preload or `fetchPriority="high"`; the only observed preload was the Next webpack script at low priority.
- A desktop homepage capture confirmed the global pause button is visible in the lower-right viewport corner.

## Preview routes

- `/` — global ASCII control, career timeline, auto-scrolling project covers.
- `/featured-case-studies/draftly` — manual CoverScroll and product carousel.
- `/featured-case-studies/credlane` — case-study regression check.
- `/featured-case-studies/todo-app` and `/featured-case-studies/letters-app` — carousel/image regression check.

## Important implementation decisions

- The global pause state intentionally controls only the global ASCII background. Timeline and CoverScroll have independent local controls because they are spatially tied to their own animation.
- CoverScroll’s pause timing uses refs so pausing cancels rAF without resetting phase, section index, or image transform. This prevents resume jumps.
- The timeline static list is the primary assistive-technology representation. No `aria-live` feed was added, avoiding unsolicited speech every time the visual animation changes milestone.
- Carousel `priority` was already absent. No artificial loading change was introduced; the handoff records the rendered-HTML verification.

## Known limitations / QA focus

- There is no automated browser test for rAF pause/resume timing in this batch. Manually validate the hover and button paths in a real browser.
- The global control remains visible on every route by design, because the ASCII canvas remains mounted globally. Check its placement against especially dense mobile content.
- The `next lint` command is currently deprecated by Next.js but completed successfully; migration to the ESLint CLI is outside this task.
