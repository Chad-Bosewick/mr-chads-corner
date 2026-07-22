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
import { ExecutiveSummary } from "@/components/case-study/ExecutiveSummary";
import { CaseStudyNav } from "@/components/case-study/CaseStudyNav";
import { PageShell, ReadingColumn } from "@/components/layout/PageShell";
import type { CaseStudy, ContentSection as ContentSectionType } from "@/content/case-studies";
import type { Project } from "@/content/projects";

/* ─── In-page navigation items ─── */
const caseStudyNavItems = [
  { label: "Overview", id: "overview" },
  { label: "Problem", id: "problem" },
  { label: "What I designed", id: "what-i-designed" },
  { label: "Assessment system", id: "assessment-system" },
  { label: "Talent", id: "talent-experience" },
  { label: "Employer", id: "employer-experience" },
  { label: "External", id: "external-assessments" },
  { label: "Results", id: "results" },
  { label: "Decisions", id: "key-decisions" },
];

/* ─── Section ID helper ─── */
function sectionId(heading?: string): string | undefined {
  if (!heading) return undefined;
  return heading
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/* ─── Divider placement ─── */
function shouldInsertDividerAfter(section: ContentSectionType): boolean {
  if (!section.heading) return false;
  const h = section.heading.toLowerCase();
  return (
    h === "the problem" ||
    h === "product evolution" ||
    h === "product ecosystem" ||
    h === "the assessment system" ||
    h === "designing the talent experience" ||
    h === "designing the employer experience" ||
    h === "designing external assessments" ||
    h === "maintaining the design system"
  );
}

function shouldInsertDividerBefore(section: ContentSectionType): boolean {
  if (!section.heading) return false;
  return section.heading.toLowerCase() === "results";
}

/* ─── WhatIDesigned helper component ─── */
function WhatIDesigned({
  features,
  heading,
}: {
  features: { name: string; description: string }[];
  heading?: string;
}) {
  return (
    <SectionReveal>
      <section className="my-12 md:my-16" id="what-i-designed">
        {heading && (
          <h2 className="mb-6 font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">
            {heading}
          </h2>
        )}
        <div className="grid gap-8 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.name}>
              <h3 className="font-sans text-sm font-medium text-[#151515]">
                {f.name}
              </h3>
              <p className="mt-1 font-sans text-[clamp(0.875rem,1.5vw,1rem)] leading-relaxed text-[#151515]/70">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </SectionReveal>
  );
}

/* ─── OutcomeList helper component ─── */
function OutcomeList({
  items,
  heading,
  id,
}: {
  items: { label: string; description: string }[];
  heading?: string;
  id?: string;
}) {
  return (
    <SectionReveal>
      <section className="my-12 md:my-16" id={id}>
        {heading && (
          <h2 className="mb-6 font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">
            {heading}
          </h2>
        )}
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.label}
              className="font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70"
            >
              <strong className="font-medium text-[#151515]">
                {item.label}.
              </strong>{" "}
              {item.description}
            </li>
          ))}
        </ul>
      </section>
    </SectionReveal>
  );
}

/* ─── Section renderer ─── */
function renderSection(
  section: ContentSectionType,
  index: number,
  caseStudy: CaseStudy,
) {
  const id = sectionId(section.heading);

  switch (section.type) {
    case "text":
      return (
        <ReadingColumn key={index}>
          <ContentSection heading={section.heading}>
            <div id={id}>
              {section.body?.split("\n").map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
            </div>
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
        <HeroMedia
          key={index}
          src={section.images?.[0]?.src ?? caseStudy.coverSrc}
          alt={
            section.images?.[0]?.alt ??
            `${caseStudy.title} hero`
          }
        />
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
    case "executive-summary":
      return (
        <ReadingColumn key={index}>
          <ExecutiveSummary
            problem={section.executiveSummary?.problem ?? ""}
            solution={section.executiveSummary?.solution ?? ""}
            outcome={section.executiveSummary?.outcome ?? ""}
          />
        </ReadingColumn>
      );
    case "what-i-designed":
      return (
        <ReadingColumn key={index}>
          <WhatIDesigned
            features={section.designedFeatures || []}
            heading={section.heading}
          />
        </ReadingColumn>
      );
    case "results":
      return (
        <ReadingColumn key={index}>
          <OutcomeList
            items={section.outcomeBullets || []}
            heading={section.heading}
            id={id}
          />
        </ReadingColumn>
      );
    case "constraints":
      return (
        <ReadingColumn key={index}>
          <OutcomeList
            items={section.outcomeBullets || []}
            heading={section.heading}
            id={id}
          />
        </ReadingColumn>
      );
    case "key-decisions":
      return (
        <ReadingColumn key={index}>
          <OutcomeList
            items={section.outcomeBullets || []}
            heading={section.heading}
            id={id}
          />
        </ReadingColumn>
      );
    default:
      return null;
  }
}

/* ─── Main layout ─── */
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
            <header id="overview">
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
          <HeroMedia
            src={caseStudy.heroMedia.src}
            alt={caseStudy.heroMedia.alt}
          />
        )}

        {/* In-page navigation */}
        <CaseStudyNav items={caseStudyNavItems} />

        {/* Content sections */}
        {caseStudy.sections.flatMap(
          (section: ContentSectionType, index: number) => {
            const items: React.ReactNode[] = [];
            if (shouldInsertDividerBefore(section)) {
              items.push(
                <SectionDivider key={`div-before-${index}`} />,
              );
            }
            items.push(renderSection(section, index, caseStudy));
            if (shouldInsertDividerAfter(section)) {
              items.push(
                <SectionDivider key={`div-after-${index}`} />,
              );
            }
            return items;
          },
        )}

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
