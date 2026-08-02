# TASK: UI-POLISH-002 Item 1 fix — pause control observes the wrong footer on the home page

**Task ID:** UI-POLISH-002-FIX-1
**Date:** 2026-08-02
**Feature:** Global pause control visibility — footer target selector
**Owner:** Codex (principal engineer)
**Priority:** P1 (Critical defect)
**Reviewed by:** Claude Code (orchestration review + browser QA)
**Requested quality bar:** one-shot implementation, no back-and-forth

---

## Objective

Fix a defect found in the UI-POLISH-002 item 1 implementation during Claude Code's browser QA. On the **home page**, the global pause button fails to render while the site footer wordmark is in view — the exact effect it is meant to govern.

## Root cause (verified)

`GlobalAnimationPauseControl` (`src/components/providers/AnimationProvider.tsx:55`) watches the footer via:

```ts
const footer = document.querySelector("footer");
```

`querySelector("footer")` returns the **first** `<footer>` in DOM order. The home page renders **two** footer elements:

1. The **testimonial attribution footer** — `TestimonialBlock.tsx:20` (`<footer className="mt-4">`, ~24px tall, contains "Product Lead, previous team collaboratio…"). This is the first `<footer>` and is what the observer watches.
2. The **site footer** — `Footer.tsx:42` (`<footer className="relative z-10 bg-[#0F0F0F] py-16" aria-label="Site footer">`, 723px tall, contains `FooterAsciiBrand` — the wordmark morph the pause button governs).

The observer therefore tracks the 24px testimonial strip instead of the site footer. Browser evidence at 1440×900, Y=3745/3787: observed footer not in view, site footer (wordmark) in view (top=39), pause button absent.

Non-home pages (contact, about-temi) have a single `<footer>` (no `TestimonialBlock`), so the defect is home-page only — but the home page is the primary page for both governed effects (hero field + footer wordmark).

## Change

**`src/components/providers/AnimationProvider.tsx:55`** — target the site footer by its stable, unique attribute instead of the bare selector:

```ts
const footer = document.querySelector('footer[aria-label="Site footer"]');
```

`Footer.tsx:44` already carries `aria-label="Site footer"` — no change needed to the footer markup. (Confirmed the site footer is the only element with that label; the testimonial footer has no `aria-label`.)

**`src/components/providers/AnimationProvider.test.tsx`** — update the fixture so the mock mirrors real site structure. The current fixture renders `<footer />` (no label); if it is left as-is, `querySelector('footer[aria-label="Site footer"]')` finds nothing and the DOM-gating test would break. Change the fixture's footer to `<footer aria-label="Site footer" />`. The `container.querySelector("footer")` in the test still resolves to the same element (it is the only `<footer>` in the fixture).

## Acceptance criteria

1. Home page: pause button renders while `[data-hero-band]` **or** the site footer (`footer[aria-label="Site footer"]`) intersects the viewport; unmounted otherwise — including the bottom of the page where only the site footer (wordmark) is on screen.
2. Non-home pages unchanged (single footer → still works).
3. Existing `computePauseControlVisible` tests and DOM-gating component tests still pass; fixture updated to `<footer aria-label="Site footer" />`.
4. `npm run build`, `npx tsc --noEmit`, `npm run lint`, full `npm test` all pass.

## Guardrails

- **Never stage** `tsconfig.tsbuildinfo`, `next-env.d.ts`, `.superpowers/`, `*.mjs` QA scripts, `temi's cvs/`, `tasks/2026-07-30-codex-feedback-round-1.md`, or `ascii wordmark footer sample.jpg` — pre-existing untracked files outside this task.
- No `git add -A`. Stage only the two files: `src/components/providers/AnimationProvider.tsx` and `src/components/providers/AnimationProvider.test.tsx`.
- No other files. No new dependencies. Do not touch `Footer.tsx`, `TestimonialBlock.tsx`, or any other component.

## Commit message

```
fix: pause control observes the site footer, not the testimonial attribution
```

## Validation method (AGENTS.md §7)

- `npm run build` / `npx tsc --noEmit` / `npm run lint` / `npm test` — all pass (report output).
- Manual browser check at **1440px and 375px** (home page):
  - Scroll to the very bottom. The pause button must be **present** while the site footer (wordmark) is in view, even after the testimonial attribution has scrolled past.
  - Hero still shows the button on load; mid-page still hides it.
  - Contact page: button appears only near the footer (unchanged).

## Definition of Done

- Acceptance criteria satisfied; one commit with the message above.
- Build, typecheck, lint, full test suite pass.
- Completion report to Claude Code in AGENTS.md §8.2 format (Implementation summary, Files changed, Decisions made, Deviations, Testing performed, Validation evidence, Known limitations, Preview instructions).
- Claude Code re-verifies in the browser, then the full UI-POLISH-002 batch goes to ChatGPT for independent QA.
