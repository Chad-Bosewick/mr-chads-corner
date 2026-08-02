# CHATGPT QA REVIEW REQUEST

## Review ID

UI-POLISH-QA

## Feature

UI polish batch (7 items) — timeline note copy, carousel active-pill slide, footer availability dot breath, footer email label, interest-card like hearts, contact page mailto ice-breaker form, footer wordmark ASCII scribble

## Review objective

Determine whether each of the 7 items is implemented correctly, matches the approved design intent, behaves well at mobile (375px) and desktop (1440px), respects `prefers-reduced-motion`, and introduces no regressions. Confirm production quality and release readiness.

## Approved requirement

### UI-POLISH-001: UI polish batch (7 items)

**1. H2 2023 timeline note copy**

Trim the redundant date prefix from the H2 2023 timeline milestone. New copy: "Completed the Google UX Design Certificate and built my design foundation."

- Where: homepage timeline (hero) — the sr-only list and the hover/active tooltip.
- Not on `/about-temi` (that timeline is a separate hardcoded component).

**2. Carousel active-pill slides between dots**

The active indicator pill on image carousels slides from its current dot to the newly active dot rather than teleporting.

- `DOT_SPACING=32`, `DOT_PILL_OFFSET=2`; pill translates `activeIndex * 32 + 2` px with `transition-transform duration-[500ms] ease-[var(--ease-fluid)]`.
- Under reduced motion: no transition, no auto-advance.

**3. Footer availability dot breathes ~2.8s**

The availability dot (green, `size-2`) animates a breathing scale on a ~2.8s `ease-in-out` infinite cycle.

- Only when `prefers-reduced-motion: no-preference`.

**4. Footer email link label → "Email"**

The footer email link's visible label is "Email".

**5. Interest-card like hearts (session-only)**

Each interest card has a heart button to like the interest. Session-only — resets on reload. Not a popover toggle.

- 44×44px touch target.
- Accessible: `aria-pressed`, descriptive `aria-label` ("Like this interest: …"), visible state change (fill + colour `#f5f2ee` ↔ `#A43718`).
- Reduced motion: heart-pop animation disabled.

**6. Contact page mailto ice-breaker form**

Replace the contact page Email/Social links with a mailto ice-breaker form. **No Email/Social links under the form.**

- Fields: Name (required), Role (optional), Message (maxLength 600, with counter).
- Composes `mailto:Addtemi270@gmail.com?subject=…&body=…`; opens the visitor's email app.
- Validation messages: "Please add your name." / "Please write a short message."
- Helper: "This opens your email app with your message ready to send."
- Submit button: "Send message".

**7. Footer wordmark ASCII scribble**

The footer wordmark is an ASCII canvas that morphs in a loop between "Temi Adekunle" and "Chad Bosewick".

- Static SVG "Temi Adekunle" under reduced motion and no-JS.
- Motion should be calm, respect the pause control if present, and not be visually loud.
- **Note for reviewers:** a post-QA regression was found and fixed (2026-08-02) — the animation never initialised after reload (blank canvas, wordmark vanished after ~2s). Root cause: the animation effect ran before the canvas mounted and never re-ran (`mounted` missing from deps). Fix + regression test landed in `FooterAsciiBrand.tsx` / `FooterAsciiBrand.test.tsx`; re-verified at 1440px and 375px.
- **Codex iteration (commit `5122ed3`):** on top of the fix, Codex layered three refinements — the static "Temi Adekunle" SVG stays beneath the canvas until its first successful draw (canvas fades in via opacity), a footer already in view draws immediately instead of waiting for the observer, and particles now shuffle their anchors between both names with a mid-transition scatter for a genuine scramble morph. The review below covers the **current committed state** (`5122ed3`).

## Design source

