# ASCII Field Unravel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the site-wide ASCII ambient field disperse as the visitor scrolls — per-particle drift expansion + alpha fall driven by one scroll factor — so the hero is the single living moment and reading zones sit on calm ground; scope the beating heart to the hero element (desktop cursor-follow, mobile tap-to-beat), and remove the accidental center-screen mobile heart.

**Architecture:** All changes live in the existing `useAsciiShader` canvas hook, plus one attribute added to the hero section. Three new pure, unit-tested functions (`computeScrollFactor`, `computeHeartAlpha`, `isInteractiveControl`) carry the decision logic; the canvas draw loop consumes them. No new dependencies, no new production files, no layout/content changes.

**Tech Stack:** Next.js 15 (app router), React 19, TypeScript 5.6, canvas 2D, Vitest + jsdom + Testing Library, Motion (untouched here).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-31-ascii-unravel-design.md` (approved, commit `3bde563`). This plan implements it exactly.
- No new production files, no new dependencies. One new **test** file is a deliberate, justified exception (the repo already co-locates `*.test.ts*` beside sources).
- Only two production files change: `src/hooks/useAsciiShader.ts` and `src/components/sections/EditorialHero.tsx`.
- Palette untouched: `BASE #f5f2ee`, `INK "21,21,21"`, `ACCENT "164,55,24"`, `HEART_START/HEART_END` unchanged.
- `TimelineHero`, `FooterAscii`, `FooterAsciiBrand`, `AnimationProvider`, `useReducedMotion` unchanged.
- Do NOT stage `tsconfig.tsbuildinfo` or the repo's existing untracked files. Stage only the plan's named files per task (`git add <exact paths>`).
- Commit style: conventional, e.g. `feat: ...`, `fix: ...`, `test: ...` (see `git log`).
- `prefers-reduced-motion` and the global pause must behave exactly as today: no rAF, static draw, no tap-heart, no unravel.

---

## File Structure

| File | Responsibility | Change |
|---|---|---|
| `src/hooks/useAsciiShader.ts` | All field/unravel/heart/tap logic + pure helpers | Modify |
| `src/hooks/useAsciiShader.test.ts` | Unit tests for the pure helpers | Create (test-only) |
| `src/components/sections/EditorialHero.tsx` | Hero section — carry `data-hero-band` hook | Modify (one line + attr) |

---

### Task 1: Pure decision helpers + tests

**Files:**
- Modify: `src/hooks/useAsciiShader.ts` — add constants and three exported helpers at module scope (place them in the "Maths helpers" section after `easeOutCubic`, around line 88).
- Create: `src/hooks/useAsciiShader.test.ts`

**Interfaces:**
- Produces (consumed by later tasks):
  - `RECESSION_SCROLL_VIEWPORTS = 1.15`
  - `UNRAVEL_RADIUS = { desktop: 8, mobile: 5 } as const`
  - `TAP_IGNORE_SELECTOR = 'a, button, input, textarea, select, [role="button"], [contenteditable]'`
  - `computeScrollFactor(scrollY: number, viewportH: number, recessionViewports?: number): number`
  - `computeHeartAlpha(heroBottom: number, viewportH: number): number`
  - `isInteractiveControl(target: EventTarget | null): boolean`

- [ ] **Step 1: Add the constants**

After the existing `HEART_END = [164, 55, 24] as const;` line, add:

```ts
const RECESSION_SCROLL_VIEWPORTS = 1.15;
const UNRAVEL_RADIUS = { desktop: 8, mobile: 5 } as const;
const TAP_IGNORE_SELECTOR =
  'a, button, input, textarea, select, [role="button"], [contenteditable]';
```

- [ ] **Step 2: Add the three exported helpers**

After `easeOutCubic` (line ~88), add:

```ts
export function computeScrollFactor(
  scrollY: number,
  viewportH: number,
  recessionViewports = RECESSION_SCROLL_VIEWPORTS,
): number {
  return easeOutCubic(clamp01(scrollY / (viewportH * recessionViewports)));
}

export function computeHeartAlpha(
  heroBottom: number,
  viewportH: number,
): number {
  return clamp01(heroBottom / viewportH);
}

export function isInteractiveControl(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return target.closest(TAP_IGNORE_SELECTOR) !== null;
}
```

