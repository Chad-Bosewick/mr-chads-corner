# TASK: Footer Wordmark — Shared Constellation

**Task ID:** FOOTER-CONSTELLATION-001
**Date:** 2026-08-02
**Feature:** Footer wordmark morph — gather-on-arrival + letter-aware morph + shared-constellation instant + global pause integration
**Owner:** Codex (principal engineer)
**Priority:** P1
**Reviewed by:** Claude Code (orchestration review)
**Requested quality bar:** one-shot implementation, ~95% accurate, no back-and-forth

---

## Objective

Evolve `FooterAsciiBrand` from a mechanical name-swap loop into a **narrative signature moment** that completes a system the site already started. The homepage hero's ASCII field **unravels** as you scroll (particles disperse + fade). This footer is built from the same particle medium. Make the footer its **mirror**: the wordmark **gathers itself** from a dispersed field on arrival, and the Temi Adekunle ↔ Chad Bosewick morph passes through a brief **shared-constellation instant** — both names faintly coexist — before the second name dwells. The collaboration the whole site is about, made visible in one gesture.

This task is **purely a rewrite of the implementation inside `src/components/layout/FooterAsciiBrand.tsx` + its test file.** No new dependencies, no routing/layout/content-model changes, no changes to the hero, the static wordmark output, or the reduced-motion fallback.

---

## Current state (read first)

- **`docs/PROJECT_STATE.md`** — mandatory start-of-task checklist, AGENTS.md §2.
- **`docs/superpowers/specs/2026-08-01-ui-polish-batch-design.md`** — item 7's approved design intent (wordmark = decorative `aria-hidden`, static "Temi Adekunle" under reduced motion / no-JS).
- **`src/components/layout/FooterAsciiBrand.tsx`** — current implementation, commit `c40c796` / `5122ed3`. **Read it fully.** Reuse: `VIEWBOX_WIDTH = 1120`, `VIEWBOX_HEIGHT = 340`, `TEXT_WIDTH = 1092`, `CELL = 6`, `PARTICLE_CAP = 720`, `sampleEvenly`, `pairParticleAnchors` (exported — used by tests), the `WordmarkParticle` shape, and the CSS-transition `ParticleWordmark` render. You will extend it, not replace its machinery.
- **`src/components/layout/FooterAsciiBrand.test.tsx`** — 3 existing tests. **They must keep passing** (modify only where this spec explicitly requires, and extend).
- **`src/components/providers/AnimationProvider.tsx`** — global animation pause. Exposes `useAnimationContext()` → `{ isAsciiPaused, toggleAsciiPause }`. The hero's `AsciiShader` consumes `isAsciiPaused`. The footer currently does NOT — **that is a WCAG 2.2.2 defect this task fixes.**
- **`src/hooks/useReducedMotion.ts`** — `useReducedMotion()` hook already used by the footer.
- **`src/hooks/useAsciiShader.ts`** — the hero's dispersal **visual language** (read the constants at lines 6–18 and `updateParticle` ~line 243). Mirror its *feeling*, not its code.

### The two existing bugs/gaps this task must close

1. **Global pause does not stop the wordmark.** The site ships a global "Pause background animation" button that pauses the hero ASCII field but not the footer morph. A user who hits pause still gets an endlessly cycling wordmark. Fix: the morph must respect `isAsciiPaused`.
2. **The morph is meaningless** — a perpetual name swap with no story. This task adds the story (gather + constellation).

---

## Behavior specification (what the user sees)

The wordmark is a **particle field** (sampled from the rendered text, same as today). It has four sequential states, then loops the two-name cycle:

