export interface Project {
  slug: string;
  title: string;
  category: string;
  hook: string;
  description: string;
  coverSrc?: string;
  coverSrcSecondary?: string;
  coverScroll?: {
    src: string;
    alt: string;
    sections?: { label: string; start: number }[];
  };
  annotationSet?: "todo-device";
  status: "published" | "coming-soon";
  device: "laptop" | "phone" | "dual-phone";
}

export const projects: Project[] = [
  {
    slug: "credlane",
    title: "Travecs",
    category: "Talent Platform",
    hook: "Designing a hiring platform where talent can prove readiness and employers can evaluate candidates with stronger evidence.",
    description:
      "I led the design of Travecs, a responsive talent-assessment and hiring platform connecting job readiness, employer discovery, custom assessments, and candidate evaluation.",
    coverSrc: "/images/case-studies/credlane/credlane-hero.webp",
    coverScroll: {
      src: "/images/case-studies/credlane/credlane-landing-page-full.webp",
      alt: "Travecs landing page",
      sections: [
        { label: "Meet Travecs", start: 0 },
        { label: "What our users say", start: 0.19 },
        { label: "Talent experience", start: 0.31 },
        { label: "Employer experience", start: 0.49 },
        { label: "Verified talent", start: 0.7 },
        { label: "Frequently asked questions", start: 0.78 },
        { label: "Find talent, get hired", start: 0.9 },
      ],
    },
    status: "published",
    device: "laptop",
  },
  {
    slug: "todo-app",
    title: "TODO++",
    category: "Productivity",
    hook: "A task manager that adapts to how you work.",
    description:
      "Redesigning a task management tool from feature-heavy checklist into an intelligent, adaptive workflow system — reducing cognitive load while preserving power-user capabilities.",
    coverSrc: "/images/case-studies/todo-app-device.webp",
    annotationSet: "todo-device",
    status: "published",
    device: "laptop",
  },
  {
    slug: "draftly",
    title: "Draftly",
    category: "Content Creation",
    hook: "An AI writing coach that teaches through explanation, not automation.",
    description:
      "A learning-first writing tool for high-school students that helps them brainstorm, revise, and understand their work — turning every correction into a teaching moment.",
    coverSrc: "/images/draftly/draftly-hero-1440x900.webp",
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
    status: "published",
    device: "laptop",
  },
  {
    slug: "testground",
    title: "Testground",
    category: "Developer Tools",
    hook: "Testing infrastructure that teams actually enjoy using.",
    description:
      "A testing platform designed for collaboration, speed, and developer happiness.",
    status: "coming-soon",
    device: "laptop",
  },
  {
    slug: "letters-app",
    title: "Letters App",
    category: "Communication",
    hook: "Thoughtful correspondence for the modern world.",
    description:
      "Designing a thoughtful correspondence platform that reintroduces pause and intentionality into digital messaging — combining the warmth of letter-writing with the practicality of modern communication.",
    coverSrc: "/images/case-studies/letters-app-homepage-post-1.webp",
    coverSrcSecondary: "/images/case-studies/letters-app-showcase.webp",
    status: "published",
    device: "dual-phone",
  },
];
