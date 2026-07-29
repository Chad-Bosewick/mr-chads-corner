# Codex Task — Letters App Case Study Rewrite

## Objective

Rewrite the `lettersApp` case-study object in `src/content/case-studies.ts` to match the established chaptered editorial structure used by TODO++ and Travecs. This is a **data-only rewrite** — no new components, types, or layout changes are needed.

## Input files to read first

1. `src/content/case-studies.ts` — study the `todoApp` object (recently rewritten) and the `credlane` object (lines 267-609) as structural references for chapter grouping, nav labels, section rhythm, and data structure
2. `docs/qa/letters-case-study-rewrite-prd.md` — the ChatGPT-authored PRD specifying every section, copy, and asset path
3. `tasks/2026-07-27-codex-todo-case-study-rewrite.md` — the format exemplar for this task

---

## Scope

**Replace the entire `lettersApp` export** (currently lines 292-366) with the new structure below. No other case study objects should be modified.

### What does NOT need to change

- `ContentSection` type union — `"phone-mockup"` already exists (line 19)
- `phoneMockupImages` field — already exists on `ContentSection` (lines 57-61)
- `PhoneMockupSection` component — already exists at `src/components/case-study/PhoneMockupSection.tsx`
- `CaseStudyLayout.tsx` — already handles `case "phone-mockup"` (lines 211-218)
- `src/content/projects.ts` — do not modify

---

## Top-level fields

```typescript
export const lettersApp: CaseStudy = {
  slug: "letters-app",
  title: "Letters App",
  category: "Communication",
  role: "Sole product designer — end-to-end product design",
  timeline: "2024",
  overview:
    "Letters App was conceived as a response to the always-on, notification-driven nature of modern messaging. The premise was simple: what if digital communication could feel more like writing a letter than sending a text message? The challenge was designing a platform that encouraged thoughtfulness and intentionality without feeling slow, heavy, or impractical for everyday use.",
  subtitle:
    "A digital space for letters worth returning to.",
  coverSrc: "/images/case-studies/letters-app-cover.webp",
  heroMedia: {
    src: "/images/case-studies/letters-app/letters-app-hero.webp",
    alt: "Letters App web homepage and iPhone writing composition displayed together",
  },
  coverScroll: {
    src: "/images/case-studies/letters-app/letters-app-landing-page-full.webp",
    alt: "Letters App full web homepage — recent and continuing letter correspondence",
    sections: [],
  },
  meta: {
    role: "Sole product designer — end-to-end product design",
    timeline: "2024",
    date: "2024",
    platform: "Responsive web and iPhone app",
    team: "Solo product design",
    scope: "Product concept, UX, UI, design system",
    status: "Presentation-ready concept",
  },
  sections: [
    // ... 12 sections below ...
  ],
  nextSlug: "credlane",
  prevSlug: "todo-app",
};
```

---

## Section 1: Executive Summary (no chapter)

```typescript
{
  type: "executive-summary",
  heading: "A digital space for letters worth returning to",
  executiveSummary: {
    problem: "Most communication products optimise for immediacy. That makes it easy to send a message, but leaves little room for a story, a response with context, or a record worth returning to.",
    solution: "Letters App reframes digital correspondence as a composed letter. Its web and mobile experiences support discovery, long-form reading, replying, writing, image and theme choices, preview, and posting.",
    outcome: "A presentation-ready, responsive communication-product concept with complete web home and letter-reading views, a detailed iPhone writing flow, onboarding, sent/received letters, and pals. No business or behavioural metric is claimed.",
  },
},
```

## Section 2: What I Designed (no chapter)

```typescript
{
  type: "what-i-designed",
  heading: "What I designed",
  designedFeatures: [
    {
      name: "Web home and discovery",
      description: "Recent posts, continuing reads, navigation, and search in a spacious letter-first layout.",
    },
    {
      name: "Long-form reading and reply",
      description: "A desktop letter view with author, date, imagery, location moments, and a direct reply action.",
    },
    {
      name: "Mobile writing flow",
      description: "Compose, select or generate imagery, choose a visual treatment, preview, and post.",
    },
    {
      name: "Personal correspondence spaces",
      description: "Sent and received letters plus a pals view that makes the network of people visible.",
    },
    {
      name: "Onboarding",
      description: "A mobile entry screen that introduces the product promise and gives clear sign-in and sign-up actions.",
    },
  ],
},
```

## Section 3: Communication With Room to Mean Something (Context)

```typescript
{
  type: "text",
  heading: "Communication with room to mean something",
  chapter: "context",
  navLabel: "Context",
  body: "<strong>Letters App makes a case for a different pace of communication.</strong> The product is organised around reading, writing, and replying to stories that need more than a few lines. The design gives a letter its own space, preserving its author, date, images, places, and the invitation to respond.",
},
```

