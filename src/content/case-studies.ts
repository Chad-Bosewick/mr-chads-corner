export interface ContentSection {
  type: "text" | "image-pair" | "metrics" | "full-image";
  heading?: string;
  body?: string;
  /** For image-pair and full-image types */
  images?: { src: string; alt: string; caption?: string }[];
  /** For metrics type */
  metrics?: { label: string; value: string }[];
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
      type: "text",
      heading: "Defining the principles",
      body: "We established three design principles that guided every decision: reduce cognitive load before adding features, make the most common paths the most prominent paths, and preserve power through progressive disclosure rather than sacrificing depth for simplicity. These principles became the litmus test for every design decision throughout the project.",
    },
    {
      type: "text",
      heading: "The intelligent inbox",
      body: "The centrepiece of the redesign was the intelligent inbox — a smart prioritisation layer that surfaces the most relevant tasks based on deadlines, dependencies, and user behaviour patterns. Rather than forcing users to organise their work into folders and tags, the system learns how each user works and adapts the view accordingly. Users who want manual control can still access the full organisational model, but it no longer sits in the critical path of daily use.",
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
      type: "text",
      heading: "What I learned",
      body: "This project reinforced that simplification is harder than addition. Removing features requires understanding why they were added in the first place and whether those use cases are still valid. The most valuable discussions happened when we asked 'who actually uses this?' and were willing to deprecate features that served an imagined user rather than a real one. The principles we established early became our anchor throughout — every time someone proposed a new feature, we asked whether it reduced or increased cognitive load.",
    },
  ],
  nextSlug: "letters-app",
  prevSlug: null,
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
      type: "text",
      heading: "Designing for anticipation",
      body: "We designed the experience around the emotional arc of sending and receiving. Writing a letter involves intention — choosing words, arranging thoughts, deciding what matters. The interface was designed to support that reflection without adding friction. The inbox displays letters as physical envelopes, with the first few words visible through a translucent window — creating anticipation before opening. Delivery notifications are calm rather than demanding, arriving as a subtle badge rather than a banner interruption.",
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
      type: "text",
      heading: "Reflections",
      body: "Letters App taught me that emotional design doesn't require complex animations or elaborate visual treatments. The most emotionally resonant elements were simple: a letter that slowly appears to open, a seal that breaks when read, an inbox that treats each message as something valuable rather than something to process and discard. These moments worked because they were grounded in a real understanding of how people want to connect — not because they were visually impressive.",
    },
  ],
  nextSlug: "enviodeck",
  prevSlug: "todo-app",
};

export const caseStudies: Record<string, CaseStudy> = {
  "todo-app": todoApp,
  "letters-app": lettersApp,
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
