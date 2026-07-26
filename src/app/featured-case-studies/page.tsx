import { HeroHeading } from "@/components/sections/HeroHeading";
import { SectionReveal } from "@/components/sections/SectionReveal";
import { ProjectRow } from "@/components/sections/ProjectRow";
import { PageShell } from "@/components/layout/PageShell";
import { projects } from "@/content/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Featured case studies",
  description:
    "A selection of recent work spanning talent platforms, productivity, communication, and developer tools.",
};

export default function CaseStudiesPage() {
  return (
    <PageShell>
      <SectionReveal>
        <HeroHeading
          title="Featured case studies"
          subtitle="A selection of recent work spanning talent platforms, productivity, communication, and developer tools."
        />
      </SectionReveal>

      <div className="mt-12 md:mt-16">
        {projects
          .filter((p) => p.status === "published")
          .map((project, index) => (
            <ProjectRow
              key={project.slug}
              slug={project.slug}
              title={project.title}
              category={project.category}
              hook={project.hook}
              coverSrc={project.coverSrc}
              status={project.status}
              device={project.device}
              delay={index * 100}
            />
          ))}
      </div>
    </PageShell>
  );
}