## Section 4: Designing for Reading, Reflection, and Reply (Context)

```typescript
{
  type: "key-decisions",
  heading: "Designing for reading, reflection, and reply",
  chapter: "context",
  outcomeBullets: [
    {
      label: "Let letters read like letters",
      description: "Protect generous typography, a clear reading column, and space for images.",
    },
    {
      label: "Keep the reply close to the story",
      description: "Make responding feel like a continuation, not a context switch.",
    },
    {
      label: "Make authorship visible",
      description: "Surface the writer, date, imagery, and place where the letter provides them.",
    },
    {
      label: "Turn writing into a guided sequence",
      description: "Composition, visual treatment, preview, and posting each have a clear state.",
    },
  ],
},
```

## Section 5: A Web Home for Returning to Letters (Solution)

```typescript
{
  type: "full-image",
  heading: "A home built for returning to stories",
  chapter: "solution",
  navLabel: "Solution",
  body: "<strong>The web home prioritises correspondence over a generic social feed.</strong> Continue Reading and Recent Posts give the reader two useful ways back into the product, while search and primary navigation stay available without competing with the letters.",
  images: [
    { src: "/images/case-studies/letters-app/carousel/letters-app-web-home.webp", alt: "Letters App web homepage — browse recent and continuing letter correspondence", caption: "The web home — recent posts and continuing reads in a letter-first layout", width: 1440, height: 850 },
  ],
},
```

## Section 6: Reading and Replying on the Web — Carousel (Solution)

```typescript
{
  type: "carousel",
  heading: "A letter can hold a whole journey",
  chapter: "solution",
  body: "Use one wide web state per slide: the web home, the full reading view, the reply modal, and the expanded reply/editor state. <strong>Each slide must keep the long-form letter readable at portfolio scale.</strong>",
  images: [
    { src: "/images/case-studies/letters-app/carousel/letters-app-web-home.webp", alt: "Letters App web home — browse recent and continuing letters", caption: "Browse recent and continuing letters.", width: 1440, height: 850 },
    { src: "/images/case-studies/letters-app/carousel/letters-app-web-letter.webp", alt: "Letters App web letter view — long-form reading with imagery and location context", caption: "Read a letter with imagery and place context.", width: 1440, height: 850 },
    { src: "/images/case-studies/letters-app/carousel/letters-app-web-reply.webp", alt: "Letters App web reply modal — respond without leaving the letter", caption: "Reply without leaving the letter.", width: 1440, height: 850 },
    { src: "/images/case-studies/letters-app/carousel/letters-app-web-compose.webp", alt: "Letters App web compose editor — focused writing surface", caption: "Compose in a focused writing surface.", width: 1440, height: 850 },
  ],
},
```

## Section 7: Writing a Letter Step by Step — Phone Mockup (Solution)

```typescript
{
  type: "phone-mockup",
  heading: "Writing is guided without taking over the author's voice",
  chapter: "solution",
  body: "<strong>The iPhone flow makes the editorial choices visible.</strong> The writer composes a letter, chooses imagery or a visual treatment, previews the result, and posts only when it is ready.",
  phoneMockupImages: [
    { src: "/images/case-studies/letters-app/phone/letters-app-phone-compose.webp", alt: "Letters App iPhone compose screen — write a letter and choose its visual treatment", caption: "Compose a letter and choose its visual treatment." },
    { src: "/images/case-studies/letters-app/phone/letters-app-phone-preview-post.webp", alt: "Letters App iPhone preview and post screen — review the finished letter before posting", caption: "Preview the finished letter before posting." },
  ],
},
```

## Section 8: Letters, Pals, and Onboarding — Phone Mockup (Solution)

This section has 3 phone images. Since `PhoneMockupSection` renders max 2 phones side-by-side, split into two sub-sections. First pair:

```typescript
{
  type: "phone-mockup",
  heading: "A correspondence product needs a clear way in and back",
  chapter: "solution",
  body: "The supporting mobile states establish the product beyond one letter: <strong>onboarding introduces its promise, My Letters separates sent and received correspondence, and My Pals makes the people behind the letters discoverable.</strong>",
  phoneMockupImages: [
    { src: "/images/case-studies/letters-app/phone/letters-app-phone-onboarding.webp", alt: "Letters App iPhone onboarding screen — welcome, log in, sign up", caption: "Welcome and sign-in entry point." },
    { src: "/images/case-studies/letters-app/phone/letters-app-phone-my-letters.webp", alt: "Letters App iPhone My Letters screen — sent and received letters", caption: "Sent and received letters." },
  ],
},
```

