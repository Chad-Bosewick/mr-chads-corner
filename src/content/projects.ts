export interface Project {
  slug: string;
  title: string;
  category: string;
  hook: string;
  description: string;
  coverSrc: string;
  status: "published" | "coming-soon";
  device: "laptop" | "phone";
}

export const projects: Project[] = [
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
  {
    slug: "credlane",
    title: "Credlane",
    category: "Fintech",
    hook: "Making credit accessible through better design.",
    description:
      "A financial platform designed for clarity, trust, and informed decision-making.",
    coverSrc: "/images/case-studies/credlane-cover.webp",
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
    coverSrc: "/images/case-studies/testground-cover.webp",
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
];