- Spec: `docs/superpowers/specs/2026-08-01-ui-polish-batch-design.md` (approved, commits `599803e`, `9db0b01`)
- Plan: `docs/superpowers/plans/2026-08-01-ui-polish-batch.md` (6 tasks, commit `8160d3a`)
- Task: `tasks/2026-08-01-codex-ui-polish-batch.md`
- Claude Code browser QA evidence: `docs/qa/2026-08-01-ui-polish-batch-claude-qa-report.md`
- Figma file: N/A (owner-directed polish batch from live-site review)

## Environment

- Preview URL: Local dev server (`npm run dev`, `localhost:3000`)
- Routes to test:
  - `/` — homepage (timeline H2 note, carousel pill, interest-card hearts, footer items)
  - `/contact` — mailto ice-breaker form (no Email/Social links under the form)
  - A case-study page with an image carousel (carousel pill)
  - `/about-temi` — confirm experience timeline unaffected
- Device sizes to test: 375px mobile, 768px tablet, 1440px desktop
- Browser: Chrome, Safari, Firefox

## Evidence provided

### Claude Code browser QA (2026-08-01) — all 7 items PASS

Full evidence: `docs/qa/2026-08-01-ui-polish-batch-claude-qa-report.md`

| Item | Desktop (1440px) | Mobile (375px) |
|---|---|---|
| H2 note copy | Trimmed in sr-only + tooltip | — |
| Carousel pill | Slides exactly 32px per dot (2px→34px) | — |
| Availability dot | `animationName` + `2.8s` duration | Same |
| Email label | "Email" | Same |
| Like hearts | 44×44px, toggles `aria-pressed` on/off | Same, no horizontal overflow |
| Mailto form | Structure, counter, validation verified | Form fits 335px, fields ≥44px tall |
| Wordmark | Pixel-hash morph across 4 frames | 104px tall |
| Wordmark (post-fix + Codex `5122ed3`, 2026-08-02) | Canvas sized 1056×240 (1440px) / 375×104 (375px), inline style set, opacity 0→1 on first draw, live draw; static SVG beneath; immediate draw when footer already in view | Same |

Reduced-motion verified deterministically: source guards (`FooterAsciiBrand.tsx:301`, carousel `transition-none` + no auto-advance, `globals.css` `no-preference` scoping) + unit tests asserting both branches. The browse tool exposes no reduced-motion emulation.

### Automated checks (all passed)

