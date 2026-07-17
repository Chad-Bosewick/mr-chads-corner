# Portfolio Redesign — Design Specification

**Date:** 2026-07-17
**Status:** Approved (awaiting implementation planning)
**Approach:** Hybrid Evolution — preserve the Figma's editorial core, enrich with purposeful motion, interaction polish, and full accessibility/responsive coverage.

---

## 1. Product Vision & Positioning

### Audience
Hiring managers, design leaders, and product leads at digital product companies — people evaluating systems thinking, product strategy, and engineering collaboration capability.

### Core narrative arc
1. Who is Temi — establish identity and professional scope immediately
2. What problems you solve — product strategy, systems thinking, polished execution
3. Evidence through work — three case studies showing context, decisions, collaboration, outcomes
4. How you think — about design, systems, users, business, and working with engineers
5. Why contact you — clear, frictionless conversion

### Positioning
A product designer who thinks in systems and delivers polished, intentional digital experiences — not someone who produces attractive screens. The site should feel more like a thoughtful editorial piece than a conventional portfolio gallery.

### Key pages
- **Homepage** — narrative lede, professional identity, evidence of craft
- **Featured Case Studies** — index of 3 projects with editorial previews
- **TODO++ Case Study** — detailed long-form case study
- **Letters App Case Study** — detailed long-form case study
- **Enviodeck** — coming-soon or mini case study (decision TBD)
- **About Temi** — professional background, thinking, personality
- **Contact** — conversion point with multiple options
- **404** — thoughtful fallback that maintains brand

---

## 2. Information Architecture & Navigation

### Sitemap
```
/                                              → Homepage
/featured-case-studies                         → Case study index (3 projects)
/featured-case-studies/todo-app                → TODO++ case study
/featured-case-studies/letters-app             → Letters App case study
/featured-case-studies/enviodeck               → Enviodeck (coming-soon or mini page)
/about-temi                                    → About, background, thinking
/contact                                       → Contact & conversion
```

