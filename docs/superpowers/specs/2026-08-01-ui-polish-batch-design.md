# UI Polish Batch — Design Spec

Date: 2026-08-01
Status: Approved — per product-owner review (2026-08-01)
Branch: `foundations`

## 1. Summary

A batch of seven small, independent product-polish items that make the site feel more alive and more intentional without changing its architecture:

- **A. Timeline tooltip copy** — light grammar pass on two milestone notes.
- **B. Carousel indicator** — the active pill slides between dots instead of morphing in place.
- **C. Availability dot** — the footer "Available to work" green dot breathes softly instead of sitting static.
- **D. Wordmark scribble** — the footer ASCII wordmark morphs between "Temi Adekunle" and "Chad Bosewick" in a looping scribble.
- **E. Interest-card hearts** — session-only like/heart affordance on the "Do we have similar interests?" cards.
- **F. Contact form** — the contact page's Email + Social links are replaced with a short ice-breaker form (no email link under the form — the footer keeps the contact links).
- **G. Footer email label** — the footer's mailto link reads "Email" instead of the bare address, matching the other link labels.

Every item is self-contained, low-risk, and reversible. No architecture changes, no new dependencies, no content-model changes.

## 2. Background

- Timeline hero tooltip text lives in `src/content/timeline.ts`; the 2024 note reads "Became an HNG Design Finalist and proved I could grow quickly." **"an HNG" is grammatically correct** — *a/an* follows the spoken sound, and "HNG" is pronounced letter-by-letter ("aitch-en-gee"), a vowel sound. The live site and source both spell "Became" correctly (a "Beacame" sighting was a stale build/memory).
- Carousel dot indicators in `src/components/case-study/CarouselImage.tsx` animate width (`w-2` → `w-5`) so the active pill *morphs in place*, reading as a jump. Desired feel: a pill that *slides* to the active dot.
- The footer (`src/components/layout/Footer.tsx`) shows a static green availability dot; the footer wordmark is a static dot-matrix SVG (`src/components/layout/FooterAsciiBrand.tsx`). The codebase already has canvas-ASCII precedent (`FooterAscii`, the hero unravel shader) to build on.
- Interest cards (`src/components/sections/InterestCard.tsx`) are a single large `<button>` that expands an item popover. Adding a heart means restructuring to sibling controls so the heart does not nest inside the button.
- The contact page (`src/app/contact/page.tsx`) lists Email + Social links that duplicate the footer. The site is a **static Next.js export** (Netlify, `out/`) with no backend — submissions cannot POST anywhere, so the form composes a `mailto:` draft.

## 3. Decisions (locked)

| # | Decision | Choice |
|---|---|---|
| D1 | Timeline copy scope | Light touch — the 2024 note tail stays "and proved I could grow quickly."; only the H2 2023 note's redundant "Later in 2023," is trimmed |
| D2 | Carousel indicator | Sliding pill on a fixed track — all dots equal ellipses, one pill translates to the active dot |
| D3 | Availability dot | Soft breathing pulse, ~2.8s cycle, 45%→100% opacity; static under reduced motion |
| D4 | Wordmark animation | Canvas ASCII scribble-morph looping "Temi Adekunle" ↔ "Chad Bosewick"; reduced-motion/no-JS shows the current static "Temi Adekunle" wordmark; decorative (`aria-hidden`) |
| D5 | Interest hearts | Session/decorative — heart fills + count ticks 0→1, resets on reload; no fabricated aggregate numbers |
| D6 | Contact form | Mailto composer — Name, Role, Message fields build a pre-filled draft in the visitor's mail app; no backend |

## 4. Item details

### A. Timeline tooltip copy (`src/content/timeline.ts`)

- **2024 note** (unchanged): "Became an HNG Design Finalist and proved I could grow quickly." — grammar already correct; do not touch.
- **H2 2023 note**: drop the redundant "Later in 2023, " → **"Completed the Google UX Design Certificate and built my design foundation."** (the year is already in the label, matching the other four notes).
- Other notes (H1 2023, 2025, 2026): unchanged.
- Pure data change; tooltip rendering, timeline canvas, and the sr-only list all read from this file automatically.

### B. Carousel indicator — sliding pill (`src/components/case-study/CarouselImage.tsx`)

- Replace the width-morph dots with a **sliding pill on a fixed track**:
  - All dots are equal `w-2 h-2` ellipses (`bg-[#151515]/20`, `group-hover:bg-[#151515]/40`).
  - A single decorative pill element (`aria-hidden`) sits behind/over the track and **translates** horizontally to the active dot's center, `transition-transform duration-[500ms] ease-[var(--ease-fluid)]`.
  - Pill position = `activeIndex × dotSpacing` where `dotSpacing` is the fixed distance between dot centers (each dot sits in a 24px-wide hit area with 8px gaps, so spacing is constant and derivable).
  - Reduced motion: pill renders instantly (no transition), or `duration-0`.
