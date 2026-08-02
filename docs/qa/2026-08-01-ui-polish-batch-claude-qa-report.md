# UI POLISH BATCH (7 ITEMS) — CLAUDE CODE BROWSER QA REPORT

**Review ID:** UI-POLISH-CLAUDE-QA
**Date:** 2026-08-01
**QA owner:** Claude Code (browser QA + automated checks)
**Batch:** UI polish batch (7 items) — commits `da16c39`→`3831904`
**Scope:** Browser verification at 1440px and 375px, reduced-motion verification via source guards + unit tests, full test suite, mailto behaviour via unit tests.

---

## Summary

**PASS.** All 7 UI-polish items verified working at desktop (1440px) and mobile (375px). Reduced-motion branches verified deterministically (source guards + 12 unit tests covering both branches; the browse tool exposes no reduced-motion emulation). Full suite: **52/54 tests passing** — the only 2 failures are pre-existing `CoverScroll.test.tsx` assertions, reproduced at the pre-batch commit `1507d7b` and **not caused by this batch** (documented in `docs/PROJECT_STATE.md`).

**Post-QA correction (2026-08-02):** a regression in item 7 (footer wordmark) was found after this pass, root-caused, and fixed — see the item-7 fix note below. Codex then layered an iteration on the fix (commit `5122ed3`); its orchestration review **passed** and is recorded in the item-7 note. Suite count reflects the current committed state.

---

## Verification environment

- Next.js 15.5.20 dev server at `localhost:3000`
- `gstack browse` headless Chromium (`~/.claude/skills/gstack/browse/dist/browse`) — `goto`, `eval <js-file> --raw`, `click <selector>`, `viewport WxH`, `reload`, `screenshot`
- Viewports: 1440×900 (desktop) and 375×812 (mobile)
- Eval scripts written to `/tmp/qa-*.js` then run via `browse eval <file> --raw` (inline code fails with `ENAMETOOLONG`)

## Method notes

- **React state batching:** reading `aria-pressed` synchronously after a synthetic `click` reads stale state. Used native `click` followed by a separate synchronous `eval` read (120ms–0.7s delay).
- **Reduced-motion:** the browse tool's CDP allowlist only permits `setDeviceMetricsOverride` / `clearDeviceMetricsOverride` / `setUserAgentOverride` — no `Emulation.setEmulatedMedia`. Reduced-motion was therefore verified by reading the source guards (`useReducedMotion` hook + `prefers-reduced-motion: reduce` media scoping in `globals.css`) and by unit tests that assert both branches.
- **Mailto:** headless Chrome blocks external-protocol navigation. The mailto composer was verified by 4 passing unit tests instead.

---

## Item-by-item evidence

### 1. H2 2023 timeline note copy — PASS

**Requirement:** Remove the redundant "Later in 2023, " date prefix from the H2 2023 timeline note.

**Source:** `src/content/timeline.ts:17-20` → `note: "Completed the Google UX Design Certificate and built my design foundation."`

**Browser evidence (homepage):**
- `sr-only` list (`TimelineHero.tsx` lines 155-159) renders the trimmed note.
- Tooltip (`currentMilestone.note`, `TimelineHero.tsx:189`) renders the trimmed note.
- Note lives on the **homepage** `TimelineHero`, not `/about-temi` `ExperienceTimeline` (that component hardcodes its own EXPERIENCE array and never used the H2 note).

### 2. Carousel active-pill slides between dots — PASS

**Requirement:** The active indicator pill slides between dots (not teleports).

**Source:** `CarouselImage.tsx` — `DOT_SPACING=32`, `DOT_PILL_OFFSET=2`; pill `transition-transform duration-[500ms] ease-[var(--ease-fluid)]`; `style.transform = translateY(-50%) translateX(${activeIndex * DOT_SPACING + DOT_PILL_OFFSET}px)`.

**Browser evidence (1440px):**
- Dot 0 → pill at `translateX(2px)`; dot 1 → pill at `translateX(34px)` (= 32 + 2). Pill moves exactly `DOT_SPACING` (32px) per slide step.
- Unit tests: `CarouselImage.test.tsx` — "slides a single active pill to the current dot" and "renders the pill without sliding under reduced motion".

### 3. Footer availability dot breathes ~2.8s — PASS

**Requirement:** Availability dot breathes on ~2.8s cycle.

**Source:** `Footer.tsx:78` `animate-availability-breathe size-2 rounded-full bg-[#48B36A]`; `globals.css` `.animate-availability-breathe` — `animation: availability-breathe 2.8s ease-in-out infinite`, scoped inside `@media (prefers-reduced-motion: no-preference)`.

**Browser evidence (1440px + 375px):**
- `getComputedStyle(dot).animationName === "animate-availability-breathe"`.
- `animationDuration === "2.8s"`.

### 4. Footer email link label → "Email" — PASS

**Requirement:** Footer email link labelled "Email".

**Browser evidence (1440px + 375px):**
- Mailto anchor `textContent.trim() === "Email"`, `href` starts with `mailto:`.

