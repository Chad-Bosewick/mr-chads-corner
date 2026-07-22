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
    | "key-decisions";
  heading?: string;
  body?: string;
  images?: { src: string; alt: string; caption?: string }[];
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
  coverSrc: string;
  sections: ContentSection[];
  nextSlug: string | null;
  prevSlug: string | null;
  // New fields
  heroMedia?: { src: string; alt: string };
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
        { src: "/images/case-studies/todo-app-persona-1.webp", alt: "TODO++ user persona — power user", caption: "Power user persona — needs advanced features without clutter" },
        { src: "/images/case-studies/todo-app-persona-2.webp", alt: "TODO++ user persona — casual user", caption: "Casual user persona — wants simplicity over options" },
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
        { src: "/images/case-studies/todo-app-homepage-task.webp", alt: "TODO++ redesigned task view", caption: "The redesigned task view — clear hierarchy, focused on what matters" },
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
        { src: "/images/case-studies/todo-app-new-user-sync.webp", alt: "TODO++ new user sync screen", caption: "Onboarding — getting started with intelligent sync" },
        { src: "/images/case-studies/todo-app-new-user-link-device.webp", alt: "TODO++ device linking", caption: "Cross-device setup — seamless transition between devices" },
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
        { src: "/images/case-studies/todo-app-complete-task.webp", alt: "TODO++ completed task state", caption: "Completed task view — satisfying visual feedback without clutter" },
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
        { src: "/images/case-studies/letters-app-homepage-post-1.webp", alt: "Letters App inbox view", caption: "The inbox — envelopes with preview windows, no read receipts, no typing indicators" },
        { src: "/images/case-studies/letters-app-homepage-post-2.webp", alt: "Letters App homepage", caption: "Home feed — letters from your circle, organised by person" },
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
        { src: "/images/case-studies/letters-app-my-letters.webp", alt: "Letters App my letters view", caption: "My letters — a personal archive of correspondence" },
        { src: "/images/case-studies/letters-app-my-pals.webp", alt: "Letters App pals page", caption: "My Pals — manage your correspondence circle" },
      ],
    },
    {
      type: "full-image",
      heading: "Personality and connection",
      images: [
        { src: "/images/case-studies/letters-app-persona-details.webp", alt: "Letters App persona details", caption: "Persona details — understanding communication preferences" },
        { src: "/images/case-studies/letters-app-personality-analysis.webp", alt: "Letters App personality analysis", caption: "Personality insights — how your communication style comes across" },
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
        { src: "/images/case-studies/letters-app-showcase.webp", alt: "Letters App showcase", caption: "The complete Letters App experience" },
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
  title: "Credlane",
  category: "Fintech",
  role: "Lead Product Designer",
  timeline: "2 months",
  overview:
    "Credlane is a responsive skills-verification and hiring platform connecting talent readiness, employer discovery, and custom assessments. I led the design across the talent, employer, and external experiences over two months, handing off a partially implemented product to engineering.",
  coverSrc: "/images/case-studies/credlane-hero.webp",
  heroMedia: {
    src: "/images/case-studies/credlane-hero.webp",
    alt: "Credlane talent dashboard, assessment interface, and employer dashboard shown together.",
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
    /* 1. Project snapshot */
    { type: "snapshot" },

    /* 2. Executive summary */
    {
      type: "executive-summary",
      executiveSummary: {
        problem:
          "Hiring decisions rely on CVs and short interviews that rarely provide dependable evidence of what a candidate can do.",
        solution:
          "Credlane gives talent a structured assessment pathway and gives employers interpretable results to support hiring decisions.",
        outcome:
          "A broad, partially implemented platform covering talent readiness, employer discovery, custom assessments, and candidate evaluation.",
      },
    },

    /* 3. What I designed */
    {
      type: "what-i-designed",
      heading: "What I designed",
      designedFeatures: [
        {
          name: "Talent experience",
          description:
            "Onboarding, assessment dashboard, job exploration, and employer outreach — connecting readiness with opportunity.",
        },
        {
          name: "Employer experience",
          description:
            "Role creation, talent discovery, candidate review, hiring pipeline, and assessment management.",
        },
        {
          name: "Assessment system",
          description:
            "Personal, skill, and advanced assessments with Job Ready qualification, Employability Score, and integrity safeguards.",
        },
        {
          name: "External assessments",
          description:
            "Shareable assessment links for non-platform candidates with a distinct permission model and dedicated applicant flow.",
        },
      ],
    },

    /* 4. The problem */
    {
      type: "text",
      heading: "The problem",
      body: "<strong>Hiring lacks evidence.</strong> CVs, self-reported skills, and short interviews provide context, but not dependable proof of what a candidate can do.\n\n<strong>Both sides feel the gap.</strong> Job seekers with limited experience struggle to prove competence. Employers spend time screening candidates and still lack practical evidence of readiness.\n\n<strong>Credlane bridges the gap.</strong> The product gives talent a structured way to demonstrate capabilities while giving employers interpretable results as part of a broader hiring decision.\n\n<strong>My role.</strong> As Lead Designer, I turned an evolving product idea into a coherent experience across multiple user groups — leading design direction, assigning flows to other designers, maintaining the design system, translating stakeholder decisions into actionable flows, and preparing the talent, employer, and external experiences for development.\n\n<strong>The real challenge</strong> was not designing individual screens. It was helping the team understand what the product was becoming and ensuring each change in direction was reflected consistently across the platform.",
    },
    {
      type: "diagram",
      diagramType: "problem",
      diagramData: {
        problemDiagram: {
          leftLabel: "Talent",
          leftStatement: "I need a fair way to prove what I can do.",
          rightLabel: "Employer",
          rightStatement: "I need stronger evidence before I hire.",
          centre: "Structured assessments + interpretable results",
        },
      },
    },

    /* 5. Product evolution */
    {
      type: "text",
      heading: "Product evolution",
      body: "<strong>Started as education.</strong> Credlane began as a platform where talent could learn skills, complete assessments, and become visible to employers. The intended journey was: learn, practise, assess, become employable.\n\n<strong>Pivoted to hiring.</strong> As stakeholders reconsidered the commercial position, the product evolved into a semi-job board and talent-assessment platform. This changed the structure, navigation, permissions, and relationship between both user groups.\n\n<strong>Scope expanded significantly.</strong> The revised product needed to support assessments, job discovery, employer hiring tools, external assessments, subscriptions, and candidate management — all within two months.\n\n<strong>Two questions emerged.</strong> How might we turn verified assessment performance into a useful hiring signal without reducing talent to a single score? And how could the design team keep the product coherent while its underlying definition continued to change?",
    },
    {
      type: "diagram",
      diagramType: "evolution",
      diagramData: {
        evolutionStages: [
          {
            stage: "Education platform",
            description: "Learn, practise, assess, become employable",
          },
          {
            stage: "Skills-verification platform",
            description: "Assess, earn Job Ready status, become discoverable",
          },
          {
            stage: "Semi-job board and hiring system",
            description: "Discover roles and talent, assess, shortlist, hire",
          },
        ],
      },
    },

    /* 6. Product ecosystem */
    {
      type: "text",
      heading: "Product ecosystem",
      body: "<strong>Three distinct user types.</strong> Credlane had to work for registered talent, employers, and external assessment applicants — each with different goals, permissions, and entry points.\n\n<strong>Talent</strong> completed assessments, explored opportunities, and became discoverable to employers.\n\n<strong>Employers</strong> discovered talent, created roles, invited candidates, built assessments, and managed hiring decisions.\n\n<strong>External applicants</strong> were invited through a shareable assessment link but were not full members of the talent platform. They could register, complete the assessment, and receive results — but could not access the talent dashboard or enter the discoverable talent pool.\n\n<strong>The third role was critical.</strong> Without a distinct permission model, external applicants could accidentally gain access to parts of the product intended for registered talent.",
    },
    {
      type: "diagram",
      diagramType: "ecosystem",
      diagramData: {
        ecosystemRoles: [
          {
            name: "Talent",
            description:
              "Registered job seekers using the main platform. They complete assessments, explore opportunities, and become discoverable to employers.",
            permissions: [
              "Complete assessments",
              "Explore jobs",
              "Receive offers",
              "View results",
            ],
          },
          {
            name: "Employers",
            description:
              "Organizations using Credlane to discover talent, create roles, invite candidates, and manage hiring decisions.",
            permissions: [
              "Create roles",
              "Discover talent",
              "Send offers",
              "Build assessments",
            ],
          },
          {
            name: "External applicants",
            description:
              "Users invited through an external assessment link. Not full members of the talent platform.",
            permissions: [
              "Register via email",
              "Complete assessment",
              "Receive results",
            ],
          },
        ],
      },
    },

    /* 7. Research and definition */
    {
      type: "text",
      heading: "Research and definition",
      body: "<strong>Compressed discovery.</strong> Because Credlane was a new product with a tight timeline, our discovery combined competitor analysis, interface pattern research, team brainstorming, stakeholder discussions, prototype testing, and design reviews.\n\n<strong>Pattern research.</strong> We reviewed products across assessment, recruitment, education, and job-board categories. Mobbin was used to examine recurring patterns — onboarding structures, assessment instructions, multi-step forms, dashboard navigation, candidate profiles, table layouts, progress indicators, and warning states.\n\n<strong>Not reproduction.</strong> The goal was not to copy another product. Studying familiar patterns helped us avoid introducing unnecessary interaction models where users already had established expectations. Interface references served as design inputs, evaluated through team reviews and testing rather than treated as direct evidence of user behaviour.",
    },
    {
      type: "full-image",
      heading: "Pattern research and early product exploration",
      images: [
        {
          src: "/images/case-studies/credlane-pattern-research.webp",
          alt: "Interface pattern research and early product exploration for Credlane.",
        },
      ],
    },

    /* 8. The assessment system */
    {
      type: "text",
      heading: "The assessment system",
      body: "<strong>Three assessments determine readiness.</strong> A talent user needed to pass personal, skill, and advanced assessments to earn Job Ready status and become discoverable to employers.\n\n<strong>Job Ready is a starting point.</strong> We positioned it as a qualification state within Credlane — not a guarantee that someone was appropriate for every role. The status showed progress toward visibility, explained incomplete requirements, made failure feel recoverable, and directed users toward resources during the retake waiting period.\n\n<strong>The Employability Score needs context.</strong> Determined by skill and advanced assessment performance, the score was visible to both talent and employers. The design risk was allowing it to become the only signal employers considered. The score sat alongside assessment breakdowns, candidate experience, skills, profile information, and role relevance — making it interpretable rather than reductive.\n\n<strong>Assessments support multiple formats.</strong> Credlane assessments included multiple-choice, written responses, coding questions, file uploads, timed questions, and scenario-based questions. Tab-switch warnings communicated integrity concerns without being unnecessarily threatening, and the interface showed progress, remaining time, flagged questions, and submission confirmation.",
    },
    {
      type: "comparison",
      heading: "Two assessment models",
      comparisonItems: [
        {
          label: "Open assessments",
          content:
            "Talent take available assessments as part of their journey toward Job Ready status. The motivation is profile improvement and discoverability.",
        },
        {
          label: "Employer-assigned assessments",
          content:
            "Employers create or assign assessments to evaluate candidates for a particular role. The motivation is responding to a specific opportunity.",
        },
      ],
    },
    {
      type: "sequence",
      heading: "Assessment flow",
      sequenceItems: [
        {
          step: 1,
          label: "Assessment details",
          description:
            "Understand what the assessment covers, how long it takes, and what question types to expect.",
          src: "/images/case-studies/credlane-assessment-details.webp",
          alt: "Credlane assessment instructions and details screen",
        },
        {
          step: 2,
          label: "Active question",
          description:
            "Answer questions with support for multiple-choice, written responses, coding, file uploads, and timed questions.",
          src: "/images/case-studies/credlane-assessment-question.webp",
          alt: "Credlane active assessment question screen",
        },
        {
          step: 3,
          label: "Integrity warning",
          description:
            "Tab-switch warnings that explain the impact on assessment validity without being unnecessarily threatening.",
          src: "/images/case-studies/credlane-assessment-integrity.webp",
          alt: "Credlane assessment tab-switch integrity warning",
        },
        {
          step: 4,
          label: "Review and submit",
          description:
            "Review answers, check flagged questions, and submit the completed assessment.",
          src: "/images/case-studies/credlane-assessment-review.webp",
          alt: "Credlane assessment review and submit screen",
        },
        {
          step: 5,
          label: "Completion",
          description:
            "Successful submission state with clear confirmation and next steps.",
          src: "/images/case-studies/credlane-assessment-complete.webp",
          alt: "Credlane assessment completion screen",
        },
      ],
    },

    /* 9. Talent experience */
    {
      type: "text",
      heading: "Talent experience",
      body: "<strong>Onboarding without friction.</strong> The talent onboarding collected enough information to personalise the platform without making account creation feel like an application form — establishing identity, professional interests, preferred skills, experience, assessment status, and profile completion.\n\n<strong>Assessment dashboard.</strong> The dashboard helped talent understand which assessments were available and required, view completed assessments and scores, check retake eligibility, and track progress toward Job Ready status.\n\n<strong>Two paths to opportunity.</strong> Talent could actively explore roles and indicate interest — allowing employers to review profiles and assessment evidence before moving forward. Alternatively, employers could proactively discover talent profiles and send job offers directly. These two entry paths supported both active and passive job discovery.",
    },
    {
      type: "sequence",
      heading: "Talent journey",
      sequenceItems: [
        {
          step: 1,
          label: "Onboarding",
          description:
            "Collect identity, professional interests, preferred skills, and experience without making account creation feel like an application form.",
          src: "/images/case-studies/credlane-talent-onboarding.webp",
          alt: "Credlane talent onboarding screen",
        },
        {
          step: 2,
          label: "Assessment dashboard",
          description:
            "View available and required assessments, completed assessments, scores, retake eligibility, and progress toward Job Ready status.",
          src: "/images/case-studies/credlane-talent-dashboard.webp",
          alt: "Credlane talent assessment dashboard",
        },
        {
          step: 3,
          label: "Explore jobs",
          description:
            "Discover opportunities and indicate interest in roles, allowing employers to review profiles and assessment evidence.",
          src: "/images/case-studies/credlane-talent-explore.webp",
          alt: "Credlane talent job exploration screen",
        },
        {
          step: 4,
          label: "Received opportunity",
          description:
            "Receive a job offer directly when an employer discovers the talent profile and reaches out.",
          src: "/images/case-studies/credlane-talent-opportunity.webp",
          alt: "Credlane talent received job opportunity screen",
        },
      ],
    },

    /* 10. Employer experience */
    {
      type: "text",
      heading: "Employer experience",
      body: "<strong>Role creation.</strong> Employers defined opportunities with job information, required skills, experience expectations, assessment requirements, hiring preferences, and candidate criteria.\n\n<strong>Talent discovery.</strong> Employers explored Job Ready talent and evaluated profiles based on skills, Employability Score, assessment performance, experience, role relevance, and profile information. Filtering narrowed the pool without manually reviewing every profile.\n\n<strong>Candidate management.</strong> Employers could invite talent, send offers, shortlist or reject candidates, schedule interviews, send assessment invitations, review results, and move candidates through hiring stages.\n\n<strong>Assessment results as workflow input.</strong> This made Credlane more than an assessment tool. Assessment results became part of a broader decision-making workflow that connected discovery, evaluation, and hiring.",
    },
    {
      type: "sequence",
      heading: "Employer journey",
      sequenceItems: [
        {
          step: 1,
          label: "Employer dashboard",
          description:
            "Overview of roles, candidate activity, assessment results, and hiring pipeline.",
          src: "/images/case-studies/credlane-employer-dashboard.webp",
          alt: "Credlane employer dashboard",
        },
        {
          step: 2,
          label: "Create role",
          description:
            "Define job information, required skills, experience expectations, assessment requirements, and hiring preferences.",
          src: "/images/case-studies/credlane-employer-create-role.webp",
          alt: "Credlane employer role creation screen",
        },
        {
          step: 3,
          label: "Discover talent",
          description:
            "Explore Job Ready talent, evaluate profiles, and filter by skills, score, and role relevance.",
          src: "/images/case-studies/credlane-employer-discover.webp",
          alt: "Credlane employer talent discovery screen",
        },
        {
          step: 4,
          label: "Candidate management",
          description:
            "Invite talent, send offers, shortlist candidates, and move them through hiring stages.",
          src: "/images/case-studies/credlane-employer-candidates.webp",
          alt: "Credlane employer candidate management screen",
        },
      ],
    },
    {
      type: "full-image",
      heading: "Candidate review with annotations",
      images: [
        {
          src: "/images/case-studies/credlane-candidate-review-annotated.webp",
          alt: "Credlane candidate profile with annotation callouts for score, Job Ready status, skills, experience, and employer actions.",
        },
      ],
    },

    /* 11. External assessments */
    {
      type: "text",
      heading: "External assessments",
      body: "<strong>Commercially significant.</strong> One of the most important employer features was the ability to assess people who were not part of the main talent platform. External assessment creation was planned as a paid feature gated behind an employer subscription tier.\n\n<strong>Employer creation flow.</strong> The employer selected whether the assessment was internal (for existing talent) or external (distributed through a shareable link). They created the assessment, added questions, set correct answers, established a pass benchmark, and generated the link. For the MVP, custom assessments supported multiple-choice questions.\n\n<strong>External applicant flow.</strong> The external journey was intentionally separated from the main talent experience. Users opened the shared link, registered via email, reviewed instructions and terms, completed the assessment, and received confirmation. Taking the assessment also represented consent to receive targeted marketing emails, as stated in the Terms and Conditions.\n\n<strong>Permission boundaries.</strong> External applicants had a dedicated user role — they could take the assessment but could not access the talent dashboard or enter the discoverable talent pool. This separation prevented external participants from unintentionally becoming regular Credlane users.",
    },
    {
      type: "sequence",
      heading: "Employer external assessment creation",
      sequenceItems: [
        {
          step: 1,
          label: "Create Assessment entry",
          description:
            "Enter the Create Assessment flow from the employer dashboard.",
          src: "/images/case-studies/credlane-external-create-entry.webp",
          alt: "Credlane Create Assessment entry point",
        },
        {
          step: 2,
          label: "Internal vs External",
          description:
            "Select whether the assessment is for existing talent or distributed through a shareable link.",
          src: "/images/case-studies/credlane-external-toggle.webp",
          alt: "Credlane assessment internal versus external toggle",
        },
        {
          step: 3,
          label: "Assessment builder",
          description:
            "Add questions, answer options, correct answers, and assessment settings.",
          src: "/images/case-studies/credlane-external-builder.webp",
          alt: "Credlane assessment builder screen",
        },
        {
          step: 4,
          label: "Benchmark and settings",
          description:
            "Establish a pass benchmark and configure assessment parameters.",
          src: "/images/case-studies/credlane-external-benchmark.webp",
          alt: "Credlane assessment benchmark and settings screen",
        },
        {
          step: 5,
          label: "Shareable link",
          description:
            "Generate and distribute the assessment through a shareable link.",
          src: "/images/case-studies/credlane-external-shareable-link.webp",
          alt: "Credlane shareable assessment link success state",
        },
      ],
    },
    {
      type: "sequence",
      heading: "External applicant journey",
      sequenceItems: [
        {
          step: 1,
          label: "Invitation",
          description:
            "Open the shared assessment link received from an employer.",
          src: "/images/case-studies/credlane-external-invitation.webp",
          alt: "Credlane external assessment invitation screen",
        },
        {
          step: 2,
          label: "Email sign-up",
          description:
            "Register using an email address to access the assessment.",
          src: "/images/case-studies/credlane-external-signup.webp",
          alt: "Credlane external applicant email registration screen",
        },
        {
          step: 3,
          label: "Terms and consent",
          description:
            "Review assessment instructions, terms, and consent to marketing communications.",
          src: "/images/case-studies/credlane-external-terms.webp",
          alt: "Credlane external assessment terms and consent screen",
        },
        {
          step: 4,
          label: "Assessment",
          description:
            "Complete the assigned assessment with supported question types.",
          src: "/images/case-studies/credlane-external-assessment.webp",
          alt: "Credlane external assessment question screen",
        },
        {
          step: 5,
          label: "Completion",
          description:
            "Receive confirmation that the assessment has been submitted successfully.",
          src: "/images/case-studies/credlane-external-complete.webp",
          alt: "Credlane external assessment completion screen",
        },
      ],
    },

    /* 12. Leading through change */
    {
      type: "text",
      heading: "Leading through change",
      body: "<strong>Repeated pivots.</strong> The central challenge was the repeated change in product direction. Credlane began as education-led, then expanded into job discovery, employer hiring tools, external assessments, subscriptions, and candidate management. Each change affected multiple connected areas.\n\n<strong>System-level thinking.</strong> Moving toward a semi-job board required revisiting talent navigation, employer navigation, profile visibility, Job Ready eligibility, role creation, candidate discovery, assessment entry points, platform permissions, and external user roles. I treated these as product-system changes rather than isolated screen requests.\n\n<strong>My process.</strong> Clarify the revised stakeholder decision, identify affected user journeys, map dependencies, break work into assignable flows, review output from other designers, update reusable patterns, present the revised direction, and align with product and engineering.\n\n<strong>Team coordination.</strong> With 24 people across product, engineering, marketing, and design, inconsistencies could appear easily when several flows were created simultaneously. The objective was not for every designer to create screens that looked similar — it was for the product to behave like one connected system.",
    },
    {
      type: "diagram",
      heading: "Change framework",
      diagramType: "change-framework",
      diagramData: {
        changeRows: [
          {
            change: "Education platform became a semi-job board",
            systems: "Navigation, profiles, roles, discovery",
            response: "Reframed the information architecture around hiring journeys",
          },
          {
            change: "Employers could assess external applicants",
            systems: "Roles, permissions, sign-up, results, pricing",
            response: "Added a distinct external applicant role and shareable assessment flow",
          },
          {
            change: "Assessment results became a hiring signal",
            systems: "Scores, profiles, candidate lists, filters",
            response: "Added contextual performance breakdowns rather than relying on one number",
          },
        ],
      },
    },
    {
      type: "diagram",
      heading: "Team coordination workflow",
      diagramType: "team-workflow",
      diagramData: {
        workflowSteps: [
          "Stakeholder direction",
          "Product clarification",
          "Flow assignment",
          "Design review",
          "System alignment",
          "Engineering handoff",
        ],
      },
    },

    /* 13. Design system */
    {
      type: "text",
      heading: "Design system",
      body: "<strong>Reusable across a large surface.</strong> Credlane required consistent patterns across authentication, form fields, multi-step onboarding, buttons, navigation, assessment questions, progress states, warnings, modals, candidate cards, job cards, tables, filters, score displays, empty states, and responsive behaviour.\n\n<strong>Essential during change.</strong> Reusable components allowed us to revise shared patterns without redesigning each screen independently. As requirements changed, the system absorbed variation while maintaining consistency.\n\n<strong>Improved handoff quality.</strong> The design system gave developers clearer, repeatable interface behaviour — reducing ambiguity during the engineering implementation phase.",
    },
    {
      type: "full-image",
      heading: "Selected design-system components",
      images: [
        {
          src: "/images/case-studies/credlane-design-system.webp",
          alt: "Selected Credlane design-system components used across talent and employer experiences.",
        },
      ],
    },

    /* 14. Results */
    {
      type: "results",
      heading: "Results",
      outcomeBullets: [
        {
          label: "Comprehensive scope delivered",
          description:
            "Designed talent onboarding, assessment flows, Job Ready qualification, Employability Score, job discovery, employer hiring tools, custom assessment creation, external applicant assessment, results dashboards, and supporting components.",
        },
        {
          label: "Handed off to engineering",
          description:
            "The work was delivered to the engineering team and partially implemented, establishing a clear foundation for Credlane's talent, employer, and external assessment experiences.",
        },
        {
          label: "Strong qualitative feedback",
          description:
            "The design received positive feedback from the HNG chief mentor and cross-disciplinary mentors who commended its visual quality and completeness.",
        },
        {
          label: "System survived repeated pivots",
          description:
            "The design system and information architecture remained coherent despite the product shifting from education to hiring, then expanding to include external assessments and candidate management.",
        },
      ],
    },

    /* 15. Constraints */
    {
      type: "constraints",
      heading: "Constraints",
      outcomeBullets: [
        {
          label: "Two-month timeline",
          description:
            "The entire talent, employer, and external experience needed to be designed within two months, requiring rapid iteration and decisive trade-offs.",
        },
        {
          label: "Shifting product definition",
          description:
            "The product direction changed multiple times — from education to hiring to external assessments — requiring constant re-alignment of navigation, permissions, and user journeys.",
        },
        {
          label: "Large cross-functional team",
          description:
            "Coordinating design across 24 people in product, engineering, marketing, and design demanded strong system-level thinking and consistent communication of evolving requirements.",
        },
      ],
    },

    /* 16. Key decisions */
    {
      type: "key-decisions",
      heading: "Key decisions",
      outcomeBullets: [
        {
          label: "Pivoted from education to hiring",
          description:
            "Reframed the entire information architecture around assessment readiness, employer discovery, and hiring workflows — rather than learning and skill development.",
        },
        {
          label: "Created a dedicated external applicant role",
          description:
            "Separated external assessment participants from the main talent pool with distinct permissions, preventing unintended access to the job-seeker product.",
        },
        {
          label: "Score as context, not verdict",
          description:
            "Positioned the Employability Score as one input alongside assessment breakdowns, profile information, and role relevance — reducing the risk of employers treating a single number as a complete hiring signal.",
        },
      ],
    },

    /* 17. Future-state assessments */
    {
      type: "future-state",
      heading: "Open-ended assessments",
      futureStateData: [
        {
          label: "Planned feature",
          description:
            "Open-ended questions were considered for a later phase rather than the MVP. Unlike multiple-choice assessments, open-ended responses would require manual review by the Credlane team.",
        },
        {
          label: "Manual review over AI",
          description:
            "Manual review was chosen to avoid unpredictable AI evaluation, grading inconsistency, token costs, reduced employer trust, and difficulty explaining how scores were generated.",
        },
        {
          label: "System design impact",
          description:
            "Although not part of the MVP, accounting for open-ended assessments during planning helped prevent the assessment system from being designed too narrowly.",
        },
      ],
    },

    /* 18. Reflection */
    {
      type: "text",
      heading: "Reflection",
      body: "<strong>Product clarity is a design dependency.</strong> Interface quality cannot compensate for an unclear product definition. When the product changed from education-led to hiring-led, the most important work was understanding what the new direction meant for each user, permission, action, and journey — not immediately redesigning screens.\n\n<strong>Changes must be evaluated across the system.</strong> A decision within one flow can affect several others. Adding external assessments introduced questions about pricing, user roles, permissions, consent, results reporting, marketing access, and talent-pool visibility. Treating the feature as only a new assessment screen would have missed most of the product work.\n\n<strong>Leadership requires shared understanding.</strong> Assigning screens was only part of leading the design team. The more important responsibility was helping designers understand the product well enough to make consistent decisions across separate flows.\n\n<strong>Scores need context.</strong> Assessment scores can help employers make decisions, but they can also create false certainty. The Employability Score needed to sit within a broader candidate profile rather than serve as a complete definition of talent quality.",
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
  coverSrc: "/images/case-studies/testground-cover.webp",
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
  role: "Product design — UX, UI",
  timeline: "2026",
  overview: "Case study content coming soon.",
  coverSrc: "/images/case-studies/draftly-cover.webp",
  sections: [
    {
      type: "text",
      heading: "Coming soon",
      body: "This case study is being prepared. Check back for the full story.",
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
  const cs = getCaseStudy(currentSlug);
  if (!cs)
    return { prev: null, next: null, prevProject: null, nextProject: null };
  const prev = cs.prevSlug ? getCaseStudy(cs.prevSlug) ?? null : null;
  const next = cs.nextSlug ? getCaseStudy(cs.nextSlug) ?? null : null;
  const prevProject = cs.prevSlug
    ? getProjectBySlug(cs.prevSlug) ?? null
    : null;
  const nextProject = cs.nextSlug
    ? getProjectBySlug(cs.nextSlug) ?? null
    : null;
  return { prev, next, prevProject, nextProject };
}
