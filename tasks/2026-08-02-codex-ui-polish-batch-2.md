# TASK: UI Polish Batch 2 — pause rescope · heart affordance · textarea padding · CTA system

**Task ID:** UI-POLISH-002
**Date:** 2026-08-02
**Feature:** Global pause control visibility · interest-card heart size · contact message-field padding · shared CTA button variants
**Owner:** Codex (principal engineer)
**Priority:** P1
**Reviewed by:** Claude Code (orchestration review)
**Requested quality bar:** one-shot implementation, ~95% accurate, no back-and-forth

---

## Objective

Ship four small, independent polish items surfaced from a QA review of the localhost site. None changes architecture. Each item closes a real gap:

1. **Pause control rescope** — the global "pause background animation" button renders on every page at all times, but it only governs effects that are actually prominent in two places: the home hero ASCII field (heart + ambient field, hero-scoped, recesses after ~1 viewport of scroll) and the footer wordmark morph. Everywhere else it pauses nothing visible and reads as dead weight. Rescope its *visibility* to exactly those moments.
2. **Interest heart affordance** — the 44px like-button hit area is already WCAG-compliant; the 20px heart icon inside it reads small and delicate. Enlarge it.
3. **Contact message-field padding** — the 5-row message textarea has no vertical padding, so the placeholder hugs the top frame edge. Fix **only** the message field, not the single-line inputs.
4. **CTA button system** — three hand-rolled CTA treatments (text link / solid pill / squared tonal) with no shared token. Different fills should signal hierarchy; different *radii* read as "different design systems." Unify radius, keep hierarchy in fill.

---

## Scope

- `src/components/providers/AnimationProvider.tsx` (+ new `src/components/providers/AnimationProvider.test.tsx`) — pause-control visibility gating.
- `src/components/sections/InterestCard.tsx` (+ extend `src/components/sections/InterestCard.test.tsx`) — heart icon 24px + hover scale.
- `src/components/contact/ContactForm.tsx` (+ extend `src/components/contact/ContactForm.test.tsx`) — message textarea `py-3`.
- New `src/components/ui/buttonVariants.ts` (+ new `src/components/ui/buttonVariants.test.ts`) — shared CTA class map.
- `src/components/contact/ContactForm.tsx`, `src/app/about-temi/page.tsx`, `src/app/page.tsx` — consume the shared variants.

## Out of scope

- **No new dependencies.** No routing, layout, content-model, or palette changes.
- Removing the global pause button, or changing **what** it governs (hero field + footer wordmark stay as-is). Only *when it is rendered* changes.
- The case-study cover's own local pause buttons (`CoverScroll.tsx`) — those are separate controls, untouched.
- Contact form persistence, `buildMailtoUrl` behaviour, the mailto target address — unchanged.
- Any change to single-line inputs' height or padding.
- The repo's pre-existing untracked files (see Guardrails) — leave them untouched.

## Input files to read first

1. `docs/PROJECT_STATE.md` — current status (mandatory start-of-task checklist, AGENTS.md §2)
2. `AGENTS.md` §2–4, §7, §8.2 — execution playbook, validation, report format.
3. `src/components/providers/AnimationProvider.tsx` — the global pause provider + control. **Read fully.**
4. `src/hooks/useAsciiShader.ts` — confirm the hero-field scoping (`computeHeartAlpha` ~line 106, `computeScrollFactor` ~line 98, `draw` early-return at `s > 0.97` ~line 370).
5. `src/components/sections/EditorialHero.tsx:51` — the `[data-hero-band]` marker the shader already queries.
6. `src/components/layout/FooterAsciiBrand.tsx:387` — the footer wordmark's existing `isAsciiPaused` consumption.
7. `src/components/sections/InterestCard.tsx` — like heart (lines 100–126).
8. `src/components/contact/ContactForm.tsx` — `fieldClass` (line 13) + textarea (line 93).
9. `src/app/page.tsx:104–124`, `src/app/about-temi/page.tsx:100–112` — the home and about CTAs.

## Technical context

