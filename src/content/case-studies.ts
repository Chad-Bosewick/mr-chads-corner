export interface ContentSection {
  type:
    | "text"
    | "image-pair"
    | "metrics"
    | "full-image"
    | "hero-media"
    | "snapshot"
    | "diagram"
    | "comparison"
    | "sequence"
    | "future-state"
    | "executive-summary"
    | "what-i-designed"
    | "results"
    | "constraints"
    | "key-decisions"
    | "carousel";
  heading?: string;
  body?: string;
  images?: {
    src: string;
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
    scroll?: boolean;
  }[];
  // Image width: "text" (680px, within ReadingColumn) or "full-bleed" (1120px, breaks out)
  width?: "text" | "full-bleed";
  metrics?: { label: string; value: string }[];
  // Diagram fields
  diagramType?: "problem" | "evolution" | "ecosystem" | "change-framework" | "team-workflow";
  diagramData?: DiagramData;
  // Comparison fields
  comparisonItems?: { label: string; content: string }[];
  // Sequence fields
  sequenceItems?: { step: number; label: string; description?: string; src?: string; alt?: string }[];
  // Future state
  futureStateData?: { label: string; description: string }[];
  // Executive summary (type: "executive-summary")
  executiveSummary?: { problem: string; solution: string; outcome: string };
  // What I designed feature cards (type: "what-i-designed")
  designedFeatures?: { name: string; description: string }[];
  // Outcome bullets — used by results, constraints, and key-decisions sections
  outcomeBullets?: { label: string; description: string }[];
  // Optional nav label — if set, this section appears in the in-page navigation
  navLabel?: string;
  // Chapter grouping — dividers render when chapter changes between consecutive sections
  chapter?: "context" | "process" | "solution" | "results" | "reflection";
}

export interface CaseStudyMeta {
  role: string;
  timeline: string;
  date: string;
  platform: string;
  team: string;
  scope: string;
  status: string;
}

