# ChatGPT Directive — TODO++ Case Study Figma Inspection + PRD

## Objective

Inspect the TODO++ Figma file and produce a Case Study Rewrite PRD that Claude Code will use to prepare a Codex implementation task. This follows the exact pattern used for the Draftly case study rewrite.

## Figma Access

### Primary source — Presentation slide

This node contains the presentation slide that serves as the mini-case study with full product context:

**https://www.figma.com/design/G6734pJxLbQjDpIobWfpAw/Stage-7--Copy-?node-id=173-3402&t=V1sXDFvzWIiEAkbz-4**

This is the most important frame. It contains the product story, design decisions, and presentation-quality screenshots that should become the case study narrative.

### Secondary source — Full app and device flows

This node contains the full app screens and device compositions:

**https://www.figma.com/design/G6734pJxLbQjDpIobWfpAw/Stage-7--Copy-?node-id=18-64&t=V1sXDFvzWIiEAkbz-1**

Use this to identify:
- Desktop product screens for carousel slides
- Mobile product screens for phone-mockup sections (device bezels)
- Any full-page product screenshot suitable for CoverScroll
- Hero media compositions

---

## What to inspect

### From the presentation slide (node 173-3402)

1. **The product story** — What is TODO++? What was the problem? What was designed? What were the outcomes?
2. **Design decisions** — What key decisions were made during the product redesign?
3. **Screenshots / frames** — Identify every product screenshot and its context (which screen, which state, which device)
4. **Metrics or outcomes** — Any real, verifiable outcomes mentioned (NOT the current fabricated metrics)
5. **Persona / user research** — Check if the presentation includes user research persona graphics. The owner likes the persona section as a storytelling device and wants to keep it if the images are real Figma exports.

### From the full app flows (node 18-64)

1. **Desktop screens** — Identify 3-5 key desktop screens that should become carousel slides in the case study
2. **Mobile screens** — Identify 1-3 key mobile screens that should render inside phone device bezels (the `phone-mockup` section type)
3. **Full-page screenshot** — Is there a full-page product screenshot suitable for CoverScroll auto-scroll?
4. **Hero composition** — Is there a device composition (laptop + phone, or laptop alone) suitable for hero media?

---

## What to produce

A PRD document at `docs/qa/todo-case-study-rewrite-prd.md` following the Draftly PRD structure.

### Reference PRD

Study the Draftly case study source document for the expected format:
`docs/qa/draftly-case-study-source-for-chatgpt.md`

Your PRD must follow the same section-by-section structure.

### Required PRD sections

#### 1. Product story summary

A 2-3 paragraph summary of TODO++ based on the Figma presentation. This replaces the current generic overview. Be specific, editorial, evidence-based. No AI hype.

#### 2. Section restructuring

Map the current 10 sections to a new editorial structure. The current TODO++ case study has:

| # | Type | Heading |
|---|---|---|
| 1 | text | Understanding the problem |
| 2 | image-pair | User research — personas |
| 3 | text | Defining the principles |
| 4 | full-image | Redesigned interface |
| 5 | text | The intelligent inbox |
| 6 | full-image | Onboarding flow |
| 7 | metrics | Impact |
| 8 | text | Collaboration with engineering |
| 9 | full-image | (no heading) |
| 10 | text | What I learned |

Your new structure should follow the Travecs/Draftly chapter grouping pattern:

- `executive-summary` (Problem / Solution / Outcome) — no chapter
- `what-i-designed` (feature cards) — no chapter
- Context chapter: the real problem, design principles
- Solution chapter: key screens, design decisions, personas
- Results chapter: verifiable outcomes (NOT fabricated metrics)
- Reflection chapter: constraints, key decisions, lessons

#### 3. Section-by-section specification

For each section in your new structure, specify:
- Section type (`executive-summary`, `what-i-designed`, `text`, `image-pair`, `full-image`, `carousel`, `phone-mockup`, `results`, `constraints`, `key-decisions`)
- Heading
- `chapter` value (if applicable)
- `navLabel` value (if applicable — only for key navigation sections)
- Full body copy or content specification
- Image references (placeholder paths)

#### 4. Asset requirements

Specify every image needed, with:
- Placeholder file path (under `public/images/case-studies/todo-app/`)
- Description of what the image should contain
- Source (presentation slide or full app flows node)
- Whether it's a desktop frame (carousel) or mobile frame (phone-mockup)

Directory structure:
```
public/images/case-studies/todo-app/
├── todo-app-landing-page-full.webp    # CoverScroll
├── todo-app-hero.webp                 # Hero media
├── carousel/
│   ├── todo-app-*.webp                # Desktop product frames (3-5)
└── phone/
    ├── todo-app-phone-*.webp          # Mobile product frames (1-3)
```

#### 5. Chapter mapping table

Old sections → new sections with rationale for each change.

#### 6. Non-negotiable facts

Preserve exactly:
- Category: "Productivity"
- Role: Verify from Figma — the current role is "Product design lead — UX, UI, design system"

#### 7. What to remove

- Fabricated metrics (32% churn reduction, +28% task completion, +45% feature discovery, +18 pts NPS)
- Generic placeholder content that doesn't match the Figma source

#### 8. What to keep

- **User research personas section** — The owner likes this as a storytelling device. If the current persona images (`todo-app-persona-1.webp`, `todo-app-persona-2.webp`) are real Figma exports, keep them. If they're placeholders, specify replacement exports from Figma.

---

## Copy rules

- Editorial, clear, concise, active voice
- No AI hype, no fabricated metrics, no unsupported claims
- Use `<strong>` tags for emphasis in body text (matching existing pattern)
- Every claim must be traceable to the Figma source
- Writing voice should match Travecs and Draftly: specific, evidence-based, human

---

## Phone mockup identification

For each mobile screen you identify in the Figma file, specify:
- Which screen it is (e.g., "task detail view", "inbox", "settings")
- Whether it should be a single phone or part of a side-by-side pair
- What caption should appear below the phone
- Which chapter/section it belongs to

---

## Deliverable

Save the completed PRD to:
`docs/qa/todo-case-study-rewrite-prd.md`

Then report back with:
1. Summary of what you found in the Figma file
2. The complete PRD
3. Any questions or ambiguities that need resolution before Codex implements
