# Portfolio Website Full QA Review

## Review ID

QA-2026-07-18-001

## Review Date

2026-07-19

## Reviewed Build

Extracted project: `/tmp/portfolio-website.zip`

Local static preview: `http://localhost:4173`

Source QA brief: `docs/qa/2026-07-18-qa-review.md`

Figma reference: `FIGMA_AUDIT.md`, audit of Figma file `Portfolio` (`u2V5nuWFvE4iGhjfc0BXk0`)

## Overall Verdict

**Fail for production release.**

The implementation is stable enough for internal review: all required static routes are generated, the project typechecks, lints, tests, and builds successfully once Google Fonts are reachable. The visual system is coherent, responsive layout measurements show no horizontal overflow at 390, 768, 1024, or 1440px, and the core route structure is present.

It should not be released as final production yet. The main release risks are progressive-enhancement failure from hidden server-rendered content, incomplete mobile modal accessibility, sitemap/robots deployment mismatch, inconsistent Enviodeck publication state, small touch targets, clipped about-gallery captions, and a broader product-quality gap between the intended premium authored portfolio experience and the current restrained editorial implementation.

## Verification Performed

- Installed dependencies with `npm ci`
- Ran `npm run typecheck`: passed
- Ran `npm test`: passed, 3 test files / 8 tests
- Ran `npm run lint`: passed with no ESLint warnings or errors
- Ran `npm run build`: passed after allowing network access for `next/font` Google Fonts
- Served static export from `out/` on `http://localhost:4173`
- Checked required routes:
  - `/`
  - `/featured-case-studies`
  - `/featured-case-studies/todo-app`
  - `/featured-case-studies/letters-app`
  - `/featured-case-studies/enviodeck`
  - `/about-temi`
  - `/contact`
- Checked generated `robots.txt`, `sitemap.xml`, and `404.html`
- Tested rendered pages at 390px mobile, 768px tablet, 1024px laptop, and 1440px desktop
- Captured browser evidence in `docs/qa/screenshots/`
- Captured browser measurement data in `docs/qa/browser-qa-results.json`
- Compared implementation against the documented Figma audit findings where applicable
- Extracted the supplied links PDF and compared implemented social links against the source list

## Findings

### Critical: Server-rendered content is hidden before JavaScript runs

**Location:** All routes using `SectionReveal`; implementation in `src/components/sections/SectionReveal.tsx`

**Expected behaviour:** Core content should remain visible by default and be progressively enhanced with motion when JavaScript and IntersectionObserver are available.

**Actual behaviour:** Static HTML renders reveal sections with `translate-x-[8px] opacity-0`. If JavaScript is disabled, delayed, blocked, or hydration fails, primary content can remain invisible.

**Evidence:** Exported `out/index.html` contains initial `opacity-0` reveal wrappers around hero, text, dividers, project rows, and CTA sections.

**Impact:** This is a serious accessibility, resilience, and SEO quality risk. A portfolio must not depend on client JavaScript to reveal basic reading content.

### Critical: Mobile navigation modal is not fully accessible

**Location:** Mobile navigation, `src/components/layout/Nav.tsx` and `src/components/layout/NavMobile.tsx`

**Expected behaviour:** A full-screen modal menu should trap focus, restore focus to the opener when closed, support Escape globally while open, and provide practical touch targets.

**Actual behaviour:** The menu opens, locks scroll, uses `role="dialog"` and `aria-modal="true"`, and moves focus to the first link. However, there is no focus trap or focus restoration, and the open/close controls are 24x24px.

**Evidence:** Browser inspection at 390px showed the open button as 24x24 and the close button as 24x24. No focus-trap logic exists in `NavMobile.tsx`.

**Impact:** Keyboard and touch users can have a degraded or confusing navigation experience.

### Major: Sitemap and robots use a hardcoded production host

**Location:** `src/app/sitemap.ts`, `src/app/robots.ts`

**Expected behaviour:** Sitemap and robots should reflect the actual production domain or be configurable by environment.

**Actual behaviour:** Both files hardcode `https://mrchad.netlify.app`, regardless of preview or future custom domain.

**Impact:** Deploying this build to a preview or final custom domain creates incorrect discoverability signals and can confuse crawlers.

### Major: Enviodeck public state is inconsistent

**Location:** `/featured-case-studies`, `/featured-case-studies/enviodeck`, `sitemap.xml`, case-study navigation