- **Branch:** `foundations` (current). Do not switch branches.
- **Stack:** Next.js 15 static export (`next build` → `out/`, Netlify), React 19, TypeScript, Tailwind 4. `@` aliases to `src/`. Tests: Vitest (`npm test`).
- **Design tokens:** durations `--duration-fast:150ms / standard:300ms / slow:500ms`; eases `--ease-out`, `--ease-fluid`, `--ease-spring`. Motion must respect `prefers-reduced-motion`. Interactive targets stay ≥ 44×44px with visible focus rings. No layout shift (only opacity/transform animate).
- **Pause state:** lives in `AnimationProvider` context (`isAsciiPaused`). It must survive the button unmounting/remounting. `AsciiShader` (hero) and `FooterAsciiBrand` (wordmark) already consume it — untouched.
- **Client navigation:** the control is mounted once in `src/app/layout.tsx:78`. Route changes do not remount the layout, so the observer setup must re-run on navigation (see item 1).

---

## Item 1 — Pause control visibility rescope

### Current state (verified)

`GlobalAnimationPauseControl` (`AnimationProvider.tsx:32–43`) renders `AnimationPauseButton` with `className="fixed bottom-4 right-4 z-20"` — visible on every page, always. It governs two effects:
- The hero ASCII field: heart only draws while `[data-hero-band]` is in viewport (`useAsciiShader.ts` `computeHeartAlpha`), and the whole field recesses after ~1 viewport of scroll (`computeScrollFactor`, early-return at `s > 0.97`).
- The footer wordmark morph: frozen by `isAsciiPaused` (`FooterAsciiBrand.tsx:387`).

Between the hero (home only) and the footer, pausing has no visible effect.

### Change

Gate the button's **render** on whether a governed effect is on screen:

- Add a pure, exported helper (unit-testable, no DOM):

```ts
export function computePauseControlVisible(opts: {
  heroInView: boolean;
  footerInView: boolean;
  prefersReducedMotion: boolean;
}): boolean {
  return !opts.prefersReducedMotion && (opts.heroInView || opts.footerInView);
}
```

- In `GlobalAnimationPauseControl`, track `heroInView` and `footerInView` **as two independent state flags**, each updated only when its own target's entry fires — the callback updates just that flag, never both, so a scroll that moves only the footer cannot clobber the hero flag. `visible = heroInView || footerInView`. Use a single `IntersectionObserver` that watches `document.querySelector("[data-hero-band]")` (when present) and `document.querySelector("footer")` (stable marker — the app has exactly one `<footer>`). Re-run the effect on route change (e.g. via `usePathname()` from `next/navigation` as an effect dependency) so client-side navigation back to the home page re-attaches the hero target.
- Initialize both flags to `false` and render nothing until the first callback for each target fires (no dead-button flash). There is no "wait for both callbacks" barrier — each flag updates independently as its target reports, and either being `true` shows the button.
- **Unmount** (return `null`) when not visible — the button must not be focusable when hidden.
- Under `prefers-reduced-motion` (`useReducedMotion`), never render the button (effects are static anyway).
- Pause/resume behaviour and the button's styling are unchanged.

### Acceptance criteria

1. Home page: button renders while `[data-hero-band]` **or** the footer intersects the viewport; unmounted otherwise.
2. Non-home pages (about-temi, contact, case-study): button renders only while the footer intersects; unmounted otherwise.
3. Paused state persists across the button disappearing/reappearing (pause near the hero, scroll to the footer → still paused, resume works).
4. Client-side navigation home → other → home re-runs the observer; the hero still triggers visibility on return.
5. `prefers-reduced-motion`: button is never rendered.
6. `computePauseControlVisible` is unit-tested (hero-only, footer-only, both, neither, plus the reduced-motion override).
7. **New component test** in `AnimationProvider.test.tsx` for the DOM gating (mock `IntersectionObserver` with a callable `trigger` per observed target, and `usePathname` as a hook mock):
   - Renders nothing before the first callback; shows the button when the hero target reports intersecting; hides it when the hero reports not-intersecting while the footer target has never fired; shows it when the footer reports intersecting with hero absent; and unmounts the button (assert `queryByRole("button", { name: /pause background animation/i })` is `null`) when all targets report not-intersecting — it must not remain focusable/hidden.
8. `npm run build`, `npx tsc --noEmit`, `npm run lint`, full `npm test` all pass.

## Item 2 — Interest heart affordance

### Current state (verified)

