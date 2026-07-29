# CHATGPT QA REVIEW REQUEST

## Review ID

UI-003-QA

## Feature

Letters App dual-phone device composition — left-aligned overlapping layout on desktop, single phone on mobile

## Review objective

Determine whether the dual-phone composition is visually correct, spatially balanced, responsive across breakpoints, accessible via keyboard, and free of layout defects. Confirm the implementation matches the approved design intent and production quality bar.

## Approved requirement

### UI-003: Letters App dual-phone layout

Rebuild the Letters App card media area to display two overlapping phone device mockups on desktop, replacing the single-device presentation used by other case-study cards.

**Desktop layout specifications:**

| Property | Value |
|---|---|
| Stage width | `max-w-[440px]` |
| Stage height | `h-[540px]` |
| Stage alignment | Left-aligned (no `mx-auto`), matching laptop bezel left edge |
| Front phone width | `w-[240px]`, anchored `absolute left-0 top-0` |
| Back phone width | `w-[225px]`, anchored `absolute right-0 top-12` |
| Horizontal overlap | ~25px at full stage width |
| Back phone vertical offset | 48px (`top-12`) |
| Bezel stroke | `p-[1.5px]` consistent with UI-002 standardisation |

**Mobile layout specifications:**

| Property | Value |
|---|---|
| Breakpoint | Below `md` (768px) |
| Behaviour | Single front phone only, no dual-phone composition |
| Phone width | `w-full max-w-[220px]` |
| Alignment | Centred |

**Interaction specifications:**

| Property | Value |
|---|---|
| Hover/focus spread | Phones scale to 0.94, move ±6.5px horizontally, rear phone lifts 47px |
| Spring animation | 0.38s, bounce: 0 |
| Idle float | Independent staggered vertical float when card is inactive |
| Reduced motion | Static default composition, no animation |
| Keyboard parity | Focus on the card link produces the same spread as mouse hover |

## Design source

- Implementation handoff: `docs/qa/2026-07-26-codex-ui-003-left-aligned-bezel-handoff.md`
- UI-004 hover interaction handoff: `docs/qa/2027-07-27-codex-ui-004-letters-hover-handoff.md`
- Figma file: N/A (owner-directed layout adjustment based on live-site visual comparison)
- TASTE.md principles: "deliberate whitespace", "controlled asymmetry", "confident project imagery"
- Design intent: Letters App card should have comparable visual weight to the 480px laptop bezel frame used by other case studies

## Environment

- Preview URL: Local dev server (`npm run dev`, `localhost:3000`)
- Routes to test:
  - `/` — homepage, Letters App card in project row section
  - `/featured-case-studies` — project listing page (same card composition)
- Device sizes to test: 375px mobile, 768px tablet, 1280px desktop, 1440px desktop
- Browser: Chrome, Safari, Firefox

## Evidence provided

### Owner visual confirmation (5/5 states PASS)

Playwright screenshots captured and owner-reviewed on 2026-07-27:

| State | File | Owner verdict |
|---|---|---|
| Desktop default | `/tmp/ui003-desktop-default-crop.png` | PASS |
| Desktop hover | `/tmp/ui003-desktop-hover-crop.png` | PASS |
| Desktop after-hover return | `/tmp/ui003-desktop-after-hover-crop.png` | PASS |
| Desktop keyboard focus | `/tmp/ui003-desktop-focus-crop.png` | PASS |
| Mobile (375px) | `/tmp/ui003-mobile-letters.png` | PASS |

### Automated checks (all passed)

- `npm test`: 32/32 tests passed
- `npm run build`: Next.js production build passed
- Type validation during build: passed
- Static generation: 13/13 pages passed

### Files changed

| File | Change |
|---|---|
| `src/components/ui/DeviceMockup.tsx` | Rebuilt with dual-phone variant, nested Motion transform layers for float + hover, phone shell positioning, bezel standardisation |
| `src/components/sections/ProjectRow.tsx` | Hover/focus state tracking for dual-phone card, `coverSrcSecondary` prop passthrough |
| `src/app/page.tsx` | Passes `coverSrcSecondary={project.coverSrcSecondary}` to project rows |
| `src/app/featured-case-studies/page.tsx` | Same prop wiring for listing page |
| `src/styles/globals.css` | Removed superseded `device-float` keyframes |

## Review areas

### Primary (must review)

- **Layout composition:**
  - Is the front phone anchored to the left edge of the media column?
  - Is the back phone offset to the right and ~48px downward?
  - Is the horizontal overlap approximately 25px?
  - Does the composition have visual weight comparable to the ~480px laptop frame?
  - Do neither phone cross section dividers or overlap adjacent content?

- **Responsive behaviour:**
  - Does mobile (below 768px) show only a single centered phone?
  - Is the single phone `max-w-[220px]` and free of horizontal overflow?
  - Does the transition between single/dual phone occur cleanly at the `md` breakpoint?

- **Hover/focus interaction:**
  - Do phones spread apart on hover with a visible ~16px gap?
  - Does the spring animation (0.38s, bounce: 0) settle without overshoot?
  - Does keyboard focus on the Letters link produce the same spread?
  - Does leaving the card restore the default overlapping composition smoothly?
  - Does the idle float animation resume after the hover/focus ends?

- **Accessibility:**
  - Is the Letters card link keyboard-focusable with a visible focus ring?
  - Does `prefers-reduced-motion: reduce` produce a static composition with no animation?
  - Do device mockups have appropriate `aria-hidden` or decorative treatment?
  - Is the touch layout (single phone) free of interaction issues?

- **Visual polish:**
  - Are bezel strokes consistent at `p-[1.5px]` (matching UI-002)?
  - Do the phone screenshots render cleanly without distortion?
  - Is the purple gradient design element positioned correctly?
  - Are tag labels ("Letters", "Apps", "iOS") legible and properly spaced?

### Secondary (review if time allows)

- **Consistency:**
  - Does the dual-phone treatment feel intentional alongside the single-device laptop and tablet cards?
  - Is the visual hierarchy between the two phones clear (front = primary, back = secondary)?

- **Edge cases:**
  - What happens at very wide viewports (1920px+)? Does the stage remain contained?
  - What happens during rapid hover/unhover cycling?
  - Does the card remain stable if the window is resized while hovering?

- **Performance:**
  - Are the phone images lazy-loaded or appropriately prioritised?
  - Does the float animation use `transform` only (no layout thrashing)?

## Known constraints

- The back phone image uses `/images/case-studies/letters-app-showcase.webp`. Image quality at the rendered size should be verified.
- The `next lint` command shows a deprecation notice from Next.js; this is a pre-existing project condition, not related to this task.
- The dual-phone layout is Letters App-specific. Other case-study cards use single-device presentations (laptop, tablet, phone). This is by design, not an inconsistency.
- UI-004 (hover interaction) changes are also present in the working tree but are a separate review scope.

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
7. **Release recommendation** — whether this feature is ready for deployment
