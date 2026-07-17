export interface Project {
  slug: string;
  title: string;
  category: string;
  description: string;
  coverSrc: string;
  status: "published" | "coming-soon";
}

export const projects: Project[] = [
  {
    slug: "todo-app",
    title: "TODO++",
    category: "Productivity",
    description:
      "Redesigning a task management tool from feature-heavy checklist into an intelligent, adaptive workflow system — reducing cognitive load while preserving power-user capabilities.",
    coverSrc: "/images/case-studies/todo-app-cover.webp",
    status: "published",
  },
  {
    slug: "letters-app",
    title: "Letters App",
    category: "Communication",
    description:
      "Designing a thoughtful correspondence platform that reintroduces pause and intentionality into digital messaging — combining the warmth of letter-writing with the practicality of modern communication.",
    coverSrc: "/images/case-studies/letters-app-cover.webp",
    status: "published",
  },
  {
    slug: "enviodeck",
    title: "Enviodeck",
    category: "Climate Tech",
    description:
      "Designing an environmental analytics platform that makes complex climate data accessible, actionable, and trustworthy for organisations navigating sustainability reporting and carbon reduction.",
    coverSrc: "/images/case-studies/enviodeck-cover.webp",
    status: "coming-soon",
  },
];