The like-button is `h-11 w-11` = 44×44px (`InterestCard.tsx:107`) — hit area is compliant. The heart SVG is `width="20" height="20"` (`:114`), which reads small and delicate inside the target.

### Change

- Bump the heart SVG to `width="24" height="24"`.
- Add a hover scale for clearer affordance, reduced-motion-safe: add `group` to the like-button's existing className, and on the SVG add `!prefersReducedMotion && "group-hover:scale-110"` via `cn()` so hovering **anywhere on the button** (including the 44px padding around the icon) scales it. `group-hover` is required here — plain `hover:scale-110` would only react to hovering the icon itself. Ensure the SVG's `transition-transform` is present (it already is at `:122`).
- Keep the button at 44×44px, the gradient fill, `aria-pressed`, and the popover/like independence unchanged.

### Acceptance criteria

1. Heart SVG renders at 24×24px.
2. Hovering the like button scales the icon to 110% under `prefers-reduced-motion: no-preference`; no scale under reduced motion.
3. Like toggles and the card popover behave exactly as before.
4. Existing `InterestCard.test.tsx` tests pass; add an assertion that the heart SVG has `width="24" height="24"`.
5. `npm run build`, `npx tsc --noEmit`, `npm run lint`, full `npm test` all pass.

## Item 3 — Contact message-field padding

### Current state (verified)

`fieldClass` (`ContactForm.tsx:13`) has `px-4` but **no vertical padding**. Single-line inputs are fine (browsers vertically center input text), but the 5-row message textarea (`:93`, `className={`${fieldClass} resize-y`}`) has its placeholder and typed text hugging the top frame edge.

### Change

- Add `py-3` **only** to the textarea's own className:

```tsx
className={`${fieldClass} resize-y py-3`}
```

- **Do not** touch the shared `fieldClass` — adding padding there would change the single-line inputs' height.

### Acceptance criteria

1. Message-field placeholder and typed text start exactly 12px (Tailwind `py-3` = `0.75rem` = 12px) below the top edge — the spec'd `py-3` value, not "approximately."
2. Name and Role inputs are unchanged (no height or padding change).
3. `buildMailtoUrl` behaviour and existing tests unchanged; add a render test asserting the message textarea's className contains `py-3` and the Name/Role inputs do not.
4. `npm run build`, `npx tsc --noEmit`, `npm run lint`, full `npm test` all pass.

## Item 4 — CTA button system

### Current state (verified)

Three hand-rolled treatments, no shared primitive or token (`src/components/ui/` has no `Button`; no `.btn` classes in `globals.css`):

| CTA | Location | Treatment |
|---|---|---|
| "Get in touch" | `src/app/page.tsx:104–124` | Bare accent text link + arrow |
| "Send message" | `src/components/contact/ContactForm.tsx:104–109` | Solid dark pill (`rounded-full`) |
| "Download CV" | `src/app/about-temi/page.tsx:100–112` | Squared tonal (`rounded-lg`, outline + tint) |

The site's control language is pills (pause button, carousel arrows, number badges all `rounded-full`) — the squared Download button is the outlier, not the contact pill.

### Change

Establish a 3-tier system where **hierarchy comes from fill, not radius**. Add a single source of truth, `src/components/ui/buttonVariants.ts`:

```ts
export const buttonVariants = {
  primary: "inline-flex min-h-11 items-center justify-center rounded-full bg-[#151515] px-7 font-sans text-[#f5f2ee] transition-colors duration-[var(--duration-fast)] hover:bg-[#A43718] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]",
  secondary: "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#A43718]/30 bg-[#A43718]/5 px-5 font-sans text-sm font-medium text-[#A43718] transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-[#A43718]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]",
  tertiary: "inline-flex items-center gap-2 font-sans text-[clamp(1rem,2.5vw,1.125rem)] font-medium text-[#A43718] transition-colors duration-[var(--duration-fast)] hover:text-[#A43718] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]",
} as const;
```

Map the call sites:

- **Primary** (solid pill) → Contact "Send message" (`ContactForm.tsx:106`).
- **Secondary** (tonal pill) → About "Download CV" (`about-temi/page.tsx:104`) — converts `rounded-lg px-4 py-2.5` → `rounded-full min-h-11 px-5`. Icon and `gap-2` preserved.
- **Tertiary** (text link) → Home "Get in touch" (`page.tsx:106`) — visually unchanged.

