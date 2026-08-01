# TASK: UI Polish Batch (7 items)

**Task ID:** UI-POLISH-001
**Date:** 2026-08-01
**Feature:** Timeline copy · carousel indicator · footer dot + email label · interest hearts · contact form · wordmark scribble
**Owner:** Codex (principal engineer)
**Priority:** P1
**Reviewed by:** Claude Code (orchestration review)
**Implementation reference:** `docs/superpowers/plans/2026-08-01-ui-polish-batch.md` — **this plan is authoritative. Execute its tasks 1–6 exactly as written, including the TDD steps, exact code, and commit messages.**

---

## Objective

Ship seven small, independent product-polish items that make the site feel more alive and intentional without changing its architecture:

1. **Timeline tooltip copy** — trim the redundant "Later in 2023, " prefix on the H2 2023 milestone note.
2. **Carousel indicator** — the active dot pill **slides** between equal dots instead of morphing in place.
3. **Footer availability dot** — the green dot breathes softly on a ~2.8s cycle (static under reduced motion).
4. **Footer email label** — the mailto link label changes from the bare address to "Email" (href unchanged).
5. **Interest-card hearts** — session-only like/heart on the "Do we have similar interests?" cards.
6. **Contact page** — Email + Social sections replaced by a short **mailto ice-breaker form** (Name, Role, Message, CTA). No email/social link under the form — the footer remains the single home for contact links.
7. **Footer wordmark** — loops an ASCII scribble morph between "Temi Adekunle" and "Chad Bosewick"; reduced-motion / no-JS show the static "Temi Adekunle" wordmark.

## Scope

- `src/content/timeline.ts` — H2 2023 note copy only.
- `src/components/case-study/CarouselImage.tsx` (+ `.test.tsx`) — sliding pill indicator.
- `src/components/layout/Footer.tsx` — availability dot breathe class + email link label.
- `src/styles/globals.css` — `availability-breathe` and `heart-pop` keyframes/classes.
- `src/components/sections/InterestCard.tsx` (+ new `.test.tsx`) — like heart (restructure to sibling controls).
- `src/app/contact/page.tsx` + new `src/components/contact/ContactForm.tsx` (+ `.test.tsx`) — ice-breaker form.
- `src/components/layout/FooterAsciiBrand.tsx` (+ new `.test.tsx`) — ASCII scribble wordmark.

## Out of scope

- No new dependencies. No routing, layout, or content-model changes.
- `TimelineHero` / `useTimelineHero` (the timeline canvas) — only the tooltip *text* changes.
- `FooterAscii` (ambient field), nav, other case-study sections, other pages.
- Palette, typography, spacing tokens, global pause control.
- Contact form **persistence** — no backend, no storage. It composes a `mailto:` draft.
- The repo's pre-existing untracked files (see Guardrails) — leave them untouched.

## Input files to read first

1. `docs/PROJECT_STATE.md` — current status (mandatory start-of-task checklist, AGENTS.md §2)
2. `docs/superpowers/plans/2026-08-01-ui-polish-batch.md` — **the implementation plan. Execute its tasks 1–6 exactly.**
3. `docs/superpowers/specs/2026-08-01-ui-polish-batch-design.md` — approved design intent and decisions.
4. `AGENTS.md` §2–4, §7, §8.2 — execution playbook, validation, report format.
5. Existing test conventions: `src/components/case-study/CarouselImage.test.tsx` (mock `next/image` + `@/hooks/useReducedMotion`).
6. Canvas-ASCII precedent for the wordmark: `src/components/effects/FooterAscii.tsx`, `src/components/effects/TimelineHero.tsx`.

## Technical context

