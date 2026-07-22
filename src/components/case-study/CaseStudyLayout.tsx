import { SectionReveal } from "@/components/sections/SectionReveal";
import Link from "next/link";
import { ContentSection } from "@/components/case-study/ContentSection";
import { ImagePair } from "@/components/case-study/ImagePair";
import { MetricBar } from "@/components/case-study/MetricBar";
import { ProjectNav } from "@/components/case-study/ProjectNav";
import { HeroMedia } from "@/components/case-study/HeroMedia";
import { ProjectSnapshot } from "@/components/case-study/ProjectSnapshot";
import { DiagramSection } from "@/components/case-study/DiagramSection";
import { ComparisonSection } from "@/components/case-study/ComparisonSection";
import { SequenceSection } from "@/components/case-study/SequenceSection";
import { EditorialCard } from "@/components/case-study/EditorialCard";
import { SectionDivider } from "@/components/case-study/SectionDivider";
import { PageShell, ReadingColumn } from "@/components/layout/PageShell";
import type { CaseStudy, ContentSection as ContentSectionType } from "@/content/case-studies";
import type { Project } from "@/content/projects";

/**
 * Returns true if a divider should appear AFTER this section.
 * Divider placement marks transitions between major narrative beats.
 */
function shouldInsertDividerAfter(section: ContentSectionType): boolean {
  if (!section.heading) return false;
  const h = section.heading.toLowerCase();
  return (
    h === "my role" ||
    h === "the problem" ||
    h === "from education platform to hiring product" ||
    h === "understanding the product ecosystem" ||
    h === "research and product definition" ||
    h === "designing the assessment experience" ||
    h === "designing the talent experience" ||
    h === "designing the employer experience" ||
    h === "designing external assessments" ||
    h === "maintaining the design system"
  );
}

/**
 * Returns true if a divider should appear BEFORE this section.
 * Used to insert a divider before the outcome section.
 */
function shouldInsertDividerBefore(section: ContentSectionType): boolean {
  if (!section.heading) return false;
  return section.heading.toLowerCase() === "outcome";
}

function renderSection(
  section: ContentSectionType,
  index: number,
  caseStudy: CaseStudy,
) {
  switch (section.type) {
    case "text":
      return (
        <ReadingColumn key={index}>
          <ContentSection heading={section.heading}>
            {section.body?.split("\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </ContentSection>
        </ReadingColumn>
      );
    case "image-pair":
      return (
        <ImagePair
          key={index}
          heading={section.heading}
          images={section.images || []}
        />
      );
    case "full-image":
      return (
        <ImagePair
          key={index}
          heading={section.heading}
          images={section.images || []}
        />
      );
    case "metrics":
      return (
        <ReadingColumn key={index}>
          <MetricBar
            heading={section.heading}
            metrics={section.metrics || []}
          />
        </ReadingColumn>
      );
    case "hero-media":
      return (
        <HeroMedia key={index} src={section.images?.[0]?.src ?? caseStudy.coverSrc} alt={section.images?.[0]?.alt ?? `${caseStudy.title} hero`} />
      );
    case "snapshot":
      return (
        <ReadingColumn key={index}>
          <ProjectSnapshot meta={caseStudy.meta!} />
        </ReadingColumn>
      );
    case "diagram":
      return (
        <ReadingColumn key={index}>
          <DiagramSection
            heading={section.heading}
            diagramType={section.diagramType!}
            diagramData={section.diagramData}
          />
        </ReadingColumn>
      );
    case "comparison":
      return (
        <ReadingColumn key={index}>
          <ComparisonSection
            heading={section.heading}
            items={section.comparisonItems || []}
          />
        </ReadingColumn>
      );
    case "sequence":
      return (
        <ReadingColumn key={index}>
          <SequenceSection
            heading={section.heading}
            items={section.sequenceItems || []}
          />
        </ReadingColumn>
      );
    case "future-state":
      return (
        <ReadingColumn key={index}>
          <EditorialCard
            label="Future consideration"
            heading={section.heading}
          >
            {section.futureStateData?.map((item, i) => (
              <p key={i}>
                <strong>{item.label}.</strong> {item.description}
              </p>
            ))}
          </EditorialCard>
        </ReadingColumn>
      );
    default:
      return null;
  }
}

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
    <PageShell>
      <article>
        {/* Header */}
        <ReadingColumn>
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
        </ReadingColumn>

        {/* Hero media */}
        {caseStudy.heroMedia && (
          <HeroMedia src={caseStudy.heroMedia.src} alt={caseStudy.heroMedia.alt} />
        )}

        {/* Content sections — text stays in column, images break out */}
        {caseStudy.sections.flatMap((section: ContentSectionType, index: number) => {
          const items: React.ReactNode[] = [];
          // Insert divider BEFORE section if needed (e.g. before outcome)
          if (shouldInsertDividerBefore(section)) {
            items.push(<SectionDivider key={`div-before-${index}`} />);
          }
          items.push(renderSection(section, index, caseStudy));
          // Insert divider AFTER section if needed
          if (shouldInsertDividerAfter(section)) {
            items.push(<SectionDivider key={`div-after-${index}`} />);
          }
          return items;
        })}

        {/* Back link */}
        <ReadingColumn>
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
        </ReadingColumn>
      </article>
    </PageShell>
  );
}