(`clamp01` and `easeOutCubic` already exist as module-private functions above this point — reuse them, do not redefine.)

- [ ] **Step 3: Write the failing test file**

Create `src/hooks/useAsciiShader.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  computeScrollFactor,
  computeHeartAlpha,
  isInteractiveControl,
} from "./useAsciiShader";

describe("computeScrollFactor", () => {
  it("returns 0 at the top of the page", () => {
    expect(computeScrollFactor(0, 800, 1.15)).toBe(0);
  });

  it("returns 1 at full recession distance", () => {
    expect(computeScrollFactor(800 * 1.15, 800, 1.15)).toBe(1);
  });

  it("clamps past full recession", () => {
    expect(computeScrollFactor(800 * 2, 800, 1.15)).toBe(1);
  });

  it("is eased — below linear at the midpoint", () => {
    const mid = computeScrollFactor((800 * 1.15) / 2, 800, 1.15);
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(0.5);
  });
});

describe("computeHeartAlpha", () => {
  it("is 1 while the hero bottom is at the viewport top", () => {
    expect(computeHeartAlpha(800, 800)).toBe(1);
  });

  it("is 0 once the hero bottom clears the viewport top", () => {
    expect(computeHeartAlpha(0, 800)).toBe(0);
    expect(computeHeartAlpha(-120, 800)).toBe(0);
  });

  it("scales linearly between", () => {
    expect(computeHeartAlpha(400, 800)).toBe(0.5);
  });
});

describe("isInteractiveControl", () => {
  const make = (html: string) => {
    const el = document.createElement("div");
    el.innerHTML = html;
    return el.firstElementChild as Element;
  };

  it("rejects null and plain elements", () => {
    expect(isInteractiveControl(null)).toBe(false);
    expect(isInteractiveControl(document.createElement("div"))).toBe(false);
  });

  it("matches interactive controls", () => {
    expect(isInteractiveControl(make("<a>link</a>"))).toBe(true);
    expect(isInteractiveControl(make("<button>b</button>"))).toBe(true);
    expect(isInteractiveControl(make("<input />"))).toBe(true);
    expect(isInteractiveControl(make("<textarea />"))).toBe(true);
    expect(isInteractiveControl(make("<select />"))).toBe(true);
    expect(isInteractiveControl(make('<div role="button">x</div>'))).toBe(true);
    expect(isInteractiveControl(make('<div contenteditable="true">x</div>'))).toBe(true);
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npm test -- src/hooks/useAsciiShader.test.ts`
Expected: FAIL — `computeScrollFactor` / `computeHeartAlpha` / `isInteractiveControl` are not exported yet.

- [ ] **Step 5: Add the helpers (Steps 1–2) and re-run**

Run: `npm test -- src/hooks/useAsciiShader.test.ts`
Expected: 8 passing (2 scroll factor, 2+1 heart alpha, 2 interactive-control cases).

- [ ] **Step 6: Verify typecheck + lint, then commit**

```bash
npm run typecheck
npm run lint
git add src/hooks/useAsciiShader.ts src/hooks/useAsciiShader.test.ts
git commit -m "test: add pure helpers for ascii field scroll factor, heart alpha, tap targeting"
```

---

### Task 2: Field unravel in the draw loop

**Files:**
- Modify: `src/hooks/useAsciiShader.ts` — `ShaderState`, `updateParticle`, `draw`, the effect's resize wiring.

**Interfaces:**
- Consumes: `computeScrollFactor` from Task 1, `RECESSION_SCROLL_VIEWPORTS`, `UNRAVEL_RADIUS`.
- Produces: `state.s` (number, computed per tick), used by Task 3/4 gating.

- [ ] **Step 1: Add `s` to `ShaderState` and `prepareCanvas` init**

In the `ShaderState` interface add `s: number;`. In `prepareCanvas`, initialize it: `state.s = 0;` (the field is updated per tick in `draw`).

- [ ] **Step 2: Compute the scroll factor and add the perf fast path in `draw`**

At the very top of `draw` (before `setTransform`), after the existing `const dt = ...` line, add:

```ts
const s = computeScrollFactor(window.scrollY, state.height);
state.s = s;

/* Fast path: fully recessed — canvas is visually identical to the body
   background, so stop drawing entirely. */
if (s > 0.97) {
  context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  context.fillStyle = BASE;
  context.fillRect(0, 0, state.width, state.height);
  return;
}
```

