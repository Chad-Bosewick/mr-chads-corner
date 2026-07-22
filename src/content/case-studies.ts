export interface ContentSection {
  type: "text" | "image-pair" | "metrics" | "full-image" | "hero-media" | "snapshot" | "diagram" | "comparison" | "sequence" | "future-state";
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
    "Credlane is a responsive web platform that helps job seekers verify their capabilities through structured assessments and enables employers to discover, evaluate, and hire qualified talent with greater confidence.\n\nThe product connects two related experiences. Talent complete personal, skill, and advanced assessments to demonstrate their readiness for work. Employers use assessment results, candidate profiles, and hiring tools to find suitable talent, create roles, send job offers, and assess candidates inside or outside the Credlane platform.\n\nI worked on Credlane in April 2026 as the Lead Product Designer. Over two months, I led the design of the talent experience, employer experience, and external-facing screens while collaborating with product managers, engineers, marketers, and other designers within a team of approximately 24 people.\n\nThe project was handed off to engineering and partially implemented.",
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
    /* ------------------------------------------------------------------ */
    /* 2. Project snapshot                                                 */
    /* ------------------------------------------------------------------ */
    {
      type: "snapshot",
    },

    /* ------------------------------------------------------------------ */
    /* 3. My role                                                         */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "My role",
      body: "As Lead Designer, I was responsible for turning an evolving product idea into a coherent experience across multiple user groups.\n\nMy responsibilities included:\n\n- Leading the product's overall design direction\n- Assigning flows to other designers\n- Reviewing and improving design output\n- Maintaining consistency across the design system\n- Translating stakeholder decisions into actionable product flows\n- Presenting concepts and progress to stakeholders\n- Collaborating with product managers and engineers\n- Making final interaction and interface decisions\n- Preparing the talent, employer, and external experiences for development\n\nThe most difficult part of my role was not designing an individual screen. It was helping the team understand what the product was becoming and ensuring that each change in direction was reflected consistently across the platform.",
    },
    {
      type: "full-image",
      heading: "Credlane project overview",
      images: [
        {
          src: "/images/case-studies/credlane-figma-overview.webp",
          alt: "Overview of the Credlane Figma file showing talent, employer, and external assessment flows.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /* 4. The problem                                                     */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "The problem",
      body: "Hiring decisions are often based on CVs, self-reported skills, and short interviews. These methods provide useful context, but they do not always offer dependable evidence of what a candidate can do.\n\nThis creates problems for both sides of the hiring process.\n\nFor job seekers, especially those with limited professional experience, it can be difficult to prove their competence or stand out using a conventional CV.\n\nFor employers, reviewing applications manually is time-consuming. Even after screening candidates, hiring teams may still lack enough practical evidence to determine who is genuinely prepared for a role.\n\nCredlane was designed to reduce this gap between claimed ability and demonstrated readiness.\n\nThe product needed to give talent a structured way to prove their capabilities while helping employers use those results as part of a broader hiring decision.",
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

    /* ------------------------------------------------------------------ */
    /* 5. The original product concept                                    */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "The original product concept",
      body: "Credlane initially began as an education-focused platform.\n\nThe early concept was to allow talent to learn preferred skills, access educational resources, complete assessments, and become visible to employers based on their performance.\n\nThe intended journey was:\n\nLearn a skill, complete an assessment, demonstrate competence, become employable.\n\nDuring brainstorming sessions, we explored how learning resources, skill development, and assessments could work together. However, the product direction changed as stakeholders reconsidered Credlane's commercial position and primary value proposition.\n\nThe educational experience remained an explored concept, but it was not included in the final product scope.",
    },

    /* ------------------------------------------------------------------ */
    /* 6. From education platform to hiring product                       */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "From education platform to hiring product",
      body: "Credlane gradually evolved from an educational product into a semi-job board and talent-assessment platform.\n\nThe revised product needed to support a much broader set of activities.\n\nFor talent:\n\n- Complete personal, skill, and advanced assessments\n- Earn a Job Ready status\n- Become visible to employers\n- Explore available roles\n- Indicate interest in jobs\n- Receive job offers from employers\n- Review assessment results and Employability Scores\n- Access relevant resources while preparing to retake an assessment\n\nFor employers:\n\n- Create roles\n- Discover assessed talent\n- Review candidate profiles and scores\n- Filter and shortlist candidates\n- Invite talent to apply\n- Send job offers\n- Create custom assessments\n- Assess candidates already on Credlane\n- Assess external applicants through shareable links\n- Review individual and aggregate assessment results\n- Move candidates through a hiring pipeline\n\nThis was not a small feature adjustment. It changed the product's structure, navigation, permissions, and relationship between both user groups.\n\nOur challenge became: how might we turn verified assessment performance into a useful hiring signal without reducing talent to a single score?\n\nAt the same time, I had to answer a second operational question: how could the design team keep the product coherent while its underlying definition continued to change?",
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

    /* ------------------------------------------------------------------ */
    /* 7. Understanding the product ecosystem                             */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "Understanding the product ecosystem",
      body: "Credlane had to work for three distinct user types.\n\n1. Talent. These were registered job seekers using the main platform. They could complete assessments, monitor their performance, explore opportunities, and become discoverable to employers.\n\n2. Employers. These were organizations using Credlane to discover talent, create roles, invite candidates, build assessments, and manage hiring decisions.\n\n3. External assessment applicants. These users were invited through an external assessment link but were not full members of the talent platform.\n\nThey could register with an email address, complete the assigned assessment, and receive necessary assessment communication.\n\nThey could not access the primary talent dashboard, enter Credlane's regular talent pool, become visible to unrelated employers, or use the complete job-seeker product.\n\nDefining this third user type was important. Without a distinct role and permission model, external applicants could accidentally gain access to parts of the product intended for registered talent.",
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

    /* ------------------------------------------------------------------ */
    /* 8. Research and product definition                                 */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "Research and product definition",
      body: "Because Credlane was a new product with a compressed delivery timeline, our discovery work combined competitor analysis, interface pattern research, team brainstorming, stakeholder discussions, prototype testing, and design reviews.\n\nWe reviewed products across assessment, recruitment, education, and job-board categories to understand how established platforms handled complex interactions.\n\nMobbin was one of the tools used to examine recurring product patterns, including onboarding structures, assessment instructions, multi-step forms, dashboard navigation, candidate profiles, job exploration, table layouts, progress indicators, warning states, and confirmation and submission flows.\n\nThe goal was not to reproduce another product. Studying familiar patterns helped us avoid introducing unnecessary interaction models in areas where users already had established expectations.\n\nBecause we did not conduct a large formal research study, I avoided treating interface references as direct evidence of user behaviour. Instead, they served as inputs for design exploration and were evaluated through team reviews and testing.",
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

    /* ------------------------------------------------------------------ */
    /* 9. Defining talent readiness                                       */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "Defining talent readiness",
      body: "A major product decision was determining when a talent user should become visible to employers.\n\nCredlane defined three important assessments.\n\nPersonal assessment. This evaluated qualities associated with workplace readiness, including personality traits, workplace behaviour, communication style, situational judgement, culture alignment, and general cognitive ability.\n\nSkill assessment. This measured competence in the talent's selected professional area.\n\nAdvanced assessment. This provided a more demanding evaluation of the user's ability and readiness.\n\nA talent user needed to pass all three assessments to receive the Job Ready Talent status.\n\nOnce the status was earned, the talent became discoverable to employers.\n\nWhen a user did not pass the advanced assessment, they could not immediately repeat it. They had to wait for a defined period before retaking the assessment. During that waiting period, Credlane could provide relevant learning resources to help them prepare.\n\nThis allowed the product to retain part of its original educational thinking without becoming a full learning platform.",
    },
    {
      type: "sequence",
      heading: "Assessment progression",
      sequenceItems: [
        {
          step: 1,
          label: "Personal assessment",
          description:
            "Evaluate personality traits, workplace behaviour, communication style, situational judgement, culture alignment, and general cognitive ability.",
          src: "/images/case-studies/credlane-personal-assessment.webp",
          alt: "Credlane personal assessment screen",
        },
        {
          step: 2,
          label: "Skill assessment",
          description:
            "Measure competence in the talent's selected professional area.",
          src: "/images/case-studies/credlane-skill-assessment.webp",
          alt: "Credlane skill assessment screen",
        },
        {
          step: 3,
          label: "Advanced assessment",
          description:
            "Provide a more demanding evaluation of the user's ability and readiness.",
          src: "/images/case-studies/credlane-advanced-assessment.webp",
          alt: "Credlane advanced assessment screen",
        },
        {
          step: 4,
          label: "Job Ready status",
          description:
            "Earn Job Ready Talent status and become discoverable to employers.",
          src: "/images/case-studies/credlane-job-ready-status.webp",
          alt: "Credlane Job Ready status screen",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /* 10. Designing the Job Ready status                                 */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "Designing the Job Ready status",
      body: "The Job Ready status had to perform several functions at once.\n\nFor talent, it needed to show progress toward becoming visible, explain which assessment requirements remained incomplete, make failure feel recoverable, clarify when an assessment could be retaken, and direct the user toward useful resources.\n\nFor employers, it needed to indicate that the talent had completed Credlane's required assessment sequence, provide a quick readiness signal, support candidate discovery and filtering, and act as a starting point rather than a complete hiring verdict.\n\nWe deliberately positioned Job Ready as a qualification state within Credlane, not as a guarantee that someone was appropriate for every available role.\n\nA candidate could be ready for employment while still being a poor fit for a specific role, industry, experience level, or organization.",
    },
    {
      type: "comparison",
      heading: "Two sides of Job Ready",
      comparisonItems: [
        {
          label: "For talent",
          content:
            "Show progress toward becoming visible. Explain which assessment requirements remained incomplete. Make failure feel recoverable. Clarify when an assessment could be retaken. Direct the user toward useful resources.",
        },
        {
          label: "For employers",
          content:
            "Indicate that the talent had completed Credlane's required assessment sequence. Provide a quick readiness signal. Support candidate discovery and filtering. Act as a starting point rather than a complete hiring verdict.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /* 11. Designing the Employability Score                              */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "Designing the Employability Score",
      body: "Credlane's Employability Score was determined by the talent's performance in the skill and advanced assessments.\n\nThe score was visible to both talent and employers.\n\nFor talent, it helped communicate current assessment performance, relative readiness, areas that may require improvement, and progress toward stronger job opportunities.\n\nFor employers, it functioned as one input when reviewing a candidate.\n\nA significant design risk was allowing the score to become the only information employers considered. A single number can appear objective while hiding important context.\n\nTo reduce that risk, the score needed to sit alongside information such as assessment breakdowns, candidate experience, skills, profile information, role relevance, personal assessment results, and individual question or category performance, where appropriate.\n\nThe design objective was not to make the score unimportant. It was to make it interpretable.",
    },
    {
      type: "sequence",
      heading: "Employability Score presentation",
      sequenceItems: [
        {
          step: 1,
          label: "Talent score summary",
          description:
            "Current assessment performance and relative readiness shown to the talent user.",
          src: "/images/case-studies/credlane-talent-score.webp",
          alt: "Credlane talent-facing Employability Score summary",
        },
        {
          step: 2,
          label: "Assessment breakdown",
          description:
            "Detailed breakdown of performance across skill and advanced assessments.",
          src: "/images/case-studies/credlane-score-breakdown.webp",
          alt: "Credlane assessment performance breakdown",
        },
        {
          step: 3,
          label: "Employer candidate profile",
          description:
            "Employer-facing view showing the score alongside profile, experience, and role relevance.",
          src: "/images/case-studies/credlane-employer-candidate-profile.webp",
          alt: "Credlane employer-facing candidate profile with Employability Score",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /* 12. Designing the assessment experience                            */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "Designing the assessment experience",
      body: "Assessments were central to the entire product. A confusing or unreliable assessment experience would weaken both talent trust and employer confidence.\n\nCredlane assessments supported multiple-choice questions, written responses, coding questions, file uploads, timed questions, and scenario-based questions. Video responses were not included.\n\nThe flow needed to help users understand what they were about to take, how long it would take, what question types to expect, whether they could return to previous questions, what actions could affect assessment validity, and what would happen after submission.\n\nAssessment integrity. Credlane included tab-switch warnings. When a user attempted to leave the assessment environment, the system needed to explain that the behaviour could affect the validity of the assessment. The warning had to be firm without being unnecessarily threatening.\n\nA useful integrity state needed to communicate what the system detected, why it mattered, whether the action had been recorded, what could happen after repeated violations, and how the user could return to the assessment.\n\nThis was particularly important because accidental tab changes can happen. The product needed to distinguish between informing the user and immediately treating them as dishonest.\n\nProgress and submission. The assessment interface also needed to show current question, total question count, remaining time, answered and unanswered states, flagged or revisited questions, submission confirmation, incomplete-answer warnings, and successful completion.\n\nThese patterns were designed to reduce avoidable errors and give talent confidence about their current state.",
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

    /* ------------------------------------------------------------------ */
    /* 13. Supporting open and assigned assessments                       */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "Supporting open and assigned assessments",
      body: "Credlane supported two assessment models.\n\nOpen assessments. Talent could take available assessments as part of their journey toward Job Ready status.\n\nEmployer-assigned assessments. Employers could create or assign assessments to evaluate candidates for a particular role or requirement.\n\nSupporting both models meant the experience could not assume that every assessment had the same motivation.\n\nA talent user completing an open assessment may be trying to improve their profile and become discoverable.\n\nA candidate completing an employer-assigned assessment may be responding to a specific opportunity and may have a different level of urgency, context, or familiarity with Credlane.\n\nThe assessment introduction therefore needed to explain the source and purpose of the assessment clearly.",
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

    /* ------------------------------------------------------------------ */
    /* 14. Designing the talent experience                                */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "Designing the talent experience",
      body: "The talent flow connected assessment readiness with job discovery.\n\nTalent onboarding. The onboarding experience needed to collect enough information to personalize the platform without making account creation feel like an application form. The system had to establish user identity, professional interests, preferred skills, relevant experience, assessment status, and profile completion.\n\nAssessment dashboard. The assessment dashboard helped talent understand which assessments were available, which assessments were required, completed assessments, current scores, retake eligibility, and progress toward Job Ready status.\n\nExplore jobs. Talent could discover opportunities through the Explore page. Rather than submitting a traditional application immediately, a talent user could indicate interest in a role. This allowed employers to review relevant profiles and assessment evidence before moving forward.\n\nTalent could also receive an opportunity directly when an employer discovered their profile and sent them a job offer.\n\nThese two entry paths supported both active and passive job discovery: talent actively expresses interest in a role, or an employer proactively discovers and approaches a talent user.",
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

    /* ------------------------------------------------------------------ */
    /* 15. Designing the employer experience                              */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "Designing the employer experience",
      body: "The employer experience needed to connect role creation, talent discovery, assessments, and candidate management.\n\nCreating roles. Employers could define opportunities and the requirements attached to them. The role-creation flow needed to capture job information, required skills, experience expectations, assessment requirements, hiring preferences, and candidate criteria.\n\nDiscovering talent. Employers could explore Job Ready talent and evaluate profiles based on skills, Employability Score, assessment performance, experience, role relevance, and profile information. Filtering helped employers narrow the pool without manually reviewing every available profile.\n\nCandidate actions. Employers could invite talent to apply, send job offers, shortlist or reject candidates, schedule interviews, send assessment invitations, review completed assessment results, and move candidates through hiring stages.\n\nThis made Credlane more than an assessment tool. Assessment results became part of a broader decision-making workflow.",
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

    /* ------------------------------------------------------------------ */
    /* 16. Designing external assessments                                 */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "Designing external assessments",
      body: "One of Credlane's more commercially significant employer features was the ability to assess people who were not part of the main talent platform.\n\nExternal assessment creation was planned as a paid feature gated behind an employer subscription tier.\n\nEmployer flow. The employer entered the Create Assessment flow from the dashboard and selected whether the assessment was internal (intended for existing Credlane talent) or external (distributed through a shareable link). For the MVP, custom assessments supported multiple-choice questions.\n\nThe employer could create the assessment, add questions and answer options, set the correct answers, establish a pass benchmark, select internal or external distribution, generate or distribute the assessment, and review responses and results.\n\nExternal applicant flow. The external applicant journey was intentionally separated from the main talent experience.\n\nThe user would open the shared assessment link, register using an email address, review the assessment instructions and terms, complete the assessment, submit their responses, and receive the appropriate completion state.\n\nTaking the assessment also represented consent to receive targeted Credlane marketing emails, as stated in the Terms and Conditions. This consent needed to be communicated clearly rather than hidden inside the flow.\n\nPermission boundaries. External applicants had a dedicated user role. They could take the assessment but could not access the main talent dashboard or enter the discoverable talent pool. This separation prevented an external assessment participant from unintentionally becoming a regular Credlane user.",
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

    /* ------------------------------------------------------------------ */
    /* 17. Designing the external results dashboard                       */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "Designing the external results dashboard",
      body: "Employers needed both individual and aggregate views of external assessment performance.\n\nThe results dashboard included individual candidate scores, average assessment score, score distribution, pass and fail counts, performance against the employer's benchmark, and candidate-level responses, where appropriate.\n\nThis gave employers a quick overview while preserving access to individual details.\n\nThe aggregate view was particularly useful when the same assessment was sent to a large external group. Instead of opening every response separately, the employer could first understand the overall quality of the candidate pool.",
    },
    {
      type: "image-pair",
      heading: "External results views",
      images: [
        {
          src: "/images/case-studies/credlane-external-results-dashboard.webp",
          alt: "Credlane external assessment aggregate results dashboard showing average score, distribution, and pass-fail counts.",
        },
        {
          src: "/images/case-studies/credlane-results-candidates.webp",
          alt: "Credlane external assessment candidate-level results table and individual responses.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /* 18. Planning for open-ended assessments                            */
    /* ------------------------------------------------------------------ */
    {
      type: "future-state",
      heading: "Open-ended assessments",
      futureStateData: [
        {
          label: "Planned feature",
          description:
            "Open-ended questions were considered for a later phase rather than the MVP. Unlike the multiple-choice assessments, which could be automatically graded, open-ended responses would require manual review by the Credlane team.",
        },
        {
          label: "Manual review over AI",
          description:
            "Manual review was chosen to avoid unpredictable AI evaluation, grading inconsistency, token and infrastructure costs, reduced employer trust, and difficulty explaining how scores were generated. This would operate as a higher-priced employer add-on.",
        },
        {
          label: "Flow",
          description:
            "Open-ended response, manual Credlane review, employer receives evaluated result.",
        },
        {
          label: "System design impact",
          description:
            "Although this feature was not part of the MVP, accounting for it during product planning helped prevent the assessment system from being designed too narrowly.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /* 19. Leading through changing requirements                          */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "Leading through changing requirements",
      body: "The central challenge of the project was the repeated change in product direction.\n\nCredlane began with an education-led model. As the project progressed, the product expanded into job discovery, employer hiring tools, external assessments, subscriptions, and candidate management.\n\nEach change affected several connected areas.\n\nFor example, moving toward a semi-job board required us to revisit talent navigation, employer navigation, profile visibility, Job Ready eligibility, role creation, candidate discovery, job-interest states, employer outreach, assessment entry points, platform permissions, and external user roles.\n\nAs Lead Designer, I treated these changes as product-system changes rather than isolated screen requests.\n\nMy process was to clarify the revised stakeholder decision, identify which user journeys were affected, map dependencies across talent and employer experiences, break the work into assignable flows, review the output from other designers, update reusable patterns and components, present the revised direction to stakeholders, and align the final decision with product and engineering.\n\nThis approach helped the team continue meeting milestones despite uncertainty around the product definition.",
    },
    {
      type: "diagram",
      heading: "Change framework",
      diagramType: "change-framework",
      diagramData: {
        changeRows: [
          {
            change:
              "Education platform became a semi-job board",
            systems: "Navigation, profiles, roles, discovery",
            response:
              "Reframed the information architecture around hiring journeys",
          },
          {
            change:
              "Employers could assess external applicants",
            systems:
              "Roles, permissions, sign-up, results, pricing",
            response:
              "Added a distinct external applicant role and shareable assessment flow",
          },
          {
            change:
              "Assessment results became a hiring signal",
            systems:
              "Scores, profiles, candidate lists, filters",
            response:
              "Added contextual performance breakdowns rather than relying on one number",
          },
        ],
      },
    },

    /* ------------------------------------------------------------------ */
    /* 20. Coordinating the design team                                   */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "Coordinating the design team",
      body: "The size of the wider project team created an additional coordination challenge.\n\nWith approximately 24 people across product, engineering, marketing, and design, inconsistencies could easily appear when several flows were being created simultaneously.\n\nMy design-lead responsibilities included dividing the product into manageable flows, assigning work based on priority, establishing shared interaction patterns, reviewing screens before stakeholder presentations, resolving inconsistent interpretations of requirements, maintaining visual and behavioural consistency, communicating changes back to the team, and making final decisions when multiple directions were proposed.\n\nThe objective was not for every designer to create screens that looked similar. It was for the product to behave like one connected system.",
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

    /* ------------------------------------------------------------------ */
    /* 21. Maintaining the design system                                  */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "Maintaining the design system",
      body: "Credlane required reusable patterns across a large number of screens.\n\nThe design system needed to support authentication, form fields, multi-step onboarding, buttons and action hierarchies, navigation, assessment questions, progress states, warning messages, modals, candidate cards, job cards, tables, filters, score displays, empty states, success states, and responsive behaviour.\n\nMaintaining the system became especially important as requirements changed. Reusable components allowed us to revise shared patterns without redesigning each screen independently.\n\nThe system also improved the quality of the engineering handoff by giving developers clearer, repeatable interface behaviour.",
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

    /* ------------------------------------------------------------------ */
    /* 22. Testing and review                                             */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "Testing and review",
      body: "The designs were reviewed through internal team walkthroughs, stakeholder presentations, mentor reviews, cross-disciplinary feedback, prototype testing, and engineering discussions.\n\nFeedback came from product stakeholders, designers, engineers, potential users, and mentors from several technical disciplines.\n\nThe design received strong positive feedback during the project. The HNG chief mentor repeatedly expressed approval of the work, and mentors from other disciplines also commended its visual quality and completeness.\n\nBecause these responses were not recorded as formal research metrics, I treat them as qualitative project feedback rather than evidence of measurable product impact.",
    },
    {
      type: "full-image",
      heading: "Testing and iteration evidence",
      images: [
        {
          src: "/images/case-studies/credlane-testing-iteration.webp",
          alt: "Credlane design iteration and testing evidence showing before-and-after improvements.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /* 23. Outcome                                                        */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "Outcome",
      body: "At the end of the engagement, the team had designed the principal parts of Credlane's responsive web experience, including talent onboarding and assessment flows, Job Ready qualification, Employability Score presentation, job discovery, employer onboarding, role creation, talent discovery, candidate review and hiring actions, custom assessment creation, external applicant assessment, employer results dashboards, public-facing screens, and supporting states and reusable components.\n\nThe work was handed off to engineering and partially implemented.\n\nAlthough the product did not reach a complete public release during the project period, the design established a clear foundation for Credlane's talent, employer, and external assessment experiences.",
    },
    {
      type: "full-image",
      heading: "Final product screens",
      images: [
        {
          src: "/images/case-studies/credlane-final-product-montage.webp",
          alt: "Final Credlane responsive web screens across talent assessment, job discovery, employer hiring, and external results.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /* 24. What I learned                                                 */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "What I learned",
      body: "Product clarity is a design dependency. The project reinforced that interface quality cannot compensate for an unclear product definition. When the product changed from education-led to hiring-led, the most important work was not immediately redesigning screens. It was first understanding what the new direction meant for each user, permission, action, and journey.",
    },
    {
      type: "text",
      heading: "Changes should be evaluated across the system",
      body: "A decision made within one flow can affect several others.\n\nAdding external assessments, for example, introduced questions about pricing, user roles, permissions, consent, results reporting, marketing access, and talent-pool visibility.\n\nTreating the feature as only a new assessment screen would have missed most of the product work.",
    },
    {
      type: "text",
      heading: "Leadership requires creating shared understanding",
      body: "Assigning screens was only one part of leading the design team.\n\nThe more important responsibility was helping designers understand the product well enough to make consistent decisions across separate flows.",
    },
    {
      type: "text",
      heading: "Scores need context",
      body: "Assessment scores can help employers make decisions, but they can also create false certainty.\n\nCredlane's Employability Score needed to be presented as part of a broader candidate profile rather than as a complete definition of talent quality.",
    },

    /* ------------------------------------------------------------------ */
    /* 25. What I would improve                                           */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "What I would improve",
      body: "With more time and access to the launched product, I would strengthen the work in four areas.",
    },
    {
      type: "text",
      heading: "Conduct formal usability studies",
      body: "The project relied heavily on team reviews, interface research, stakeholder feedback, and iterative testing. Formal moderated sessions with talent and employers would have provided stronger evidence for the final decisions.",
    },
    {
      type: "text",
      heading: "Validate the Job Ready model",
      body: "I would test whether employers understood what Job Ready represented and whether talent considered the assessment sequence fair and achievable.",
    },
    {
      type: "text",
      heading: "Evaluate score interpretation",
      body: "I would study how employers used the Employability Score alongside experience and profile information, particularly whether the score was receiving too much weight.",
    },
    {
      type: "text",
      heading: "Measure assessment completion",
      body: "After launch, I would track assessment start and completion rates, drop-off by assessment stage, tab-warning frequency, retake completion, time to Job Ready status, job-interest conversion, employer profile views, assessment invitation completion, candidate shortlist rates, external assessment completion, and employer usage of aggregate result views.\n\nThese measures would help determine whether Credlane was reducing hiring friction rather than only adding another screening step.",
    },

    /* ------------------------------------------------------------------ */
    /* 26. Closing reflection                                             */
    /* ------------------------------------------------------------------ */
    {
      type: "text",
      heading: "Closing reflection",
      body: "Credlane challenged me to work beyond individual interface execution.\n\nI had to lead a design team, interpret changing stakeholder ideas, maintain a growing system, and connect assessments, job discovery, talent visibility, employer decision-making, and external candidate evaluation into one product.\n\nThe result was a broad, partially implemented platform that gave talent a structured way to demonstrate readiness and gave employers more evidence with which to make hiring decisions.\n\nMore importantly, the project strengthened my ability to create clarity when the product itself was still changing.",
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
