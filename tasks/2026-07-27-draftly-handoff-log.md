# Draftly case study — implementation handoff

Status: approximately 90% complete as of 27 July 2026.

This log is intended to bring a CTO/reviewer up to date on the Figma source work and the corresponding portfolio implementation. Treat the existing working-tree changes as intentional unless noted otherwise.

## Objective

Present Draftly as a concise, product-led editorial case study that follows the established Travecs case-study rhythm:

- A long-form landing-page CoverScroll is the primary visual overview in both the editorial project card and the case-study hero.
- The body avoids repeating landing-page content and instead focuses on two concrete product moments, the Writing Journey, the visual system, outcome, and next validation work.
- Product and system images use real Figma exports rather than generated approximations.

## Figma file and relevant nodes

Figma file: `ij6f8NbOKFMGqdBHya6BNV` (`HNG-14`).

| Purpose | Node | Current use |
| --- | --- | --- |
| Landing page | `6:4` | Exported as the full-page CoverScroll source. |
| Writing Journey cards | `640:29` | Four cards received editable imported SVG illustrations. |
| Writing Assistant feature | `643:39` | Exported as a case-study product carousel slide. Outer corner radius is now `0px`. |
| AI Idea Starter feature | `213:296` | Exported as a case-study product carousel slide. Outer corner radius is now `0px`. |
| Visual and Brand System board | `672:5` | Exported as the framed, single-slide Visual and Brand System reference. |
| Draftly design-system storyboard | `658:3` on page `Case Study System Board` | Created/refined in Figma as supporting internal design-system documentation. |

## Figma work completed

### Writing Journey illustration cards

- Created four original editable SVG illustrations at `320 × 142`, transparent background, no text, delicate plum hand-drawn linework, pale lavender/soft-blush accents.
- Imported the SVGs as editable vectors into the matching Figma Writing Journey cards under node `640:29`.
- Card backgrounds and illustration details were refined in Figma.
- Simplified display variants were also created for the storyboard board.

Source deliverables are in:

`outputs/draftly-writing-journey-illustrations/`

### Design-system storyboard

- Added Figma page: `Case Study System Board`.
- Added board: `Draftly — Design System Storyboard` (`658:3`, 1920 × 1080).
- It brings together the brand anchor, mascot, product proof, foundations, and Writing Journey.
- The simplified storyboard cards preserve the approved card fills, illustrations, and titles while avoiding dense portfolio-scale body copy.

### Product feature source cleanup

- The two feature-export frame containers (`643:39` and `213:296`) previously had `16px` outer corner radii.
- Both outer frame radii were set to `0px` in Figma and re-exported.
- Internal product UI radii remain intentional and were not removed.

## Website implementation completed

### CoverScroll

Draftly now follows the same CoverScroll pattern as Travecs in both locations:

1. Editorial project-card bezel.
2. Case-study hero.

Shared landing-page asset:

`public/images/draftly/draftly-landing-page-full.webp`

The cover contains source-derived section stops for Meet Draftly, Product, Learning support, Writing journey, Pricing, Questions, Start writing, and Footer.

### Editorial content reduction

The original Draftly case study was reduced from a long, repetitive feature inventory to nine editorial beats:

1. Executive summary
2. What I designed
3. A coach, not a generator
4. Two learning-first product moments
5. Product demonstrations carousel
6. Make progress visible
7. Visual and brand system
8. Outcome
9. What I would validate next

Removed or merged material includes duplicate landing-page discussion, separate pricing and integrity sections, repeated feature explanations, and placeholder-only sections.

### Product demonstrations carousel

Uses these direct Figma exports:

- `public/images/draftly/draftly-idea-starter-feature.webp`
- `public/images/draftly/draftly-writing-assistant-feature.webp`

Carousel details:

- Uses the exact source ratio (`880 / 573`) so neither slide has side gutters.
- Keeps the shared Travecs carousel frame treatment: rounded outer frame, soft shadow, carousel controls, and slide motion.
- The transition surface for Draftly only is `#F6F4FE`, sampled from all four slide-corner pixels. This replaces the generic gray `#F0F0F0`, which was visible through anti-aliased rounded corners during motion as a subtle dark tint.
- The source Figma exports themselves are square-cornered (`0px` outer radius); the carousel frame remains rounded by design.

### Visual and Brand System

Uses the exact Figma board export:

`public/images/draftly/draftly-visual-brand-system.webp`

It is rendered as a single-slide carousel, not an unframed editorial image, so it now matches the Travecs visual language:

- Native `1920 / 1080` aspect ratio.
- Rounded carousel frame.
- Soft shadow.
- No redundant controls, because there is only one slide.

## Primary changed files

| File | Purpose |
| --- | --- |
| `src/content/case-studies.ts` | Draftly’s shortened narrative, CoverScroll configuration, exact product/system exports, per-carousel ratio and background values. |
| `src/content/projects.ts` | Draftly editorial-card CoverScroll section labels and stops. |
| `src/components/case-study/CarouselImage.tsx` | Supports optional source aspect ratio and optional transition-surface color while retaining default Travecs styling. |
| `src/components/case-study/CarouselSection.tsx` | Passes optional carousel visual properties through. |
| `src/components/case-study/CaseStudyLayout.tsx` | Passes carousel visual properties from content configuration. |
| `public/images/draftly/EXPORT_MAPPING.json` | Documents each Figma export used by Draftly. |

## Asset inventory added

- `public/images/draftly/draftly-landing-page-full.webp`
- `public/images/draftly/draftly-idea-starter-feature.webp`
- `public/images/draftly/draftly-writing-assistant-feature.webp`
- `public/images/draftly/draftly-visual-brand-system.webp`

## Validation completed

- `npm run typecheck` passes after the current implementation.
- `npm run build` passed after the content and CoverScroll implementation. Re-run before final merge because subsequent carousel/surface styling refinements followed that build.
- Desktop and mobile local-page checks were performed during the content reduction pass.
- Both product feature assets return HTTP 200 locally.
- The revised square-corner Figma AI Idea Starter export was visually inspected before it replaced the website asset.

## Remaining work for the final ~10%

1. Run a final production build after the latest visual-system carousel treatment.
2. Perform a final desktop and mobile visual pass, including advancing the Product Demonstrations carousel to verify the corner-tint fix in motion.
3. Review the shorter Draftly copy for final portfolio voice and factual approval.
4. Decide whether the Figma design-system storyboard (`658:3`) also needs a dedicated exported placement in the public case study. The current page uses the user-specified Visual and Brand System frame (`672:5`), which already includes the relevant system proof.
5. Review the working tree before committing: existing unrelated/generated files may be present and should not be bundled accidentally.

## Reviewer focus

Please evaluate:

- Whether the case study is now materially easier to scan than the previous long-form Draftly version while retaining enough product reasoning.
- Whether the landing-page CoverScroll reads consistently with Travecs in both the project index and case-study hero.
- Whether the two focused product demonstrations are sufficient evidence for the concept.
- Whether the Visual and Brand System board reads clearly within the shared carousel surface.
- Whether any remaining content is redundant with the CoverScroll landing-page narrative.
