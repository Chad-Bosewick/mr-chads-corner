# CV / Resume Page — Design Specification

> **Replaces the existing About Temi page** at `/about-temi`.
> Design approved via brainstorming flow. All 6 sections validated.

---

## 1. Executive Snapshot

**Hero section** — answers "who is this?" in 5 seconds.

- **Name:** Temi Adekunle (h1, `clamp(2rem,5vw,3rem)`)
- **Tagline:** "Product designer with a bias toward clarity, systems thinking, and work that holds up under scrutiny."
- **Three-column "what I do" grid:**
  - **Systems Thinker** — biochemistry background, information architecture, design-system thinking
  - **Design System Builder** — 40+ components (Candidote), 50+ components (Enviodeck)
  - **AI-Native Operator** — daily use of ChatGPT, Claude, Codex, Perplexity; AI workflow design
- Each column: label (bold accent) + one-line explanation
- Responsive: 3 cols on desktop, 2 on tablet, stacked on mobile
- Uses existing `HeroHeading` and `SectionReveal`

## 2. Professional Summary

Brief narrative paragraph — biochemistry → product design → AI workflows — framed as the thread connecting the roles below.

- Positioned inside `ReadingColumn` + existing `TextSection`
- Three staggered `SectionReveal` paragraphs (delay: 80/160/240) matching current page pattern
- Content: systems thinking from biochemistry, startup product design work, self-taught UX, current shift into AI-native workflows
- Tone: specific, evidence-based, human. "Looking at the world through a systems lens" framing

## 3. Experience Timeline

Chronological experience with narrative hooks — not just dates and titles.

Each role rendered as:
- **Title + Company** (bold heading)
- **Date range + Location** (muted text, small)
- **Context hook** — one sentence framing the situation
- **Key contributions** — 3-4 bullet points focused on real scope: screens designed, components built, team size, timeframes
- No fabricated metrics. Use real counts: screens designed, components built, collaboration scope.

### Roles (in order):

| Role | Company | Period | Location |
|---|---|---|---|
| Product Designer / Founder-Side Operator | Candidote | Aug 2025 - Mar 2026 | Fully remote, 3-person team |
| Lead Designer / Product Operations Collaborator | Enviodeck | Mar 2026 - Present | Start-up design systems |
| Customer Experience / Digital Operations | UBA | Earlier role | Lagos, Nigeria |

### Design Systems callout (inline with timeline or adjacent):

Side-by-side or stacked comparison of the two design systems:
- **Candidote Design System:** 40+ components, built across 8-month engagement for a small 3-person team
- **Enviodeck Design System:** 50+ components, ongoing work
- Specs: component count, types of components, tools used (Figma, variants, auto-layout)

### Section behavior

- Each role wrapped in `SectionReveal` with staggered delay
- Responsive: single-column on all breakpoints, max reading width
- Expand/collapse optional — content visible by default, the narrative hook does the work of drawing the reader in

## 4. Skills & Tools

Compact grouped reference — not a main attraction, but easy to scan.

Groups:
- **Product Design:** UX research, information architecture, interaction design, visual design, prototyping, design systems
- **AI Workflows:** Prompt engineering, AI-assisted product design, code generation workflows, tool orchestration
- **Tools:** Figma, Framer, Notion, Linear, ClickUp, Miro, Canva, ChatGPT, Claude, Codex, Perplexity, Google Analytics, Slack, Airtable

Layout:
- Desktop: 3-column grid
- Tablet: 2 columns  
- Mobile: 1 column
- Skill tags in compact chips or simple list
- No progress bars or percentage ratings

## 5. Education & Certifications

Compact, bottom-of-page section.

- **University of Lagos** — Biochemistry (background)
- **Google UX Design Certificate** — Coursera

Laid out as a simple list with dates, no embellishment.

## 6. Interests Collage — "Do we have similar interests?"

### Heading
- `h2`: "Do we have similar interests?"
- Subtitle: "A few things I'm into — beyond the work." (placeholder, refine in content pass)

### Grid layout

**Desktop (1120px container):** 3-column asymmetric grid
| Row 1 | Row 2 | Row 3 |
|---|---|---|
| Education (2 cols) | Sports (1 col) | — |
| Books (1 col) | Films (1 col) | Podcasts (1 col) |
| Gaming (full width, 3 cols) | | |

**Tablet (~768px):** 2-column grid. Education spans full width. Gaming spans full width.
**Mobile (~375px):** Single column stack. Asymmetry collapses.

### Interest cards (6)