### Phase A — DISPERSED (off-screen / at rest)
- When the footer is out of view, each particle sits at a **dispersed anchor**: its A-anchor (Temi position) offset by a small drift, exactly like the hero's settled field (max drift ≈ `2–5px`, per-particle seeded pseudo-randomly, deterministic).
- Out of view = `IntersectionObserver` not intersecting (same as today's `stop()`).

### Phase B — GATHER (on arrival, ONE SHOT, first entry only)
- When the wordmark scrolls into view: particles travel **from their dispersed anchors to their exact A-anchors** (Temi Adekunle's glyphs), forming the wordmark. This is the precise **inverse of the hero unravel** — the hero disperses on scroll, the footer assembles on arrival.
- Duration: **900ms**, eased `cubic-bezier(0.2, 0, 0, 1)` (the same critically-damped ease the current morph uses).
- After gather, the wordmark **dwells on Temi Adekunle** for **1600ms** (the current `HOLD_MS`).
- **Important:** the gather is only the first time the footer enters view. If the footer leaves and re-enters view, it should NOT re-gather — it resumes the current cycle from where it was (see phase E). Rationale: the gather is a one-time signature moment, not a repeated effect.

### Phase C — MORPH Temi → Chad (the shared-constellation instant)
- Particles travel from their **A-anchors to their B-anchors** (Chad Bosewick's glyphs).
- Duration **680ms** (`MORPH_MS`), same critically-damped ease, right-leading **wave** of **220ms** (`WAVE_MS`) — exactly the current morph.
- **NEW — the constellation instant:** the morph must pass through a brief moment, at ~50% of the morph timeline, where **both names faintly coexist**:
  - Particle **opacity** follows a two-hump curve: full alpha → dips to ≈`0.45` → back to full, with the dip centered at ~50% of the morph. (So neither name is ever fully "gone"; they cross-fade through each other.)
  - This is implemented **per-particle over the CSS transition**, NOT as a second layer of DOM. The current `ParticleWordmark` already animates `transform` and `opacity` on each `<circle>`. You will add the opacity dip into that same transition.
  - **Constraint:** each `<circle>` keeps its single `transition` declaration (one `transitionProperty: "transform, opacity"`). The opacity hump must be expressible within a **single cubic-bezier** easing. This is achievable: `cubic-bezier(0.2, 0, 0, 1)` applied to *both* properties gives the dip naturally when combined with the transition timing (opacity goes 1 → ~0.45 → 1 because the bezier's plateau crosses the midpoint). **If you cannot get the double-hump in a single bezier, ship the next-best: a short `@keyframes` on opacity only** (defined inside the same `@media (prefers-reduced-motion: no-preference)` block pattern used by `src/styles/globals.css`), applied to the `<circle>` element, running only during the morph. The keyframes must not affect the static fallback or the reduced-motion path. Document which you chose and why.

### Phase D — DWELL on Chad
- Chad Bosewick dwells **1600ms**, then the morph runs **Chad → Temi** (same 680ms, same wave, same constellation instant), then dwell on Temi 1600ms, and **cycles forever**.

### Phase E — PAUSE (global pause button, WCAG 2.2.2)
- `useAnimationContext().isAsciiPaused` is consumed. When `true`, the cycle **freezes in place** — timers stop, particles hold exactly where they are (a mid-morph freeze is fine and correct). When `false`, resume exactly from the frozen state.
- The pause must ALSO stop a mid-`requestAnimationFrame`/`setTimeout` state, and the IntersectionObserver visibility logic must still apply while paused (off-screen still stops; on-screen still shows the frozen wordmark). **This is the fix for bug #1.**

### Phase F — REDUCED MOTION / NO-JS (unchanged, non-negotiable)
- Under `prefers-reduced-motion: reduce`: render the **existing static "Temi Adekunle" SVG** — byte-for-byte the current `StaticWordmark` output. No gather, no morph, no pause wiring.
- No-JS: the same static wordmark (server-rendered).

---

## Technical specification

### Files

- `src/components/layout/FooterAsciiBrand.tsx` — the rewrite.
- `src/components/layout/FooterAsciiBrand.test.tsx` — keep the 3 existing tests, add the new ones below.
- **No other files.** The global pause is consumed via `useAnimationContext()` from `@/components/providers/AnimationProvider` — the provider already wraps the app (`src/app/layout.tsx`), so the footer can call the hook directly; **do not edit the provider or layout.**

### Exports to preserve

- `pairParticleAnchors` — keep the exact current signature + behaviour (the existing test asserts it).
- `ParticlePoint` type — keep.

### New constants (use these exact values)

```ts
const GATHER_MS = 900;
const CONSTELLATION_OPACITY = 0.45; // dip depth at ~50% of morph
const DISPERSED_MAX_DRIFT = 5;      // px, per-particle seeded, deterministic
```

Keep the existing `HOLD_MS = 1600`, `MORPH_MS = 680`, `WAVE_MS = 220`, `PARTICLE_CAP = 720`.

### Dispersed anchor generation

Extend the `WordmarkParticle` shape with the dispersed coordinates and a seeded jitter:

```ts
interface WordmarkParticle {
  ax: number; ay: number;      // A-anchor (Temi)
  bx: number; by: number;      // B-anchor (Chad)
  dx: number; dy: number;      // dispersed anchor
  delayMs: number;             // existing right-leading wave delay
}
```

- `dx = ax + seededJitter`, `dy = ay + seededJitter` where jitter is deterministic per-particle in `[-DISPERSED_MAX_DRIFT, DISPERSED_MAX_DRIFT]`. Reuse a small hash (e.g. `fract(sin(...))`) — match the hero's deterministic style — **do NOT use `Math.random()`**; it must be stable across re-renders so the field doesn't jump on the pause/resume re-render.
- Determinism rule: the same name pair → the same dispersed field every render. This is what makes pause/resume and re-entry stable.

### Render strategy (gather + morph)

Extend `ParticleWordmark` to a **3-target** version. The `<circle>` set is the same; the target state changes what each particle's `translate`/`opacity` resolve to.

Suggested shape (you may implement equivalently, but preserve the single-`transition` per circle and the `data-wordmark-particle` / `data-wordmark-target` attributes):

```tsx
type Target = "dispersed" | "a" | "b";
```

- `translate` resolves from current origin (`ax`/`ay` if gathering to A; `ax`→`bx` when morphing A→B; `bx`→`ax` when B→A).
- **Opacity:** when gathering, opacity eases 0 → full (the dispersed field is invisible/speculative; it assembles). When morphing, opacity runs the constellation dip. When dwelling, opacity = full.
- Implementation note on the gather: you can model the dispersed state as the "from" position and A as the "to" position with a `translate(dx-ax, dy-ay)` → `translate(0,0)` transition. Reuse the current `translate(px,py)`-from-`ax,ay` pattern by feeding each circle an origin that is the dispersed anchor during gather and `ax`/`bx` during morph. Keep it simple — the goal is one `<circle>` per particle, CSS-transitioned.

### Cycle scheduling

Replace the current `scheduleMorph` loop with a state machine that handles: `idle → gather → dwellA → morphAtoB → dwellB → morphBtoA → dwellA → …`. Timers:

- First entry: `gather(900) → dwell(1600) → morph(680) → dwell(1600) → morph(680) → …`
- Re-entry (left & returned): **do NOT gather** — pick up the current dwell/morph phase where it left off.
- Track whether the gather has run: a ref/state set once per mount (e.g. `hasGatheredRef`). Reset only on full unmount.

### Pause wiring

- `const { isAsciiPaused } = useAnimationContext();`
- When `isAsciiPaused` flips true: stop the schedule timer, keep the current target (freeze). When false: resume the timer for the remaining phase. Do NOT re-run gather on resume.
- The IntersectionObserver still gates: off-screen while paused = no timers; on-screen while paused = frozen render. `prefersReducedMotion` path returns early and never reads pause.

### Performance / motion discipline (unchanged requirements)

- Still `aria-hidden="true"` on the wrapper (decorative), `role="presentation"` on the SVG.
- Still capped at `PARTICLE_CAP = 720` particles.
- No new dependencies, no rAF loop needed (CSS transitions, same as current). Keep the current "no rAF" approach.
- Only `transform` and `opacity` animate. No layout shift.
- If you use the `@keyframes` fallback for the constellation dip, it must live inside `@media (prefers-reduced-motion: no-preference)` and must not fire during the static fallback.

---

## Tests (Vitest, same conventions as the current file)

Keep the existing 3 tests green. Add:

1. **Gather resolves to the A-wordmark:** render with the current canvas mock; assert that on mount the particles first render at their dispersed translate (`translate(dx-ax, dy-ay)` for some particle), then that the target advances to `a` (`data-wordmark-target="a"`), i.e. the gather transition happens before any morph. Use fake timers if needed.
2. **Pause freezes the cycle:** mock `@/components/providers/AnimationProvider` → `useAnimationContext` returns `{ isAsciiPaused: true, toggleAsciiPause: vi.fn() }`; render; assert `data-wordmark-target` stays `a` and no timer advances the state after dwell would have elapsed (advance fake timers past `HOLD_MS`; assert target unchanged). Then flip the mock to `isAsciiPaused: false`; assert the cycle resumes.
3. **No re-gather on re-entry:** after the first gather, disconnect/re-observe (or unmount the observer mock call) and re-observe; assert the gather phase does NOT restart (target never returns to `dispersed`).
4. **Reduced-motion renders the static wordmark without particles** — already covered by existing test 1; keep it, do not weaken it.

**Do not test the constellation dip's exact pixel timing** (fragile). Assert presence instead: during a morph, the circle's opacity transition exists and the target flips to `b`.

---

## Acceptance criteria

1. Global pause button now freezes the footer wordmark; resume continues from the frozen point. Verified via the mock test above + manual browser check (see Validation).
2. First scroll into view: the field gathers into Temi Adekunle (900ms), dwells, morphs to Chad Bosewick (680ms + wave) through a faint shared-constellation instant, dwells, and cycles. Re-entry does not re-gather.
3. Reduced motion: byte-for-byte static "Temi Adekunle" (existing test). No-JS: same.
4. `data-wordmark-particle`, `data-wordmark-target`, `pairParticleAnchors`, `ParticlePoint` unchanged/compatible; `sampleEvenly` reused.
5. All existing 3 tests + 4 new tests pass; `npm run build`, `npx tsc --noEmit`, `npm run lint`, full `npm test` suite pass.
6. No new dependencies. No edits outside the two listed files. No `git add -A`.

---

## Validation method (AGENTS.md §7)

- `npm run build` / `npx tsc --noEmit` / `npm run lint` / `npm test` — all pass (report output).
- Manual browser check at **1440px and 375px**:
  - Fresh load at the footer scrolled into view → gather once, then cycle.
  - Scroll away and back → no re-gather, cycle resumes.
  - Click the floating pause button → wordmark freezes mid-state; click resume → continues. **Confirm the hero ASCII field also pauses (unchanged behaviour) and the footer now matches it.**
- `prefers-reduced-motion` emulation → static "Temi Adekunle".
- No horizontal overflow; touch targets ≥ 44px; footer height unchanged (`h-[clamp(6.5rem,21vw,15rem)]`).

## Definition of Done

- All acceptance criteria satisfied; changes committed as ONE commit with message `feat: gather-and-morph footer wordmark through a shared constellation`.
- Build, typecheck, lint, full test suite pass.
- Completion report to Claude Code in AGENTS.md §8.2 format, explicitly stating:
  - Whether the constellation dip shipped via single-bezier or the `@keyframes` fallback, and why.
  - How the gather/pause/re-entry state machine is structured (brief).
  - Confirmation the static reduced-motion fallback is byte-for-byte unchanged.
- Claude Code updates `docs/PROJECT_STATE.md`; ChatGPT performs independent QA afterwards.