export interface DiagramData {
  // Problem diagram
  problemDiagram?: {
    leftLabel: string;
    leftStatement: string;
    rightLabel: string;
    rightStatement: string;
    centre: string;
  };
  // Evolution timeline
  evolutionStages?: { stage: string; description: string }[];
  // Ecosystem map
  ecosystemRoles?: { name: string; description: string; permissions: string[] }[];
  // Change framework
  changeRows?: { change: string; systems: string; response: string }[];
  // Team workflow
  workflowSteps?: string[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  category: string;
  role: string;
  timeline: string;
  overview: string;
  subtitle?: string;
  coverSrc?: string;
  sections: ContentSection[];
  nextSlug: string | null;
  prevSlug: string | null;
  // New fields
  heroMedia?: { src: string; alt: string };
  /** Full-page screenshot for auto-scrolling cover component */
  coverScroll?: {
    src: string;
    alt: string;
    sections?: { label: string; start: number }[];
  };
  meta?: CaseStudyMeta;
}

import type { Project } from "./projects";
import { projects } from "./projects";

export const todoApp: CaseStudy = {
  slug: "todo-app",
  title: "TODO++",
  category: "Productivity",
  role: "Product design lead — UX, UI, design system",
  timeline: "2025",
  overview:
    "TODO++ started as a straightforward task management tool that had grown into a feature-heavy checklist application. The product was losing users to simpler alternatives because the core experience had become buried under options. The goal was to redesign the experience from the ground up — preserving power-user capabilities while making the everyday experience feel effortless.",
  coverSrc: "/images/case-studies/todo-app-cover.webp",
  sections: [
    {
      type: "text",
      heading: "Understanding the problem",
      body: "Users reported that TODO++ had become overwhelming. The average user was only engaging with 20% of available features, but those features were increasingly difficult to find beneath layers of menus and configuration screens. The churn rate had increased by 15% over two quarters, primarily driven by users migrating to tools that offered a simpler experience — even when those tools had objectively fewer capabilities.",
    },
    {
      type: "image-pair",
      heading: "User research — personas",
      images: [
        { src: "/images/case-studies/todo-app-persona-1.webp", alt: "TODO++ user persona — power user", caption: "Power user persona — needs advanced features without clutter", width: 800, height: 744 },
        { src: "/images/case-studies/todo-app-persona-2.webp", alt: "TODO++ user persona — casual user", caption: "Casual user persona — wants simplicity over options", width: 800, height: 744 },
      ],
    },
    {
      type: "text",
      heading: "Defining the principles",
      body: "We established three design principles that guided every decision: reduce cognitive load before adding features, make the most common paths the most prominent paths, and preserve power through progressive disclosure rather than sacrificing depth for simplicity. These principles became the litmus test for every design decision throughout the project.",
    },
    {
      type: "full-image",
      heading: "Redesigned interface",
      images: [
        { src: "/images/case-studies/todo-app-homepage-task.webp", alt: "TODO++ redesigned task view", caption: "The redesigned task view — clear hierarchy, focused on what matters", width: 492, height: 1057 },
      ],
    },
    {
      type: "text",
      heading: "The intelligent inbox",
      body: "The centrepiece of the redesign was the intelligent inbox — a smart prioritisation layer that surfaces the most relevant tasks based on deadlines, dependencies, and user behaviour patterns. Rather than forcing users to organise their work into folders and tags, the system learns how each user works and adapts the view accordingly. Users who want manual control can still access the full organisational model, but it no longer sits in the critical path of daily use.",
    },
    {
      type: "full-image",
      heading: "Onboarding flow",
      images: [
        { src: "/images/case-studies/todo-app-new-user-sync.webp", alt: "TODO++ new user sync screen", caption: "Onboarding — getting started with intelligent sync", width: 492, height: 1057 },
        { src: "/images/case-studies/todo-app-new-user-link-device.webp", alt: "TODO++ device linking", caption: "Cross-device setup — seamless transition between devices", width: 485, height: 1050 },
      ],
    },
    {
      type: "metrics",
      heading: "Impact",
      metrics: [
        { label: "Churn reduction", value: "32%" },
        { label: "Task completion rate", value: "+28%" },
        { label: "Feature discovery", value: "+45%" },
        { label: "NPS score increase", value: "+18 pts" },
      ],
    },
    {
      type: "text",
      heading: "Collaboration with engineering",
      body: "The implementation required close collaboration with the engineering team to ensure that the intelligent inbox was powered by meaningful signals without compromising user privacy or creating a black-box recommendation system. We held weekly design reviews where engineers could challenge assumptions about what data was available and what would be useful. This collaboration resulted in a transparent priority system that users could understand and adjust — no mysterious algorithms.",
    },
    {
      type: "full-image",
      images: [
        { src: "/images/case-studies/todo-app-complete-task.webp", alt: "TODO++ completed task state", caption: "Completed task view — satisfying visual feedback without clutter", width: 492, height: 1057 },
      ],
    },
    {
      type: "text",
      heading: "What I learned",
      body: "This project reinforced that simplification is harder than addition. Removing features requires understanding why they were added in the first place and whether those use cases are still valid. The most valuable discussions happened when we asked 'who actually uses this?' and were willing to deprecate features that served an imagined user rather than a real one. The principles we established early became our anchor throughout — every time someone proposed a new feature, we asked whether it reduced or increased cognitive load.",
    },
  ],
  nextSlug: "letters-app",
  prevSlug: "credlane",
};

export const lettersApp: CaseStudy = {
  slug: "letters-app",
  title: "Letters App",
  category: "Communication",
  role: "Sole product designer — end-to-end product design",
  timeline: "2024",
  overview:
    "Letters App was conceived as a response to the always-on, notification-driven nature of modern messaging. The premise was simple: what if digital communication could feel more like writing a letter than sending a text message? The challenge was designing a platform that encouraged thoughtfulness and intentionality without feeling slow, heavy, or impractical for everyday use.",
  coverSrc: "/images/case-studies/letters-app-cover.webp",
  sections: [
    {
      type: "text",
      heading: "The tension between speed and thoughtfulness",
      body: "The core design tension was immediately clear: how do you create a product that encourages considered communication without frustrating users who expect instant responses? Our research showed that users already felt overwhelmed by instant messaging — they wanted a way to communicate that felt deliberate without requiring a significant time commitment. The solution was not to slow down the interface but to change the expectations around response time.",
    },
    {
      type: "full-image",
      heading: "The inbox experience",
      images: [
        { src: "/images/case-studies/letters-app-homepage-post-1.webp", alt: "Letters App inbox view", caption: "The inbox — envelopes with preview windows, no read receipts, no typing indicators", width: 492, height: 1057 },
        { src: "/images/case-studies/letters-app-homepage-post-2.webp", alt: "Letters App homepage", caption: "Home feed — letters from your circle, organised by person", width: 492, height: 1057 },
      ],
    },
    {
      type: "text",
      heading: "Designing for anticipation",
      body: "We designed the experience around the emotional arc of sending and receiving. Writing a letter involves intention — choosing words, arranging thoughts, deciding what matters. The interface was designed to support that reflection without adding friction. Delivery notifications are calm rather than demanding, arriving as a subtle badge rather than a banner interruption.",
    },
    {
      type: "image-pair",
      heading: "Writing and connecting",
      images: [
        { src: "/images/case-studies/letters-app-my-letters.webp", alt: "Letters App my letters view", caption: "My letters — a personal archive of correspondence", width: 492, height: 1057 },
        { src: "/images/case-studies/letters-app-my-pals.webp", alt: "Letters App pals page", caption: "My Pals — manage your correspondence circle", width: 492, height: 1057 },
      ],
    },
    {
      type: "full-image",
      heading: "Personality and connection",
      images: [
        { src: "/images/case-studies/letters-app-persona-details.webp", alt: "Letters App persona details", caption: "Persona details — understanding communication preferences", width: 800, height: 744 },
        { src: "/images/case-studies/letters-app-personality-analysis.webp", alt: "Letters App personality analysis", caption: "Personality insights — how your communication style comes across", width: 800, height: 741 },
      ],
    },
    {
      type: "metrics",
      heading: "Key results",
      metrics: [
        { label: "Avg letter length", value: "240 words" },
        { label: "Response rate", value: "78%" },
        { label: "User retention (90d)", value: "82%" },
        { label: "Daily active users", value: "12k+" },
      ],
    },
    {
      type: "text",
      heading: "Accessibility as a feature",
      body: "Because the product depended so heavily on emotional cues and visual metaphors (envelopes, seals, handwriting-style typography), accessibility was not an afterthought but a core design driver. Every visual metaphor had a text-based alternative. The envelope preview had an accessible version that read the first sentence. The handwriting font was decorative only — all body text used system fonts with full accessibility support. Colour was never the sole indicator of urgency or importance.",
    },
    {
      type: "full-image",
      heading: "Showcase",
      images: [
        { src: "/images/case-studies/letters-app-showcase.webp", alt: "Letters App showcase", caption: "The complete Letters App experience", width: 800, height: 461 },
      ],
    },
    {
      type: "text",
      heading: "Reflections",
      body: "Letters App taught me that emotional design doesn't require complex animations or elaborate visual treatments. The most emotionally resonant elements were simple: a letter that slowly appears to open, a seal that breaks when read, an inbox that treats each message as something valuable rather than something to process and discard. These moments worked because they were grounded in a real understanding of how people want to connect — not because they were visually impressive.",
    },
  ],
  nextSlug: "credlane",
  prevSlug: "todo-app",
};

export const credlane: CaseStudy = {
  slug: "credlane",
  title: "Travecs",
  category: "Talent Platform",
  role: "Lead Product Designer",
  timeline: "2 months",
  overview:
    "Travecs is a skills-verification and hiring platform where talent proves readiness and employers evaluate candidates with evidence. I led the design across two months, turning a shifting education concept into a coherent multi-sided hiring system.",
  subtitle:
    "Turning a shifting education concept into a coherent multi-sided hiring platform.",
  coverSrc: "/images/case-studies/credlane/credlane-hero.webp",
  heroMedia: {
    src: "/images/case-studies/credlane/credlane-hero.webp",
    alt: "Travecs platform displayed on a MacBook Pro showing the product landing page",
  },
  coverScroll: {
    src: "/images/case-studies/credlane/credlane-landing-page-full.webp",
    alt: "Travecs landing page",
    sections: [
      { label: "Meet Travecs", start: 0 },
      { label: "Talent experience", start: 0.31 },
      { label: "Employer experience", start: 0.49 },
      { label: "Frequently asked questions", start: 0.78 },
      { label: "Find talent, get hired", start: 0.9 },
      { label: "Footer", start: 0.97 },
    ],
  },
  meta: {
    role: "Lead Product Designer",
    timeline: "Two months",
    date: "April 2026",
    platform: "Responsive web",
    team: "Approximately 24 people across product, engineering, marketing, and design",
    scope: "Talent flow, employer flow, external-facing screens, design-system oversight",
    status: "Handed off to engineering and partially implemented",
  },
  sections: [
    /* 1. What I designed */
    {
      type: "what-i-designed",
      heading: "What I designed",
      designedFeatures: [
        {
          name: "Talent experience",
          description:
            "Onboarding, assessment dashboard, job exploration, and employer outreach.",
        },
        {
          name: "Employer experience",
          description:
            "Role creation, talent discovery, candidate review, hiring pipeline, and assessment management.",
        },
        {
          name: "Assessment system",
          description:
            "Three-tier assessments with Job Ready qualification, Employability Score, and employer-created evaluations.",
        },
        {
          name: "External assessments",
          description:
            "Shareable assessment links for non-platform candidates with a distinct permission model.",
        },
      ],
    },

    /* 3. The problem */
    {
      type: "text",
      heading: "The problem",
      navLabel: "Problem",
      chapter: "context",
      body: "<strong>Hiring lacks evidence.</strong> CVs and self-reported skills give context but not proof of what a candidate can do. Employers spend hours screening and still lack practical evidence of readiness.\n\n<strong>The assessment system is the differentiator.</strong> I designed a three-tier assessment flow where talent proves readiness through personal, skill, and advanced assessments. Passing earns Job Ready status and makes them discoverable to employers. The Employability Score gives employers a structured signal without reducing a candidate to a number.\n\n<strong>The product evolved while we designed it.</strong> The project began as the education platform SkillBridge, became the hiring-focused Credlane, and ultimately launched under the Travecs name. Each transition changed the navigation, permissions, and relationship between talent and employers. The scope tripled. The timeline did not. I led the design through every pivot, keeping the information architecture coherent across shifting requirements.\n\n<strong>Two user types, distinct journeys.</strong> Talent completed assessments and explored opportunities. Employers discovered talent, created roles, and managed hiring. A third user type (external applicants) was invited through shareable assessment links but had restricted access. Each role needed its own permissions, navigation, and entry points.",
    },

    /* 4. The assessment system */
    {
      type: "text",
      heading: "The assessment system",
      navLabel: "Assessment",
      chapter: "solution",
      body: "<strong>Three assessments determine readiness.</strong> Talent passes personal, skill, and advanced assessments to earn Job Ready status. Two paths exist: open assessments for self-directed progress, and employer-assigned evaluations for role-specific candidates.\n\n<strong>Job Ready is a starting point, not a guarantee.</strong> I positioned it as a qualification state that shows progress, explains incomplete requirements, makes failure feel recoverable, and directs users toward retake resources.\n\n<strong>The Employability Score needs context.</strong> Determined by skill and advanced assessment performance, the score sits alongside breakdowns, experience, skills, and role relevance. I designed it to keep employers interpreting the full picture rather than reducing candidates to a single number.\n\n<strong>Multiple question formats.</strong> Assessments support multiple-choice, written responses, coding questions, file uploads, timed questions, and scenario-based questions. Tab-switch warnings communicate integrity without being threatening.",
    },
    {
      type: "carousel",
      heading: "Assessment workflow",
      chapter: "solution",
      images: [
        {
          src: "/images/case-studies/credlane/carousel/travecs-assessment-01-personal-summary.png",
          alt: "SkillBridge-stage personal assessment summary with the next assessment in the talent roadmap",
          caption: "Personal assessment: the summary unlocks the next step in the roadmap",
          width: 1360,
          height: 967,
          scroll: true,
        },
        {
          src: "/images/case-studies/credlane/carousel/travecs-assessment-02-advanced-preview.png",
          alt: "SkillBridge-stage advanced assessment preview with timing, expectations, and retake guidance",
          caption: "Advanced assessment preview: expectations and guidance before starting",
          width: 1360,
          height: 1085,
          scroll: true,
        },
        {
          src: "/images/case-studies/credlane/carousel/travecs-assessment-03-active.png",
          alt: "SkillBridge-stage active assessment with question navigation, timer, progress, and submit action",
          caption: "Active assessment: structured navigation, progress, and submission",
          width: 1360,
          height: 967,
          scroll: true,
        },
        {
          src: "/images/case-studies/credlane/carousel/travecs-assessment-04-advanced-summary.png",
          alt: "SkillBridge-stage advanced assessment summary confirming completion and explaining the results timeline",
          caption: "Advanced assessment summary: completion confirmation and what happens next",
          width: 1360,
          height: 967,
          scroll: true,
        },
      ],
    },

    /* 5. Talent experience */
    {
      type: "text",
      heading: "Talent experience",
      navLabel: "Talent",
      chapter: "solution",
      body: "<strong>Onboarding without friction.</strong> I collected enough information to personalise the platform without making sign-up feel like a job application. Identity, interests, skills, and assessment status were established in one flow.\n\n<strong>Two paths to opportunity.</strong> Talent could actively explore roles and indicate interest. Alternatively, employers could discover profiles and send offers directly. Both active and passive discovery were supported.\n\n<strong>The dashboard drove daily use.</strong> Talent saw available assessments, completed results, retake eligibility, and progress toward Job Ready status in one view.",
    },
    {
      type: "carousel",
      heading: "Talent journey",
      chapter: "solution",
      images: [
        {
          src: "/images/case-studies/credlane/carousel/travecs-talent-01-generating.png",
          alt: "SkillBridge-stage loading screen generating assessments before a new talent profile is created",
          caption: "New talent: generating a personalised assessment path before profile creation",
          width: 1360,
          height: 967,
          scroll: true,
        },
        {
          src: "/images/case-studies/credlane/carousel/travecs-talent-02-home.png",
          alt: "SkillBridge-stage default talent homepage with profile progress and the assessment roadmap",
          caption: "Default homepage: profile progress and the complete Job Ready roadmap",
          width: 1360,
          height: 1107,
          scroll: true,
        },
        {
          src: "/images/case-studies/credlane/carousel/travecs-talent-03-resources-menu.png",
          alt: "SkillBridge-stage resources page with learning resources and the account menu open",
          caption: "Resources: learning content with account controls kept within reach",
          width: 1360,
          height: 1344,
          scroll: true,
        },
        {
          src: "/images/case-studies/credlane/carousel/travecs-talent-04-job-ready.png",
          alt: "Credlane-stage Job Ready talent homepage with verified status, skill breakdown, and recommendations",
          caption: "Job Ready homepage: verified status, score context, and next opportunities",
          width: 1360,
          height: 1215,
          scroll: true,
        },
      ],
    },

    /* 6. Employer experience */
    {
      type: "text",
      heading: "Employer experience",
      navLabel: "Employer",
      chapter: "solution",
      body: "<strong>Role creation.</strong> Employers defined opportunities with job details, required skills, assessment requirements, and hiring preferences.\n\n<strong>Talent discovery.</strong> I designed the employer dashboard to surface Job Ready talent with profiles, Employability Score, assessment performance, and role relevance. Filtering narrowed the pool without manual review.\n\n<strong>Candidate management.</strong> Employers could invite, shortlist, reject, send offers, schedule interviews, and move candidates through hiring stages. Assessment results sat within the broader decision-making workflow.",
    },
    {
      type: "carousel",
      heading: "Employer journey",
      chapter: "solution",
      images: [
        {
          src: "/images/case-studies/credlane/carousel/credlane-employer-01-overview.webp",
          alt: "SkillBridge-stage employer account creation screen",
          caption: "Employer onboarding: creating an organisation account",
          width: 1360,
          height: 850,
        },
        {
          src: "/images/case-studies/credlane/carousel/credlane-employer-02-roles.webp",
          alt: "Credlane-stage employer dashboard showing hiring tools and pipeline overview",
          caption: "Dashboard: hiring tools and pipeline overview",
          width: 1360,
          height: 850,
        },
        {
          src: "/images/case-studies/credlane/carousel/credlane-employer-03-create-role.webp",
          alt: "Credlane-stage talent discovery screen with filters and verified candidates",
          caption: "Talent discovery: filtering verified candidates by role fit",
          width: 1360,
          height: 850,
        },
        {
          src: "/images/case-studies/credlane/carousel/credlane-assessment-01-dashboard.webp",
          alt: "Credlane-stage employer offer review with candidate assessment steps",
          caption: "Hiring action: reviewing role details before sending an offer",
          width: 1360,
          height: 850,
        },
      ],
    },

    {
      type: "text",
      heading: "Employer assessment engine",
      navLabel: "Assessment engine",
      chapter: "solution",
      body: "<strong>Assessment creation supported both sourcing paths.</strong> Employers built reusable, role-specific assessments and defined the category, pass rate, deadline, and questions. They could attach an assessment to a Travecs role for talent sourced on the platform or share it with preferred candidates sourced elsewhere.\n\n<strong>One engine, separate candidate management.</strong> Internal and external candidates were managed separately within assessment details and analytics. This kept each candidate journey distinct while giving employers consistent evidence for deciding who to hire.",
    },
    {
      type: "carousel",
      heading: "Employer assessment workflow",
      chapter: "solution",
      images: [
        {
          src: "/images/case-studies/credlane/carousel/travecs-employer-assessment-01-create.png",
          alt: "Credlane-stage employer modal for defining an assessment title, category, pass rate, and deadline",
          caption: "Set up: define the assessment details, pass rate, and deadline",
          width: 1360,
          height: 850,
        },
        {
          src: "/images/case-studies/credlane/carousel/travecs-employer-assessment-02-review-create.png",
          alt: "Credlane-stage employer review screen with a Create assessment action",
          caption: "Review: confirm the configuration before creating the assessment",
          width: 1360,
          height: 1136,
          scroll: true,
        },
        {
          src: "/images/case-studies/credlane/carousel/travecs-employer-assessment-03-manage.png",
          alt: "Credlane-stage employer Assessments page showing active, completed, and draft assessments",
          caption: "Manage: track active, completed, and draft assessments in one place",
          width: 1360,
          height: 850,
        },
      ],
    },

    /* 7. Results */
    {
      type: "results",
      heading: "Results",
      navLabel: "Results",
      chapter: "results",
      outcomeBullets: [
        {
          label: "Complete multi-sided platform designed",
          description:
            "Delivered talent onboarding, assessment flows, Job Ready qualification, employer hiring tools, custom assessment creation, and external applicant assessment across two months.",
        },
        {
          label: "Engineering handoff with partial implementation",
          description:
            "The design system, component library, and flow specifications were handed off to engineering. Key screens were implemented, establishing the foundation for Travecs' hiring experience.",
        },
        {
          label: "Design system survived repeated pivots",
          description:
            "The information architecture and component system remained coherent despite the product shifting from education to hiring, then expanding to include external assessments.",
        },
        {
          label: "Recognised for visual quality and completeness",
          description:
            "The design received positive feedback from the HNG chief mentor and cross-disciplinary mentors who commended its visual quality and scope.",
        },
      ],
    },

    /* 8. Constraints */
    {
      type: "constraints",
      heading: "Constraints",
      chapter: "reflection",
      outcomeBullets: [
        {
          label: "Two months, three product pivots",
          description:
            "The entire platform needed to be designed in two months while the product direction changed from education to hiring to external assessments.",
        },
        {
          label: "24-person cross-functional team",
          description:
            "Coordinating design across product, engineering, marketing, and design required system-level thinking and consistent communication of evolving requirements.",
        },
        {
          label: "Design system under pressure",
          description:
            "The component library and information architecture had to remain coherent while the product scope tripled and the timeline stayed fixed.",
        },
      ],
    },

    /* 9. Key decisions */
    {
      type: "key-decisions",
      heading: "Key decisions",
      navLabel: "Decisions",
      chapter: "reflection",
      outcomeBullets: [
        {
          label: "Reframed the IA around hiring, not learning",
          description:
            "When the product pivoted from education to hiring, I restructured the entire information architecture around assessment readiness, employer discovery, and hiring workflows instead of course completion and skill development.",
        },
        {
          label: "Score as context, not verdict",
          description:
            "I positioned the Employability Score as one input alongside assessment breakdowns, profile information, and role relevance. This reduced the risk of employers treating a single number as a complete hiring signal.",
        },
        {
          label: "Separated external applicants from the talent pool",
          description:
            "I created a distinct user type with restricted permissions for external assessment participants, preventing unintended access to the job-seeker product.",
        },
        {
          label: "Kept the design system coherent under pressure",
          description:
            "With 24 people across product, engineering, marketing, and design, I helped the team understand what the product was becoming so each change in direction was reflected consistently across the platform.",
        },
        {
          label: "Planned for features beyond the MVP",
          description:
            "Open-ended assessments were considered for a later phase. Accounting for them during planning prevented the assessment system from being designed too narrowly, even though they were not part of the initial build.",
        },
      ],
    },
  ],
  nextSlug: "todo-app",
  prevSlug: null,
};

export const testground: CaseStudy = {
  slug: "testground",
  title: "Testground",
  category: "Developer Tools",
  role: "Product design — UX, UI",
  timeline: "2026",
  overview: "Case study content coming soon.",
  sections: [
    {
      type: "text",
      heading: "Coming soon",
      body: "This case study is being prepared. Check back for the full story.",
    },
  ],
  nextSlug: "draftly",
  prevSlug: "credlane",
};

export const draftly: CaseStudy = {
  slug: "draftly",
  title: "Draftly",
  category: "Content Creation",
  role: "Design Lead and Sole Designer",
  timeline: "3 days",
  overview:
    "Draftly is an AI writing coach designed for high-school students. Unlike general-purpose AI tools that generate content, Draftly helps students understand how to improve their writing while preserving ownership of their work. I completed the project as a three-day solo design sprint — defining product direction, developing the visual identity, designing the responsive landing page, and creating product previews for the AI Idea Starter and Writing Assistant. The final prototype was used to demonstrate the concept to potential investors and collaborators.",
  coverSrc: "/images/case-studies/draftly-cover.webp",
  heroMedia: {
    src: "/images/draftly/draftly-hero-1440x900.webp",
    alt: "Draftly landing page hero showing the AI writing coach positioning and product interface preview",
  },
  meta: {
    role: "Design Lead and Sole Designer",
    timeline: "3 days",
    date: "February 2026",
    platform: "Responsive Web",
    team: "Solo",
    scope: "Landing page, AI Idea Starter preview, Writing Assistant preview",
    status: "Prototype presented to potential investors and collaborators",
  },
  sections: [
    /* 1. Executive summary */
    {
      type: "executive-summary",
      executiveSummary: {
        problem:
          "Students have access to AI tools, but most are designed to generate content rather than help students learn. Starting is difficult, corrections lack explanation, and AI can weaken student ownership of their work.",
        solution:
          "Draftly positions itself as an AI writing coach — not an essay generator. It helps students brainstorm, structure, revise, and understand their work through an explanation loop that turns every correction into a learning moment.",
        outcome:
          "A responsive landing page with product previews for the AI Idea Starter and Writing Assistant, presented to potential investors and collaborators as a clear articulation of the product opportunity.",
      },
    },

    /* 2. What I designed */
    {
      type: "what-i-designed",
      heading: "What I designed",
      designedFeatures: [
        {
          name: "Landing page",
          description:
            "A responsive marketing page that introduces the product category, explains the learning-first approach, and builds trust with students, parents, and teachers.",
        },
        {
          name: "AI Idea Starter",
          description:
            "A brainstorming tool that helps students move from assignment prompt to thesis, outline, or first paragraph — without generating the essay for them.",
        },
        {
          name: "Writing Assistant",
          description:
            "A real-time revision tool that provides feedback on grammar, clarity, tone, vocabulary, and sentence flow — with explanations that teach rather than just correct.",
        },
        {
          name: "Explain My Mistake",
          description:
            "A correction-plus-explanation flow that answers what is wrong, why it is wrong, and how to avoid the same mistake next time.",
        },
      ],
    },

    /* 3. The problem */
    {
      type: "text",
      heading: "The problem",
      navLabel: "Problem",
      chapter: "context",
      body: `<strong>Students already have access to AI tools, but most are not designed around learning.</strong> Many struggle to move from an assignment prompt to a clear thesis, outline, or first paragraph.\n<strong>Corrections often lack explanation.</strong> Grammar tools may improve a sentence without helping the student understand what was wrong.\n<strong>AI can weaken student ownership.</strong> When tools generate complete responses, students can submit better-looking work without developing stronger writing skills.\n<strong>Academic trust is fragile.</strong> Parents, teachers, and schools need reassurance that AI is supporting the writing process rather than completing assignments on the student's behalf.\n<strong>Draftly needed to feel useful enough for students to adopt while clearly communicating that it was a coach, not an essay generator.</strong>`,
    },

    /* 4. Product positioning */
    {
      type: "text",
      heading: "Product positioning",
      body: `<strong>Learn while you write.</strong> The central product promise shaped both the landing-page messaging and the product concepts shown inside it.\n<strong>Draftly was positioned as an AI writing coach, a guided essay builder, and a learning companion.</strong> It was deliberately not positioned as an essay generator, a homework shortcut, or a tool that thinks on behalf of students.\n<strong>This distinction was the foundation of every design decision.</strong>`,
    },
    {
      type: "full-image",
      heading: "Product positioning",
      images: [
        {
          src: "/images/draftly/draftly-positioning-1200x760.webp",
          alt: "Draftly product positioning section contrasting learning support with generic AI writing tools",
          width: 1200,
          height: 760,
        },
      ],
    },

    /* 5. Landing page */
    {
      type: "text",
      heading: "Landing page",
      navLabel: "Landing page",
      chapter: "solution",
      body: `<strong>A page that explains before it sells.</strong> The landing page needed to introduce a new category without overwhelming the audience with educational-technology language.\n<strong>The structure followed a simple sequence:</strong> introduce the writing problem, explain Draftly's learning-first approach, demonstrate the product, show how different users benefit, build trust around originality and AI use, present pricing, answer common objections, and end with a direct invitation to start writing.\n<strong>The hero message — "Write better essays. Learn while you do it." — communicated both the immediate student benefit and the longer-term educational value.</strong>`,
    },
    {
      type: "full-image",
      heading: "Landing page hero",
      images: [
        {
          src: "/images/draftly/draftly-landing-hero-1440x960.webp",
          alt: "Complete Draftly landing-page hero with headline, CTA buttons, and product preview",
          width: 1440,
          height: 960,
        },
      ],
    },

    /* 6. AI Idea Starter */
    {
      type: "text",
      heading: "AI Idea Starter",
      body: `<strong>Addressing blank-page anxiety without creating the assignment.</strong> Instead of asking Draftly to write an essay, students could use it to brainstorm possible directions, explore different arguments, generate thesis options, organize ideas into an outline, and identify useful questions before drafting.\n<strong>The distinction was important.</strong> Draftly could help a student decide what to write, but the student would remain responsible for the final expression and argument.\n<strong>Familiar school topics made the tool approachable.</strong> Prompts like "The effect of social media on teenagers' mental health" or "Whether school uniforms should be mandatory" helped students understand the tool without a long explanation.`,
    },
    {
      type: "image-pair",
      heading: "Idea Starter flow",
      images: [
        {
          src: "/images/draftly/draftly-idea-starter-input-1280x800.webp",
          alt: "Draftly AI Idea Starter prompt-entry state",
          width: 1280,
          height: 800,
        },
        {
          src: "/images/draftly/draftly-idea-starter-output-1280x800.webp",
          alt: "Draftly AI Idea Starter generated outline or idea state",
          width: 1280,
          height: 800,
        },
      ],
    },

    /* 7. Writing Assistant */
    {
      type: "text",
      heading: "Writing Assistant",
      navLabel: "Writing",
      body: `<strong>Real-time revision with explanation.</strong> The Writing Assistant preview demonstrated how Draftly could support revision in real time — providing feedback for grammar, clarity, tone, vocabulary, sentence flow, and punctuation.\n<strong>Each suggestion included the highlighted issue, a corrected version, a short explanation, and Accept and Ignore actions.</strong> The explanation layer was the key difference.\n<strong>Rather than only replacing a sentence, Draftly would tell the student why the original version was weak or incorrect.</strong> This allowed each correction to act as a small learning moment.`,
    },
    {
      type: "full-image",
      heading: "Writing Assistant",
      images: [
        {
          src: "/images/draftly/draftly-writing-assistant-1440x900.webp",
          alt: "Draftly writing editor showing highlighted text, a suggested correction, explanation, and actions",
          width: 1440,
          height: 900,
        },
      ],
    },

    /* 8. Explain My Mistake */
    {
      type: "text",
      heading: "Explain My Mistake",
      body: `<strong>Correction plus instruction.</strong> Although not designed as a separate product flow, Explain My Mistake was one of the strongest concepts presented in the landing page. It was built around three questions: what is wrong, why is it wrong, and how can the student avoid the same mistake next time.\n<strong>This moved Draftly beyond correction and into instruction.</strong> A conventional writing tool might improve a sentence. Draftly would correct it while explaining subject–verb agreement, preposition choice, and possessive nouns.\n<strong>The student would not only receive a better sentence. They would receive a reason.</strong>`,
    },
    {
      type: "full-image",
      heading: "Explain My Mistake",
      images: [
        {
          src: "/images/draftly/draftly-explain-mistake-1000x700.webp",
          alt: "Focused Draftly suggestion panel showing a correction and the reason behind it",
          width: 1000,
          height: 700,
        },
      ],
    },

    /* 9. Use cases */
    {
      type: "what-i-designed",
      heading: "Use cases",
      designedFeatures: [
        {
          name: "Break through the blank page",
          description:
            "Students explore possible angles, generate thesis options, and build an outline before drafting.",
        },
        {
          name: "Improve a working draft",
          description:
            "Students receive feedback on grammar, sentence flow, clarity, vocabulary, and tone without losing their original voice.",
        },
        {
          name: "Understand every correction",
          description:
            "Students learn which rule applies and why the suggestion improves the sentence.",
        },
        {
          name: "Submit with confidence",
          description:
            "Students perform a final review of structure, clarity, originality, and overall writing quality before turning in their work.",
        },
      ],
    },

    /* 10. Visual direction */
    {
      type: "text",
      heading: "Visual direction",
      body: `<strong>Youthful without appearing childish.</strong> Draftly's visual identity uses bright purple, rounded cards, soft shadows, generous spacing, and large interface previews.\n<strong>The direction was chosen to feel modern without resembling a generic AI dashboard, academic without feeling institutional, and energetic without making the writing experience more stressful.</strong>\n<strong>The dark, angled sections introduce contrast and momentum,</strong> while the purple palette provides a recognizable brand system across the page. This was a deliberate departure from traditional education software, which often feels administrative, dense, or overly formal.`,
    },
    {
      type: "full-image",
      heading: "Visual system",
      images: [
        {
          src: "/images/draftly/draftly-visual-system-1200x1000.webp",
          alt: "Draftly landing-page crop showing the transition between light and dark branded sections",
          width: 1200,
          height: 1000,
        },
      ],
    },

    /* 11. Pricing */
    {
      type: "text",
      heading: "Pricing",
      body: `<strong>Four tiers for multiple stages of adoption.</strong> Free introduced the product through limited feedback and basic essay-building support. Pro unlocked unlimited essays, advanced feedback, explanations, originality checking, progress tracking, and the Smart Writing Score. Business extended the concept to teachers and tutoring organizations. Enterprise represented a future school and district offering with integrations, administration, analytics, and onboarding support.\n<strong>The pricing structure communicated the broader product vision,</strong> even though the teacher, school, and administration products were roadmap concepts rather than completed interfaces.`,
    },
    {
      type: "full-image",
      heading: "Pricing",
      images: [
        {
          src: "/images/draftly/draftly-pricing-1440x900.webp",
          alt: "Draftly pricing section showing Free, Pro, Business, and Enterprise plans",
          width: 1440,
          height: 900,
        },
      ],
    },

    /* 12. Trust and academic integrity */
    {
      type: "text",
      heading: "Trust and academic integrity",
      body: `<strong>The most important product risk was the perception that Draftly could become another shortcut for schoolwork.</strong> The landing page addressed this directly through messages such as "Built for learning — not shortcuts."\n<strong>The product principles reinforced this position:</strong> explain every suggestion, preserve student ownership, encourage critical thinking, make AI assistance visible, avoid automatic essay generation, and support originality by default.\n<strong>This trust layer was intended for students, but it was equally important for parents, teachers, and schools</strong> evaluating whether the product belonged in an academic environment.`,
    },
    {
      type: "full-image",
      heading: "Trust and integrity",
      images: [
        {
          src: "/images/draftly/draftly-integrity-1200x760.webp",
          alt: "Draftly trust and academic-integrity section",
          width: 1200,
          height: 760,
        },
      ],
    },

    /* 13. Results */
    {
      type: "results",
      heading: "What was delivered",
      navLabel: "Results",
      chapter: "results",
      outcomeBullets: [
        {
          label: "Responsive landing page",
          description:
            "A complete marketing page introducing the product category, explaining the learning-first approach, and building trust with students, parents, and teachers.",
        },
        {
          label: "Product previews",
          description:
            "Interface concepts for the AI Idea Starter and Writing Assistant that made the product concrete rather than relying only on marketing copy.",
        },
        {
          label: "Brand and visual identity",
          description:
            "A distinctive visual system using bright purple, rounded cards, and dark angled sections — designed to feel youthful and modern without resembling generic AI tooling.",
        },
        {
          label: "Investor-ready prototype",
          description:
            "A presentation-ready articulation of the product opportunity and its differentiation from general-purpose AI writing tools, completed in three days.",
        },
      ],
    },

    /* 14. Constraints */
    {
      type: "constraints",
      heading: "What I had to work with",
      outcomeBullets: [
        {
          label: "Three-day timeline",
          description:
            "The project required rapid product definition, visual exploration, interface design, copy structure, and responsive page design within a compressed schedule.",
        },
        {
          label: "New product category",
          description:
            "Draftly was my first attempt at designing an AI education product centered on writing development, requiring fast learning and confident direction-setting.",
        },
        {
          label: "No direct student testing",
          description:
            "The direction was informed by product logic, competitive analysis, and market references rather than validated student behaviour.",
        },
      ],
    },

    /* 15. Key decisions */
    {
      type: "key-decisions",
      heading: "Key decisions",
      navLabel: "Decisions",
      outcomeBullets: [
        {
          label: "Teach before automating",
          description:
            "Draftly was positioned around helping students understand their writing rather than generating completed work.",
        },
        {
          label: "Make explanation the differentiator",
          description:
            "Corrections alone are easy to reproduce. Explaining the rule and helping students avoid future mistakes creates a stronger educational product.",
        },
        {
          label: "Show the product early",
          description:
            "The landing page used interface previews to make the concept concrete rather than relying only on marketing copy.",
        },
        {
          label: "Design for trust beyond the student",
          description:
            "The message needed to reassure parents, teachers, and schools that Draftly supported learning and academic integrity.",
        },
        {
          label: "Keep future scope visible but separate",
          description:
            "Teacher, parent, and school features were shown as part of the roadmap without presenting them as completed product work.",
        },
      ],
    },

    /* 16. Simulated review */
    {
      type: "future-state",
      heading: "Simulated investor and design-engineering review",
      futureStateData: [
        {
          label: "Clear product wedge",
          description:
            "Draftly has a clearer wedge than many generic AI writing products because it treats explanation and student ownership as the product rather than as secondary safety messaging.",
        },
        {
          label: "Strongest opportunity",
          description:
            "The explanation loop — identifying an issue, showing an improved version, explaining the rule, and tracking whether the student improves over time — is the most important feature to develop further.",
        },
        {
          label: "Before investment",
          description:
            "The most important evidence would not be whether students accept more suggestions, but whether their unaided writing improves after repeated use.",
        },
      ],
    },

    /* 17. What I would improve */
    {
      type: "text",
      heading: "What I would improve next",
      chapter: "reflection",
      body: `<strong>Move beyond the marketing page and validate the core learning experience.</strong> The next version should prioritize designing the complete writing-editor journey, testing the AI Idea Starter with students experiencing blank-page anxiety, and evaluating whether explanations are understandable and measurable.\n<strong>The most important metric would not be the number of AI corrections accepted.</strong> It would be whether students gradually need fewer corrections and produce stronger independent writing.`,
    },

    /* 18. Closing reflection */
    {
      type: "text",
      heading: "Closing reflection",
      body: `<strong>Draftly was a short project, but it introduced a meaningful design problem:</strong> how to make AI useful without making the student less responsible for the work.\n<strong>The final concept established a clear product promise, a distinctive visual identity, and a credible initial view</strong> of how guided AI could support writing development.\n<strong>The next challenge would be proving that the product does more than make essays look better</strong> — that it actually helps students become better writers.`,
    },
  ],
  nextSlug: null,
  prevSlug: "testground",
};

export const caseStudies: Record<string, CaseStudy> = {
  "todo-app": todoApp,
  "letters-app": lettersApp,
  "credlane": credlane,
  "testground": testground,
  "draftly": draftly,
};

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug];
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNavAdjacent(currentSlug: string): {
  prev: CaseStudy | null;
  next: CaseStudy | null;
  prevProject: Project | null;
  nextProject: Project | null;
} {
  const publishedProjects = projects.filter(
    (project) => project.status === "published" && getCaseStudy(project.slug),
  );
  const currentIndex = publishedProjects.findIndex(
    (project) => project.slug === currentSlug,
  );

  if (currentIndex === -1) {
    return { prev: null, next: null, prevProject: null, nextProject: null };
  }

  const prevProject = publishedProjects[currentIndex - 1] ?? null;
  const nextProject = publishedProjects[currentIndex + 1] ?? null;
  const prev = prevProject ? getCaseStudy(prevProject.slug) ?? null : null;
  const next = nextProject ? getCaseStudy(nextProject.slug) ?? null : null;

  return { prev, next, prevProject, nextProject };
}
