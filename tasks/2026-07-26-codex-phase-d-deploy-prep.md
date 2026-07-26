# CODEX IMPLEMENTATION TASK

## Task ID

PHASE-D-001

## Title

Remove font mocking system and fix carousel touch targets — prepare for Netlify deployment

## Objective

Remove the font mocking system that disguises macOS system fonts (Arial/Georgia) as the project's brand fonts (Plus Jakarta Sans/Lora), verify the carousel pagination meets WCAG target-size requirements, and ensure the project builds cleanly for Netlify deployment.

## Product context

The Owner needs a live portfolio URL for an urgent job search. The site cannot ship with wrong typography — every page currently renders in Arial instead of Plus Jakarta Sans because of a build-time font interception system. This task unblocks deployment.

## User story

As a portfolio visitor, I need to see the correct brand typography (Plus Jakarta Sans for body, Lora for serif accents) so that the site communicates professional visual quality and design intentionality.

## Scope

- Remove `scripts/google-font-mocks.cjs`
- Remove `scripts/with-font-mocks.cjs`
- Update `package.json` scripts to run `next dev` and `next build` directly (no wrapper)
- Verify `npx next build` succeeds with real Google Fonts self-hosted by Next.js
- Verify `npx vitest run` passes
- Verify `npx tsc --noEmit` passes (after build regenerates `.next/types`)
- Verify carousel dot indicators and arrow buttons have minimum 44×44px touch targets (already appears fixed — confirm and document)

## Out of scope

- Animation pause/stop controls (P1-4) — sprint 2
- Screen-reader timeline alternative (P1-5) — sprint 2
- Deployment to Netlify — Claude Code will handle this after verification
- Any visual redesign or new features
- Changes to the font imports in `src/app/layout.tsx` (they already use `next/font/google` correctly)

## Dependencies

- The `next/font/google` imports in `src/app/layout.tsx` (lines 8, 15) are already correctly configured. The font mocking system is the only thing preventing them from working.
- `package.json` scripts currently route through `scripts/with-font-mocks.cjs` (lines 6-7)

## Design source

- TASTE.md typography direction: Plus Jakarta Sans for body, Lora for serif accents
- The brand fonts are already correctly imported via `next/font/google` in `src/app/layout.tsx`
- The font mocking scripts intercept these imports at build time and return macOS system font paths instead

## Technical context

- Framework: Next.js 15 with static export (`output: "export"`)
- Branch: `foundations`
- Current build command: `node scripts/with-font-mocks.cjs build` (which sets `NEXT_FONT_GOOGLE_MOCKED_RESPONSES` env var)
- The mock system works by creating a Proxy that intercepts Google Fonts CSS requests and returns local font-face declarations pointing to `/System/Library/Fonts/Supplemental/Arial.ttf` and `Georgia Italic.ttf`
- Next.js 15's `next/font/google` self-hosts fonts at build time by downloading them from Google Fonts CDN. The mock prevents this download and substitution.
- On Netlify (Linux), the macOS font paths don't exist, so the build may use fallback fonts or fail silently

## Functional requirements

1. Delete `scripts/google-font-mocks.cjs`
2. Delete `scripts/with-font-mocks.cjs`
3. Update `package.json` scripts:
   - `"dev"`: change from `"node scripts/with-font-mocks.cjs dev"` to `"next dev"`
   - `"build"`: change from `"node scripts/with-font-mocks.cjs build"` to `"next build"`
4. Run `npm install` (no dependency changes expected, but verify)
5. Run `npx next build` — must succeed. The `.next/` output should contain self-hosted font files in `.next/static/media/`
6. Run `npx vitest run` — all tests must pass
7. Run `npx tsc --noEmit` — must pass (run after build to regenerate `.next/types`)
8. Inspect `out/index.html` after build to confirm:
   - Font CSS references self-hosted `.woff2` files (not system fonts)
   - OG/Twitter metadata is present and correct
   - All page content renders

## Visual requirements

1. Plus Jakarta Sans must load as the body font (not Arial)
2. Lora italic must load as the serif accent font (not Georgia)
3. Typography must look identical to the Figma design intent — the current Arial/Georgia rendering is wrong

## Interaction requirements

1. Carousel dot indicators must have minimum 44×44px touch targets
2. Carousel arrow buttons must have minimum 44×44px touch targets
3. Existing keyboard navigation must continue working

## Responsive requirements

1. Typography must render correctly at all breakpoints
2. Carousel controls must be usable on mobile touch devices

## Accessibility requirements

1. WCAG 2.5.8: Target Size — carousel controls must meet minimum 24×24px (aim for 44×44px)
2. Fonts must load for all users (not just macOS)
3. Reduced motion preferences must continue to be respected

## Performance requirements

1. Self-hosted Google Fonts should be within `.next/static/media/` with proper cache headers
2. No additional network requests for fonts (they should be bundled)
3. `font-display: swap` must be preserved (already configured in layout.tsx)

## Likely files affected

- `scripts/google-font-mocks.cjs` — DELETE
- `scripts/with-font-mocks.cjs` — DELETE
- `package.json` — update `scripts.dev` and `scripts.build`

## Verification steps (run in order)

```bash
# 1. Confirm mock files exist before deletion
ls scripts/google-font-mocks.cjs scripts/with-font-mocks.cjs

# 2. After deletion and package.json update, verify build
npx next build

# 3. Verify font files were self-hosted
find .next/static/media -name "*.woff2" | head -5

# 4. Verify tests pass
npx vitest run

# 5. Verify types pass (after build)
npx tsc --noEmit

# 6. Verify built HTML has correct font references
grep -o 'href="[^"]*\.woff2"' out/index.html | head -5

# 7. Verify OG/Twitter metadata still present
grep 'og:title' out/index.html
grep 'twitter:card' out/index.html

# 8. Verify carousel button sizes in source
grep -n 'h-11 w-11' src/components/case-study/CarouselImage.tsx
```

## Acceptance criteria

- [ ] `scripts/google-font-mocks.cjs` is deleted
- [ ] `scripts/with-font-mocks.cjs` is deleted
- [ ] `package.json` scripts run `next dev` and `next build` directly
- [ ] `npx next build` succeeds
- [ ] Self-hosted font files (`.woff2`) exist in `.next/static/media/`
- [ ] `npx vitest run` passes (all tests green)
- [ ] `npx tsc --noEmit` passes
- [ ] Built HTML references self-hosted fonts, not system fonts
- [ ] OG/Twitter metadata renders correctly in built output
- [ ] Carousel buttons confirmed at minimum 44×44px touch targets
- [ ] No visual regression in typography (Plus Jakarta Sans and Lora load correctly)

## Required tests

- Existing test suite must pass unchanged
- Visual verification: open `out/index.html` in browser and confirm Plus Jakarta Sans renders (not Arial)

## Required output

Return:

1. Implementation summary (what was changed and why)
2. Files changed (with before/after for package.json scripts)
3. Important technical decisions (any issues encountered with font self-hosting)
4. Deviations or assumptions (anything that didn't work as expected)
5. Tests performed (build, typecheck, test suite results)
6. Screenshots or preview instructions (how to verify fonts loaded correctly)
7. Known limitations (any remaining issues)
8. Follow-up recommendations (sprint 2 items, deployment notes)