- [ ] **Step 3: Extend `updateParticle` to take the scroll context**

Change the signature from `updateParticle(particle, state, time, dt)` to `updateParticle(particle, state, time, dt, s)`. Inside it:

- Compute the effective drift radius at the top of the function:
  ```ts
  const unravelRadius = state.mobile
    ? UNRAVEL_RADIUS.mobile
    : UNRAVEL_RADIUS.desktop;
  const drift = particle.maxDrift * (1 + s * unravelRadius);
  ```
- Replace every use of `particle.maxDrift` in `targetX` / `targetY` (the two sinusoidal orbital lines, ~line 206–212) with `drift`.
- Replace the anchor-return threshold `particle.maxDrift * 1.6` (the `if (anchorDist > ...)` line, ~247) with `drift * 1.6` so dots do not snap back prematurely mid-unravel.
- Multiply the cursor-pull influence by `(1 - s)` so the pull fades with the field:
  ```ts
  const influence =
    (state.mouse.active ? 1 - smoothstep(0, state.mobile ? 280 : 420, dist) : 0) * (1 - s);
  const mouseInfluence = influence;
  ```

- [ ] **Step 4: Update the call site and per-particle alpha in `draw`**

At the call site (~line 330):

```ts
const { dist, mouseInfluence } = shouldUpdate
  ? updateParticle(particle, state, time, dt, s)
  : {
      dist: Math.hypot(
        state.mouse.x - particle.x,
        state.mouse.y - particle.y,
      ),
      mouseInfluence: 0,
    };
```

Replace the alpha accumulation block (~lines 362–376) so the field fades with `(1 - s)`:

```ts
const fieldBase = 0.016 + breathe * 0.02;
const cursor = nearCursor * 0.035 * heartAlpha;
const heartA = heart > 0.08 && heartAlpha > 0.01 ? heart * heartFrame.boost * heartAlpha : 0;

const alpha = Math.min(
  heart > 0.08 ? (heartFrame.glow > 0.5 ? 0.50 : 0.35) : 0.09,
  (fieldBase + cursor + heartA + mouseInfluence * 0.015 * heartAlpha) * (1 - s),
);
```

`heartAlpha` does not exist yet — add this provisional definition in `draw` just above the heart-frame computation for now (Task 3 replaces it with the hero-band version):

```ts
const heartAlpha = 1;
```

- [ ] **Step 5: Verify and commit**

```bash
npm run typecheck
npm run lint
npm test
git add src/hooks/useAsciiShader.ts
git commit -m "feat: disperse ascii field on scroll with perf fast-path"
```

Note: the visual effect is not unit-testable in jsdom (no canvas 2D). Correctness is covered by Task 1's helper tests plus the manual QA checklist in Task 5.

---

### Task 3: Hero-band heart gating + mobile glow + center-fallback removal

**Files:**
- Modify: `src/hooks/useAsciiShader.ts` — `ShaderState`, `prepareCanvas`, `drawCursorGlow`, `draw`, the effect's listener wiring.
- Modify: `src/components/sections/EditorialHero.tsx` — add `data-hero-band` to the section.

**Interfaces:**
- Consumes: `computeHeartAlpha` from Task 1, `state.s` from Task 2.
- Produces: `state.heroElement`, `state.heroRectBottom`, `state.heartAlpha` (number).

- [ ] **Step 1: Add hero state to `ShaderState` and `prepareCanvas`**

In `ShaderState` add: `heroElement: Element | null;`, `heroRectBottom: number | null;`, `heartAlpha: number;`.
In `prepareCanvas` init: `state.heroElement = null;`, `state.heroRectBottom = null;`, `state.heartAlpha = 0;`.

Change the mouse init (line ~191) to remove the center-screen fallback:

```ts
state.mouse = { x: 0, y: 0, active: false };
```

- [ ] **Step 2: Mark the hero element**

In `EditorialHero.tsx`, on the intro `<section>` (line 51), add the hook:

```tsx
<section className="relative" aria-label="Introduction" data-hero-band>
```

- [ ] **Step 3: Resolve and track the hero rect in the effect**

In the main `useEffect` (after `const state = stateRef.current; let disposed = false;`), add:

