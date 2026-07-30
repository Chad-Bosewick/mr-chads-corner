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
    | "carousel"
    | "phone-mockup"
    | "device-showcase";
  heading?: string;
  body?: string;
  images?: {
    src: string;
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
    scroll?: boolean;
    presentation?: "device" | "annotated-device" | "phone" | "phone-pair";
    secondarySrc?: string;
    secondaryAlt?: string;
  }[];
  // Image width: "text" (680px, within ReadingColumn) or "full-bleed" (1120px, breaks out)
  width?: "text" | "full-bleed";
  /** Optional aspect ratio for carousel frames, derived from the source artwork. */
  carouselAspectRatio?: number;
  /** Optional carousel transition surface, matched to the source artwork's edge colour. */
  carouselBackground?: string;
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
  // Phone mockup fields (type: "phone-mockup")
  phoneMockupImages?: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  deviceAssets?: {
    body: string;
    screenContent: string;
    screenMask: string;
    fallback: string;
    alt: string;
    caption?: string;
  };
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
  heroCarousel?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    presentation?: "device" | "annotated-device" | "phone" | "phone-pair";
    secondarySrc?: string;
    secondaryAlt?: string;
  }[];
  heroCarouselBackground?: string;
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
  role: "Product design lead: UX, UI, design system",
  timeline: "2025",
  overview:
    "TODO++ started as a straightforward task management tool that had grown into a feature-heavy checklist application. The product was losing users to simpler alternatives because the core experience had become buried under options. The goal was to redesign the experience from the ground up, preserving power-user capabilities while making the everyday experience feel effortless.",
  subtitle:
    "A calmer task loop across a dedicated device and mobile companion.",
  coverSrc: "/images/case-studies/todo-app-cover.webp",
  heroMedia: {
    src: "/images/case-studies/todo-app/todo-app-hero.webp",
    alt: "TODO++ dedicated task device and companion phone displayed together",
  },
  heroCarousel: [
    {
      src: "/images/case-studies/todo-app/phone/todo-app-phone-splash.webp",
      alt: "TODO++ splash screen in a mobile bezel",
      secondarySrc: "/images/case-studies/todo-app/phone/todo-app-phone-onboarding.webp",
      secondaryAlt: "TODO++ onboarding screen in a mobile bezel",
      presentation: "phone-pair",
    },
    {
      src: "/images/case-studies/todo-app-device.webp",
      alt: "TODO++ dedicated device with its e-paper task display and annotated controls",
      presentation: "annotated-device",
      width: 800,
      height: 458,
    },
  ],
  heroCarouselBackground: "#FFFFFF",
  coverScroll: {
    src: "",
    alt: "",
    sections: [],
  },
  meta: {
  role: "Product design lead: UX, UI, design system",
    timeline: "2025",
    date: "2025",
    platform: "Physical device + mobile app",
    team: "Solo product design",
    scope: "Product concept, UX, UI, design system",
    status: "Presentation-ready concept",
  },
  sections: [
    {
      type: "executive-summary",
      heading: "A calmer task loop across a dedicated device and mobile companion",
      executiveSummary: {
        problem: "Task-management products can make a simple daily action, deciding what to do next, feel like administration. TODO++ explores a calmer alternative: a focused physical task device paired with a mobile companion.",
        solution: "The concept brings the essential task loop to the foreground: see the current work, open its details, connect the companion device, and mark work complete. The UI uses deliberate hierarchy and visible state changes to keep the interaction legible.",
        outcome: "A presentation-ready product concept comprising a dedicated task device, companion mobile screens, onboarding/linking, task detail, and task-completion states. No quantitative outcome is claimed because the supplied source set does not verify one.",
      },
    },
    {
      type: "what-i-designed",
      heading: "What I designed",
      designedFeatures: [
        {
          name: "Dedicated task device",
          description: "A focused hardware surface for viewing the day's tasks and moving through core controls.",
        },
        {
          name: "Companion mobile home",
          description: "A mobile task-home state that shows the day, task status, navigation, and a clear entry point into the active task.",
        },
        {
          name: "Task detail",
          description: "A deeper mobile view for an active task, with its context and actions available without turning the home state into a dense dashboard.",
        },
        {
          name: "Cross-device linking",
          description: "A mobile setup state that connects the companion app to the physical device.",
        },
        {
          name: "Completion feedback",
          description: "A distinct completed-task state that makes progress visible and gives the task loop a clear endpoint.",
        },
      ],
    },
    {
      type: "text",
      heading: "Keeping the next task visible",
      chapter: "context",
      navLabel: "Context",
      body: "<strong>TODO++ starts with a smaller question than a typical task dashboard:</strong> what should be visible when someone needs to act now? The concept reduces the daily task loop to a focused device surface and a companion app. Instead of making every organisational option compete for attention, the design foregrounds the current day, the active task, and a small number of clear actions.",
    },
    {
      type: "image-pair",
      heading: "Research personas",
      chapter: "context",
      body: "The research artifacts frame two complementary needs: <strong>Daniel needs focus and a system that keeps a demanding schedule manageable;</strong> <strong>Amara needs a simple way to capture and return to work without feeling buried by options.</strong> Treat these as the lens for the concept, not as quantitative validation.",
      images: [
        { src: "/images/case-studies/todo-app/todo-app-persona-1.webp", alt: "Daniel Okafor persona, needs clarity, focus, and control without clutter", caption: "Daniel Okafor needs clarity, focus, and control without clutter.", width: 800, height: 744 },
        { src: "/images/case-studies/todo-app/todo-app-persona-2.webp", alt: "Amara Bello persona, needs a simple system for assignments and personal tasks", caption: "Amara Bello needs a simple system for assignments and personal tasks.", width: 800, height: 744 },
      ],
    },
    {
      type: "key-decisions",
      heading: "Designing for focus, not configuration",
      chapter: "context",
      body: "1. <strong>Make the next action easy to find.</strong> The home state should give the active task and its status room to breathe. 2. <strong>Keep context available when it is needed.</strong> Task detail belongs behind a deliberate transition, not in every overview. 3. <strong>Make progress tangible.</strong> Linking and completion are explicit states, so the system clearly acknowledges what has changed.",
    },
    {
      type: "device-showcase",
      heading: "A dedicated surface for the day's work",
      chapter: "solution",
      navLabel: "Solution",
      body: "<strong>The physical device is the product's most distinctive design decision.</strong> Its display concentrates the task experience into a compact surface while the companion app handles deeper task interaction. The hero should let the reader see the relationship between hardware controls and the on-screen task state.",
      deviceAssets: {
        body: "/images/case-studies/todo-app/threejs/device-body.png",
        screenContent: "/images/case-studies/todo-app/threejs/screen-content.png",
        screenMask: "/images/case-studies/todo-app/threejs/screen-mask.png",
        fallback: "/images/case-studies/todo-app/todo-app-dedicated-surface.webp",
        alt: "TODO++ dedicated task device showing the curated e-paper task list and hardware controls",
        caption: "The dedicated TODO++ device: focused hardware for daily task management",
      },
    },
    {
      type: "carousel",
      heading: "The product system at a glance",
      chapter: "solution",
      body: "The dedicated device, the companion mobile home, device linking, and task completion each make one relationship legible.",
      carouselBackground: "#FFFFFF",
      images: [
        { src: "/images/case-studies/todo-app/phone/todo-app-phone-home-figma.webp", alt: "TODO++ companion mobile home screen", caption: "Companion mobile home", presentation: "phone" },
        { src: "/images/case-studies/todo-app/phone/todo-app-phone-qr-connection.webp", alt: "TODO++ QR connection screen for linking the companion app to the device", caption: "Cross-device connection", presentation: "phone" },
        { src: "/images/case-studies/todo-app/phone/todo-app-phone-manage-hardware.webp", alt: "TODO++ hardware management controls", caption: "Manage hardware", presentation: "phone" },
        { src: "/images/case-studies/todo-app/phone/todo-app-phone-companion-connection.webp", alt: "TODO++ companion app connected to the dedicated device", caption: "Companion connection", presentation: "phone" },
      ],
    },
    {
      type: "phone-mockup",
      heading: "A daily overview for tasks and updates",
      chapter: "solution",
      body: "<strong>The companion home keeps today's tasks, recent updates, and device status in one calm view.</strong> The screen gives the reader a clear entry point into the daily task loop before they move into deeper task context.",
      phoneMockupImages: [
        { src: "/images/case-studies/todo-app/phone/todo-app-phone-daily-overview.webp", alt: "TODO++ companion app daily overview with tasks, updates, and device controls", caption: "The daily overview keeps tasks, updates, and device controls within reach." },
      ],
    },
    {
      type: "phone-mockup",
      heading: "From task context to a clear endpoint",
      chapter: "solution",
      body: "<strong>Task detail holds the information needed to act; completion closes the loop.</strong> Present the two states together so the reader can follow the interaction from an active task to a confirmed result.",
      phoneMockupImages: [
        { src: "/images/case-studies/todo-app/phone/todo-app-phone-task-detail.webp", alt: "TODO++ task detail view, the active task and its context", caption: "Task detail: the active task and its context." },
        { src: "/images/case-studies/todo-app/phone/todo-app-phone-completion-figma.webp", alt: "TODO++ completed task state, clear acknowledgement that the task is done", caption: "Completion: clear acknowledgement that the task is done." },
      ],
    },
    {
      type: "results",
      heading: "What the concept delivered",
      navLabel: "Results",
      chapter: "results",
      outcomeBullets: [
        { label: "Coherent product concept", description: "A dedicated task device and companion mobile app designed as a focused, linked system." },
        { label: "Focused mobile task loop", description: "Home, task detail, device linking, and completion states covering the essential interaction arc." },
        { label: "Research-led narrative", description: "Two personas distinguishing the needs for clarity and focus from the need for simplicity and recovery." },
      ],
    },
    {
      type: "text",
      heading: "Focus is a product decision",
      chapter: "reflection",
      body: "<strong>TODO++ explores how a task product can become more present without becoming more demanding.</strong> The work's clearest contribution is the relationship between a purposeful physical surface and a mobile companion that retains task context when it is needed. The next step would be validating whether that focused loop helps people return to work with less friction.",
    },
  ],
  nextSlug: "letters-app",
  prevSlug: "credlane",
};