- **Branch:** `foundations` (current). Do not switch branches.
- **Stack:** Next.js 15 static export (`next build` → `out/`, Netlify), React 19, TypeScript, Tailwind 4, `motion/react`. `@` aliases to `src/`. Tests: Vitest (`npm test`).
- **Design tokens:** durations `--duration-fast:150ms / standard:300ms / slow:500ms`; eases `--ease-out`, `--ease-fluid`, `--ease-spring`. Keyframes live in `src/styles/globals.css` inside `@media (prefers-reduced-motion: no-preference)` blocks; reduced-motion overrides live in the sibling `@media (prefers-reduced-motion: reduce)` block.
- **Motion discipline:** every new animation respects `prefers-reduced-motion` (static fallback). Interactive targets stay ≥ 44×44px with visible focus rings. No layout shift (only opacity/transform animates).
- **Contact form:** static export means no backend — submit sets `window.location.href` to a composed `mailto:Addtemi270@gmail.com?...` URL. `buildMailtoUrl` is a pure, exported, testable function.
- **Wordmark:** decorative `aria-hidden`. Reduced-motion / no-JS render the existing static "Temi Adekunle" SVG (byte-for-byte the current output). The canvas effect reuses the project's 15fps rAF + `MAX_DPR = 2` + IntersectionObserver pattern so it stops when the footer is off screen.

## Guardrails (apply to every step)

- **Never stage** `tsconfig.tsbuildinfo`, `next-env.d.ts`, `.superpowers/`, `*.mjs` QA scripts, `temi's cvs/`, `tasks/2026-07-30-codex-feedback-round-1.md`, or the `ascii wordmark footer sample.jpg` — these are pre-existing untracked files outside this task. Stage only the specific files listed in each plan step.
- Do not use `git add -A` or `git add .`. Stage specific files only.
- No silent deviations — if a plan step cannot be delivered as written, stop and report to Claude Code.
- Commit after **each** of the plan's tasks 1–6 with the exact commit messages given in the plan.

## Acceptance criteria

1. **Timeline:** H2 2023 tooltip reads "Completed the Google UX Design Certificate and built my design foundation."; 2024 note unchanged; no other copy changes. `src/content/timeline.test.ts` passes.
2. **Carousel:** dots are equal ellipses; a single `aria-hidden` pill slides (translate, ~500ms ease-fluid) to the active dot; `aria-current` tracks the active slide; 44px targets preserved; reduced-motion renders the pill without sliding. All existing + new `CarouselImage.test.tsx` pass.
3. **Footer:** availability dot breathes ~2.8s (static under reduced motion); link list reads **Email · LinkedIn · Dribbble · Download CV** and "Email" opens the same `mailto:`.
4. **Interest hearts:** 44px heart button top-right, sibling of the card body button; clicking it fills the heart (brand gradient), ticks 0→1, does **not** open the popover; `aria-pressed` toggles; popover still works; reduced-motion fills without the pop. `InterestCard.test.tsx` passes.
5. **Contact:** page shows the ice-breaker form; submit opens a correctly composed `mailto:` draft; character counter caps at 600; availability paragraph remains; Email/Social sections gone; no email/social link under the form. `ContactForm.test.tsx` passes.
6. **Wordmark:** loops "Temi Adekunle" → scribble → "Chad Bosewick" → scribble → back (hold ~2.5s, morph ~1.2s); static "Temi Adekunle" under reduced motion / no-JS; canvas stops when the footer is off screen. `FooterAsciiBrand.test.tsx` passes.
7. `npm run build`, `npx tsc --noEmit`, `npm run lint`, and the full `npm test` suite all pass.

## Validation method

Per AGENTS.md §7 — required for this task:
- `npm run build` / `npx tsc --noEmit` / `npm run lint` / `npm test` all pass (report output).
- Manual browser check at **375px and 1440px** and with **`prefers-reduced-motion` emulation**:
  - Timeline tooltip (hover + auto-advance) — H2 2023 copy.
  - Carousel dots + arrows + keyboard — pill slides; `aria-current` tracks.
  - Footer — dot breathes; wordmark scribbles and pauses when scrolled away; link list.
  - About page — like a card (heart fills, popover unaffected); popover still opens.
  - Contact page — submit composes a mailto draft; no link under the form.
- Reduced-motion: static dot, static "Temi Adekunle" wordmark, pill snaps, heart fills without the pop.

## Definition of Done

- All acceptance criteria satisfied; plan tasks 1–6 committed individually.
- Build, typecheck, lint, and full test suite pass.
- Completion report submitted to Claude Code using the AGENTS.md §8.2 format (Implementation summary, Files changed, Decisions made, Deviations from task, Testing performed, Validation evidence, Known limitations, Preview instructions).
- Claude Code updates `docs/PROJECT_STATE.md`; ChatGPT performs independent QA afterwards.