| Category | Details | Emoji |
|---|---|---|
| Education | University of Lagos, Google UX Design (Coursera) | 🎓 |
| Sports | Chelsea FC, Formula 1, NBA | ⚽ |
| Books | George R.R. Martin | 📖 |
| Films | Quentin Tarantino, James Cameron | 🎥 |
| Podcasts | Steven Bartlett, The space between | 🎙️ |
| Gaming | GTA VI, Red Dead Redemption, Call of Duty | 🎮 |

### Card design
- Full-bleed stock image background with dark gradient overlay (`from-black/60 via-black/30 to-transparent` or similar)
- Category name in bottom-left: Plus Jakarta Sans, medium weight, light color (`#f5f2ee` or white)
- Default: image visible, category label shown
- Hover (mouse): image scales ~5%, overlay deepens, category details fade in (emoji + full list of items)
- Focus-visible: `outline-2 outline-offset-2 outline-[#A43718]`
- Tap/click (touch): toggle open/close with persistent state
- `prefers-reduced-motion`: no scale transform, details appear on tap/click with opacity only

### Stock image sourcing
- Source: Unsplash via API or curated download
- Each image should be evocative, not literal or generic
- Dark/moody tones preferred for natural gradient blending
- No logos, branded content, or trademarked imagery
- Sourcing to be done by Codex during implementation and documented

### Loading & error states
- Loading: soft skeleton placeholder matching card aspect ratio
- Error: fallback dark card with category name and emoji visible, no image
- Both states covered within the `InterestCard` component

### Interaction states summary
| State | Visual |
|---|---|
| Default | Image + category label |
| Hover | Scale 105% + detail fade-in |
| Focus-visible | Outline ring (#A43718) |
| Active/Tap | Toggle details |
| Reduced motion | No scale; details via opacity only |
| Loading | Skeleton placeholder |
| Error | Dark fallback card |

---

## Component Architecture

### New component: `InterestCard`
Props: `imageSrc`, `category`, `items`, `emoji`, `alt`
States: default, hover, focus-visible, active, reduced-motion, loading, error

### New component: `InterestGrid`
Arranges `InterestCard` children in the asymmetric grid pattern.
Responsive: 3-col → 2-col → 1-col.
Handles the grid layout and gap spacing only.

### New component: `ExperienceTimeline`
Renders an ordered list of `ExperienceItem` components.
Each item: title, company, date range, location, context, contributions.

### New component: `SkillsGrid`
Groups skills into labeled categories, renders as responsive grid.

### New component: `ExecutiveSnapshot`
Layout container for the 3-column "what I do" grid.

---

## Dependencies

- **Existing:** `PageShell`, `ReadingColumn`, `SectionReveal`, `HeroHeading`, `TextSection`, `StaggerContainer`
- **New:** `InterestCard`, `InterestGrid`, `ExperienceTimeline`, `SkillsGrid`, `ExecutiveSnapshot`
- **External:** Unsplash API or manually sourced + downloaded images (decision to be made during implementation)
- **No new animation, state management, or utility libraries needed**

---

## Route & Navigation

- Route stays at `/about-temi`
- Nav label unchanged: "About Temi"
- Metadata title updated: "Temi Adekunle — CV / Resume"
- Metadata description updated to reflect full page scope

---

## Responsive Behaviour Summary

| Breakpoint | Snapshot | Timeline | Skills | Interests |
|---|---|---|---|---|
| ≥1200px | 3 cols | Full width | 3 cols | 3-col asymmetric |
| 768-1199px | 2 cols | Full width | 2 cols | 2-col symmetric |
| <768px | Stacked | Full width | 1 col | 1-col stack |
| Typography | Fluid type everywhere | | | |
| Touch | 44×44px min tap targets | | | |

---

## Accessibility Requirements

- Semantic heading hierarchy (h1 → h2 → h3 within cards)
- All images have descriptive alt text
- Interest cards: keyboard accessible, focus visible, toggle details via `aria-expanded`
- Reduced motion: no transform animations
- Color contrast: all text meets WCAG AA
- Touch targets: minimum 44×44px on all interactive elements
- `prefers-reduced-motion` respected at component level

---

## Acceptance Criteria

1. All 6 sections render on the page in order
2. Experience timeline shows real, verified scope (screen counts, team sizes, timeframes)
3. Interests collage uses globally sourced stock images, not previously exported travel photos
4. All interaction states work (default, hover, focus, active, tap, reduced-motion, loading, error)
5. Responsive layout works at 375px, 768px, and 1120px+
6. Build, type check, and lint pass without errors
7. SectionReveal scroll animations work consistently
8. Nav link to /about-temi remains functional
9. Metadata updated appropriately
10. `prefers-reduced-motion` disables all scale transforms in interest cards