```ts
const hero = document.querySelector<HTMLElement>("[data-hero-band]");
state.heroElement = hero ?? null;

const refreshHero = () => {
  state.heroRectBottom = hero ? hero.getBoundingClientRect().bottom : null;
};
refreshHero();
```

Register `scroll` and `resize` refreshes **outside** the reduced-motion gate (heart gating must stay correct even when paused):

```ts
window.addEventListener("scroll", refreshHero, { passive: true });
window.addEventListener("resize", refreshHero);
```

Add matching removals in the cleanup function.

- [ ] **Step 4: Compute `heartAlpha` in `draw` and gate the heart**

Replace the provisional `const heartAlpha = 1;` from Task 2 with:

```ts
const heartAlpha =
  state.heroRectBottom === null
    ? 0
    : computeHeartAlpha(state.heroRectBottom, state.height);
state.heartAlpha = heartAlpha;
```

Gate the heart silhouette block (~lines 341–351): wrap it so it only computes when a heart can appear:

```ts
let heart = 0;
let heartX = 0;
let heartY = 0;
if (heartScale > 0 && heartAlpha > 0.01 && state.mouse.active) {
  heartX = (particle.x - state.mouse.x) / heartScale;
  heartY = (particle.y - state.mouse.y) / heartScale;
  if (heartInside(heartX, heartY)) {
    const edge = 1 - smoothstep(0.02, 0.28, heartCurveDistance(heartX, heartY));
    heart = 0.68 + edge * 0.32;
  }
}
```

- [ ] **Step 5: Remove the mobile glow early-return**

In `drawCursorGlow` (line ~278), change `if (state.mobile || !state.mouse.active) return;` to `if (!state.mouse.active) return;` and multiply the glow/dot alphas by `heartAlpha` (pass `heartAlpha` as a new parameter). This restores the halo during a mobile tap-beat and ties the desktop glow to the hero band.

- [ ] **Step 6: Gate cursor pull on heart availability**

In the draw loop, the `nearCursor` value (from `dist`) should also respect the band — multiply `nearCursor` by `heartAlpha` where it feeds `cursor` (already covered by the `cursor = nearCursor * 0.035 * heartAlpha` line added in Task 2). Confirm that line is present; if `heartAlpha` gates it, the accent halo near the cursor disappears below the hero. No further change needed here.

- [ ] **Step 7: Verify and commit**

```bash
npm run typecheck
npm run lint
npm test
git add src/hooks/useAsciiShader.ts src/components/sections/EditorialHero.tsx
git commit -m "feat: scope beating heart to the hero element and remove center-screen fallback"
```

---

### Task 4: Mobile tap-to-beat

**Files:**
- Modify: `src/hooks/useAsciiShader.ts` — `ShaderState`, new `getTapHeartFrame`, `draw`, effect listener wiring.

**Interfaces:**
- Consumes: `isInteractiveControl` from Task 1, `state.heroElement` / `state.heartAlpha` from Task 3.
- Produces: `state.tapStartedAt` (number | null, seconds on the rAF clock).

- [ ] **Step 1: Add tap state**

In `ShaderState` add `tapStartedAt: number | null;`. In `prepareCanvas` init: `state.tapStartedAt = null;`. In the `stateRef` initial value add `tapStartedAt: null`.

- [ ] **Step 2: Add the one-shot tap frame function**

Near `getHeartFrame` (after it), add:

```ts
function getTapHeartFrame(time: number, start: number): HeartFrame | null {
  const elapsed = time - start;
  if (elapsed < 0 || elapsed > 0.7) return null;
  const attack = easeOutCubic(clamp01(elapsed / 0.14));
  const decay = 1 - clamp01((elapsed - 0.14) / 0.56);
  const beat = attack * decay;
  return { scale: 0.30 + beat * 0.70, boost: 0.01 + beat * 0.39, glow: beat };
}
```

- [ ] **Step 3: Add the tap handler to the effect**

In the reduced-motion-gated block (where `pointermove`/`pointerleave` are added), add:

```ts
const handleTap = (event: PointerEvent) => {
  if (!state.mobile) return;
  if (isInteractiveControl(event.target)) return;
  if (!state.heroElement || !state.heroElement.contains(event.target as Node)) return;
  state.mouse.x = event.clientX;
  state.mouse.y = event.clientY;
  state.mouse.active = true;
  state.tapStartedAt = performance.now() / 1000;
};

window.addEventListener("pointerdown", handleTap, { passive: true });
```

