# TODO++ Hero Overhaul — Interactive Device + Layout Fixes

**Status:** Ready for Codex
**Priority:** P1
**Dependencies:** Figma device layers exported (see references)
**Files affected:** `src/components/case-study/TodoCaseStudySlide.tsx`, `src/components/case-study/CaseStudyLayout.tsx`, `src/content/case-studies.ts`, new interactive device component
**Design reference:** `public/images/case-studies/todo-app/figma-device-reference.png`

---

## Overview

Improve the TODO++ case study hero section with 4 changes: an interactive device component, layout fixes for the hero carousel, and a content fix for a section whose body text is silently dropped.

## Change 1 — Interactive device component (new file)

**Objective:** Replace the current `annotated-device` hero carousel slide with an interactive-device presentation that renders a new `TodoInteractiveDevice` component, making the device feel live rather than a flat screenshot.

**Important:** "Interactive" means **animated display only**. No pointer/tap/hover interaction is required. The animated face is purely decorative and must not create redundant screen-reader output (add `aria-hidden="true"` to the emoji overlay).

**How it works:** The current device editorial image (`todo-app-device-editorial.webp`, 800×458px) is a single flat render. Figma reveals the device has distinct sub-systems: an e-paper screen, navigation buttons, a mic button, and an AI emoji LCD display. Codex should create a new component that uses the existing editorial image as the device shell base but adds:

1. **Animated AI emoji display** — The circular LCD screen between the navigation cluster and mic button. Render a small animated decorative face using CSS/SVG:
   - Default state: neutral smile (`:)` or simple SVG face)
   - After ~4s idle: cycles to a wink (one eye closes for 300ms, returns to neutral)
   - Optional: cycle through 3 subtle expressions (neutral → slight smile → wink → neutral)
   - Animation loops while the slide is visible, pauses when hidden (use `IntersectionObserver` or parent visibility signal)
   - Must respect `prefers-reduced-motion`
   - Must be `aria-hidden="true"` — this is visual decoration, not content

2. **Device fills the frame** — The component should take up significantly more of the 680px carousel frame. Target: the device occupies ~75-80% of the frame width (up from the current ~59% / 400px max). The beige background should remain as padding but the device should feel substantial.

3. **Preserve annotations** — The existing `DeviceAnnotations` overlay (E-paper task display, Screen control keys, Interactive AI emoji display, Push to speak) must remain functional on desktop. The line that points to "Interactive AI emoji display" should connect to the actual animated emoji element so the annotation label and the live animation reinforce each other.

**Type changes required:**
- Add `"interactive-device"` to the `TodoSlidePresentation` union type in `TodoCaseStudySlide.tsx`
- Change the TODO++ hero carousel slide 2 from `presentation: "annotated-device"` to `presentation: "interactive-device"` in `src/content/case-studies.ts`
- Verify `"interactive-device"` is accepted wherever the image/presentation type is constrained in the content data schema

**Implementation notes:**
- Create the component at `src/components/case-study/TodoInteractiveDevice.tsx`
- The component should accept the same props shape used by the hero carousel slide: `{ src, alt }` for the device shell image
- Use CSS `position: absolute` to overlay the emoji display on top of the device image at the correct coordinates
- The emoji coordinates can be calculated as a percentage of the device image dimensions (the Figma node 4040:1872 shows the AI LCD at ~61% from left, ~55% from top within the device frame)
- Use `useEffect` with cleanup + `requestAnimationFrame` or a small `useInterval` for the emoji animation cycle
- Annotations (`DeviceAnnotations` in `TodoCaseStudySlide.tsx`) should be imported or duplicated here — they must reposition to match the larger device layout

## Change 2 — Enlarge annotated-device image (TodoCaseStudySlide.tsx)

**Objective:** The current `annotated-device` and `device` presentation types constrain the image to `w-[min(50%,400px)]`, making the device look small and centred in the 680px carousel frame.

