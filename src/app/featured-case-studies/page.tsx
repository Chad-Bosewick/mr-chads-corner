import { HeroHeading } from "@/components/sections/HeroHeading";
import { SectionReveal } from "@/components/sections/SectionReveal";
import { ProjectRow } from "@/components/sections/ProjectRow";
import { projects } from "@/content/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Featured case studies",
  description:
    "A selection of recent work spanning productivity, communication, and climate technology.",
};

export default function CaseStudiesPage() {
  return (
    <div className="mx-auto max-w-[1038px] px-4 py-12 md:px-6 md:py-16 lg:py-24">
      <SectionReveal>
        <HeroHeading
          title="Featured case studies"
          subtitle="A selection of recent work spanning productivity, communication, and climate technology."
        />
      </SectionReveal>

      <div className="mt-12 md:mt-16">
        {projects.map((project, index) => (
          <ProjectRow
            key={project.slug}
            slug={project.slug}
            title={project.title}
            category={project.category}
            description={project.description}
            coverSrc={project.coverSrc}
            status={project.status}
            delay={index * 100}
          />
        ))}
      </div>
    </div>
  );
}
