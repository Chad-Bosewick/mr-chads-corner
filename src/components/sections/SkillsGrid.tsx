"use client";

import { cn } from "@/lib/utils";
import { SectionReveal } from "./SectionReveal";

interface SkillsGridProps {
  compact?: boolean;
}

const SKILL_GROUPS = [
  { label: "Product Design", skills: ["UX research", "Information architecture", "Interaction design", "Visual design", "Prototyping", "Design systems"] },
  { label: "AI Workflows", skills: ["Prompt engineering", "AI-assisted product design", "Code generation workflows", "Tool orchestration"] },
];

export function SkillsGrid({ compact }: SkillsGridProps) {
  return (
    <SectionReveal>
      <section aria-label="Skills and tools" className={cn("grid gap-8", compact ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3")}>
        {SKILL_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="font-sans text-sm font-semibold uppercase tracking-wider text-[#6F6F6F]">
              {group.label}
            </p>
            <ul className="mt-3 space-y-1.5">
              {group.skills.map((skill) => (
                <li key={skill} className="font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </SectionReveal>
  );
}
