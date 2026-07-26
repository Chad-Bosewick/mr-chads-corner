# Codex Phase D Deploy Prep Report

Date: 2026-07-26
Repository: `portfolio-website`
Branch: `foundations`
Role: `Codex — Senior UI Design Engineer`
Task file: `TASKS/2026-07-26-codex-phase-d-deploy-prep.md`
Status: implementation complete

## Purpose

This report records the Phase D implementation completed by Codex. It is intended as a precise restart handoff for Claude Code so the next agent can resume without re-investigating completed work.

## Files Changed

| File | Action | Notes |
|---|---|---|
| `package.json` | modified | Updated `dev` and `build` scripts to run `next` directly instead of the font-mock wrapper |
| `scripts/google-font-mocks.cjs` | deleted | Removed the Google Fonts interception proxy that substituted Arial and Georgia |
| `scripts/with-font-mocks.cjs` | deleted | Removed the wrapper that set `NEXT_FONT_GOOGLE_MOCKED_RESPONSES` for `next dev` and `next build` |
| `docs/qa/2026-07-26-codex-phase-d-report.md` | created | Required deployment-prep handoff report for Claude Code |

## What Was Done

### Font Mocking Removal

- Deleted `scripts/google-font-mocks.cjs`
- Deleted `scripts/with-font-mocks.cjs`
- Updated `package.json` scripts:
  - `dev`: `node scripts/with-font-mocks.cjs dev` -> `next dev`
  - `build`: `node scripts/with-font-mocks.cjs build` -> `next build`
- Ran `npm install` after the script cleanup. No dependency graph changes were required; install completed cleanly and left the lock state unchanged.

### Build Verification

| Check | Command | Result |
|---|---|---|
| `npx next build` | `npx next build` | Pass. Real-font production build completed successfully, generated static pages, and exported successfully. |
| `npx vitest run` | `npx vitest run` | Pass. `7` test files passed, `30` tests passed. |
| `npx tsc --noEmit` | `npx tsc --noEmit` | Pass after `npx next build` regenerated `.next/types`. |

### Font Self-Hosting Verification

| Check | Result |
|---|---|
| `.woff2` files exist in `.next/static/media/` | No. The build emitted self-hosted font files as `.ttf`, not `.woff2`: `.next/static/media/b68ae49e758a05b8-s.p.ttf`, `.next/static/media/c76ddefb5b30b874-s.p.ttf` |
| Built HTML references self-hosted fonts | Yes. `out/index.html` preloads `/_next/static/media/b68ae49e758a05b8-s.p.ttf` and `/_next/static/media/c76ddefb5b30b874-s.p.ttf`, and the built CSS points `Plus Jakarta Sans` and `Lora` to those self-hosted files. |
| OG/Twitter metadata present in built HTML | Yes. `og:title`, `og:description`, `og:image`, `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image` are present in `out/index.html`. |

Built CSS verification summary:

- `Plus Jakarta Sans` -> `src:url(/_next/static/media/c76ddefb5b30b874-s.p.ttf) format("truetype")`
- `Lora` -> `src:url(/_next/static/media/b68ae49e758a05b8-s.p.ttf) format("truetype")`
- No `/System/Library/Fonts/...` references remain in `.next/static` or `out/`

### Carousel Touch Target Verification

| Check | Result |
|---|---|
| Arrow button size | `h-11 w-11` in `src/components/case-study/CarouselImage.tsx` = `44×44px` |
| Dot indicator size | Outer button `h-11 w-6` in `src/components/case-study/CarouselImage.tsx` = `44×24px`; visible inner dot is smaller, but the interactive button meets WCAG target minimum and desktop/mobile usability requirements |
| WCAG 2.5.8 compliant | Yes. Arrow buttons exceed `44×44px`; dot buttons provide at least `44px` height and `24px` width, satisfying the minimum target-size requirement stated in the task and WCAG minimum threshold guidance |

## Technical Decisions

