# UI-POLISH-002 — Claude Code Browser QA Report

**Date:** 2026-08-02
**Task:** `tasks/2026-08-02-codex-ui-polish-batch-2.md` (UI-POLISH-002)
**Implementer:** Codex (4 commits: `ec3c3e5`, `c324117`, `4c07a0a`, `b4e5173`)
**QA by:** Claude Code (orchestration review, pipeline stage 6)
**Scope:** Browser QA at 1440×900 and 375×812; reduced-motion verified via source guards + unit tests (browse has no reduced-motion emulation).

---

## Result: 3 of 4 items pass; 1 defect found (item 1, home page only)

### Item 1 — Pause control visibility rescope: **FAIL on home page, PASS elsewhere**

Verified against acceptance criterion 1 ("Home page: button renders while `[data-hero-band]` **or** the footer intersects the viewport; unmounted otherwise").

**Home page — defect:** `document.querySelector("footer")` at `AnimationProvider.tsx:55` matches the **first** `<footer>` in the document, which on the home page is the **testimonial attribution footer** (`TestimonialBlock.tsx:20`, 24px tall, `Product Lead, previous team collaboratio…`), **not** the site footer (`Footer.tsx:42`, 723px tall, `bg-[#0F0F0F]`, contains the wordmark morph the pause button governs).

Airtight browser evidence at 1440×900, Y=3745/3787:
- Observed footer (`querySelector("footer")`) = testimonial attribution, h=24px, **not in view**
- Site footer (with wordmark) **in view** (top=39, h=723)
- Pause button **absent**

So when the footer wordmark (the exact governed effect) is on screen, the button is missing. The button instead tracks the 24px testimonial strip, which exits the viewport ~310px before the site footer does. Consequence: the pause button disappears at the very bottom of the home page while the wordmark morph it is meant to control is still animating — a WCAG 2.2.2 regression (the pause control is unavailable exactly when the animated content it governs is in view).

**Root cause:** bare `document.querySelector("footer")`. The site footer is stable and uniquely identifiable via `aria-label="Site footer"` (`Footer.tsx:44`).

**Defect window geometry (home, 1440×900):**
- f1 (testimonial) document top 3453–3477
- f2 (site footer) document top 3784–4507
- Viewport 900px → button renders while f1 intersects (Y ≈ 2553–3477); **f1 exits at Y≈3477 but f2/wordmark remains in view until Y≈3787** — button absent in Y ∈ (3477, 3787].

**Non-home pages — pass:** contact has a single `<footer>` (no TestimonialBlock) → button correctly appears only near the footer (Y=0 false, Y=640 true, Y=1066 true). about-temi confirmed single footer. Home hero works (button present at scroll 0). Pause/resume state persistence is unchanged (component unmounts but context state survives).

**Reduced motion:** `GlobalAnimationPauseControl` returns `null` when `prefersReducedMotion` — verified in source; component test asserts never-renders.

**Item 1 verdict:** defect → queue fix task (see below).

---

### Item 2 — Interest heart affordance: **PASS**

- Heart SVG renders at **24×24** (DOM attrs `width="24" height="24"`), up from 20.
- Like button carries `group` class; SVG has `transition-transform group-hover:scale-110` (gated by `!prefersReducedMotion`).
- Compiled CSS confirmed: `.group-hover\:scale-110:is(:where(.group):hover *) { --tw-scale-x: 110%; … scale: … }` exists under `@media (hover: hover)`.
- 44×44 hit area, `aria-pressed`, gradient fill, popover independence unchanged (source).
- Hover-scale visual could not be captured live (browse daemon instability + CDP mouse dispatch not on allowlist); verified via class presence + compiled rule + unit test asserting `group-hover:scale-110` and its absence under reduced motion.

**Item 2 verdict: pass.**

---

### Item 3 — Contact message-field padding: **PASS**

- Message textarea computed `padding-top: 12px` (`py-3`), 5-row height 146px.
- Name input `padding-top: 0px`, `padding-bottom: 0px` — **unchanged**.
- Role input identical.
- `buildMailtoUrl` and mailto flow untouched.

**Item 3 verdict: pass.**

---

### Item 4 — CTA button system: **PASS**

All three call sites verified to render the shared `buttonVariants`:

| CTA | Radius | Height | Fill | Evidence |
|---|---|---|---|---|
| Send message (contact) | pill (`rounded-full`) | 44px (`min-h-11`) | solid `#151515` | computed radius ≈ 3.36e7px, bg `rgb(21,21,21)` |
| Download CV (about) | pill (`rounded-full`) | 44px (`min-h-11`) | tonal border+tint | radius pill, bg `oklab(…/0.05)` |
| Get in touch (home) | text link | — | accent `#A43718` | radius 0, color `rgb(164,55,24)`, arrow intact |

- Grep confirms no hand-rolled radius/fill literals remain in the three call-site class strings (call-site layout classes like `mt-6` preserved).
- Focus-visible + duration tokens present on all three (source + test).
- Hierarchy now reads from fill, not radius — consistent with the site's pill control language.

**Item 4 verdict: pass.**

---

## Responsive

- **1440×900:** hero button present; mid-page absent; footer behavior per item-1 finding. No overflow.
- **375×812:** no horizontal overflow (`scrollWidth = 375 = viewport`). Hero button appears after initial mount (IntersectionObserver callback fires async); verified present after scroll-trigger. Footer defect window reproduces (both footers in view at bottom on 375 due to shorter viewport).
- Reduced-motion and pause-state persistence verified via source + unit tests (61/63 passing; 2 pre-existing `CoverScroll.test.tsx` failures documented separately).

---

## Defect summary

| Severity | Item | Finding | Fix |
|---|---|---|---|
| **Critical** | 1 | Pause button absent on home page while the site-footer wordmark (its governed effect) is in view — selector `querySelector("footer")` matches the testimonial attribution footer, not the site footer. | Target the site footer with a stable selector: `footer[aria-label="Site footer"]`. |

**Fix scope:** `src/components/providers/AnimationProvider.tsx` (one line) + test fixture in `AnimationProvider.test.tsx` to render `<footer aria-label="Site footer" />` so the mock mirrors the real site structure.

---

## Recommendation

Queue the item-1 fix as a Codex task, then hand the batch to ChatGPT for independent QA (pipeline stage 7). Items 2–4 are ready for ChatGPT review now.
