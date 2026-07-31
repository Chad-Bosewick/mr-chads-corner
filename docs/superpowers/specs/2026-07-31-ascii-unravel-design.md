# ASCII Field Unravel — Design Spec

Date: 2026-07-31
Status: Approved — revised per review feedback (2026-07-31)
Branch: `foundations`

## 1. Summary

Borrow the one transferable staging idea from the OpenAI Codex hero — the background is *richest at the hero and recedes near the fold* — and express it in the site's own material: the ASCII ambient field. As the visitor scrolls, the field does not merely fade; it *unravels* — each dot's drift radius expands so the texture visibly lifts away and disperses ahead of the reading zone, while its opacity falls in lockstep. The hero remains the site's single living moment (field + beating heart + career timeline); everything below sits on calm, flat ground.

The "aurora" direction was explicitly rejected (it is the `collection of fashionable gradients` anti-pattern in TASTE.md). The Codex floral-film backdrop itself is not imitated. Only the *staging principle* — "the background gives way" — is stolen, and it is executed in the ASCII material.

## 2. Background

- The site already has a fixed, window-level ASCII ambient field (`src/components/effects/AsciiShader.tsx` → `src/hooks/useAsciiShader.ts`, 15fps canvas, `fixed inset-0 z-0`, warm base `#f5f2ee`).
- The field is currently **uniform wallpaper** at full richness behind every section, including project rows and case-study covers where it competes with the work.
- Inside the field: a slow per-particle orbital drift (radius ~3–11px), a gentle cursor pull, and the **beating ASCII heart** at the cursor (lub-dub double-beat on a 3.2s cycle, scale 0.30→1.00, `·`→`▣`→`■`, warm-orange→terracotta gradient, faint accent halo).
- The hero (`src/components/sections/EditorialHero.tsx`) stacks: entrance animation, cycling greeting label, the auto-advancing `TimelineHero`, and the ASCII heart.
- **Confirmed bug:** on mobile, `pointermove` does not fire reliably, so `state.mouse` stays at its default `{ x: width/2, y: height/2 }` (`useAsciiShader.ts` line 191). The heart renders **pinned to the center of the viewport**, beating forever, following the user down the page — with the accent glow early-returned on mobile (`line 278`), so it has no explanatory halo. Accidental, not designed.

## 3. Decisions (locked)

| # | Decision | Choice |
|---|---|---|
| D1 | Recession depth | **Full recession** — field disperses to near-invisible below the hero; reading zones sit on flat `#f5f2ee` ground |
| D2 | Heart below hero | **Hero-only heart** — the beating heart renders only inside the hero band; below it the cursor is inert |
| D3 | Recession mechanism | **Approach B — the unravel** — per-particle drift expansion + alpha fall driven by one scroll factor (not a plain fade) |
| D4 | Mobile heart | **Tap-to-beat** — tap anywhere in the hero band and the heart beats once at the touch point, then settles; idle mobile shows no heart |
| D5 | Discovery | **No discovery pulse** — the tap stays a quiet, intentional Easter egg (user decision at review). If ever reconsidered: mobile-only, and gated on the mobile hero having settled — the entrance animation is skipped on mobile (`EntranceAnimation.tsx:101`), so it must not key off "after entrance". |

## 4. Motion language (the feel)

- **Hero, top of page:** exactly as today — field at full richness, dots orbiting anchors, heart beating at the cursor (desktop) or on tap (mobile), faint glow. The one living moment.
- **As you descend:** the field disperses. Each dot's effective drift radius expands so it threads outward from its anchor while its alpha falls in lockstep — the texture visibly lifts away and spreads apart ahead of the reading zone.
- **Below the hero:** field dispersed to nothing, cursor inert — no heart, no glow, no cursor pull. Canvas shows flat `#f5f2ee`, identical to the body background, so it visually vanishes.
- **Reversible:** scroll up and the field reassembles. Spring-driven; no drifting state.

## 5. Mechanics (all inside `useAsciiShader.ts`)

### 5.1 The scroll factor

A single factor read inside the existing 15fps tick (no new scroll listener, no new dependency, no new file):

```
scroll = window.scrollY
s = easeOutCubic(clamp01(scroll / (viewportH × RECESSION_SCROLL_VIEWPORTS)))
```

- `RECESSION_SCROLL_VIEWPORTS = 1.15` — field fully gone by ~1.15 viewports of scroll.
- Read per tick; monotonic and clamped, so rubber-band / overscroll are safe.

### 5.2 The unravel

- Effective drift radius: `maxDrift × (1 + s × UNRAVEL_RADIUS)` where `UNRAVEL_RADIUS = 8` desktop, `5` mobile (22px cells → fewer dots, 8× reads sparser faster).
- The anchor-return spring threshold scales with the expanded radius so dots do not snap back prematurely mid-unravel.
- Particle alpha is multiplied by `(1 − s)` in the existing draw alpha accumulation.
- Cursor-pull influence scales to zero with `(1 − s)`.

### 5.3 Heart gating — hero element band