**What to change:**
- In `TodoCaseStudySlide.tsx` line 102, increase the width constraint for the `annotated-device` case from `w-[min(50%,400px)]` to `w-[min(75%,560px)]`
- Similarly increase the base `device` presentation from `w-[min(48%,400px)]` to `w-[min(70%,500px)]`
- Test both at 375px, 768px, and 1440px viewports — on mobile the constraint should still prevent overflow

## Change 3 — Fix key-decisions body text (CaseStudyLayout.tsx)

**Objective:** The "Designing for focus, not configuration" section (case-studies.ts line 226) defines a `body` field with 3 numbered items, but the `key-decisions` case in `CaseStudyLayout.tsx` (line 333) only renders `OutcomeList` with `outcomeBullets` — the body text is silently dropped.

**What to change:**
- In `CaseStudyLayout.tsx`, modify the `key-decisions` case to also render `section.body` content if present
- Render the body text below the heading and above the `OutcomeList`, using the same `dangerouslySetInnerHTML` pattern as the `text` case (line 171-173)
- Only render the body if `section.body` is not empty/null
- The rendered body should be a single paragraph block with the same styling as regular text sections

## Change 4 — Upgrade single-image carousel hero treatment

**Objective:** The "A dedicated surface for the day's work" section (case-studies.ts line 232) has a carousel with a single image (1440×1024px). This is the key hero image of the physical device and deserves more impact than a standard 16:10 carousel frame.

**What to change:**
- This section's image (`todo-app-dedicated-surface.png`) is already large at 1440×1024px
- Change the section from `type: "carousel"` to `type: "full-image"` with `width: "full-bleed"` — this makes the image break out of the 680px reading column to 1120px
- Update the image dimensions in the content data: set `width: 1440, height: 1024`
- The `CarouselSection` wrapper should be replaced with `ImagePair` (which `full-image` already uses) — no carousel chrome needed for a single image
- Add the existing `caption` text as the image caption via the `caption` field
- Verify the full-bleed image renders at 1120px and doesn't overflow on any viewport
- **Image `sizes` fix:** `ImagePair` hardcodes `sizes="(max-width: 768px) 100vw, 680px"` at line 31 of `ImagePair.tsx`. For full-bleed, this must deliver a 1120px image. Either pass a `sizes` prop down or parameterise per display context — pick the least invasive approach

**Content data change in case-studies.ts:**
```typescript
// Change from:
{
  type: "carousel",
  heading: "A dedicated surface for the day's work",
  chapter: "solution",
  navLabel: "Solution",
  body: "<strong>...</strong>",
  images: [{ src: "...", alt: "...", caption: "...", width: 1440, height: 1024 }],
}
// To:
{
  type: "full-image",
  width: "full-bleed",
  heading: "A dedicated surface for the day's work",
  chapter: "solution",
  navLabel: "Solution",
  body: "<strong>...</strong>",
  images: [{ src: "...", alt: "...", caption: "...", width: 1440, height: 1024 }],
}
```

---

## Acceptance Criteria

1. **Interactive device**: AI emoji display animates (wink cycle), device fills ~75-80% of carousel frame, annotations point to correct elements, animations respect `prefers-reduced-motion`. **Confirmed rendering:** the TODO++ hero carousel slide 2 actually renders `TodoInteractiveDevice` (not the old flat image or a fallback)
2. **Enlarged image**: annotated-device and device images are significantly larger in the carousel frame, responsive at all breakpoints
3. **Key-decisions body**: "Designing for focus, not configuration" section shows its numbered body text below the heading
4. **Full-bleed hero**: "A dedicated surface for the day's work" image breaks out to 1120px full-bleed layout
5. **Build passes**: `npm run build` succeeds with no type errors
6. **No regressions**: Existing TODO++ content (phone-pair slide, other carousels, phone mockups) renders correctly

---

## Handoff Notes

- Figma device reference: `public/images/case-studies/todo-app/figma-device-reference.png`
- The AI emoji display is positioned at roughly 61% from left, 55% from top within the device editorial image
- The device editorial image is 800×458px
- `DeviceAnnotations` component currently uses hardcoded percentage positions — these may need adjustment for the larger layout
- Do not remove the existing flat image asset — the interactive component should use it as the shell background