Deliberate choice: this is a shared class map, **not** a polymorphic `<Button>` component — the three call sites use different elements (`<button type="submit">`, `<a download>`, `<Link>`), and a polymorphic component would be over-engineering for three call sites. The map is the single source of truth that prevents drift. All three keep their native element.

### Acceptance criteria

1. "Download CV" renders as a pill (`rounded-full`), 44px min-height, tonal fill, icon + gap preserved.
2. "Send message" renders as a solid dark pill — visually unchanged from today.
3. Home "Get in touch" renders as the tertiary text link + arrow, default/hover visuals unchanged; its keyboard-focus outline now matches the site's other controls (a no-op for mouse users, an a11y improvement for keyboard users).
4. All three call sites import their radius/fill/typography classes from `buttonVariants`. **Call-site-specific non-variant classes are permitted** (e.g. `mt-6` layout spacing on the home link, `mt-12` on the form) — the prohibition is on hand-rolled radius, fill, font, or focus classes duplicated inline. Grep check: no `rounded-full`/`rounded-lg`/`bg-[#151515]`/`bg-[#A43718]` literals remain inside the three call-site class strings.
5. New `buttonVariants.test.ts` asserts: `primary` and `secondary` include `rounded-full`; `tertiary` does not; all three include the focus-visible + duration tokens.
6. `npm run build`, `npx tsc --noEmit`, `npm run lint`, full `npm test` all pass.

---

## Guardrails (apply to every step)

- **Never stage** `tsconfig.tsbuildinfo`, `next-env.d.ts`, `.superpowers/`, `*.mjs` QA scripts, `temi's cvs/`, `tasks/2026-07-30-codex-feedback-round-1.md`, or `ascii wordmark footer sample.jpg` — these are pre-existing untracked files outside this task. Stage only the specific files listed in each item.
- Do not use `git add -A` or `git add .`. Stage specific files only.
- No silent deviations — if an item cannot be delivered as written, stop and report to Claude Code.
- Commit after **each** of the four items with the exact commit messages below.
- The global pause **state** (`isAsciiPaused`) and the effects it governs are unchanged — only the control's render condition changes.

## Acceptance criteria (batch)

All per-item acceptance criteria above, plus:
1. No new dependencies.
2. No edits outside the listed files.
3. Build, typecheck, lint, and the full test suite pass.

## Commit messages (one per item)

1. `feat: show pause control only when a governed effect is on screen`
2. `fix: enlarge interest heart icon for clearer affordance`
3. `fix: add top padding to the contact message field`
4. `refactor: unify CTAs through shared button variants`

## Validation method (AGENTS.md §7)

Per AGENTS.md §7 — required for this task:
- `npm run build` / `npx tsc --noEmit` / `npm run lint` / `npm test` all pass (report output).
- Manual browser check at **375px, 768px, and 1440px** and with **`prefers-reduced-motion` emulation**:
  - Home: pause button appears while the hero is in view, disappears mid-scroll, reappears near the footer. About-temi/contact: button only near the footer. Client-side nav home → about → home restores the hero trigger. Pause near the hero, scroll to the footer, resume — state persists.
  - About Temi page (`/about-temi`, "Do we have similar interests?" section): heart icon renders 24px and is visibly larger than before; hovering anywhere on the like button scales it (no scale under reduced motion); like + popover still independent.
  - Contact page: message-field placeholder sits 12px off the top edge; Name/Role inputs unchanged.
  - CTAs: Download CV (`/about-temi`) and Send message (`/contact`) both render `rounded-full` pills; home Get in touch (`/`) renders the tertiary text link; hover each and Tab-focus each to confirm the shared tokens.
- Reduced-motion: pause button hidden, no heart hover scale, static wordmark and field unaffected.

## Definition of Done

- All acceptance criteria satisfied; four commits with the exact messages above.
- Build, typecheck, lint, and full test suite pass.
- Completion report submitted to Claude Code using the AGENTS.md §8.2 format (Implementation summary, Files changed, Decisions made, Deviations from task, Testing performed, Validation evidence, Known limitations, Preview instructions).
- Claude Code updates `docs/PROJECT_STATE.md`; ChatGPT performs independent QA afterwards.
