import { SectionReveal } from "@/components/sections/SectionReveal";
import Link from "next/link";
import Image from "next/image";
import { ContentSection } from "@/components/case-study/ContentSection";
import { MetricBar } from "@/components/case-study/MetricBar";
import { ProjectNav } from "@/components/case-study/ProjectNav";
import type { CaseStudy, ContentSection as ContentSectionType } from "@/content/case-studies";
import type { Project } from "@/content/projects";

interface CaseStudyLayoutProps {
  caseStudy: CaseStudy;
  prevProject: Project | null;
  nextProject: Project | null;
}

export function CaseStudyLayout({
  caseStudy,
  prevProject,
  nextProject,
}: CaseStudyLayoutProps) {
  return (
    <article className="mx-auto max-w-[680px] px-4 py-12 md:px-6 md:py-16 lg:py-24">
      {/* Header */}
      <SectionReveal>
        <header>
          <p className="font-sans text-sm uppercase tracking-wider text-[#757575]">
            {caseStudy.category} &middot; {caseStudy.timeline}
          </p>
          <h1 className="mt-2 font-sans text-[clamp(2rem,5vw,3rem)] font-medium text-[#151515]">
            {caseStudy.title}
          </h1>
          <p className="mt-2 font-sans text-sm text-[#757575]">
            {caseStudy.role}
          </p>
          <p className="mt-6 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
            {caseStudy.overview}
          </p>
        </header>
      </SectionReveal>

      {/* Cover image */}
      <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden bg-[#f0f0f0] md:mt-12">
        <Image
          src={caseStudy.coverSrc}
          alt={`Cover image for ${caseStudy.title}`}
          fill
          className="object-cover"
          sizes="680px"
        />
      </div>

      {/* Content sections */}
      {caseStudy.sections.map((section: ContentSectionType, index: number) => {
        switch (section.type) {
          case "text":
            return (
              <ContentSection key={index} heading={section.heading}>
                {section.body?.split("\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </ContentSection>
            );
          case "metrics":
            return (
              <MetricBar
                key={index}
                heading={section.heading}
                metrics={section.metrics || []}
              />
            );
          default:
            return null;
        }
      })}

      {/* Back link */}
      <SectionReveal>
        <div className="mt-16 text-center md:mt-20">
          <Link
            href="/featured-case-studies"
            className="font-sans text-sm font-medium text-[#A43718] transition-colors duration-[var(--duration-fast)] hover:text-[#A43718]/70"
          >
            &larr; All case studies
          </Link>
        </div>
      </SectionReveal>

      {/* Previous / Next navigation */}
      <ProjectNav prevProject={prevProject} nextProject={nextProject} />
    </article>
  );
}
