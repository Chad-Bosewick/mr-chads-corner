# UI-004 — Letters App dual-phone hover interaction and working-tree handoff

Date: 27 July 2026  
Status: implementation complete; UI-005 visual-state fix applied; awaiting retest and commit

## Result

The homepage’s Letters App card now resolves its two-phone composition into a deliberate, spaced editorial pose when a desktop visitor hovers the card or a keyboard user focuses its link.

- Each active bezel resolves to the same exact 212px width (and therefore the same 9:19 height): the 240px front bezel scales to `0.8833`, while the 225px rear bezel scales to `0.9422`.
- The equal-sized bezels sit flush with the left and right edges of the 440px stage, leaving a precise 16px gap between them. The previous default pose remains unchanged.
- During the active pose, the rear phone lifts by 48px to remove its default vertical stagger, placing both top bezel edges on the same visual horizontal level.
- The screenshot images no longer use the shared card-hover zoom in the dual-phone presentation; only the enclosing bezels transition.
- The independent idle floats settle smoothly into that aligned pose instead of freezing partway through their loop.
- Leaving the card or moving focus away smoothly restores the default pose and resumes the low-amplitude float.
- On touch layouts and under `prefers-reduced-motion: reduce`, the pair stays in the static default composition.

## Implementation details

| File | Update |
| --- | --- |
| `src/components/sections/ProjectRow.tsx` | Tracks hover/focus state only for the non-placeholder `dual-phone` card and passes it into the device presentation. This gives keyboard focus the same visual feedback as pointer hover. |
| `src/components/ui/DeviceMockup.tsx` | Replaced the conflicting CSS float/transform setup with nested Motion transform layers. A spring (`0.38s`, `bounce: 0`) handles the interactive spread and re-targets cleanly; idle vertical movement runs only when the card is inactive. |
| `src/styles/globals.css` | Removed the superseded `device-float` keyframes. |

The Motion implementation is intentional: the previous float loop and a hover transform both needed control of `transform`. Nesting and Motion retargeting prevent a hover from snapping, overriding, or freezing the phone at an arbitrary vertical position.

## UI-005 — TODO++ device annotation reveal

The TODO++ homepage card now adds an informational overlay on desktop hover and keyboard focus.

- Four staggered callouts map the device’s E-paper task display, screen control keys, AI emoji display, and push-to-speak button.
- Labels and leader lines use muted ink; the endpoint dots use the site rust accent (`#A43718`).
- The existing light image hover scale remains, while the annotation overlay adds product context without changing layout.
- The treatment is configured through the project content model (`annotationSet: "todo-device"`), not inferred from an image filename.
- It is intentionally hidden on mobile and when reduced motion is requested.

### Visual QA issue and correction

Playwright screenshots captured 2026-07-27 revealed that annotations are **not properly hidden in default state** and **do not properly reveal on hover**:

| State | Expected | Actual | Verdict |
|---|---|---|---|
| Desktop default | Annotations fully invisible | Faintly visible (labels and lines partially rendered) | FAIL |
| Desktop hover | Annotations reveal with stagger | No clear change in visibility | FAIL |
| Desktop after-hover | Annotations hide cleanly | Same faint state as default | FAIL |

**Root cause:** `TodoDeviceAnnotations` uses `motion.path`, `motion.circle`, and `motion.span` with `animate` props but no `initial` props. Without `initial={{ opacity: 0 }}`, Motion starts from CSS default (opacity: 1) and the transition to 0 may not complete cleanly.

**Correction applied:** All four paths now start at `opacity: 0` / `pathLength: 0`; all four dots start at `opacity: 0` / `scale: 0.4`; and all four labels start invisible with their appropriate horizontal offset. Task file: `tasks/2026-07-27-codex-ui-005-annotation-fix.md`

## Verification completed

- `npm run typecheck` — passed.
- `npm run lint` — passed with no warnings or errors (the existing Next.js `next lint` deprecation notice remains).
- `git diff --check` — passed.
- `npm run build` — not completed in this environment because Next.js could not resolve `fonts.googleapis.com` while fetching the Google-hosted font. This is an external DNS/network limitation, not a reported application build error; rerun in a networked CI or preview environment.

## Manual browser QA still required

1. At a desktop width (1280px or wider), hover any part of the Letters App card. Confirm the phones settle, scale slightly, and form a clean gap without exceeding the media stage.
2. Move the pointer away mid-transition. Confirm the motion reverses from its current position without a jump.
3. Tab to the Letters App link. Confirm the same expanded pose appears, then returns when focus moves away.
4. At mobile/tablet widths below `md`, confirm the single-phone presentation remains unchanged.
5. Enable reduced motion and confirm the dual-phone animation remains static.
6. On the TODO++ card at desktop width, confirm the four callouts reveal on hover and keyboard focus, map to the correct controls, and disappear cleanly on exit/blur.

## Current working-tree status

This branch is intentionally uncommitted and contains three coherent implementation batches plus one generated artifact:

| Batch | Status | Files / outcome |
| --- | --- | --- |
| Font migration | Implemented; uncommitted | `Plus Jakarta Sans` was replaced with `Inter` in the root layout and `--font-sans`; `font-synthesis: none` was added. |
| A11Y-PERF-001 | Implemented; awaiting independent QA | Global/timeline/CoverScroll pause controls, timeline screen-reader alternative, and CoverScroll geometry/pause-resume fixes. See `tasks/2026-07-27-a11y-perfection-handoff.md`. |
| UI-004 (this task) | Implemented; awaiting browser QA | Letters App desktop hover/focus dual-phone interaction. |
| UI-005 | Fix applied; awaiting Playwright retest | TODO++ desktop hover/focus device annotation reveal. Fix task: `tasks/2026-07-27-codex-ui-005-annotation-fix.md` |
| `tsconfig.tsbuildinfo` | Generated; not a product change | Updated incidentally by TypeScript verification. |

Untracked handoff material currently includes the A11Y-PERF-001 QA request, its implementation handoff, the new animation provider/control components, and this document. No batch has been committed or deployed.

## Recommended next action

Perform the five manual checks above alongside the outstanding A11Y-PERF-001 QA. If they pass, the font migration, A11Y-PERF-001, and UI-004 should be reviewed as one deliberate pre-deployment working-tree batch or split into focused commits by the CTO.