- `npx vitest run`: **52/54 tests passing** (12 test files; wordmark-init regression test added 2026-08-02, plus Codex's 4th wordmark test at commit `5122ed3`).
- Focused batch tests all pass: `CarouselImage.test.tsx` (7), `ContactForm.test.tsx` (4), `FooterAsciiBrand.test.tsx` (4, incl. the wordmark-init regression test and the static-wordmark-until-draw test), `InterestCard.test.tsx` (2).
- The 2 failing assertions are in `CoverScroll.test.tsx` (`transform` `""` vs `translateY(0px)`) — **pre-existing, reproduced at pre-batch commit `1507d7b`**, not caused by this batch.

### Files changed (commits `da16c39`→`3831904`)

| File | Change |
|---|---|
| `src/content/timeline.ts` | H2 2023 note copy trimmed |
| `src/components/case-study/CarouselImage.tsx` (+ test) | Active-pill slides between dots; reduced-motion guard |
| `src/components/layout/Footer.tsx` | Availability dot breath class; email link label "Email" |
| `src/components/sections/InterestCard.tsx` (+ test) | Session-only like heart |
| `src/components/contact/ContactForm.tsx` (+ test) | Mailto ice-breaker form; Email/Social links removed from contact page |
| `src/components/layout/FooterAsciiBrand.tsx` (+ test) | Loop ASCII scribble Temi Adekunle ↔ Chad Bosewick; static under reduced motion/no-JS. **Fix (2026-08-02):** animation now initialises after mount (`mounted` added to effect deps + guard); regression test asserts the canvas sizes once mounted. **Codex iteration (commit `5122ed3`):** static SVG stays beneath the canvas until first successful draw (canvas fades in via opacity); footer that is already in view draws immediately (plus observer-based pause/resume); particles shuffle anchors deterministically between both names with a mid-transition scatter. Now 4 focused tests. |
| `src/app/contact/page.tsx` | Wire the form; remove Email/Social links |
| `src/styles/globals.css` | `animate-availability-breathe` (2.8s), `animate-heart-pop`, `no-preference` scoping |

## Review areas

### Primary (must review)

- **1. Timeline note copy:** Is the trimmed copy correct in both the sr-only list and the tooltip? Any duplicate dates left in the timeline?
- **2. Carousel pill:** Does the pill visibly slide between dots (not teleport)? Is the motion smooth and does it settle without overshoot? Does it respect reduced motion?
- **3. Availability dot:** Does it breathe on ~2.8s cycle? Is it visible in footer at mobile and desktop? Disabled under reduced motion?
- **4. Email label:** Footer email link reads "Email".
- **5. Like hearts:**
  - 44×44px touch target at mobile?
  - Toggle works (on/off), session-only (resets on reload)?
  - `aria-pressed` reflects state; `aria-label` descriptive?
  - Does clicking the heart accidentally open the interest popover?
  - Popover toggle independent of heart?
- **6. Mailto form:**
  - Fields, counter, validation messages, helper text, submit button correct?
  - **No Email/Social links under the form** anywhere on `/contact`?
  - Does the composed mailto open correctly with name/role/message?
  - Mobile: fits without horizontal overflow; touch targets ≥44px?
- **7. Wordmark scribble:**
  - Does the ASCII wordmark morph between "Temi Adekunle" and "Chad Bosewick" in a loop?
  - Is the loop calm / not visually loud?
  - Static "Temi Adekunle" under reduced motion and no-JS?
  - No horizontal overflow or layout shift from canvas height at mobile?

### Secondary (review if time allows)

- **Consistency:** Do the 7 changes feel cohesive with the existing design language (typography, restraint, motion purpose)?
- **Contrast:** Heart colour switch `#f5f2ee` ↔ `#A43718` on the card background — sufficient contrast in both states?
- **Focus states:** Do hearts, submit button, and carousel dots have visible focus states?
- **Edge cases:** Rapid heart toggling; long name/role/message in mailto; carousel at very wide viewport; wordmark during tab-switch (background tab).

## Known constraints

- Headless Chrome blocks mailto navigation; the composer was verified via 4 unit tests (`ContactForm.test.tsx`). Please verify mailto opening in a real browser.
- Reduced-motion was verified via source guards + unit tests (no emulation available in the QA tooling). Please confirm visually in a browser with reduced-motion enabled if possible.
- The `CoverScroll.test.tsx` 2 failures are pre-existing (P2), unrelated to this batch.
- The next lint command shows a Next.js deprecation notice; pre-existing project condition.

## Known issues

- **Pre-existing (P2):** `CoverScroll.test.tsx` 2 failing assertions — not caused by this batch.
- **Resolved (2026-08-02):** wordmark animation never initialising after reload (blank canvas). Found after the Claude Code QA pass, root-caused (effect ran before canvas mounted, `mounted` missing from deps), fixed in `FooterAsciiBrand.tsx`, regression-tested, re-verified at 1440px and 375px. **This is the corrected state under review.** No other open defects from the Claude Code browser QA on the 7 items.
- **Codex iteration (commit `5122ed3`):** added after the above; its behavioural refinements and 4th test are under review. Orchestration review of `5122ed3` **passed** (2026-08-02) — diffs match scope, focused tests 4/4, full suite 52/54, typecheck + lint clean, browser re-verified at 1440px and 375px.

## Required response

Return:

1. **pass, conditional pass, or fail** — with rationale
2. **Findings classified by severity** — blocker / critical / major / minor / observation
3. **Evidence and rationale** — for each finding
4. **Required corrections** — if fail or conditional pass
5. **Optional improvements** — observations and suggestions
6. **Retest criteria** — what must be re-verified after corrections
7. **Release recommendation** — whether this batch is ready for deployment
