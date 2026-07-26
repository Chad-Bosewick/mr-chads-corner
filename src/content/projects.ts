export interface Project {
  slug: string;
  title: string;
  category: string;
  hook: string;
  description: string;
  coverSrc?: string;
  coverScroll?: {
    src: string;
    alt: string;
    sections?: { label: string; start: number }[];
  };
  status: "published" | "coming-soon";
  device: "laptop" | "phone";
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
    coverSrc: "/images/case-studies/todo-app-cover.webp",
    status: "published",
    device: "laptop",
  },
  {
    slug: "draftly",
    title: "Draftly",
    category: "Content Creation",
    hook: "Where ideas take shape before they become content.",
    description:
      "A drafting tool designed for writers who think visually and editors who think structurally.",
    coverSrc: "/images/case-studies/draftly-cover.webp",
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
    coverSrc: "/images/case-studies/letters-app-cover.webp",
    status: "published",
    device: "phone",
  },
];