Third phone as a separate section:

```typescript
{
  type: "phone-mockup",
  heading: "The people behind the correspondence",
  chapter: "solution",
  phoneMockupImages: [
    { src: "/images/case-studies/letters-app/phone/letters-app-phone-my-pals.webp", alt: "Letters App iPhone My Pals screen — discover the people behind the letters", caption: "People behind the correspondence." },
  ],
},
```

## Section 9: Results (Results)

```typescript
{
  type: "results",
  heading: "What the concept delivered",
  navLabel: "Results",
  chapter: "results",
  outcomeBullets: [
    {
      label: "Responsive web experience",
      description: "Discovery and long-form letter reading across desktop and mobile viewports.",
    },
    {
      label: "Complete mobile correspondence flow",
      description: "Onboarding through writing, visual choices, preview, posting, sent/received letters, and pals.",
    },
    {
      label: "Coherent interaction model",
      description: "A letter carries story, imagery, place, author context, and a direct reply path.",
    },
  ],
},
```

## Section 10: Constraints (Reflection)

```typescript
{
  type: "constraints",
  heading: "A slower experience still needs to be easy to use",
  chapter: "reflection",
  outcomeBullets: [
    {
      label: "Typography and contrast requirements",
      description: "Long-form reading requires resilient typography, contrast, focus order, and image alt text.",
    },
    {
      label: "Designed screens, not measured outcomes",
      description: "The product concept is evidenced by designed screens, not by a measured accessibility study or live-product outcome.",
    },
    {
      label: "Interface concepts only",
      description: "The visual-assistance and image-generation states shown in the flow should be described only as interface concepts; do not claim autonomous writing or generated content quality.",
    },
  ],
},
```

## Section 11: Key Decisions (Reflection)

```typescript
{
  type: "key-decisions",
  heading: "Key decisions",
  navLabel: "Decisions",
  chapter: "reflection",
  outcomeBullets: [
    {
      label: "Use the web home as CoverScroll",
      description: "It is a true, continuous 1440 × 2388 product frame.",
    },
    {
      label: "Use wide web states in the carousel",
      description: "These are native responsive-web frames, not desktop treatments invented for the portfolio.",
    },
    {
      label: "Use iPhone exports in phone bezels",
      description: "The writing, preview, onboarding, My Letters, and My Pals states are all 375 × 812 mobile frames.",
    },
    {
      label: "Persona artifacts conditional on source",
      description: "Keep personality or communication analysis only if the final Stage 8 node contains those real artifacts. They are not needed to explain the primary product flow.",
    },
  ],
},
```

## Section 12: Closing Reflection (Reflection)

```typescript
{
  type: "text",
  heading: "Designing for a response worth writing",
  chapter: "reflection",
  body: "<strong>Letters App treats communication as something people can return to, not simply clear from an inbox.</strong> The work connects the calm of a long reading surface with the practical steps needed to create and send a reply. The next challenge would be validating whether this pace helps people build more meaningful correspondence.",
},
```

---

## Non-negotiable

- Slug must remain `"letters-app"`
- `nextSlug` / `prevSlug` must remain `"credlane"` / `"todo-app"`
- Category must remain `"Communication"`
- Role must remain `"Sole product designer — end-to-end product design"`
- Do NOT fabricate metrics, user quotes, or research claims
- Do NOT modify any case study other than `lettersApp`
- Do NOT modify `src/content/projects.ts`
- Do NOT create image files — use placeholder paths only
- Do NOT modify any component files, type definitions, or layout files

## Placeholder image paths

```
public/images/case-studies/letters-app/
├── letters-app-hero.webp                              # Hero media
├── letters-app-landing-page-full.webp                 # CoverScroll (full 1440×2388 frame)
├── carousel/
│   ├── letters-app-web-home.webp                      # Carousel slide 1 + section 5 full-image
│   ├── letters-app-web-letter.webp                    # Carousel slide 2 — long-form reading
│   ├── letters-app-web-reply.webp                     # Carousel slide 3 — reply modal
│   └── letters-app-web-compose.webp                   # Carousel slide 4 — compose editor
└── phone/
    ├── letters-app-phone-compose.webp                 # Phone mockup — compose
    ├── letters-app-phone-preview-post.webp            # Phone mockup — preview/post
    ├── letters-app-phone-onboarding.webp              # Phone mockup — onboarding
    ├── letters-app-phone-my-letters.webp              # Phone mockup — sent/received
    └── letters-app-phone-my-pals.webp                 # Phone mockup — pals
```

