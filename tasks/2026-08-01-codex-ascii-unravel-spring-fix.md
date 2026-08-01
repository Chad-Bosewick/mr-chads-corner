# TASK: ASCII Unravel — Anchor-Return Spring Radius Fix

**Task ID:** UNRAVEL-FIX-001
**Date:** 2026-08-01
**Feature:** ASCII field unravel (commit `ad42937`)
**Owner:** Codex (principal engineer)
**Priority:** P2 (minor — imperceptible at current field alpha, but a real deviation from the approved plan)
**Reviewed by:** Claude Code (orchestration review, 2026-08-01)

---

## Objective

Make the anchor-return spring honour the unravel's expanded drift radius, so particles are allowed to disperse as far as the plan intended during the recession.

## Rationale

The approved plan (`docs/superpowers/plans/2026-07-31-ascii-unravel.md`) specifies the return spring should engage only when a particle leaves **`driftRadius * 1.6`** (the *current*, unravel-expanded radius). The implementation instead uses **`particle.maxDrift * 1.6`** (the *base*, un-expanded radius). During the unravel, `driftRadius` grows to up to `maxDrift * 9`, so the spring is pulling particles back toward their anchor far earlier than designed — damping the dispersal to roughly 2/3 of its intended spread.

The feature's acceptance criteria still pass (the field becomes effectively invisible by ~1.15 viewports via the alpha fall, independent of the spread). At the field's 1–4% alpha the visual difference is currently imperceptible, which is why this is P2, not a blocker. It is still a deviation from the approved behaviour and should be corrected for plan fidelity.

## Scope

- **File:** `src/hooks/useAsciiShader.ts` — only the return-spring block (lines ~294–305), one line changed.
- **Out of scope:** nothing else. Do not touch `EditorialHero.tsx`, the test file, or any other behaviour.

## Implementation notes

In `updateParticle`, the return-spring block currently reads:

```ts
/* ── Return spring to anchor (keeps particles from wandering) ── */
const anchorDist = Math.hypot(
  particle.x - particle.anchorX,
  particle.y - particle.anchorY,
);
if (anchorDist > particle.maxDrift * 1.6) {
  const pull = (anchorDist - particle.maxDrift * 1.6) * 0.006 * dt;
  ...
```

Change both `particle.maxDrift * 1.6` references to `driftRadius * 1.6` (the `driftRadius` variable already exists above in the same function and equals `particle.maxDrift * (1 + s * unravelRadius)`).

## Acceptance criteria

1. `src/hooks/useAsciiShader.ts` return-spring threshold and pull use `driftRadius * 1.6`, not `particle.maxDrift * 1.6`.
2. No other file changes.
3. `npm run typecheck` and `npm run lint` pass.
4. Existing helper tests still pass (`npm run test -- useAsciiShader`).

## Validation

- Visual: at the top of the homepage the field should be visually unchanged (s = 0 ⇒ `driftRadius === maxDrift`).
- On scroll, particles' dispersal follows the full unravel radius rather than being clamped early. Given the low alpha, this is a subtle tightening — confirm by inspection of the code diff rather than expecting a dramatic visual change.
- No change to the recession timing, heart gating, mobile tap, or reduced-motion behaviour.

## Definition of Done

- Change applied and committed with a message like `fix: use expanded drift radius for ascii unravel return spring`.
- Typecheck, lint, and the `useAsciiShader` test suite pass.
- Summary returned to Claude Code; Claude Code updates `docs/PROJECT_STATE.md` and the spec/plan to note the deviation is resolved.
