# Codex UI-002 Report

Date: 2026-07-26
Repository: `portfolio-website`
Branch: `foundations`
Role: `Codex — Senior UI Design Engineer`
Task file: `tasks/2026-07-26-codex-ui-002-device-bezels.md`
Status: implementation complete

## Purpose

This report records the UI-002 implementation completed by Codex. It is intended as a precise restart handoff for Claude Code so the next agent can resume without re-investigating completed work.

## Files Changed

| File | Action | Notes |
|---|---|---|
| `src/components/ui/DeviceMockup.tsx` | modified | Rebuilt the component to standardize bezels and add the `dual-phone` variant with staggered reveal and subtle float motion |
| `src/components/sections/ProjectRow.tsx` | modified | Extended the row props and `DeviceMockup` call site to support `dual-phone` plus a secondary image source |
| `src/content/projects.ts` | modified | Extended the project model with `coverSrcSecondary`, added `dual-phone` device type, and switched Letters App to the new composition |
| `src/styles/globals.css` | modified | Added `device-float` and `device-float-secondary` keyframes for the dual-phone composition |
| `docs/qa/2026-07-26-codex-ui-002-report.md` | created | Mandatory implementation report |

## What Was Done

### Bezel Standardisation

The old `DeviceMockup` implementation used a heavier frame treatment than `CoverScroll`. That discrepancy has been removed.

| Property | Before | After |
|---|---|---|
| Laptop outer padding | `p-[3px]` | `p-[1.5px]` |
| Laptop outer radius | `rounded-[8px]` | `rounded-[6px]` |
| Laptop inner radius | `rounded-[5px]` | `rounded-[4px]` |
| Laptop hover shadow | `shadow-[0_8px_30px_rgba(21,21,21,0.12)]` only | Added `transition-[box-shadow] duration-[320ms] ease-[var(--ease-fluid)] group-hover:shadow-[0_12px_38px_rgba(21,21,21,0.18)]` to match `CoverScroll` behavior |
| Phone outer padding | `p-[3px]` | `p-[1.5px]` |
| Phone outer radius | `rounded-[24px]` | `rounded-[22px]` |
| Phone screen radius | `rounded-[21px]` | `rounded-[20px]` |

Result:

- Laptop bezels now use the same stroke thickness and corner rhythm as `CoverScroll`
- Phone bezels now use the same refined 1.5px edge treatment
- Hover shadows are aligned across both mockup types

### Dual-Phone Letters App Layout

Added a new `dual-phone` variant to `DeviceMockup` and wired it through the project content model and `ProjectRow`.

Desktop behavior (`md+`):

- Front phone:
  - positioned left and slightly higher
  - `z-10`
  - `max-w-[200px]`
- Back phone:
  - positioned right and lower
  - `z-0`
  - `max-w-[190px]`
- Composition container:
  - `max-w-[330px]`
  - fixed desktop stage height for overlap and depth

Mobile behavior (`< md`):

- Only the front phone is rendered
- The back phone is hidden to avoid crowding the layout

### Motion and Reveal

The dual-phone composition uses the existing scroll-reveal system rather than starting on page mount.

- Entrance trigger:
  - `useScrollReveal` with viewport detection
- Front phone:
  - fades/slides into place first
- Back phone:
  - follows with `150ms` delay
- Continuous motion:
  - front phone uses `device-float`
  - back phone uses `device-float-secondary`
- Reduced motion:
  - disables float animation
  - keeps both desktop phones static once revealed
- Hover:
  - the parent row lift still applies via existing `group-hover:-translate-y-[2px]`
  - float animation is paused on hover via `group-hover:[animation-play-state:paused]`

## Image Asset Status

The task originally specified stand-in imagery for both phone slots. That is no longer fully true.

| Slot | Current file | Current state |
|---|---|---|
| Front phone | `/images/case-studies/letters-app-cover.webp` | Still the existing placeholder image, intentionally left unchanged per Owner instruction |
| Back phone | `/images/case-studies/letters-app-showcase.webp` | Replaced with a Figma export from node `2016:927` in file `Stage 8` |

Current asset dimensions:

| Slot | File | Dimensions |
|---|---|---|
| Front phone | `letters-app-cover.webp` | `520×565` |
| Back phone | `letters-app-showcase.webp` | `375×812` |

Placeholder note for Claude Code:

- The front phone image is still a placeholder awaiting Owner export
- The back phone image is no longer the original placeholder; it has been replaced with a Figma-backed export
- The front/back pair is therefore still not a final matched export set

## Build Verification

| Check | Command | Result |
|---|---|---|
| Full test suite | `npx vitest run` | Pass. `7` test files passed, `32` tests passed. |
| Production build | `npx next build` | Pass. Build compiled, generated static pages, and exported successfully. |
| Diff hygiene | `git diff --check` | Pass before verification run. |

## What Was Verified

### Device Variant Wiring

| Check | Result |
|---|---|
| `device: "dual-phone"` accepted in project model | Yes |
| `ProjectRow` forwards both primary and secondary images | Yes |
| Existing `laptop` and `phone` variants preserved | Yes |
| Letters App entry switched to `dual-phone` | Yes |

### Responsive and Motion Behavior

| Check | Result |
|---|---|
| Desktop shows two-phone composition | Yes, via `md:block` staged layout |
| Mobile shows front phone only | Yes, back phone hidden below `md` |
| Front phone reveals first | Yes |
| Back phone reveals with delay | Yes, `150ms` |
| Float animation present | Yes |
| Reduced motion disables float | Yes |

## Task Prompt Comparison

This section compares the current implementation against the original UI-002 prompt plus the later Owner follow-up about the back-phone export.

