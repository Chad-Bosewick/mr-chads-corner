# TODO++ Hero — Revision Corrections

The initial implementation was rejected. Three specific corrections needed:

---

## Correction 1 — Use the editorial card image for hero slide 2, not a custom interactive device

**Problem:** Codex created a new `TodoInteractiveDevice` component with an animated emoji face. That's not what's wanted.

**What's wanted:** The hero carousel slide 2 should use the **same device image already used on the editorial case study card** — the polished, finished device illustration that already exists at:

`public/images/case-studies/todo-app-device.webp`

(Referenced in `src/content/projects.ts` line 51 as `coverSrc: "/images/case-studies/todo-app-device.webp"`)

This is a finished, annotated device illustration. Use it as the image source. The `annotated-device` presentation layout (device at 75% width with `DeviceAnnotations` overlay) should remain — use the editorial card image as the `src`, keep the annotation labels pointing to the right areas.

**What to undo/change:**
- Remove the `TodoInteractiveDevice.tsx` file entirely
- Remove `"interactive-device"` from `TodoSlidePresentation` union in `TodoCaseStudySlide.tsx`
- Remove the `isActive` prop plumbing from `CarouselImage.tsx` and `TodoCaseStudySlide.tsx`
- Change the TODO++ hero carousel slide 2 `presentation` back to `"annotated-device"` (or `"device"`) in `case-studies.ts`
- Use the existing `todo-app-device.webp` image file as the `src` for that slide
- Update the `src` path in `case-studies.ts` to `/images/case-studies/todo-app-device.webp`
- The `DeviceAnnotations` component and its labels should overlay this image as they did before

---

## Correction 2 — Body font for key-decisions section

**Problem:** Codex rendered the `body` text in the "Designing for focus, not configuration" section using `font-serif` (Lora). Look wrong.

**What's wanted:** The body text should use the same font as regular text section body content — the standard sans-serif font (`font-sans`).

**What to change:**
- In `CaseStudyLayout.tsx`, in the `OutcomeList` component where it renders `body`, change `font-serif` to `font-sans`
- The styling should match regular text sections: `text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70`

---

## Correction 3 — Revert "A dedicated surface" to standard carousel frame

**Problem:** Codex changed this section from `type: "carousel"` to `type: "full-image"` with `width: "full-bleed"`. The frame doesn't match other case study images now.

**What's wanted:** This image should use the same standard carousel frame used throughout other case studies — a clean 16:10 frame with `rounded-xl` and subtle shadow. Look at how Credlane/Travecs renders its case study carousel images for reference (standard `type: "carousel"` rendering).

**What to change:**
- Revert the section in `case-studies.ts` from `type: "full-image"` back to `type: "carousel"`
- Remove `width: "full-bleed"` 
- Remove any `sizes` prop changes made to `ImagePair.tsx` for 1120px — those are no longer needed
- The carousel should render in the standard 680px reading column with the standard carousel styling

---

## Files to touch

- `src/components/case-study/TodoInteractiveDevice.tsx` — **delete this file**
- `src/components/case-study/TodoCaseStudySlide.tsx` — revert to previous state (no interactive-device type, no isActive)
- `src/components/case-study/CarouselImage.tsx` — remove `isActive` prop passing to TodoCaseStudySlide
- `src/components/case-study/CaseStudyLayout.tsx` — change `font-serif` to `font-sans` in the `OutcomeList` body render
- `src/components/case-study/ImagePair.tsx` — revert any sizes-prop changes made for full-bleed
- `src/content/case-studies.ts` — fix hero slide 2 src + presentation, revert dedicated surface to carousel

## Acceptance

1. Slide 2 shows the polished editorial device image with annotation labels
2. "Designing for focus" body uses the standard sans body font
3. "A dedicated surface" renders in the standard 680px carousel frame
4. No remaining references to `TodoInteractiveDevice` or `interactive-device` anywhere
5. Build passes