- Each dot button keeps its 24px hit area inside an 11×11 rounded hit region — **all 44×44px minimum target sizes preserved** (dots are 8px wide; the existing buttons already provide the 44px target via `h-11 w-6` — widen the hit area if the pill math needs it, but keep every target ≥ 44px).
- `aria-current` stays on the active dot; `aria-label="Go to slide N"` unchanged. Arrows, auto-advance, keyboard arrows, and direct dot clicks all drive the same `activeIndex` → same pill position.
- Slide counter (`N / M`) and captions unchanged.

### C. Availability dot — soft breathing (`src/components/layout/Footer.tsx`)

- Wrap the existing dot + halo in a soft keyframe pulse: opacity eases ~45% ↔ 100% over a ~2.8s cycle (e.g. `animation: availability-breathe 2.8s ease-in-out infinite`; keyframes 0%→45% opacity, 50%→100%, 100%→45%).
- The halo ring scales with the dot's opacity so the whole indicator breathes as one unit.
- **Reduced motion:** static dot exactly as today — gate the animation behind `@media (prefers-reduced-motion: no-preference)` so no-JS/reduced-motion users see no change.
- No layout shift (size constant; only opacity animates).

### D. Wordmark scribble — "Temi Adekunle" ↔ "Chad Bosewick" (`src/components/layout/FooterAsciiBrand.tsx`)

- Rebuild as a **canvas ASCII scribble-morph**. This is the one substantial build.
- **Glyph sampling:** rasterize both name strings ("Temi Adekunle", "Chad Bosewick") into dot/ASCII particle anchors — same technique as the existing `FooterAscii` canvas (fill each occupied cell with a small character or dot). Both names share the same particle grid so each particle has a "Temi" anchor and a "Chad" anchor.
- **Loop:** hold "Temi Adekunle" ~2.5s → scribble-morph to "Chad Bosewick" (~1.2s) → hold ~2.5s → scribble back (~1.2s) → repeat.
- **Scribble feel:** each particle eases from its current anchor to the next with a per-particle randomized stagger and a small bezier wobble, so the transition reads as handwriting/drawing rather than a mechanical crossfade. Particles not in either name fade out.
- **Performance guardrails:** particle cap (~600), the project's existing rAF + `MAX_DPR = 2` pattern, `FRAME_INTERVAL` 15fps, and an **IntersectionObserver** on the wordmark wrapper so the loop only runs while the footer is on screen (stops/resumes on enter/leave).
- **Reduced-motion / no-JS:** render today's static "Temi Adekunle" SVG wordmark, unchanged. The copyright line and quote attribution stay "Temi Adekunle" (D4).
- Decorative: `aria-hidden`, `role="presentation"` — the wordmark has no textual role; the footer's real content (copyright, links) is unaffected.

### E. Interest-card hearts — session like (`src/components/sections/InterestCard.tsx`)

- Restructure the card from one big `<button>` to a **card `<div>`** containing two sibling controls:
  1. The existing card body as a `<button>` (expands the item popover, `aria-expanded`) — behavior unchanged.
  2. A **heart button** overlaid top-right (`aria-pressed`, `aria-label="Like this interest: <items>"`, 44×44px target, brand focus ring). As a sibling, clicking it never toggles the popover.
- **Like behavior (D5):** click → heart fills with the brand gradient (`#A43718`→`#E3855B`), a small pop (scale 1 → 1.15 → 1), and the count ticks 0→1 (only 0 and 1 are ever shown — no aggregate numbers). Session-only: `useState`, resets on reload. No localStorage, no backend.
- **Reduced motion:** heart fills instantly (no pop).
- Hover/focus states, the image zoom, and the popover remain intact. The `aria-label` on the card body button stays (so SR users still get the category + items).

### F. Contact form — ice-breaker (`src/app/contact/page.tsx` + new `src/components/contact/ContactForm.tsx`)

- Replace the Email + Social sections with a **client component form**:
  - **Name** (text, required)
  - **Role** (text, optional — "Designer", "Founder", "Student", …)
  - **Message** (textarea, required, 600-char max with a live counter)
  - **"Send message"** CTA button.
- **Submit:** compose `mailto:Addtemi270@gmail.com?subject=<Name — Role>&body=<Message>` and open it (`window.location.href`), preserving line breaks in the body.
- A small honest note under the button: *"This opens your email app with your message ready to send."*
- Validation: required fields before composing (native + friendly inline handling); character cap enforced.
- Keep the availability paragraph at the bottom of the page. Styling matches the design system (serif/sans rhythm, `#151515` / `#A43718` accents, visible focus rings, 44px min-height fields, consistent spacing).
- No new dependencies; fully client-side.
- **No email or social link under the form** — the footer remains the single home for contact links (user decision).

### G. Footer email label (`src/components/layout/Footer.tsx`)

