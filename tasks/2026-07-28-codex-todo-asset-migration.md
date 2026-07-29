# Codex Task — TODO++ Case Study Asset Migration

## Objective

Migrate existing flat image assets into the new subdirectory structure, create placeholder carousel slides, and verify the TODO++ case study page renders correctly with all images.

## Input files to read first

1. `src/content/case-studies.ts` — the `todoApp` object (lines 119-290) references all image paths
2. `tasks/2026-07-27-codex-todo-case-study-rewrite.md` — the original rewrite task for context on what was implemented

---

## Part 1: Create subdirectory structure

```bash
mkdir -p public/images/case-studies/todo-app/carousel
mkdir -p public/images/case-studies/todo-app/phone
```

---

## Part 2: Migrate existing flat images

Copy (not move) existing flat images to their new paths. Keep originals as backup.

| Source (flat) | Destination (subdirectory) | Used in |
|---|---|---|
| `todo-app-device.webp` | `todo-app/todo-app-hero.webp` | Hero media + section 6 full-image |
| `todo-app-persona-1.webp` | `todo-app/todo-app-persona-1.webp` | Section 4 image-pair (left) |
| `todo-app-persona-2.webp` | `todo-app/todo-app-persona-2.webp` | Section 4 image-pair (right) |
| `todo-app-new-user-link-device.webp` | `todo-app/phone/todo-app-phone-link-device.webp` | Section 8 phone-mockup |
| `todo-app-complete-task.webp` | `todo-app/phone/todo-app-phone-complete-task.webp` | Section 9 phone-mockup (right) |
| `todo-app-homepage-task.webp` | `todo-app/phone/todo-app-phone-task-detail.webp` | Section 9 phone-mockup (left) — temporary stand-in |

All paths are relative to `public/images/case-studies/`.

---

## Part 3: Create placeholder carousel slides

The carousel section (section 7) requires 4 wide images at **1360×850** (16:10 aspect ratio, matching the Credlane carousel standard).

The only device composition on disk is `todo-app-device.webp` (800×458). Use ImageMagick to create 4 placeholder slides:

```bash
# Create a neutral warm-gray background at 1360×850, then composite the device image centered
for name in todo-app-device-overview todo-app-mobile-home-context todo-app-linking-context todo-app-completion-context; do
  convert -size 1360x850 xc:'#f5f0eb' \
    public/images/case-studies/todo-app-device.webp -gravity center -composite \
    "public/images/case-studies/todo-app/carousel/${name}.webp"
done
```

If ImageMagick is not available, use any image tool (sips, Python PIL, sharp, etc.) to:
1. Create a 1360×850 image with a neutral background (`#f5f0eb` or similar warm tone)
2. Center the `todo-app-device.webp` image on it
3. Export as WebP

**These are temporary placeholders.** They will be replaced with proper Figma editorial compositions in Phase 4. The goal is to eliminate broken-image states so the page renders fully.

---

## Part 4: Verify dev server

1. Start the dev server (`npm run dev`)
2. Navigate to `/featured-case-studies/todo-app/`
3. Verify the following:

| Check | Expected |
|---|---|
| Hero media | Device composition displays below the header |
| Section 6 full-image | Device composition displays with caption |
| Section 4 personas | Two persona images side-by-side |
| Section 7 carousel | 4 slides render, navigable, with captions |
| Section 8 phone-mockup | Single phone (linking) centered with bezel |
| Section 9 phone-mockup | Two phones (task detail + completion) side-by-side with bezels |
| Chapter dividers | Appear between context → solution → results → reflection |
| Sidebar nav | Shows Context, Solution, Results, Decisions labels |
| No broken images | Every `<img>` / `<Image>` loads successfully |

---

## Part 5: TypeScript + ESLint

```bash
npx tsc --noEmit
npm run lint
```

Both must pass.

---

## Non-negotiable

- Do NOT modify `src/content/case-studies.ts` — the `todoApp` data is already correct
- Do NOT modify any component files
- Do NOT delete the original flat images (keep as backup)
- Do NOT modify any case study other than TODO++
- Do NOT modify `src/content/projects.ts`

## Required output

Return:

1. **Migration summary** — which files were copied where
2. **Placeholder carousel details** — how the 1360×850 slides were created
3. **Dev server verification** — pass/fail for each check above
4. **Build verification** — TypeScript and ESLint status
5. **Any issues** — anything that didn't work as expected