| Task prompt item | Implemented result | Status |
|---|---|---|
| Standardize laptop bezels to match CoverScroll | Implemented with `p-[1.5px]`, `rounded-[6px]`, inner `rounded-[4px]` | Complete |
| Standardize phone bezels to thinner 1.5px treatment | Implemented with `p-[1.5px]`, outer `rounded-[22px]`, inner `rounded-[20px]` | Complete |
| Reconcile hover shadows with CoverScroll | Implemented through shared hover shadow treatment in `DeviceMockup` | Complete |
| Add dual-phone editorial layout for Letters App | Implemented inside `DeviceMockup` as `dual-phone` | Complete |
| Front phone enters first, back phone follows after `150ms` | Implemented via staggered transition delay | Complete |
| Add subtle continuous float | Implemented with `device-float` and `device-float-secondary` keyframes | Complete |
| Show only one phone on mobile | Implemented; only front phone renders below `md` | Complete |
| Extend content model for `dual-phone` and second image source | Implemented in `projects.ts` and `ProjectRow.tsx` | Complete |
| Use existing images as stand-ins for Part 3 | Partially superseded: front image remains stand-in, back image was later replaced by Figma export per Owner request | Updated after prompt |
| Keep front phone image unchanged | Preserved | Complete |
| Export supplied Figma node as back phone image | Implemented; exported node `2016:927`, converted to WebP, and replaced `letters-app-showcase.webp` | Complete |

## QA Result

QA was re-run after the back-phone export replacement so the report reflects the current asset state, not just the earlier placeholder-based implementation.

### Automated QA

| Check | Command | Result |
|---|---|---|
| Full test suite | `npx vitest run` | Pass. `7` test files passed, `32` tests passed. |
| Production build | `npx next build` | Pass. Build compiled, generated static pages, and exported successfully. |
| Asset dimensions | `sips -g pixelWidth -g pixelHeight ...` | Pass. Confirmed current front/back image dimensions and asset replacement state. |

### Visual/Structural QA

| QA item | Result |
|---|---|
| Front phone asset unchanged | Yes |
| Back phone asset replaced from Figma export | Yes |
| Dual-phone code path still points to the same back-phone filename | Yes |
| Code/model/layout still support `dual-phone` after asset swap | Yes |
| No new code changes required after asset replacement | Yes |

### QA Conclusion

The UI-002 implementation remains valid after the back-phone export update. The code path, content model, and build output all remain stable. The only remaining content-level gap is that the front phone is still a placeholder and the current front/back images are not yet a final matched export pair from Figma.

## Technical Decisions

- Rebuilt `DeviceMockup` around a shared phone-shell helper so the single-phone and dual-phone variants use the same bezel math and shadow treatment
- Used `useScrollReveal` rather than page-mount state so the editorial stagger is tied to actual viewport entry
- Kept the dual-phone layout inside `DeviceMockup` rather than splitting it into a new component because the difference is still a device-presentation concern, not a new row-level content type
- Chose `max-w-[200px]` for the front phone and `max-w-[190px]` for the back phone so the overlap reads editorial instead of symmetrical

## Deviations or Assumptions

- The original implementation used stand-in imagery for both phone slots, but the later Owner follow-up replaced only the back phone with a Figma export while keeping the front phone unchanged
- No new automated tests were added specifically for `dual-phone`; verification relied on the existing suite remaining green plus the build passing
- Browser visual verification was not performed in a live interactive browser session in this pass; implementation confidence comes from the code path, responsive logic, and successful build/test results

## Known Limitations

- The current Letters App imagery is still not the final intended front/back export pair
- The front phone remains a placeholder asset
- The back phone is now a Figma export, but the two images were not exported as a coordinated pair from the same final content decision
- The TODO++ and Draftly motion/export decisions remain intentionally unresolved, per the task’s out-of-scope note
- The dual-phone editorial composition is currently only used by Letters App; if additional projects need this treatment, they can now reuse the content model and component path

## Acceptance Criteria Status

- [x] DeviceMockup laptop bezel matches CoverScroll: `p-[1.5px] rounded-[6px]` outer
- [x] DeviceMockup phone bezel uses `p-[1.5px]` with adjusted radii
- [x] Hover shadows are consistent across CoverScroll and DeviceMockup
- [x] Letters App card shows two phones in editorial composition on desktop
- [x] Front phone animates in first, back phone follows with delay
- [x] Subtle float animation on both phones
- [x] On mobile, only front phone shown
- [x] `device: "dual-phone"` type works without breaking other cards
- [x] `npx vitest run` passes
- [x] `npx next build` passes

## Follow-up Recommendations

- Claude Code should keep the current `dual-phone` implementation
- Claude Code should treat the back phone as updated from Figma, not as the old placeholder
- Claude Code should only replace the front phone once the Owner provides the intended final export
- The next content-focused follow-up should replace the two Letters App placeholders with:
  - a final hero/landing screen for the front phone
  - a final coordinated supporting screen for the back phone if the Owner wants a matched pair
- TODO++ and Draftly still need separate export-direction decisions before any comparable motion/layout enhancement is applied

## How to Verify This Work

1. Run `npx next build`
2. Run `npx vitest run`
3. Open the homepage
4. Compare the Travecs bezel with TODO++ and Draftly:
   - the laptop stroke thickness should now read the same
   - hover shadow behavior should feel aligned
5. Scroll to the Letters App card on desktop:
   - confirm two phones are shown
   - confirm the back phone sits behind the front phone
   - confirm the entrance is staggered
   - confirm the float motion is subtle
6. Resize below `md`:
   - confirm only the front phone is shown
7. Enable `prefers-reduced-motion: reduce`:
   - confirm the phones remain static without float motion
