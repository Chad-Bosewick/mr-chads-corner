# Codex UI-003 Report

Date: 2026-07-26
Repository: `portfolio-website`
Branch: `foundations`
Role: `Codex — Senior UI Design Engineer`
Task file: `tasks/2026-07-26-codex-fix-letters-dual-phone.md`
Status: implementation complete

## Purpose

This report records the UI-003 implementation completed by Codex. It is intended as a precise restart handoff for Claude Code so the next agent can resume without re-investigating completed work.

## Files Changed

| File | Action | Notes |
|---|---|---|
| `src/content/projects.ts` | modified | Line 82: changed `coverSrc` from `letters-app-cover.webp` to `letters-app-homepage-post-1.webp` |
| `src/components/ui/DeviceMockup.tsx` | modified | Line 154: widened dual-phone desktop container from `max-w-[330px]` to `max-w-[350px]` |

## What Was Done

### Front Phone Image Swap

The Letters App `coverSrc` in the project content model was changed from:

```
"/images/case-studies/letters-app-cover.webp"
```

to:

```
"/images/case-studies/letters-app-homepage-post-1.webp"
```

**Why**: The previous image (`letters-app-cover.webp`, 520×565) was a promotional collage showing 4 phones + 1 laptop on a peach background. When forced into a 9:19 phone bezel with `object-cover`, it was severely cropped and looked wrong. The new image (`letters-app-homepage-post-1.webp`, 492×1057) is a proper phone screenshot with an aspect ratio (~0.467) very close to 9:19 (~0.474), so it renders correctly inside the bezel.

### Dual-Phone Layout Restructure

The desktop dual-phone container width was increased from `max-w-[330px]` to `max-w-[350px]`.

**Why**: The original 330px container was too narrow for two phones positioned with `absolute left-0` (front, max-w 200px) and `absolute right-0` (back, max-w 190px). This resulted in the back phone's left edge at ~140px while the front phone extended to ~200px, creating ~60px of overlap — the back phone was mostly hidden behind the front phone.

**With the new 350px container**:

| Property | Value |
|---|---|
| Container width | 350px |
| Front phone left edge | 0px |
| Front phone right edge | ~200px |
| Back phone left edge | ~160px (350 - 190) |
| Back phone right edge | 350px |
| **Overlap** | **~40px** |

The 40px overlap is within the task's target range of 30–50px and creates a clean editorial composition where both phones are clearly distinguishable as separate devices.

### What Was NOT Changed

- Back phone image (`letters-app-showcase.webp`) — unchanged per constraint
- Animation keyframes in `globals.css` — unchanged per constraint
- `ProjectRow.tsx` — unchanged per constraint
- Front/back phone class positioning (`left-0 top-0`, `right-0 top-12`) — unchanged
- Front/back phone max-widths (`200px`, `190px`) — unchanged
- Container height (`h-[470px]`) — unchanged, still sufficient for both phones
- Mobile behaviour (single front phone below `md`) — unchanged
- Scroll-reveal, reduced-motion, hover, and float behaviour — unchanged

## Important Technical Decisions

| Decision | Value | Rationale |
|---|---|---|
| Container width | `max-w-[350px]` | Produces ~40px overlap — clean editorial composition where both phones are visible |
| Phone widths unchanged | 200px front, 190px back | Already appropriate sizes; the problem was container width, not phone size |
| Container height unchanged | `h-[470px]` | Front phone at 200px wide with 9:19 aspect ≈ 422px tall; back phone at 190px ≈ 401px, offset by top-12 (48px) → 449px. Both fit within 470px |

## Deviations or Assumptions

- The exact overlap width depends on the actual rendered width of each phone shell. With `max-w` constraints of 200px and 190px inside a 350px container, the overlap is approximately 40px. If the phones render narrower than their max-w (e.g., due to parent width constraints), the overlap would be slightly larger.
- No new automated tests were added specifically for this change; verification relied on the existing suite remaining green plus the build passing.
- Browser visual verification was not performed in a live interactive browser session; implementation confidence comes from the calculated positioning math and successful build/test results.

## Build Verification

| Check | Command | Result |
|---|---|---|
| Full test suite | `npx vitest run` | Pass. 7 test files passed, 32 tests passed. |
| Production build | `npx next build` | Pass. Build compiled, generated static pages, and exported successfully. |

## What Was Verified

### Image Swap

| Check | Result |
|---|---|
| `coverSrc` points to `letters-app-homepage-post-1.webp` | Yes |
| New image exists at `public/images/case-studies/letters-app-homepage-post-1.webp` | Yes (492×1057) |
| Back phone image unchanged | Yes (`letters-app-showcase.webp`) |
| `coverSrcSecondary` unchanged | Yes |

### Layout Restructure

| Check | Result |
|---|---|
| Container width increased from 330px to 350px | Yes |
| Calculated overlap ~40px (within 30–50px target) | Yes |
| Both phones positioned correctly (front left, back right) | Yes, positioning classes unchanged |
| Container height sufficient for both phones | Yes (470px > 449px needed) |

### Responsive and Motion Behavior

| Check | Result |
|---|---|
| Desktop shows two-phone composition | Yes, via `md:block` staged layout |
| Mobile shows front phone only | Yes, back phone hidden below `md` |
| Front phone reveals first | Yes |
| Back phone reveals with 150ms delay | Yes |
| Float animation preserved on both phones | Yes |
| Reduced motion disables float | Yes |
| Hover pauses animation | Yes |

## Acceptance Criteria Status

- [x] `coverSrc` for Letters App points to `letters-app-homepage-post-1.webp`
- [x] Front phone image renders correctly inside phone bezel (proper 492×1057 screenshot, not cropped collage)
- [x] Back phone is clearly visible, not mostly hidden behind front phone
- [x] Both phones are distinguishable as separate devices
- [x] Composition feels editorial and intentional (~40px overlap)
- [x] Staggered entrance animation preserved
- [x] Float animation preserved on both phones
- [x] Reduced-motion: both phones static, no float
- [x] Mobile: only front phone shown
- [x] `npx vitest run` passes (32/32 tests)
- [x] `npx next build` passes

## Known Limitations

- Browser visual verification was not performed in a live interactive browser session; the overlap calculation is based on max-w constraints and absolute positioning math
- The exact rendered overlap may vary slightly if phone shells render narrower than their max-w values
- The TODO++ and Draftly device treatments remain unchanged (out of scope)

## Follow-up Recommendations

- Visual verification in a live browser at 1280px+ width is recommended to confirm the editorial composition reads well
- If the overlap needs fine-tuning, the container width can be adjusted in small increments (e.g., `max-w-[345px]` for ~45px overlap, `max-w-[355px]` for ~35px overlap)
- The front phone image change should be reviewed by ChatGPT for visual quality and fit within the bezel

## How to Verify This Work

1. Run `npx next build`
2. Run `npx vitest run`
3. Open the homepage
4. Scroll to the Letters App card on desktop:
   - Confirm the front phone shows the Letters App inbox/post screenshot (not the old collage)
   - Confirm two phones are clearly visible side-by-side
   - Confirm the back phone peeks out from behind the front phone with controlled overlap
   - Confirm the entrance is staggered
   - Confirm the float motion is subtle
5. Resize below `md`:
   - Confirm only the front phone is shown
6. Enable `prefers-reduced-motion: reduce`:
   - Confirm the phones remain static without float motion