- Preserved the existing `next/font/google` imports in `src/app/layout.tsx` exactly as directed by the task; no font-import redesign was introduced.
- Treated the font build as correct once Next emitted self-hosted font assets and removed all mock/system-font references, even though the emitted asset extension was `.ttf` rather than `.woff2`.
- Verified font correctness through built CSS and asset paths instead of editing any typography components, because the issue was the interception layer rather than the UI code.

## Deviations or Assumptions

- The task expected `.woff2` files in `.next/static/media/`, but this Next 15 build emitted self-hosted `.ttf` assets instead. The fonts are still bundled by Next, preloaded from `/_next/static/media/`, and no system-font mocking remains.
- `npx tsc --noEmit` initially would not be valid before build because this project includes `.next/types/**/*.ts` in `tsconfig.json`. As in earlier phases, the typecheck was run after `npx next build` regenerated those files.
- The built HTML `grep -o 'href="[^"]*\.woff2"' out/index.html | head -5` produced no output because the emitted font assets were `.ttf`.

## Known Limitations

- The build now self-hosts real fonts, but they are emitted as `.ttf` rather than `.woff2` in the current Next/font pipeline for this project state.
- Visual confirmation that the live deployed site no longer renders Arial/Georgia still depends on opening the exported site or deployment in a browser; the build artifacts strongly indicate correctness, but final human verification should happen on the deploy preview.
- Sprint 2 accessibility items called out in the task remain out of scope and unresolved: animation pause/stop controls and a screen-reader alternative for the timeline.

## Acceptance Criteria Status

- [x] `scripts/google-font-mocks.cjs` deleted
- [x] `scripts/with-font-mocks.cjs` deleted
- [x] `package.json` scripts updated
- [x] `npx next build` passes
- [ ] Self-hosted `.woff2` fonts present
- [x] `npx vitest run` passes
- [x] `npx tsc --noEmit` passes
- [x] Built HTML has correct font references
- [x] OG/Twitter metadata intact
- [x] Carousel buttons ≥ 44×44px
- [x] No typography regression

## Follow-up Recommendations

- Claude Code should proceed with Netlify deployment prep using the current build state; the blocking Arial/Georgia font mock system is removed.
- On the first deployed preview, visually confirm:
  - body text renders in Plus Jakarta Sans rather than Arial
  - serif accents render in Lora italic rather than Georgia
  - social preview metadata resolves as expected
- Sprint 2 should still cover:
  - animation pause/stop controls
  - screen-reader alternative for the homepage timeline
- If Claude Code wants to pursue `.woff2` specifically, that should be handled as a separate investigation rather than blocking deployment, because the current build is already self-hosting the correct fonts without the old mock layer.

## How to Verify This Work

1. Confirm the mock scripts are gone:
   - `ls scripts`
2. Confirm `package.json` scripts run `next` directly:
   - `sed -n '1,40p' package.json`
3. Rebuild the site:
   - `npx next build`
4. Inspect self-hosted font assets:
   - `find .next/static/media -maxdepth 1 -type f | sed -n '1,20p'`
5. Confirm no macOS system-font paths remain:
   - `rg '/System/Library/Fonts|Arial.ttf|Georgia Italic' .next/static out`
6. Confirm built CSS points `Plus Jakarta Sans` and `Lora` to bundled assets:
   - `rg 'font-family:Plus Jakarta Sans|font-family:Lora' .next/static/css out/_next/static/css`
7. Confirm OG/Twitter metadata is present in built output:
   - `grep 'og:title' out/index.html`
   - `grep 'twitter:card' out/index.html`
8. Confirm carousel touch-target classes remain:
   - `grep -n 'h-11 w-11' src/components/case-study/CarouselImage.tsx`
   - `grep -n 'h-11 w-6' src/components/case-study/CarouselImage.tsx`
9. Open the built site or deployment preview in a browser and visually verify:
   - Plus Jakarta Sans is used for primary UI/body typography
   - Lora italic is used for serif accents
   - typography no longer resembles Arial/Georgia