### Navigation (desktop)
- Top-right horizontal text menu: **Home · Featured case studies · About Temi · Contact**
- Active page: burnt orange (#A43718) SemiBold
- Inactive: dark (#151515)
- Underline grows from center on hover (scaleX 0→1, 200ms ease-out)
- No logo/mark in nav (clean, text-led per Figma)

### Navigation (mobile)
- 24px hamburger icon → full-screen overlay slides in from left (300ms spring)
- Black textured background, white links, current page in grey
- Circular close button top-right
- Links stagger in at 40ms intervals during open
- Keyboard ESC closes, focus trap while open, body scroll lock

### Content width system
- Desktop: 1038px content, ~200px margins
- Mobile: 370px content, ~16px margins
- Tablet/intermediate: fluid `clamp()` interpolation between these

### Footer
- Background: #0F0F0F
- Lora Italic quotation (16px desktop, 12px mobile)
- Social links

---

## 3. Technical Architecture

### Stack
- **Framework:** Next.js 15 (App Router) — static generation
- **Language:** TypeScript — strict mode
- **Styling:** Tailwind CSS v4 with CSS custom property tokens
- **Animation:** Motion (formerly Framer Motion) — purposeful, restrained
- **Fonts:** Plus Jakarta Sans + Lora Italic — self-hosted via next/font

### Project structure
```
src/
  app/                    # Next.js App Router pages
    layout.tsx             # Root layout, fonts, metadata, paper texture
    page.tsx               # Homepage
    featured-case-studies/
      page.tsx             # Case study index
      [slug]/
        page.tsx           # Individual case study
    about-temi/
      page.tsx             # About page
    contact/
      page.tsx             # Contact page
    not-found.tsx          # 404 page
  components/
    layout/                # Shell, navigation, footer
    ui/                    # Button, link, tag, divider, visually-hidden
    sections/              # Page-level section components
    case-study/            # Case study specific components
  lib/                     # Utilities, helpers, constants
  content/                 # Case study data (TS/MDX files)
  styles/                  # Global styles, paper texture reference
```

### Rendering
- All pages statically generated at build time
- Minimal client components — only animation and interactive elements
- Netlify static deployment (current host)

### Content model
Case studies as structured data files with typed schema:
- title, slug, role, category, tags, description
- metrics (optional), images (array with alt text)
- body content (MDX or section-based)
- status (published | coming-soon)

---

## 4. Design Token System

### Colour tokens
| Token | Value | Usage |
|-------|-------|-------|
| `--color-text-primary` | `#151515` | Body, headings, inactive nav |
| `--color-accent` | `#A43718` | Active nav, links, emphasis |
| `--color-text-muted` | `#757575` | Secondary labels, dates, status |
| `--color-bg-footer` | `#0F0F0F` | Footer background |
| `--color-text-on-dark` | `#FFFFFF` | Text on dark backgrounds |
| `--color-bg-page` | paper texture | Page background |
| `--color-focus-ring` | `#A43718` | Focus-visible ring |

### Typography scale
| Level | Desktop | Mobile | Weight |
|-------|---------|--------|--------|
| Display heading | 48px | 32px | Plus Jakarta Sans Medium |
| Section heading | 32px | 24px | Plus Jakarta Sans Medium |
| Project title | 24px | 20px | Plus Jakarta Sans Medium |
| Body | 16px | 14px | Plus Jakarta Sans Regular |
| Small / meta | 14px | 12px | Plus Jakarta Sans Regular |
| Footer quote | 16px | 12px | Lora Italic |
| Navigation | 16px | 24px (mobile menu) | Plus Jakarta Sans Medium |

### Spacing scale
`4, 8, 12, 16, 24, 32, 40, 56, 64, 80, 96, 128` (extracted from Figma patterns, extended for consistency)

### Motion tokens
- **Duration:** fast (150ms), standard (300ms), slow (500ms), reveal (700ms)
- **Easing:** ease-out for exits, ease-in-out for emphasis, spring for menu (tension: 180, friction: 25)
- **Stagger:** 40ms for mobile menu links, 80ms for content block reveals, 100ms for project rows
- **Reduced motion:** `prefers-reduced-motion` disables all animation, reveals are instant, page transitions instant

### Responsive system
- Content width: `clamp(370px, 85%, 1038px)`
- Typography: fluid via `clamp()` so no breakpoint jumps
- Navigation breakpoint: ~768px (horizontal → hamburger)

---

## 5. Component Architecture

### Layout shell
- `RootLayout` — fonts, metadata, paper texture background, skip link
- `Nav` — desktop horizontal menu / mobile hamburger + full-screen overlay
- `Footer` — dark background, Lora Italic quote, social links

### UI primitives
- `Link` — text link with hover, focus-visible, visited, external states; underline animation
- `Button` — primary (filled), secondary (outlined), ghost (text only); full interaction states
- `Tag` — project category labels (ExtraLight, small)
- `Divider` — horizontal rule
- `VisuallyHidden` — accessible screen-reader-only utility

### Page sections
- `HeroHeading` — display headline (48px → 32px) with optional subtitle and scroll reveal
- `TextSection` — body copy paragraph block with consistent spacing and reveal animation
- `ProjectRow` — editorial project listing (260px image + 738px text + hover interaction)
- `ImageBlock` — responsive art-directed image with shadow stack, alt text, optional caption
- `TestimonialBlock` — quotation with attribution and styling
- `InterestRow` — About page hover-reveal items (with tap/click fallback for touch devices)
- `SectionReveal` — wrapper that applies scroll-triggered chapter-turn animation

### Case study components
- `CaseStudyLayout` — consistent page shell for long-form content
- `ContentSection` — heading + body block for narrative chapters
- `ImagePair` — side-by-side or stacked images
- `MetricBar` — key results display
- `ProjectNav` — previous/next project navigation

### State coverage (every interactive component)
Default → hover → focus-visible → active → (disabled/loading where relevant) → mobile/touch equivalent

---

## 6. Motion & Interaction Language

### Philosophy
Motion should feel like turning pages in a carefully designed book — tactile, deliberate, rhythmic. Not decorative — editorial.

### Scroll-driven narrative
- **Chapter reveals:** Each major section enters with a subtle horizontal shift (8-12px) + opacity fade, like turning to the next spread. 700ms, custom cubic-bezier.
- **Content blocks:** Staggered at 80ms intervals for the first visible group only — subsequent groups reveal without re-animating.
- **Project rows:** Sequential stagger at 100ms. Image slides from 4px offset, text fades with slight rightward drift (2px). Walking-across-a-gallery feel.

### Micro-interactions
- **Nav hover:** Underline grows from center outward (scaleX 0→1, 200ms ease-out). Inactive items shift to accent at 30% opacity.
- **Project row hover:** Image lifts 2px with shadow deepening. "Read case study" underline expands. 1px left border fades in from accent — bookmark feeling.
- **Link hover:** Underline animates from left (150ms ease-out). External links get a -5deg arrow rotation.
- **Page transitions:** Subtle page-level fade (200ms) between routes with content cross-fade.

### Accessibility
- All motion controlled by a single `--motion-reduced` custom property
- `prefers-reduced-motion` disables all animation
- No parallax, no scroll-jacking, no auto-playing motion
- Hover-only interactions have tap/click and keyboard fallbacks

---

## 7. Quality & Accessibility Baseline

### Accessibility
- Semantic HTML landmarks (`<nav>`, `<main>`, `<footer>`, `<section>`)
- Heading hierarchy (one h1 per page, sequential h2-h6)
- Keyboard navigation with visible focus-visible rings (`#A43718`)
- Mobile menu: focus trap, ESC close, aria-expanded, role="dialog"
- Images: meaningful alt text, decorative images as CSS background or aria-hidden
- Colour contrast: WCAG 2.2 AA minimum on all text/background pairs
- Touch targets: minimum 44x44px
- Reduced motion: all animations disabled when preferred

### Performance
- JS payload under 100KB gzipped
- Fonts self-hosted via next/font (zero external font requests)
- Responsive images via next/image: WebP/AVIF, lazy loading, explicit dimensions
- Paper texture: optimised small WebP (10-20KB) with CSS fallback colour
- Core Web Vitals: LCP < 2s, CLS < 0.1, INP < 200ms
- Minimal client components — animation loaded only where used

### Responsive
- Fluid `clamp()` system for content width and typography (no breakpoint jumps)
- Navigation collapses at ~768px
- Project rows stack vertically at tablet width
- No fixed heights on any container
- Test across: 375px, 402px, 768px, 1024px, 1440px, 1920px

### Content quality
- Copy refresh pass to address audit findings (spelling, consistency, tone)
- Professional naming standardised (Temi Adekunle throughout)
- Emoji usage intentionally resolved (editorial restraint vs. personality — decide per context)

---

## 8. Roadmap & Phasing

### Phase 1 — Foundations (Sprint 1)
- Next.js + TypeScript + Tailwind v4 project setup
- Design token system (CSS custom properties)
- Global layout shell (paper texture, nav, footer)
- Font loading and typography system
- Route structure and static generation config
- Accessibility primitives (skip links, landmarks, focus styles, reduced-motion hook)
- Motion foundation (animation tokens, scroll reveal utility)
- Responsive fluid system (clamp-based)
- Image pipeline and paper texture optimisation

### Phase 2 — Homepage
- Editorial hero section with narrative hook
- Scroll-driven section reveals
- Project row previews with interaction states
- Responsive at all widths
- Performance verification

### Phase 3 — Case Study System
- Case study layout template
- Content model and structured data files
- TODO++ full case study
- Letters App full case study
- Enviodeck page (treatment TBD)
- Previous/next project navigation
- Reading progress indicator (optional)

### Phase 4 — About & Contact
- About page with hover-reveal interest items (touch-compatible)
- Professional narrative and testimonial
- Contact page with email + LinkedIn + optional scheduling

### Phase 5 — Polish & QA
- 404 page
- Copy quality refresh
- Accessibility audit pass
- Responsive audit across all breakpoints
- Motion audit with reduced-motion verification
- SEO metadata, social previews, sitemap
- Performance measurement and optimisation

### Phase 6 — Deploy
- Build configuration for Netlify static export
- Domain configuration
- Final pre-release QA
- Release

---

## 9. Key Decisions & Assumptions

| Decision | Status |
|----------|--------|
| Build new project (greenfield) | Confirmed — no existing repo to migrate |
| Stack: Next.js 15 + TS + Tailwind v4 + Motion | Confirmed |
| Content: structured data files (no CMS) | Confirmed |
| Motion: editorial page-turn philosophy | Confirmed |
| Approach: Hybrid Evolution from Figma | Confirmed |
| Enviodeck treatment (coming-soon vs. mini case study) | TBD — decision during Phase 3 |
| Figma copy refresh needed | Confirmed — addressed in Phase 5 |
| Tablet breakpoint and intermediate widths | Fluid system — no additional Figma frames needed |

---

## 10. References

- **FIGMA_AUDIT.md** — `/FIGMA_AUDIT.md` (full audit findings from ChatGPT)
- **CLAUDE.md** — `/CLAUDE.md` (master project orchestration prompt)
- **Master prompt** — `/mr-chad-portfolio-redesign-claude-code-master-prompt.md`
- **Live site** — `https://mrchad.netlify.app/`

---

## 11. Resolved Decisions

| Question | Decision |
|----------|----------|
| Enviodeck treatment | Coming-soon page (not a full case study) |
| Content copy refresh | Yes — prepare as a ChatGPT review pass during Phase 5 |
| Tablet breakpoint verification | Implementation-decided — fluid clamp system, no Figma reference needed |
| Analytics | Lightweight option — Plausible or Vercel Analytics based on simplicity |
| Contact form | Best practice: mailto link + LinkedIn + scheduling link |