- In the `SOCIAL_LINKS` array, change the first entry's label from `"Addtemi270@gmail.com"` to `"Email"` (href stays `mailto:Addtemi270@gmail.com`).
- This makes the footer link list read uniformly: **Email · LinkedIn · Dribbble · Download CV**. The link opens a `mailto:` just as before; only the visible label changes.
- No behavior change; the unique `key` (now `"Email"`) remains valid.

## 5. Named tuning knobs

| Knob | Default | Purpose |
|---|---|---|
| Pill slide duration | 500ms | How the active carousel pill travels (ease-fluid) |
| Availability cycle | 2.8s | Footer dot breathing period |
| Wordmark hold / morph | 2.5s / 1.2s | Scribble loop timing |
| Particle cap | ~600 | Wordmark canvas density ceiling |
| Message max length | 600 chars | Contact form message field |

## 6. In scope / out of scope

**In scope:**
- `src/content/timeline.ts` — H2 2023 note copy.
- `src/components/case-study/CarouselImage.tsx` — sliding pill indicator.
- `src/components/layout/Footer.tsx` — availability dot breathe.
- `src/components/layout/FooterAsciiBrand.tsx` — ASCII scribble morph.
- `src/components/sections/InterestCard.tsx` — heart like control (restructure card to sibling controls).
- `src/app/contact/page.tsx` + new `src/components/contact/ContactForm.tsx` — ice-breaker form.
- `src/components/layout/Footer.tsx` — availability dot breathe **and** email link label → "Email" (same file).
- Tests: carousel `aria-current`, contact-form mailto URL composition, interest heart toggle, wordmark reduced-motion fallback.

**Out of scope (unchanged):**
- Palette, typography, spacing tokens, global pause control, reduced-motion behavior.
- `TimelineHero` / `useTimelineHero` (the timeline canvas) — only the tooltip *text* changes.
- `FooterAscii` (the ambient field above the wordmark) — untouched.
- Nav, other case-study sections, other pages, routing, content model, dependencies.
- Contact form **persistence** — no backend, no storage (D6).

## 7. Edge cases

- **Timeline copy:** sr-only list and tooltip both source from `timeline.ts`, so a single edit stays in sync; no other copy changes.
- **Carousel pill:** pill position derives from the active index and fixed spacing — no measurement of rendered dot widths needed; safe under resize. Single-slide carousels hide the controls (already the case).
- **Availability dot:** opacity-only animation → no layout shift; reduced-motion and no-JS fall back to today's static dot.
- **Wordmark:** viewport-off canvas stops via IntersectionObserver (no wasted rAF on long pages); particle cap keeps it cheap; resize re-samples the grid; reduced-motion / no-JS render the static SVG.
- **Interest heart:** sibling buttons prevent popover/heart click collision; `aria-pressed` communicates state; session-only means no stale count.
- **Contact form:** mailto on an empty-subject edge is avoided by requiring Name + Message; long messages stay under the cap; the note sets expectation that the mail app opens.

## 8. Acceptance criteria

1. Timeline tooltip (hover/auto-advance) for H2 2023 reads "Completed the Google UX Design Certificate and built my design foundation."; 2024 note is unchanged and correct; no other copy changes.
2. Carousel dots are equal ellipses; the active pill slides (not morphs) to the current dot; `aria-current` tracks the active slide; 44px targets preserved; reduced-motion renders the pill without sliding.
3. Footer dot breathes softly on a ~2.8s cycle and is static under reduced motion; no layout shift.
4. Footer wordmark loops "Temi Adekunle" → scribble → "Chad Bosewick" → scribble → back; static "Temi Adekunle" under reduced motion / no-JS; canvas stops when the footer is off screen.
5. Interest cards show a 44px heart button top-right; clicking it fills the heart, ticks 0→1, and does not open the popover; `aria-pressed` toggles; popover still works; reduced-motion fills without the pop.
6. Contact page shows the ice-breaker form (Name, Role, Message w/ counter, CTA); submit opens a correctly composed `mailto:` draft; the availability paragraph remains; Email/Social sections are gone; no email/social link sits under the form.
7. Footer link list reads **Email · LinkedIn · Dribbble · Download CV**; the "Email" link opens the same `mailto:` as before.
8. Build, type check, and lint pass; no new dependencies; no layout shift or regressions in the touched components.
9. ChatGPT independently reviews the batch per the project QA pipeline.

## 9. Validation

- Build, type check, lint.
- Manual: hover/advance the timeline and read the tooltip; click through carousel dots + arrows + keyboard and watch the pill slide (and `aria-current`); view footer dot breathing and wordmark loop (scroll footer in/out of view); like an interest card and confirm the popover still opens; submit the contact form and confirm the mail app opens with the composed draft. Verify each at 375px and 1440px, and with `prefers-reduced-motion` emulation.
- QA per project pipeline: Codex implements, ChatGPT reviews independently.
