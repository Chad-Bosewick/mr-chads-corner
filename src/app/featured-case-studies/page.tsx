import { HeroHeading } from "@/components/sections/HeroHeading";
import { SectionReveal } from "@/components/sections/SectionReveal";
import { ProjectRow } from "@/components/sections/ProjectRow";
import { UIScrollStrip } from "@/components/sections/UIScrollStrip";
import { PageShell } from "@/components/layout/PageShell";
import { projects } from "@/content/projects";
import { uiComponents } from "@/content/ui-components";
import type { Metadata } from "next";

const DESCRIPTION =
  "A selection of recent work spanning talent platforms, productivity, communication, and developer tools.";

export const metadata: Metadata = {
  title: "Featured case studies",
  description: DESCRIPTION,
  alternates: { canonical: "/featured-case-studies" },
  openGraph: {
    title: "Featured case studies",
    description: DESCRIPTION,
    url: "/featured-case-studies",
  },
  twitter: {
    title: "Featured case studies",
    description: DESCRIPTION,
  },
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
              coverSrcSecondary={project.coverSrcSecondary}
              coverScroll={project.coverScroll}
              annotationSet={project.annotationSet}
              status={project.status}
              titleAs="h2"
              device={project.device}
              sector={project.sector}
              delay={index * 100}
            />
          ))}
      </div>

      <UIScrollStrip cards={uiComponents} />
    </PageShell>
  );
}