**Expected behaviour:** A coming-soon project should have one consistent public policy: either it is intentionally indexable as a teaser page, or it is excluded from public routes and sitemap.

**Actual behaviour:** The case-study index disables the Enviodeck row by linking it to `#` with `tabIndex={-1}`, but the site still generates `/featured-case-studies/enviodeck`, includes it in the sitemap, and links to it as the next project from the Letters App case study.

**Impact:** Users and crawlers receive mixed signals. The user can reach a page that the project index implies is unavailable.

### Major: The current experience is still too restrained for the approved product vision

**Location:** Overall UX/UI across homepage, case index, case studies, and about page

**Expected behaviour:** The site should feel authored, premium, exploratory, technically refined, and closer to a crafted digital product than a conventional portfolio.

**Actual behaviour:** The current implementation is clean and readable, but mostly behaves like a minimal editorial portfolio: paper texture, centered content, text-led sections, simple rows, and restrained reveal animation. The Figma audit also classified the underlying direction as closer to minimal editorial than the richer cinematic experience requested in the redesign brief.

**Impact:** The site is competent, but not yet differentiated enough to satisfy the stated taste direction.

### Major: Case-study evidence is not strong enough for final portfolio credibility

**Location:** `/featured-case-studies/todo-app`, `/featured-case-studies/letters-app`

**Expected behaviour:** Case studies should explain context, constraints, decisions, rejected alternatives, collaboration, evidence, outcomes, and what changed.

**Actual behaviour:** The case studies are readable and structured, but some claims and metrics appear unsupported in the page itself. Examples include churn reduction, task completion increases, NPS lift, retention, and daily active users without sourcing, framing, or evidence artifacts.

**Impact:** The work may read as polished but less trustworthy than intended, especially for hiring managers or senior product reviewers.

### Major: About gallery captions are visually compromised

**Location:** `/about-temi`, travel gallery

**Expected behaviour:** Captions should be legible, consistently positioned, and not clipped or visually swallowed by image containers.

**Actual behaviour:** The figures use `overflow-hidden`, and captions are placed inside those figures after the image wrapper. On desktop screenshots, captions appear tiny and visually embedded/clipped near the bottom of images instead of reading as proper captions.

**Impact:** The gallery feels less polished than the rest of the site and weakens the authored/premium presentation.

### Major: Missing implementation of several Figma-audit design gaps

**Location:** Global design system and interaction states

**Expected behaviour:** The implementation should either resolve or explicitly document the Figma audit gaps: tokens, reusable components, hover/focus/pressed states, responsive assumptions beyond two breakpoints, mobile menu accessibility details, and motion behavior.

**Actual behaviour:** The implementation includes some tokens and states, but the core gaps remain only partially addressed. The mobile menu still lacks complete accessibility behavior, hover/focus/pressed state coverage is uneven, and the design remains dependent on fixed visual choices without a formalized design-system document.

**Impact:** The build is visually coherent but not yet implementation-complete against the Figma audit.

### Minor: Mobile and footer touch targets are too small

**Location:** Mobile menu controls and footer social links

**Expected behaviour:** Important touch targets should be approximately 44x44px or have equivalent padded hit areas.

**Actual behaviour:** Mobile menu open/close controls are 24x24px. Footer social links measure roughly 56-67px wide by 18px high at mobile.

**Impact:** This creates unnecessary friction on touch devices.

### Minor: Homepage departs from the Figma homepage without documented rationale

**Location:** `/`

**Expected behaviour:** Deliberate deviations from the Figma source of truth should be recorded as product/design decisions.

**Actual behaviour:** Figma described the homepage as a single-screen editorial layout with no project preview above the fold. The implementation adds featured case studies, testimonial, and a CTA on the homepage. This is likely a product improvement, but it is not documented as an approved delta.

**Impact:** The implementation may be directionally better, but QA cannot distinguish intentional product evolution from design drift.

### Minor: External link set is incomplete compared with the provided links PDF

**Location:** `/contact`, global footer

**Expected behaviour:** If the PDF is the source for public links, all required links should be intentionally included, excluded, or placed in a future backlog.

**Actual behaviour:** Implemented links include Instagram, LinkedIn, Dribbble, Twitter/X, and email. The PDF also includes Behance, Medium articles, resume, HNG certificate/internship links, and Figma playground. The QA brief notes these were deliberately not added yet, but there is no visible product decision explaining where they belong.

**Impact:** Not release-blocking by itself, but it affects professional credibility and content completeness.

### Minor: Contact email casing looks unpolished