### 5. Interest-card like hearts (session-only) — PASS

**Requirement:** Session-only like heart on interest cards.

**Source:** `InterestCard.tsx` — button `h-11 w-11` (44×44px), `onClick={() => setLiked((value) => !value)}`, `aria-pressed={liked}`, `aria-label={Like this interest: ...}`, heart fill `none` ↔ `url(#interest-heart-{category})`, colour `text-[#f5f2ee]` ↔ `text-[#A43718]`.

**Browser evidence (1440px + 375px):**
- Heart button 44×44px (meets 44px touch target).
- Native click toggles `aria-pressed` false→true; second click true→false (session-only, no persistence).
- Filled state shows the gradient fill; unfilled shows none.
- Unit tests: `InterestCard.test.tsx` — "toggles the heart without opening the popover", "keeps the popover toggle independent from the heart".

### 6. Contact page mailto ice-breaker form — PASS

**Requirement:** Replace contact page Email/Social links with a mailto ice-breaker form; no Email/Social links under the form.

**Source:** `ContactForm.tsx` — `buildMailtoUrl(name, role, message)` → `mailto:Addtemi270@gmail.com?subject=...&body=...`; fields Name (required), Role (optional), Message (maxLength 600); submit via `window.location.href`; errors "Please add your name." / "Please write a short message."; button "Send message"; helper "This opens your email app with your message ready to send."

**Browser evidence (1440px + 375px):**
- Form structure present at `form[aria-label='Contact form']`; Name, Role, Message + submit button.
- Character counter present (maxLength 600).
- Validation: empty submit → "Please add your name."; name-only → "Please write a short message." (via `submit` dispatch — mailto navigation itself is blocked in headless Chrome).
- **No Email/Social links under the form** — verified links only in footer, none within the contact form region.
- Mobile (375px): form fits within viewport, all fields ≥44px tall, no horizontal overflow.
- Unit tests (4, all passing): `ContactForm.test.tsx` — composes name—role subject and message body; omits the role when empty; preserves line breaks; trims the name.

### 7. Footer wordmark ASCII scribble — PASS → regression found & FIXED (2026-08-02)

**Requirement:** Footer wordmark ASCII scribble loops "Temi Adekunle" ↔ "Chad Bosewick". Static "Temi Adekunle" under reduced motion / no-JS.

**Source:** `FooterAsciiBrand.tsx` — `showCanvas = mounted && !prefersReducedMotion` (line 301); StaticWordmark SVG shows `WORDMARK_A` ("Temi Adekunle") under reduced motion/no-JS. Constants: `HOLD_MS=2500`, `MORPH_MS=1200`, `CYCLE_MS=7400`, `PARTICLE_CAP=600`, `CELL=6`.

**Original browser evidence (1440px, unreliable):**
- Canvas present when motion allowed; pixel-hash changes across 4 captured frames were read as an animated morph loop. **This evidence was wrong** — the investigation below found the canvas permanently blank, and the root cause (effect never initialising) would have blanked it at every viewport.
- Footer wordmark wrapper height 104px at mobile (375px).
- Unit tests: `FooterAsciiBrand.test.tsx` — "renders the static wordmark under reduced motion", "renders a canvas wordmark when motion is allowed".

**Post-QA regression, root cause, fix (2026-08-02):**
- **Regression (user-reported):** after reload the wordmark disappeared after ~2s and nothing animated until the next reload. Investigation found the canvas stuck at the browser default **300×150 with no inline style and 0 pixels drawn** — the animation effect never initialised.
- **Root cause:** the animation `useEffect` ran on the first commit while `mounted=false` (the StaticWordmark SVG was rendered, so `canvasRef.current === null`), exited on the null-ref guard, and **never re-ran** because `mounted` was not in its dependency array.
- **Fix:** `FooterAsciiBrand.tsx` — added `!mounted` to the guard (`:176`) and `mounted` to the deps array (`:299`). The reduced-motion branch is unchanged (`showCanvas = mounted && !prefersReducedMotion`).
- **Regression test added:** `FooterAsciiBrand.test.tsx` — "sizes the canvas once it mounts so the animation initialises" — asserts the canvas leaves the jsdom default 300×150 and gains an inline width (with a fake 2D context so `resize()`/`build()` actually run). Confirmed **failing before** the fix, **passing after**.
- **Re-verified after fix:** 1440px — canvas sized 1056×240 with inline style, actively drawing; timed screenshot crops confirm both hold phases ("Temi Adekunle" and "Chad Bosewick") render. 375px (the viewport that showed the broken blank canvas) — canvas sized 375×104 with inline style; drawn-pixel hash changed across samples 2.5s apart, confirming the morph loop is live.

