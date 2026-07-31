"use client";

import { SectionReveal } from "./SectionReveal";

const EXPERIENCE = [
  {
    title: "Product Designer / Founder-Side Operator",
    company: "Candidote",
    period: "Aug 2025 to Mar 2026",
    location: "Fully remote, 3-person team",
    context:
      "Joined as the founding designer for a recruitment platform, owning the full product design lifecycle from research through implementation.",
    contributions: [
      "Designed 80+ screens across the core product, covering onboarding, job listings, candidate management, and hiring workflows.",
      "Built a 40+ component design system from scratch, establishing reusable patterns, variants, and documentation that enabled rapid iteration.",
      "Worked directly alongside the founder as the sole designer, defining product strategy, prioritising roadmap items, and shipping design decisions directly to development.",
    ],
  },
  {
    title: "Lead Designer / Product Operations Collaborator",
    company: "Enviodeck",
    period: "Mar 2026 to present",
    location: "Start-up environment",
    context:
      "Leading design for a logistics platform, building the visual language and component system for a product entering a competitive market.",
    contributions: [
      "Designed 100+ screens spanning order booking, delivery tracking, driver workflows, and payment flows.",
      "Built a 50+ component design system establishing the product's visual language, component hierarchy, and interaction patterns.",
      "Collaborating on product strategy, user research synthesis, and design operations workflows.",
    ],
  },
];

export function ExperienceTimeline() {
  return (
    <div className="space-y-16">
      {EXPERIENCE.map((role, index) => (
        <SectionReveal key={`${role.company}-${role.period}`} delay={index * 80}>
          <article>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <h3 className="font-sans text-lg font-semibold text-[#151515]">
                {role.title} <span className="text-[#6F6F6F]">· {role.company}</span>
              </h3>
              <span className="shrink-0 font-sans text-sm text-[#6F6F6F]">{role.period}</span>
            </div>
            <div className="max-w-[680px]">
              <p className="mt-1 font-sans text-sm text-[#6F6F6F]">{role.location}</p>
              <p className="mt-4 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/80">
                {role.context}
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
                {role.contributions.map((contribution) => (
                  <li key={contribution}>{contribution}</li>
                ))}
              </ul>
            </div>
          </article>
        </SectionReveal>
      ))}

      <SectionReveal delay={240}>
        <aside className="border-l-2 border-[#A43718] pl-5" aria-label="Design systems experience">
          <p className="font-sans text-sm font-semibold uppercase tracking-wider text-[#6F6F6F]">
            Design-systems practice
          </p>
          <p className="mt-2 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
            Candidote: 40+ components built for a three-person team over eight months. Enviodeck: 50+ components and ongoing work on visual language, variants, and auto-layout systems in Figma.
          </p>
        </aside>
      </SectionReveal>
    </div>
  );
}