Homepage card cover image stays at: `public/images/case-studies/letters-app-cover.webp`

## Phase 4: Asset Export Reference

After Codex implements with placeholder paths, export real images from Figma. Use this table — each row maps a placeholder path to the exact Figma source node.

**Source file:** Stage 8 — Submission (`dpy3EFCFIbCQKg5RU6y1XN`)
**Export format:** 2× WebP, original frame bounds, no canvas/selection/browser chrome.

| # | Export to path | Figma node | Node ID | Size hint | Notes |
|---|---|---|---|---|---|
| 1 | `letters-app/letters-app-hero.webp` | `Web Homepage` | `274:1786` | Wide | Choose composition showing both web and mobile; no invented device mockup |
| 2 | `letters-app/letters-app-landing-page-full.webp` | `Web Homepage 2` | `274:1818` | 1440 × 2388 | Full continuous frame — this is the CoverScroll source |
| 3 | `letters-app/carousel/letters-app-web-home.webp` | `Web Homepage 2` | `274:1818` | 1440 × 850 | Crop to the browse/continue-reading area for carousel |
| 4 | `letters-app/carousel/letters-app-web-letter.webp` | `Reply/Create a letter` (web reading) | `293:3667` | 1440 × 850 | Long-form reading with imagery and location |
| 5 | `letters-app/carousel/letters-app-web-reply.webp` | Reply modal (in web letter frames) | `293:3667` or nearby | 1440 × 850 | In-context reply modal state |
| 6 | `letters-app/carousel/letters-app-web-compose.webp` | Web editor frame | `293:3843` | 1440 × 850 | Focused composition surface |
| 7 | `letters-app/phone/letters-app-phone-compose.webp` | `Write a letter` — compose state | `274:2651` | 375 × 812 | Compose and choose visual treatment |
| 8 | `letters-app/phone/letters-app-phone-preview-post.webp` | `Write a letter` — `Homepage post 33` | `274:2372` | 375 × 812 | Preview and post |
| 9 | `letters-app/phone/letters-app-phone-onboarding.webp` | `onboarding1` | `2001:883` | 375 × 812 | Welcome, log in, sign up |
| 10 | `letters-app/phone/letters-app-phone-my-letters.webp` | `My letters 2` | `274:2396` | 375 × 812 | Sent and received letters |
| 11 | `letters-app/phone/letters-app-phone-my-pals.webp` | Final My Pals mobile frame | Search Submission canvas | 375 × 812 | Correspondence network |

> **Note:** Node `274:1784` is the top-level Stage 8 Submission frame. Use `get_metadata` or `get_screenshot` on individual child nodes above to locate exact export targets.

## Image migration from current flat paths

| Current path | New path | Notes |
|---|---|---|
| `letters-app-cover.webp` | Keep as-is | Homepage card |
| `letters-app-homepage-post-1.webp` | `letters-app/phone/letters-app-phone-compose.webp` | Pending Stage 8 replacement |
| `letters-app-homepage-post-2.webp` | `letters-app/phone/letters-app-phone-preview-post.webp` | Pending Stage 8 replacement |
| `letters-app-my-letters.webp` | `letters-app/phone/letters-app-phone-my-letters.webp` | Direct rename |
| `letters-app-my-pals.webp` | `letters-app/phone/letters-app-phone-my-pals.webp` | Direct rename |
| `letters-app-persona-details.webp` | Do not migrate | Retain only if confirmed as real Stage 8 artifact |
| `letters-app-personality-analysis.webp` | Do not migrate | Retain only if confirmed as real Stage 8 artifact |
| `letters-app-showcase.webp` | Superseded | Do not use as primary visual |

## Verification

After implementation, run:

1. `npx tsc --noEmit` — must pass
2. `npm run lint` — must pass
3. Dev server starts and renders the Letters App case study page at `/featured-case-studies/letters-app/`
4. All 12 sections render without errors
5. Chapter dividers appear between context → solution → results → reflection
6. Sidebar navigation shows Context, Solution, Results, and Decisions labels
7. CoverScroll renders with the placeholder path
8. Phone mockup sections render correctly: compose/preview pair side-by-side, onboarding/my-letters pair side-by-side, my-pals centered alone
9. All placeholder image paths are syntactically valid (actual images come later)

## Required output

Return:

1. **Implementation summary** — what changed, what was preserved, what's placeholder
2. **Files changed** — list with brief description of changes per file
3. **Deviations or assumptions** — anything you couldn't follow from the PRD and why
4. **Placeholders awaiting imagery** — list all placeholder image paths
5. **Build verification** — TypeScript, ESLint status
6. **Known limitations** — anything that might need follow-up