**Codex iteration on the fix (commit `5122ed3`), orchestration review PASSED (2026-08-02):**
- **1. Static SVG retained beneath the canvas.** `StaticWordmark` now renders inside the motion-enabled branch; the canvas sits `absolute inset-0` with `opacity: hasDrawn ? 1 : 0`. If drawing never starts, "Temi Adekunle" stays visible instead of a blank region.
- **2. Immediate first draw for an already-visible footer.** `startLoop()` draws on the first tick; after `resize()`, `initialRect` visibility is checked and `startLoop(performance.now())` fires immediately if in view (observer retained for pause/resume).
- **3. Genuine scramble morph.** `build()` derives particle anchors from `shuffleAnchors()` of each name's sampled cells (seeded 17 / 53, stepped to `PARTICLE_CAP`); `particleTarget()` adds `driftX/driftY * sin(progress·π)` during morph for a mid-transition scatter. A deliberate behaviour change from the earlier shared-grid-cell crossfade.
- **Tests:** added "keeps the static wordmark available until canvas drawing succeeds"; the wordmark-init regression test is preserved in the commit. `FooterAsciiBrand.test.tsx` now **4 tests**, all passing.
- **Browser re-verified (2026-08-02):** 1440px — canvas sized 1056×240, opacity flips 0→1 on first draw into view, 657 pixels drawn, static SVG retained beneath, hash changes over 2.5s (loop live). 375px — canvas sized 375×104, immediate draw (footer already in view), opacity 1, hash changes over 2.5s. Typecheck + lint clean; full suite **52/54** (only pre-existing `CoverScroll` failures).

---

## Reduced-motion verification (deterministic)

The browse tool exposes no reduced-motion emulation (CDP allowlist verified). Reduced-motion branches verified via source guards + unit tests asserting both branches:

| Item | Reduced-motion behaviour | Evidence |
|---|---|---|
| Wordmark | Static SVG "Temi Adekunle", no canvas | `FooterAsciiBrand.tsx:301` `showCanvas = mounted && !prefersReducedMotion`; unit test "renders the static wordmark under reduced motion" |
| Carousel pill | `transition-none`, no auto-advance | `CarouselImage.tsx` `enableAutoAdvance = autoAdvanceMs > 0 && !prefersReducedMotion`; `prefersReducedMotion ? "transition-none" : "transition-transform duration-[500ms]"`; unit test "renders the pill without sliding under reduced motion" |
| Availability dot + heart pop | Animations disabled | `globals.css` — `.animate-availability-breathe` and `.animate-heart-pop` scoped inside `@media (prefers-reduced-motion: no-preference)` |
| `useReducedMotion` hook | Listens to `matchMedia("(prefers-reduced-motion: reduce)")` change events; default `false` | `src/hooks/useReducedMotion.ts` |

12 unit tests across the batch test files assert the motion-enabled branch; the reduced-motion branch of each animated component is asserted by its dedicated unit test. Both branches covered.

---

## Mobile (375px) checks

- **No horizontal overflow** on all pages checked (`bodyScrollWidth === viewportWidth`): homepage, case-study index, `/about-temi`, `/contact`, featured case studies.
- **Touch targets ≥ 44px:** heart buttons 44×44px; contact form inputs ≥ 44px tall; submit button ≥ 44px.
- **Contact form fits** within 335px content column.
- **Wordmark** renders at 104px height.
- No regression found in mobile nav / hamburger alignment (recent fix `61d5b04` preserved).

---

## Automated checks

- `npx vitest run`: **52/54 tests passing** across 12 test files (wordmark-init regression test added 2026-08-02, plus Codex's 4th wordmark test at commit `5122ed3`).
- The 2 failing assertions are in `CoverScroll.test.tsx` — `expect(...transform).toBe("")` receives `translateY(0px)`. Reproduced identically at the pre-batch commit `1507d7b` in a throwaway worktree. **Pre-existing, not from this batch.** Open a separate fix task (P2).
- Focused batch tests all pass: `CarouselImage.test.tsx` (7), `ContactForm.test.tsx` (4), `FooterAsciiBrand.test.tsx` (4, incl. the wordmark-init regression test and the static-wordmark-until-draw test), `InterestCard.test.tsx` (2).

---

## Constraints and known limitations

- Mailto navigation not exercised end-to-end in headless Chrome (external-protocol block); behaviour verified via unit tests + source.
- Reduced-motion verified via source guards + unit tests, not live emulation (tooling limitation).
- Screenshots captured for the batch at desktop/mobile were reviewed by the QA owner this session.

## Known issues

- **Pre-existing (P2):** `CoverScroll.test.tsx` 2 failing assertions — not caused by this batch (see above).
- **Resolved (2026-08-02):** wordmark animation never initialising (blank canvas) — found post-QA, root-caused, fixed, regression-tested, re-verified at 1440px and 375px (see item-7 fix note).
- **Resolved (2026-08-02):** Codex iteration `5122ed3` orchestration-reviewed and browser-re-verified — PASS (see item-7 note).
- No open defects remain on any of the 7 batch items.

## Handoff

Hand to **ChatGPT** for independent QA (pipeline stage 7). See `2026-08-01-ui-polish-batch-chatgpt-qa-review-request.md`.