- The hero section carries a stable hook: `data-hero-band` on `<section aria-label="Introduction">` in `EditorialHero.tsx`.
- The hook resolves that element after mount and reads `heroRect.bottom` (viewport coordinates) per tick — cached, and refreshed only when `scrollY` changes or on resize, so `getBoundingClientRect` is not called every frame.
- Heart availability: `heartAlpha = clamp01(heroRect.bottom / viewportH)`. The heart is fully available while the hero is in view, and dissolves smoothly as the hero's bottom edge rises past the viewport top — tied to the actual hero element, not a scroll-distance proxy.
- Below the band (`heroRect.bottom ≤ 0`): no heart, no glow, no cursor pull. Cursor inert.
- On pages without a hero element (e.g. case-study pages), `heartAlpha = 0` permanently — the heart simply never renders there.

### 5.4 Mobile tap-to-beat

- Remove the center-screen fallback entirely — idle mobile shows **no heart** (fixes the accidental center-heart bug).
- A tap (`pointerdown` on touch) whose target is inside the hero element (`data-hero-band` contains the touch target) sets `state.mouse` at the touch point and triggers a one-shot heart beat: single lub-dub peak then decay, using the same heart draw path. Latest tap wins; one heart at a time.
- Taps on interactive controls are ignored — `closest('a, button, input, textarea, select, [role="button"], [contenteditable]')` — so the secret never hijacks navigation or form interaction. Broader than links/buttons to stay future-proof.
- The accent glow renders during the beat (currently early-returned on mobile).
- As the visitor scrolls, any active tap-heart dissolves via the same hero-band fade.

### 5.5 Discovery pulse — REMOVED (D5)

Decision at review: the tap stays a quiet Easter egg. A faint unexplained pulse reads as decorative motion rather than a clear affordance, and the hero already has the entrance, greeting, timeline, and ambient field. If ever reconsidered: mobile-only, gated on the mobile hero having settled (the entrance animation is skipped on mobile — `EntranceAnimation.tsx:101`), never keyed off "after entrance".

### 5.6 Perf

- When `s > 0.97`, skip the particle loop entirely — the canvas is already visually identical to the body background. Invisible to the user, but stops ~thousands of `fillText` calls at the bottom of a long page.

### 5.7 Reduced motion / global pause

- Unchanged: static draw, no `rAF`, no tap-heart, no unravel (static field at reduced richness as today).

## 6. Named tuning knobs

| Knob | Default | Purpose |
|---|---|---|
| `UNRAVEL_RADIUS` | 8 (desktop) / 5 (mobile) | How far dots thread outward as they disperse |
| `RECESSION_SCROLL_VIEWPORTS` | 1.15 | Scroll distance to full field recession |
| Heart/glow gating | — | Not a knob — derives from the hero element's bounds (§5.3) |
| (existing) `MAX_DPR`, `FRAME_INTERVAL`, `CHARS`, `BASE` | unchanged | Untouched |

## 7. In scope / out of scope

**In scope:**
- `useAsciiShader.ts`: scroll factor, unravel, hero-band heart gating, mobile tap-to-beat, center-fallback removal, perf skip.
- `EditorialHero.tsx`: add `data-hero-band` hook to the hero section.
- Minimal touches to `AsciiShader.tsx` only if a touch handler is needed (prefer keeping it in the hook).

**Out of scope (unchanged):**
- Palette (`#f5f2ee`, ink, accent).
- `TimelineHero` / `useTimelineHero` — keeps its own canvas, interaction, pause control.
- Footer ASCII (`FooterAscii`, `FooterAsciiBrand`).
- Global pause control and reduced-motion behavior.
- No new dependencies, no new files, no routing/layout/content changes.

## 8. Edge cases

- Monotonic + clamped scroll factor: rubber-band and iOS overscroll safe, no jitter.
- Resize mid-scroll: `s` recomputed from current scroll; no accumulation.
- Mobile 22px cell grid: lower `UNRAVEL_RADIUS` (5) keeps the dispersal even.
- Heart dissolve at the band edge: eased via `heartAlpha = clamp01(heroRect.bottom / viewportH)` — the heart may be mid-beat when the visitor scrolls; it simply eases out as the hero's bottom edge clears the viewport.
- Tap on any interactive control (incl. timeline markers, links, buttons, form fields): ignored (no heart, no navigation interference).
- `s > 0.97` fast path: canvas cleared to `#f5f2ee` before the skip so it never shows stale particles.
- Reduced motion: all new motion disabled; field static as today.

## 9. Acceptance criteria

1. At `s = 0` (top of page, desktop) the field is **pixel-identical** to today's hero field.
2. Scrolling disperses the field: drift radius visibly expands and alpha falls; field is effectively absent by ~1.15 viewports.
3. No heart, glow, or cursor pull renders below the hero band; no center-screen heart on mobile at idle.
4. Mobile: tapping in the hero band beats the heart once at the touch point; tapping links/buttons/markers does nothing; no heart on idle; no heart below the band.
5. `s > 0.97` skip does not leave stale particles (canvas is clean flat base).
6. Reduced motion: no heart, no tap-heart, no unravel; static draw.
7. Global pause control still pauses the field and timeline.
8. No new dependencies; bundle size effectively unchanged; no layout shift; no change to footer ASCII or timeline.
9. Reading-zone contrast: field absent behind project rows and case-study covers.
10. Case-study pages (no hero): no heart, no glow, no cursor pull — field simply unravels as usual.

## 10. Validation

- Build, type check, lint pass.
- Manual: desktop scroll through a long page (hero → project rows → footer), verify dispersal and reversal; mobile emulation (375px) verify tap-to-beat, no idle heart, no heart below band; `prefers-reduced-motion` emulation; QA per project pipeline (Codex implements, ChatGPT reviews independently).