**Location:** `/contact`

**Expected behaviour:** Email presentation should feel intentional and conventional.

**Actual behaviour:** The email appears as `Addtemi270@gmail.com`. Mail delivery is usually case-insensitive, but the capitalized local part looks accidental in a polished portfolio.

**Impact:** Small credibility/polish issue.

### Observation: Build and baseline engineering health are good

**Location:** Project checks

**Expected behaviour:** The site should pass baseline engineering checks before QA.

**Actual behaviour:** Typecheck, tests, lint, and production build passed. Static export generated all listed routes, `robots.txt`, `sitemap.xml`, and `404.html`.

### Observation: Responsive layout measurements are good

**Location:** All listed routes

**Expected behaviour:** No horizontal overflow across mobile, tablet, laptop, and desktop.

**Actual behaviour:** Browser measurements showed no horizontal overflow at 390, 768, 1024, or 1440px across the tested routes.

### Observation: Performance footprint is reasonable for the current scope

**Location:** Production build output

**Expected behaviour:** Static portfolio pages should keep JavaScript and image payloads controlled.

**Actual behaviour:** Shared first-load JS is approximately 102kB. Public image assets total under 1MB, and individual images are modestly sized. This is acceptable for the current build.

### Observation: Metadata exists but is basic

**Location:** Global and route metadata

**Expected behaviour:** Key pages should have unique page titles and useful descriptions.

**Actual behaviour:** Route titles and descriptions are present. Social preview metadata, canonical configuration, and structured data are not yet implemented.

## Required Corrections

1. Change `SectionReveal` so content is visible in server-rendered HTML and motion is applied only as progressive enhancement.
2. Complete the mobile menu accessibility implementation:
   - add focus trapping
   - restore focus to the menu button on close
   - keep Escape handling active while the modal is open
   - increase open/close hit areas to at least practical touch-target size
3. Make sitemap and robots domain-aware through configuration, then set the correct production URL before release.
4. Resolve the Enviodeck publication model:
   - either make it a deliberate coming-soon route and link to it consistently
   - or remove it from generated static params, sitemap, and project navigation until publishable
5. Fix about-gallery caption layout so captions are readable, unclipped, and visually intentional.
6. Document approved Figma deltas, especially homepage additions and any design decisions that intentionally depart from the audited Figma frames.
7. Strengthen case-study content with evidence, constraints, artifacts, decision rationale, and sourced or clearly qualified metrics.

## Optional Improvements

1. Add canonical URLs, Open Graph metadata, and social preview images.
2. Add structured data for person/profile and creative work where appropriate.
3. Consolidate duplicated social link data between Contact and Footer into one shared source.
4. Decide whether Behance, Medium, resume, HNG certificate, and Figma playground should appear on Contact, About, Footer, or a dedicated credibility section.
5. Add richer interaction states for project rows, footer links, and case-study navigation.
6. Add visual regression screenshots to the QA workflow for 390, 768, 1024, and 1440px.
7. Create a short `DESIGN_DELTAS.md` or update `FIGMA_AUDIT.md` with implementation decisions made after the audit.

## Retest Criteria

Before follow-up approval:

1. `npm run typecheck`, `npm test`, `npm run lint`, and `npm run build` pass.
2. With JavaScript disabled or delayed, core page content is visible.
3. Mobile menu passes keyboard review:
   - focus enters the menu
   - focus cannot escape the modal while open
   - Escape closes the menu
   - focus returns to the opener
   - open and close controls have practical hit areas
4. All listed routes load on the deployed host with clean URLs.
5. `/404.html` exists and unknown routes show the custom 404 on the deployed platform.
6. `robots.txt` and `sitemap.xml` reference the correct final production domain.
7. Enviodeck has a single documented public state across index, route generation, sitemap, and project navigation.
8. About gallery captions are visually verified on mobile, tablet, laptop, and desktop.
9. Case studies include stronger evidence or clearly document which metrics are placeholder/demo content.
10. Figma deltas are reviewed and accepted.

## Release Recommendation

**Do not release as final production.**

This build is acceptable for staging, stakeholder review, and content/design iteration. It should not be treated as release-ready until the Critical and Major findings are corrected and retested.

## Evidence Files

- Browser measurement data: `docs/qa/browser-qa-results.json`
- Screenshots: `docs/qa/screenshots/`
- Prior QA request: `docs/qa/2026-07-18-qa-review.md`
- Figma audit: `FIGMA_AUDIT.md`