export const lettersApp: CaseStudy = {
  slug: "letters-app",
  title: "Letters App",
  category: "Communication",
  role: "Sole product designer: end-to-end product design",
  timeline: "2024",
  overview:
    "Letters App was conceived as a response to the always-on, notification-driven nature of modern messaging. The premise was simple: what if digital communication could feel more like writing a letter than sending a text message? The challenge was designing a platform that encouraged thoughtfulness and intentionality without feeling slow, heavy, or impractical for everyday use.",
  subtitle:
    "A digital space for letters worth returning to.",
  coverSrc: "/images/case-studies/letters-app-cover.webp",
  heroCarousel: [
    {
      src: "/images/case-studies/letters-app/phone/letters-app-phone-onboarding.webp",
      alt: "Letters App iPhone welcome screen: welcome, log in, and sign up",
      secondarySrc: "/images/case-studies/letters-app/phone/letters-app-phone-preview-post.webp",
      secondaryAlt: "Letters App iPhone preview and post screen: review a finished letter before posting",
      presentation: "phone-pair",
    },
    {
      src: "/images/case-studies/letters-app/letters-app-hero.webp",
      alt: "Letters App web homepage: browse recent and continuing letter correspondence",
      width: 1440,
      height: 915,
    },
  ],
  heroCarouselBackground: "#FFFFFF",
  heroMedia: {
    src: "/images/case-studies/letters-app/letters-app-hero.webp",
    alt: "Letters App web homepage: browse recent and continuing letter correspondence",
  },
  coverScroll: {
    src: "/images/case-studies/letters-app/letters-app-landing-page-full.webp",
    alt: "Letters App full web homepage: recent and continuing letter correspondence",
    sections: [],
  },
  meta: {
  role: "Sole product designer: end-to-end product design",
    timeline: "2024",
    date: "2024",
    platform: "Responsive web and iPhone app",
    team: "Solo product design",
    scope: "Product concept, UX, UI, design system",
    status: "Presentation-ready concept",
  },
  sections: [
    {
      type: "executive-summary",
      heading: "A digital space for letters worth returning to",
      executiveSummary: {
        problem: "Most communication products optimise for immediacy. That makes it easy to send a message, but leaves little room for a story, a response with context, or a record worth returning to.",
        solution: "Letters App reframes digital correspondence as a composed letter. Its web and mobile experiences support discovery, long-form reading, replying, writing, image and theme choices, preview, and posting.",
        outcome: "A presentation-ready, responsive communication-product concept with complete web home and letter-reading views, a detailed iPhone writing flow, onboarding, sent/received letters, and pals. No business or behavioural metric is claimed.",
      },
    },
    {
      type: "what-i-designed",
      heading: "What I designed",
      designedFeatures: [
        { name: "Web home and discovery", description: "Recent posts, continuing reads, navigation, and search in a spacious letter-first layout." },
        { name: "Long-form reading and reply", description: "A desktop letter view with author, date, imagery, location moments, and a direct reply action." },
        { name: "Mobile writing flow", description: "Compose, select or generate imagery, choose a visual treatment, preview, and post." },
        { name: "Personal correspondence spaces", description: "Sent and received letters plus a pals view that makes the network of people visible." },
        { name: "Onboarding", description: "A mobile entry screen that introduces the product promise and gives clear sign-in and sign-up actions." },
      ],
    },
    {
      type: "text",
      heading: "Communication with room to mean something",
      chapter: "context",
      navLabel: "Context",
      body: "<strong>Letters App makes a case for a different pace of communication.</strong> The product is organised around reading, writing, and replying to stories that need more than a few lines. The design gives a letter its own space, preserving its author, date, images, places, and the invitation to respond.",
    },
    {
      type: "key-decisions",
      heading: "Designing for reading, reflection, and reply",
      chapter: "context",
      outcomeBullets: [
        { label: "Let letters read like letters", description: "Protect generous typography, a clear reading column, and space for images." },
        { label: "Keep the reply close to the story", description: "Make responding feel like a continuation, not a context switch." },
        { label: "Make authorship visible", description: "Surface the writer, date, imagery, and place where the letter provides them." },
        { label: "Turn writing into a guided sequence", description: "Composition, visual treatment, preview, and posting each have a clear state." },
      ],
    },
    {
      type: "carousel",
      heading: "A home built for returning to stories",
      chapter: "solution",
      navLabel: "Solution",
      body: "<strong>The web home prioritises correspondence over a generic social feed.</strong> Continue Reading and Recent Posts give the reader two useful ways back into the product, while search and primary navigation stay available without competing with the letters.",
      images: [
        { src: "/images/case-studies/letters-app/letters-app-landing-page-full.webp", alt: "Letters App web homepage: browse recent and continuing letter correspondence", caption: "The web home: recent posts and continuing reads in a letter-first layout", width: 1440, height: 2388, scroll: true },
      ],
    },
    {
      type: "carousel",
      heading: "From reading to response",
      chapter: "solution",
      body: "Each slide shows a key web state at full height. Scroll to explore the long-form reading view, the reply modal, and the compose surface. <strong>The product lets you move from discovery to correspondence without leaving the letter.</strong>",
      images: [
        { src: "/images/case-studies/letters-app/carousel/letters-app-web-read.webp", alt: "Letters App web reading view: a letter with header, featured image, body text, and reply button", caption: "Read a letter with header, author context, imagery, and a direct reply path.", width: 2880, height: 10456, scroll: true },
        { src: "/images/case-studies/letters-app/carousel/letters-app-web-reply.webp", alt: "Letters App web reply modal: respond to a letter in an overlay without losing reading context", caption: "Reply without leaving the letter. The overlay keeps the original visible.", width: 2880, height: 4776, scroll: true },
        { src: "/images/case-studies/letters-app/carousel/letters-app-web-compose.webp", alt: "Letters App web compose editor: draft a new letter with structured fields and image upload", caption: "Draft a new letter with structure: title, cover image, and body.", width: 2880, height: 4776, scroll: true },
      ],
    },
    {
      type: "phone-mockup",
      heading: "Writing is guided without taking over the author's voice",
      chapter: "solution",
      body: "<strong>The iPhone flow makes the editorial choices visible.</strong> The writer composes a letter, chooses imagery or a visual treatment, previews the result, and posts only when it is ready.",
      phoneMockupImages: [
        { src: "/images/case-studies/letters-app/phone/letters-app-phone-compose.webp", alt: "Letters App iPhone compose screen: write a letter and choose its visual treatment", caption: "Compose a letter and choose its visual treatment." },
        { src: "/images/case-studies/letters-app/phone/letters-app-phone-preview-post.webp", alt: "Letters App iPhone preview and post screen: review the finished letter before posting", caption: "Preview the finished letter before posting." },
      ],
    },
    {
      type: "phone-mockup",
      heading: "A correspondence product needs a clear way in and back",
      chapter: "solution",
      body: "The supporting mobile states establish the product beyond one letter: <strong>onboarding introduces its promise, My Letters separates sent and received correspondence, and My Pals makes the people behind the letters discoverable.</strong>",
      phoneMockupImages: [
        { src: "/images/case-studies/letters-app/phone/letters-app-phone-onboarding.webp", alt: "Letters App iPhone onboarding screen: welcome, log in, sign up", caption: "Welcome and sign-in entry point." },
        { src: "/images/case-studies/letters-app/phone/letters-app-phone-my-letters.webp", alt: "Letters App iPhone My Letters screen: sent and received letters", caption: "Sent and received letters." },
      ],
    },
    {
      type: "phone-mockup",
      heading: "The people behind the correspondence",
      chapter: "solution",
      phoneMockupImages: [
        { src: "/images/case-studies/letters-app/phone/letters-app-phone-my-pals.webp", alt: "Letters App iPhone My Pals screen: discover the people behind the letters", caption: "People behind the correspondence." },
      ],
    },
    {
      type: "results",
      heading: "What the concept delivered",
      navLabel: "Results",
      chapter: "results",
      outcomeBullets: [
        { label: "Responsive web experience", description: "Discovery and long-form letter reading across desktop and mobile viewports." },
        { label: "Complete mobile correspondence flow", description: "Onboarding through writing, visual choices, preview, posting, sent/received letters, and pals." },
        { label: "Coherent interaction model", description: "A letter carries story, imagery, place, author context, and a direct reply path." },
      ],
    },
    {
      type: "constraints",
      heading: "A slower experience still needs to be easy to use",
      chapter: "reflection",
      outcomeBullets: [
        { label: "Typography and contrast requirements", description: "Long-form reading requires resilient typography, contrast, focus order, and image alt text." },
        { label: "Designed screens, not measured outcomes", description: "The product concept is evidenced by designed screens, not by a measured accessibility study or live-product outcome." },
        { label: "Interface concepts only", description: "The visual-assistance and image-generation states shown in the flow should be described only as interface concepts; do not claim autonomous writing or generated content quality." },
      ],
    },
    {
      type: "text",
      heading: "Designing for a response worth writing",
      chapter: "reflection",
      body: "<strong>Letters App treats communication as something people can return to, not simply clear from an inbox.</strong> The work connects the calm of a long reading surface with the practical steps needed to create and send a reply. The next challenge would be validating whether this pace helps people build more meaningful correspondence.",
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
      { label: "Talent experience", start: 0.28 },
      { label: "Employer experience", start: 0.47 },
      { label: "Frequently asked questions", start: 0.64 },
      { label: "Find talent, get hired", start: 0.78 },
      { label: "Footer", start: 0.88 },
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
          src: "/images/case-studies/credlane/carousel/travecs-assessment-01-personal-summary.webp",
          alt: "SkillBridge-stage personal assessment summary with the next assessment in the talent roadmap",
          caption: "Personal assessment: the summary unlocks the next step in the roadmap",
          width: 1360,
          height: 967,
          scroll: true,
        },
        {
          src: "/images/case-studies/credlane/carousel/travecs-assessment-02-advanced-preview.webp",
          alt: "SkillBridge-stage advanced assessment preview with timing, expectations, and retake guidance",
          caption: "Advanced assessment preview: expectations and guidance before starting",
          width: 1360,
          height: 1085,
          scroll: true,
        },
        {
          src: "/images/case-studies/credlane/carousel/travecs-assessment-03-active.webp",
          alt: "SkillBridge-stage active assessment with question navigation, timer, progress, and submit action",
          caption: "Active assessment: structured navigation, progress, and submission",
          width: 1360,
          height: 967,
          scroll: true,
        },
        {
          src: "/images/case-studies/credlane/carousel/travecs-assessment-04-advanced-summary.webp",
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
          src: "/images/case-studies/credlane/carousel/travecs-talent-01-generating.webp",
          alt: "SkillBridge-stage loading screen generating assessments before a new talent profile is created",
          caption: "New talent: generating a personalised assessment path before profile creation",
          width: 1360,
          height: 967,
          scroll: true,
        },
        {
          src: "/images/case-studies/credlane/carousel/travecs-talent-02-home.webp",
          alt: "SkillBridge-stage default talent homepage with profile progress and the assessment roadmap",
          caption: "Default homepage: profile progress and the complete Job Ready roadmap",
          width: 1360,
          height: 1107,
          scroll: true,
        },
        {
          src: "/images/case-studies/credlane/carousel/travecs-talent-03-resources-menu.webp",
          alt: "SkillBridge-stage resources page with learning resources and the account menu open",
          caption: "Resources: learning content with account controls kept within reach",
          width: 1360,
          height: 1344,
          scroll: true,
        },
        {
          src: "/images/case-studies/credlane/carousel/travecs-talent-04-job-ready.webp",
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
          src: "/images/case-studies/credlane/carousel/travecs-employer-assessment-01-create.webp",
          alt: "Credlane-stage employer modal for defining an assessment title, category, pass rate, and deadline",
          caption: "Set up: define the assessment details, pass rate, and deadline",
          width: 1360,
          height: 850,
        },
        {
          src: "/images/case-studies/credlane/carousel/travecs-employer-assessment-02-review-create.webp",
          alt: "Credlane-stage employer review screen with a Create assessment action",
          caption: "Review: confirm the configuration before creating the assessment",
          width: 1360,
          height: 1136,
          scroll: true,
        },
        {
          src: "/images/case-studies/credlane/carousel/travecs-employer-assessment-03-manage.webp",
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
  role: "Product design: UX, UI",
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
    "Draftly is an AI writing coach for high-school students. It helps students brainstorm, structure, revise, and understand their writing through explanations that turn every correction into a learning moment. I designed the full product concept in a three-day solo sprint: product direction, visual identity, a responsive landing page, product previews for the AI Idea Starter and Writing Assistant, a brand and mascot system, and a set of Writing Journey illustration cards. The prototype was presented to potential investors and collaborators.",
  coverSrc: "/images/case-studies/draftly-cover.webp",
  heroMedia: {
    src: "/images/draftly/draftly-hero-1440x900.webp",
    alt: "Draftly landing page hero showing the AI writing coach positioning and product interface preview",
  },
  coverScroll: {
    src: "/images/draftly/draftly-landing-page-full.webp",
    alt: "Draftly landing page",
    sections: [
      { label: "Meet Draftly", start: 0 },
      { label: "Product", start: 0.1353 },
      { label: "Learning support", start: 0.2844 },
      { label: "Writing journey", start: 0.4654 },
      { label: "Pricing", start: 0.611 },
      { label: "Questions", start: 0.7632 },
      { label: "Start writing", start: 0.888 },
      { label: "Footer", start: 0.9489 },
    ],
  },
  meta: {
    role: "Design Lead and Sole Designer",
    timeline: "3 days",
    date: "February 2026",
    platform: "Responsive Web",
    team: "Solo",
    scope:
      "Landing page, AI Idea Starter preview, Writing Assistant preview, Writing Journey illustration cards",
    status: "Prototype presented to potential investors and collaborators",
  },
  sections: [
    {
      type: "executive-summary",
      executiveSummary: {
        problem:
          "Most AI writing tools generate work or correct it without teaching the student what changed. That leaves a gap between getting help and actually becoming a stronger writer.",
        solution:
          "I designed Draftly as an AI writing coach: a learning-first product concept that helps students begin, revise, and understand their work while keeping ownership with the student.",
        outcome:
          "In a three-day solo sprint, I translated that position into a responsive landing page, two product demonstrations, a visual system, and a Writing Journey that makes progress tangible.",
      },
    },
    {
      type: "what-i-designed",
      heading: "What I designed",
      designedFeatures: [
        { name: "Product story", description: "A responsive landing page that introduces Draftly and shows the product before asking for trust." },
        { name: "Idea Starter", description: "A guided first step from assignment prompt to an angle, thesis, or outline without writing the essay." },
        { name: "Writing Assistant", description: "Revision feedback that pairs a correction with a concise explanation and a student choice." },
        { name: "Progress system", description: "A visual identity, mascot, and four-stage Writing Journey that make learning feel encouraging and visible." },
      ],
    },
    {
      type: "text",
      heading: "A coach, not a generator",
      navLabel: "Positioning",
      chapter: "context",
      body: "<strong>Draftly’s product decision was simple: teach before automating.</strong> Students need help getting started and improving a draft, but they should still make the argument and write the work.\n<strong>That distinction also builds trust.</strong> Parents, teachers, and schools need to see a tool that supports learning rather than disguising a shortcut. The landing-page cover above carries the complete product story; the two moments below show how that promise works in practice.",
    },
    {
      type: "text",
      heading: "Two learning-first product moments",
      navLabel: "Product",
      chapter: "solution",
      body: "<strong>The Idea Starter lowers the cost of beginning.</strong> It turns an assignment prompt into possible directions and a workable structure, without producing a finished submission.\n<strong>The Writing Assistant makes revision instructional.</strong> Each suggestion exposes the issue, proposes a correction, explains the reason, and leaves the decision to accept or ignore with the student.",
    },
    {
      type: "carousel",
      heading: "Product demonstrations",
      carouselAspectRatio: 880 / 573,
      carouselBackground: "#F6F4FE",
      images: [
        {
          src: "/images/draftly/draftly-idea-starter-feature.webp",
          alt: "Draftly AI Idea Starter product frame from Figma",
          caption: "Idea Starter: helping a student move from a prompt to a direction without creating the assignment.",
          width: 880,
          height: 573,
        },
        {
          src: "/images/draftly/draftly-writing-assistant-feature.webp",
          alt: "Draftly Writing Assistant product frame from Figma",
          caption: "Writing Assistant: pairing a suggested edit with the explanation that makes it a learning moment.",
          width: 880,
          height: 573,
        },
      ],
    },
    {
      type: "text",
      heading: "Make progress visible",
      navLabel: "System",
      body: "<strong>Writing is a sequence, not a single submit moment.</strong> The Writing Journey gives students a clear path from pre-writing to drafting, revising, and polishing. The card illustrations make that otherwise invisible progress feel concrete and rewarding.\n<strong>The brand follows the same principle.</strong> Purple carries the core identity; soft colour, generous spacing, rounded shapes, and an encouraging mascot keep the experience youthful and credible rather than like a generic AI dashboard.",
    },
    {
      type: "carousel",
      heading: "Visual and brand system",
      carouselAspectRatio: 1920 / 1080,
      images: [
        {
          src: "/images/draftly/draftly-visual-brand-system.webp",
          alt: "Draftly visual and brand system board from Figma",
          width: 1920,
          height: 1080,
        },
      ],
    },
    {
      type: "results",
      heading: "Outcome",
      navLabel: "Outcome",
      chapter: "results",
      outcomeBullets: [
        { label: "A clear product wedge", description: "Explanation and student ownership were made the product promise, not secondary safety language." },
        { label: "A credible presentation", description: "The landing page and two focused product frames made the concept concrete for potential investors and collaborators." },
        { label: "A coherent system", description: "The product UI, brand identity, mascot, and Writing Journey all reinforce the same learning-first experience." },
      ],
    },
    {
      type: "text",
      heading: "What I would validate next",
      navLabel: "Next",
      chapter: "reflection",
      body: "<strong>The next step is testing the learning loop, not expanding the marketing page.</strong> I would test the Idea Starter with students facing blank-page anxiety, then measure whether explanations help them make fewer of the same mistakes independently. Success is not more accepted corrections; it is stronger unaided writing over time.",
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
