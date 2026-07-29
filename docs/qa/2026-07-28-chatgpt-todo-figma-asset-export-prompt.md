# ChatGPT handoff — export curated TODO++ Figma assets into the repository

Use your connected Figma environment to inspect this exact node before doing any export work:

`https://www.figma.com/design/G6734pJxLbQjDpIobWfpAw/Stage-7--Copy-?node-id=4040-3399&t=V1sXDFvzWIiEAkbz-4`

The selection contains a group labelled **“for codex”**. Treat the frame names and their visual contents as the source of truth. Do not choose substitute frames, infer an asset from another part of the file, or create an unrelated composition.

## Objective

Replace the temporary TODO++ case-study imagery with the owner-curated Figma assets, saving them directly into the local repository paths below so the existing page can use them without code changes.

Repository root:

`/Users/rosemary/portfolio-website`

## Existing rendering contract

- Hero uses `HeroMedia` with an **8:5** display frame and `object-contain`. Export the curated hero as an 8:5 editorial image (recommended: 1600×1000 WebP or larger) with intentional whitespace; do not crop the product composition at the frame edges.
- Carousel uses **1360×850 (16:10)** wide editorial frames.
- Phone-mockup sections add the phone bezel in code. Their files must therefore be the **raw portrait mobile screens only**, with no Figma device frame or extra canvas.
- The TODO++ hardware must retain the polished 2D illustrated shell used by the homepage editorial card, not the hand-drawn/vector-style hardware from Figma. The curated Figma e-paper display must be composited into that polished hardware shell.

Polished hardware style reference already in the repo:

`public/images/case-studies/todo-app-device.webp`

## Required asset mapping

Export or compose exactly these files. Use WebP unless export tooling makes that impossible; PNG is acceptable only if necessary, in which case report it rather than changing any code paths.

| Destination relative to repository root | Required content | Format / dimensions |
| --- | --- | --- |
| `public/images/case-studies/todo-app/todo-app-hero.webp` | Curated hero composition: polished TODO++ hardware + companion mobile product composition. The hardware shell must visually match the existing editorial-card device; its e-paper display must show the curated intended screen. | WebP, 1600×1000 minimum, 8:5 |
| `public/images/case-studies/todo-app/todo-app-persona-1.webp` | Curated Daniel Okafor persona frame. | WebP; retain the curated frame’s aspect ratio and readable scale |
| `public/images/case-studies/todo-app/todo-app-persona-2.webp` | Curated Amara Bello persona frame. | WebP; retain the curated frame’s aspect ratio and readable scale |
| `public/images/case-studies/todo-app/carousel/todo-app-device-overview.webp` | Curated device-overview composition. If the curated source is a mobile/hardware screen, place it in a 1360×850 editorial frame rather than stretching it. Hardware must use the polished 2D shell. | WebP, exactly 1360×850 |
| `public/images/case-studies/todo-app/carousel/todo-app-mobile-home-context.webp` | Curated companion-mobile home screen placed inside a mobile bezel, then placed within a 1360×850 editorial frame. | WebP, exactly 1360×850 |
| `public/images/case-studies/todo-app/carousel/todo-app-linking-context.webp` | Curated linking screen placed inside a mobile bezel, then placed within a 1360×850 editorial frame. | WebP, exactly 1360×850 |
| `public/images/case-studies/todo-app/carousel/todo-app-completion-context.webp` | Curated completion screen placed inside a mobile bezel, then placed within a 1360×850 editorial frame. | WebP, exactly 1360×850 |
| `public/images/case-studies/todo-app/phone/todo-app-phone-link-device.webp` | Raw curated portrait linking screen — no device bezel, no wide canvas. | WebP, portrait, minimum 480px wide |
| `public/images/case-studies/todo-app/phone/todo-app-phone-task-detail.webp` | Raw curated portrait task-detail screen — no device bezel, no wide canvas. | WebP, portrait, minimum 480px wide |
| `public/images/case-studies/todo-app/phone/todo-app-phone-complete-task.webp` | Raw curated portrait completion screen — no device bezel, no wide canvas. | WebP, portrait, minimum 480px wide |

## Composition rules

1. Inspect and identify the assets in **“for codex”** before exporting. If a frame name does not make the mapping unambiguous, stop and report that ambiguity rather than guessing.
2. For each wide carousel image derived from a mobile frame, first place the raw mobile screen into a realistic mobile bezel, then compose that bezel inside the neutral 1360×850 editorial canvas. Do not stretch a portrait screen to fill the carousel.
3. Keep all labels, device edges, and screen content fully inside the export boundaries.
4. Use the site’s calm neutral visual language: warm off-white background, restrained shadow, no invented decorative copy, no oversized branding, and no rasterized browser chrome.
5. For the hardware device, do not export the Figma vector/hand-drawn shell as the final shell. Preserve or faithfully recreate the quality/style of `todo-app-device.webp`; replace only the e-paper screen content with the selected curated screen.
6. Do not edit any TypeScript, CSS, or content data. Do not delete the original flat images; only replace the files at the destinations above.

## Required verification

After creating the assets:

1. Confirm all ten destination paths exist.
2. Confirm all carousel images are exactly 1360×850.
3. Confirm every phone source is portrait and has no bezel/canvas baked in.
4. Confirm the hero is 8:5 and shows the polished hardware with the curated e-paper screen.
5. Run the local TODO++ route if the environment permits: `/featured-case-studies/todo-app/`.
6. Report a table showing: Figma frame selected, destination path, final dimensions, and any unresolved ambiguity.

## Important stop condition

If the “for codex” group cannot be inspected, or if it does not make one of the ten mappings clear, do not export a guessed asset. Return the ambiguous item(s) and ask the owner for a precise frame name or node link.
