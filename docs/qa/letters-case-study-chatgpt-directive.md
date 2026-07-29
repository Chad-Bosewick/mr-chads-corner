# ChatGPT Directive — Letters App Case Study Figma Inspection + PRD

## Objective

Inspect the Letters App Figma design and produce a Case Study Rewrite PRD that Claude Code will use to prepare a Codex implementation task. This follows the exact pattern used for the TODO++ case study rewrite.

## Figma Access

### Primary source — Letters App frame

This node contains the full Letters App design:

**https://www.figma.com/design/u2V5nuWFvE4iGhjfc0BXk0/Portfolio?node-id=38-4**

This is the most important frame. It contains the product screens, states, and compositions that should become the case study narrative.

### Secondary source — Portfolio overview

The full Portfolio Figma file may contain additional Letters App assets on other pages or nodes. Use the main frame first, then explore nearby nodes if the primary frame doesn't contain enough material.

---

## What to inspect

### From the Letters App frame (node 38-4)

1. **The product story** — What is Letters App? What was the design challenge? What was designed? What are the key screens and states?
2. **Product screens** — Identify every screen: inbox, writing view, letter detail, pals/contacts, settings, onboarding, any personality/analysis screens
3. **Mobile vs desktop** — Is Letters App purely mobile, or does it have a landing page / marketing site? Identify which screens are mobile and which are desktop/web
4. **Wide compositions** — Are there any wide, final product-story compositions suitable for carousel slides?
5. **Full-page screenshot** — Is there a full-page product screenshot suitable for CoverScroll auto-scroll?
6. **Hero composition** — Is there a device composition (phone alone, phone + laptop, or landing page hero) suitable for hero media?
7. **Metrics or outcomes** — Any real, verifiable outcomes mentioned? The current case study has fabricated metrics (240 words avg, 78% response rate, 82% retention, 12k+ DAU) that need verification or removal.
8. **Persona / personality analysis** — The current case study includes `persona-details.webp` and `personality-analysis.webp`. Verify whether these are real Figma exports or placeholders. The owner values personality/communication analysis as a storytelling device.

---

## What to produce

A PRD document at `docs/qa/letters-case-study-rewrite-prd.md` following the established PRD structure.

### Reference PRD

Study the TODO++ PRD for the expected format:
`docs/qa/todo-case-study-rewrite-prd.md`

Your PRD must follow the same section-by-section structure.

### Required PRD sections

#### 1. Product story summary

A 2-3 paragraph summary of Letters App based on the Figma design. Replace the current generic overview. Be specific, editorial, evidence-based. No AI hype.

#### 2. Section restructuring

Map the current 9 sections to a new editorial structure. The current Letters App case study has:

| # | Type | Heading |
|---|---|---|
| 1 | text | The tension between speed and thoughtfulness |
| 2 | full-image | The inbox experience |
| 3 | text | Designing for anticipation |
| 4 | image-pair | Writing and connecting |
| 5 | full-image | Personality and connection |
| 6 | metrics | Key results |
| 7 | text | Accessibility as a feature |
| 8 | full-image | Showcase |
| 9 | text | Reflections |

Your new structure should follow the chaptered pattern:

- `executive-summary` (Problem / Solution / Outcome) — no chapter
- `what-i-designed` (feature cards) — no chapter
- Context chapter: the real problem, design principles
- Solution chapter: key screens, design decisions
- Results chapter: verifiable outcomes (NOT fabricated metrics — remove the current metrics section entirely)
- Reflection chapter: constraints, key decisions, accessibility, lessons

#### 3. Section-by-section specification

For each section in your new structure, specify:
- Section type
- Heading
- `chapter` value (if applicable)
- `navLabel` value (if applicable)
- Full body copy or content specification
- Image references (placeholder paths under `public/images/case-studies/letters-app/`)

#### 4. Asset requirements

Specify every image needed, with:
- Placeholder file path (under `public/images/case-studies/letters-app/`)
- Description of what the image should contain
- Source (Figma node)
- Whether it's a desktop frame (carousel) or mobile frame (phone-mockup)

Directory structure:
```
public/images/case-studies/letters-app/
├── letters-app-hero.webp                    # Hero media
├── letters-app-landing-page-full.webp       # CoverScroll (if applicable)
├── carousel/
│   └── letters-app-*.webp                   # Desktop/wide product frames
└── phone/
    └── letters-app-phone-*.webp             # Mobile product frames
```

#### 5. Image migration table

List all existing images that need to move from `public/images/case-studies/` to `public/images/case-studies/letters-app/`:

| Current path | New path | Used in section |
|---|---|---|
| `letters-app-cover.webp` | Keep as-is (homepage card) | N/A |
| `letters-app-homepage-post-1.webp` | `letters-app/letters-app-*.webp` | TBD by PRD |
| `letters-app-homepage-post-2.webp` | `letters-app/letters-app-*.webp` | TBD by PRD |
| `letters-app-my-letters.webp` | `letters-app/letters-app-*.webp` | TBD by PRD |
| `letters-app-my-pals.webp` | `letters-app/letters-app-*.webp` | TBD by PRD |
| `letters-app-persona-details.webp` | `letters-app/letters-app-*.webp` | TBD by PRD |
| `letters-app-personality-analysis.webp` | `letters-app/letters-app-*.webp` | TBD by PRD |
| `letters-app-showcase.webp` | `letters-app/letters-app-*.webp` | TBD by PRD |

#### 6. Chapter mapping table

Old sections → new sections with rationale for each change.

#### 7. Non-negotiable facts

Preserve exactly:
- Category: `Communication`
- Role: `Sole product designer — end-to-end product design`
- Slug: `letters-app`
- `nextSlug`: `credlane`
- `prevSlug`: `todo-app`

#### 8. What to remove

- Fabricated metrics: `240 words` avg letter length, `78%` response rate, `82%` retention, `12k+` DAU
- Any generic placeholder content that doesn't match the Figma source

#### 9. What to keep

- The core product narrative (thoughtful communication, emotional design)
- Real image assets (verify which are authentic Figma exports vs placeholders)
- The accessibility story (if substantiated in Figma)
- The personality/communication analysis screens (if real — the owner values this as a storytelling device)

---

## Copy rules

- Editorial, clear, concise, active voice
- No AI hype, no fabricated metrics, no unsupported claims
- Use `<strong>` tags for emphasis in body text (matching existing pattern)
- Every claim must be traceable to the Figma source
- Writing voice should match Travecs, TODO++, and Draftly: specific, evidence-based, human

---

## Phone mockup identification

For each mobile screen you identify in the Figma file, specify:
- Which screen it is (e.g., "inbox", "writing view", "letter detail")
- Whether it should be a single phone or part of a side-by-side pair
- What caption should appear below the phone
- Which chapter/section it belongs to

---

## Deliverable

Save the completed PRD to:
`docs/qa/letters-case-study-rewrite-prd.md`

Then report back with:
1. Summary of what you found in the Figma file
2. The complete PRD
3. Any questions or ambiguities that need resolution before Codex implements
