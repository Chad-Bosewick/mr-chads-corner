# QA Review - Case Study Image Comprehension

Date: 2026-07-22  
Reviewer stance: Senior technical product manager / design engineer  
Scope: Images in the four real case studies: Credlane, Draftly, TODO++, Letters App

## Fundamental Question

Can a user understand what is in the images without working too hard?

Answer: sometimes, but not consistently.

The image system currently does a good job showing that projects have visual depth. It does a weaker job helping users inspect specific design decisions. Credlane has the strongest clutter issue because many images are multi-screen composites. Draftly is mostly understandable, but some visuals are visually heavy. TODO++ and Letters App are clearer because most images isolate one phone screen, but their persona/research images are too dense to read at portfolio scale.

## Devil's Advocate on the Carousel Idea

The user's observation is directionally right: some images feel cluttered and a one-screen-at-a-time treatment would reduce cognitive load.

However, replacing every composite with carousels would create a different problem: hidden evidence. Recruiters, design leads, and product leaders skim quickly. If every image requires interaction, many users will only see the first slide. A carousel also adds accessibility, keyboard, swipe, focus, state, and caption responsibilities.

The better direction is not "all carousels." The better direction is progressive disclosure:

- Use one montage to show scope.
- Use focused single-screen images to explain decisions.
- Use carousel or stepper only when sequence matters.
- Add captions that tell users what to notice.

## Image Comprehension by Case Study

| Case Study | Image Comprehension | Assessment |
| --- | --- | --- |
| Credlane | Partial | Strongest clutter problem. Several composites show 3-6 screens at once. Good for scope, weak for inspection. |
| Draftly | Mostly clear | Strong visual identity, but some dark/purple sections make small text hard to read at portfolio scale. |
| TODO++ | Mostly clear | Phone screens are understandable. Persona sheets are too text-dense as portfolio images. |
| Letters App | Mostly clear | Phone screens are clear. Persona and personality analysis assets feel like internal artifacts rather than public storytelling moments. |

## Findings

### 1. Credlane composites communicate scope but not decisions

Severity: High  
Files:

- `src/content/case-studies.ts`
- `public/images/case-studies/credlane/*`

Problem assets include:

- `credlane-hero.webp`
- `credlane-talent-journey.webp`
- `credlane-employer-journey.webp`
- `credlane-external-assessment-creation.webp`
- `credlane-external-applicant-flow.webp`
- `credlane-final-product-montage.webp`

Impact:

- Users can tell the product is broad.
- Users cannot easily inspect what each screen is showing.
- Design decisions are hidden inside montage density.

Recommended action:

- Keep one high-level montage near the hero to communicate breadth.
- Replace workflow composites in body sections with focused flow viewers.
- Each flow viewer should show one screen at a time with explicit step labels and a short caption.

Suggested flow-viewer sections:

- Assessment workflow: Dashboard -> Assessment details -> Active assessment -> Completion/results
- Talent journey: Onboarding -> Assessment dashboard -> Job discovery -> Employer outreach
- Employer journey: Role creation -> Talent discovery -> Candidate profile -> Hiring action
- External assessment: Create assessment -> Generate link -> Applicant flow -> Results dashboard

Acceptance criteria:

- Users can understand the purpose of each image within 3 seconds.
- No workflow section relies only on a dense montage.
- Each image or slide has a caption explaining the design decision being shown.

### 2. Draftly is visually clear but sometimes too brand-heavy

Severity: Medium  
Files:

- `src/content/case-studies.ts`
- `public/images/draftly/*`

Current state:

- Draftly images are more focused than Credlane.
- Some dark purple sections and full landing-page crops make text difficult to inspect at case-study scale.

Recommended action:

- Keep major landing-page screenshots where they show brand direction.
- Add focused crops for decision-heavy sections such as:
  - AI Idea Starter input
  - AI Idea Starter output
  - Writing Assistant suggestion panel
  - Explain My Mistake panel
- Avoid adding carousels unless showing before/after or a sequence.

Acceptance criteria:

- The user can understand the core product interface without zooming.
- Brand-heavy images are balanced with focused UI detail shots.

### 3. TODO++ phone screens work; research artifacts need different treatment

Severity: Medium  
Files:

- `src/content/case-studies.ts`
- `public/images/case-studies/todo-app-*`

Current state:

- Phone UI screenshots are readable because they isolate one screen.
- Persona sheets contain a lot of text and become too dense in the page.

Recommended action:

- Keep phone screens as static images.
- Convert persona sheets into summarized insight cards or small research artifact thumbnails.
- If keeping persona images, pair each with a short takeaway:
  - "Power users needed control without clutter."
  - "Casual users needed simple capture and recovery."

Acceptance criteria:

- Users do not need to read tiny text inside persona images to understand why the artifact matters.
- Each research artifact has a visible takeaway in page text or caption.

### 4. Letters App screens are clear, but artifact hierarchy needs polish

Severity: Medium  
Files:

- `src/content/case-studies.ts`
- `public/images/case-studies/letters-app-*`

Current state:

- Phone screens are understandable.
- Persona and personality analysis images feel like internal research outputs.
- The showcase image helps scope, but the smaller phone screenshots carry the clearest UX story.

Recommended action:

- Keep single phone screens as static images.
- Treat persona/personality visuals as supporting artifacts, not primary product proof.
- Add captions that explain what the reader should notice in the interaction.

Acceptance criteria:

- Product screens remain the primary visual evidence.
- Research artifacts support the narrative instead of interrupting it.

## Recommended Component Direction

Create a new reusable case-study component for sequence-heavy visuals.

Suggested component name:

- `CaseStudyFlowViewer`

Suggested behavior:

- Manual controls only; no autoplay.
- One image visible at a time.
- Visible step labels.
- Caption below or beside the image.
- Previous/next controls with at least 44px touch target.
- Keyboard support for arrow keys when focused.
- Reduced-motion support.
- Stable image container height to avoid layout shift.
- Optional thumbnail rail on desktop.

Recommended use:

- Use for Credlane workflows.
- Use sparingly for Draftly if showing before/after or process sequence.
- Do not use for every image.

## Recommended Visual Strategy

| Use Case | Best Presentation |
| --- | --- |
| Show full product scope | One montage |
| Explain a workflow | Flow viewer / stepper |
| Show one design decision | Single focused screenshot |
| Show research artifact | Small artifact + extracted insight |
| Show final UI quality | Large static hero/detail image |

## Implementation Priority

### P0

- Do not convert all images to carousels.
- Identify Credlane workflow composites that need focused sequence treatment.

### P1

- Build `CaseStudyFlowViewer`.
- Use it first for Credlane Assessment workflow and Talent journey.
- Add captions that explain what to notice.

### P2

- Rework TODO++ and Letters App persona sections into insight-led artifact presentations.
- Add focused Draftly crops where product details are currently too small.

## Acceptance Criteria for Final Image System

- A user can explain the purpose of each image without zooming.
- Workflow visuals show one primary screen at a time.
- Scope montages are used intentionally and sparingly.
- All images have descriptive alt text.
- All captions answer: "What should the user notice here?"
- No carousel autoplay.
- Carousel controls meet keyboard and touch accessibility requirements.