Add the matching `window.removeEventListener("pointerdown", handleTap)` in cleanup.

- [ ] **Step 4: Use the tap frame in `draw`**

Replace the `const heartFrame = getHeartFrame(time, shouldUpdate);` line (currently ~line 320) with:

```ts
let heartFrame: HeartFrame;
if (state.mobile && state.tapStartedAt !== null) {
  const tapFrame = getTapHeartFrame(time, state.tapStartedAt);
  if (tapFrame) {
    heartFrame = tapFrame;
  } else {
    state.tapStartedAt = null;
    state.mouse.active = false;
    heartFrame = getHeartFrame(time, shouldUpdate);
  }
} else {
  heartFrame = getHeartFrame(time, shouldUpdate);
}
```

(The `time` passed into `draw` is `timestamp / 1000` from rAF, so it shares the `performance.now()` clock.)

- [ ] **Step 5: Verify and commit**

```bash
npm run typecheck
npm run lint
npm test
git add src/hooks/useAsciiShader.ts
git commit -m "feat: tap-to-beat heart on mobile within the hero band"
```

---

### Task 5: Verification, docs, manual QA

**Files:**
- Modify: `docs/PROJECT_STATE.md` — note the completed feature under current state / recent work.
- (No production code.)

- [ ] **Step 1: Full automated verification**

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Expected: all pass, build succeeds.

- [ ] **Step 2: Manual QA checklist** (browse the running dev server; mobile via devtools emulation)

- [ ] Desktop, top of homepage: field pixel-identical to before (same density, drift, base `#f5f2ee`); heart follows cursor and beats; glow visible near cursor.
- [ ] Scroll down the homepage: field dots expand their drift and fade; field effectively gone by ~1.15 viewports; heart dissolves as the hero's bottom edge clears the viewport (no pop); cursor inert below the hero (no heart, no glow, no pull).
- [ ] Scroll back up: field reassembles smoothly; heart returns in the hero band.
- [ ] Long page bottom (footer): canvas shows flat `#f5f2ee`; verify no stale particles (fast path).
- [ ] Mobile (375px emulation), hero: NO heart at idle (center-screen heart is gone); tap a non-interactive spot in the hero → heart beats once at the tap point with the glow, then disappears.
- [ ] Mobile: tap the timeline markers / a link / a button in the hero → no heart, normal interaction.
- [ ] Mobile: scroll below the hero → no heart, field recessed.
- [ ] Case-study page (no hero): no heart anywhere; field still unravels on scroll.
- [ ] `prefers-reduced-motion` emulated: static field, no heart, no tap-heart, no unravel; pause control still pauses field + timeline.

- [ ] **Step 3: Update project docs**

Add a short entry to `docs/PROJECT_STATE.md` under the recent-work / current-state section: ASCII field unravel shipped — full recession below the hero, hero-scoped beating heart (desktop cursor-follow / mobile tap-to-beat), center-screen mobile-heart bug fixed, perf fast-path at full recession. Reference the spec path.

- [ ] **Step 4: Commit docs**

```bash
git add docs/PROJECT_STATE.md
git commit -m "docs: record ascii field unravel in project state"
```

---

## Self-review notes

- **Spec coverage:** §5.1 (scroll factor) → Task 2; §5.2 (unravel) → Task 2; §5.3 (hero-element gating, no-hero pages → `heroRectBottom null → heartAlpha 0`) → Task 3; §5.4 (tap-to-beat, broadened ignore, glow restored, dissolves with field) → Tasks 3–4; §5.5 (discovery pulse removed) → no task, correctly absent; §5.6 (perf skip) → Task 2; §5.7 (reduced motion) → gated wiring in Tasks 3–4, unchanged. Acceptance criteria 1–10 map to Task 2/3/4 behavior + Task 5 QA. Knobs §6 → constants in Task 1.
- **Placeholder scan:** every step has concrete code or an explicit command; no TBD/TODO.
- **Type consistency:** `computeScrollFactor`, `computeHeartAlpha`, `isInteractiveControl` signatures match across Tasks 1→4; `state.s`, `state.heroRectBottom`, `state.heartAlpha`, `state.tapStartedAt` names consistent across Tasks 2–4.
