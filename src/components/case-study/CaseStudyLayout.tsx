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
import { CoverScroll } from "@/components/case-study/CoverScroll";
import { CarouselSection } from "@/components/case-study/CarouselSection";
import { CarouselImage } from "@/components/case-study/CarouselImage";
import { PhoneMockupSection } from "@/components/case-study/PhoneMockupSection";
import { ThreejsDeviceSection } from "@/components/case-study/ThreejsDeviceSection";
import { PageShell, ReadingColumn } from "@/components/layout/PageShell";
import type { CaseStudy, ContentSection as ContentSectionType } from "@/content/case-studies";
import type { Project } from "@/content/projects";

/* ─── Generate nav items from sections ─── */
function generateNavItems(sections: ContentSectionType[]) {
  const items: { label: string; id: string }[] = [
    { label: "Overview", id: "overview" },
  ];
  for (const section of sections) {
    if (section.navLabel && section.heading) {
      const id = sectionId(section.heading);
      if (id) {
        items.push({ label: section.navLabel, id });
      }
    }
  }
  return items;
}

/* ─── Section ID helper ─── */
function sectionId(heading?: string): string | undefined {
  if (!heading) return undefined;
  return heading
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/* ─── Divider placement (chapter-based) ─── */
function shouldInsertDivider(
  prev: ContentSectionType | undefined,
  next: ContentSectionType,
): boolean {
  if (!prev || !prev.chapter || !next.chapter) return false;
  return prev.chapter !== next.chapter;
}

/* ─── Chapter-aware section spacing ─── */
function sectionSpacingClass(
  section: ContentSectionType,
  prevSection?: ContentSectionType,
): string {
  // Chapter break → generous spacing
  if (prevSection?.chapter && section.chapter && prevSection.chapter !== section.chapter) {
    return "my-20 md:my-28";
  }
  // First section after hero/nav → moderate spacing
  if (!prevSection) {
    return "my-12 md:my-16";
  }
  // Image/carousel following its parent text → tighter
  if (
    (section.type === "image-pair" || section.type === "carousel" || section.type === "full-image" || section.type === "phone-mockup" || section.type === "device-showcase") &&
    prevSection?.type === "text"
  ) {
    return "mt-6 md:mt-8";
  }
  // Results or key decisions → generous
  if (section.type === "results" || section.type === "key-decisions" || section.type === "constraints") {
    return "my-16 md:my-20";
  }
  // Default
  return "my-12 md:my-16";
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
      <section id="what-i-designed">
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
  body,
}: {
  items: { label: string; description: string }[];
  heading?: string;
  id?: string;
  body?: string;
}) {
  return (
    <SectionReveal>
      <section id={id} className="scroll-mt-16">
        {heading && (
          <h2 className="mb-6 font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">
            {heading}
          </h2>
        )}
        {body && (
          <div className="mb-8 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
            <p dangerouslySetInnerHTML={{ __html: body }} />
          </div>
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
  prevSection?: ContentSectionType,
) {
  const id = sectionId(section.heading);
  const spacing = sectionSpacingClass(section, prevSection);

  switch (section.type) {
    case "text":
      return (
        <ReadingColumn key={index} className={spacing}>
          <ContentSection heading={section.heading} id={id}>
            <div>
              {section.body?.split("\n").map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
            </div>
          </ContentSection>
        </ReadingColumn>
      );
    case "image-pair":
      return (
        <ReadingColumn key={index} className={spacing}>
          <ImagePair
            heading={section.heading}
            images={section.images || []}
          />
        </ReadingColumn>
      );
    case "full-image": {
      const isFullBleed = section.width === "full-bleed";
      const content = (
        <>
          {section.body && (
            <div className="mb-6 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
              <p dangerouslySetInnerHTML={{ __html: section.body }} />
            </div>
          )}
          <ImagePair
            heading={section.heading}
            images={section.images || []}
          />
        </>
      );
      return isFullBleed ? (
        <div key={index} className={spacing}>{content}</div>
      ) : (
        <ReadingColumn key={index} className={spacing}>{content}</ReadingColumn>
      );
    }
    case "carousel":
      return (
        <ReadingColumn key={index} className={spacing}>
          <CarouselSection
            heading={section.heading}
            body={section.body}
            slides={section.images || []}
            aspectRatio={section.carouselAspectRatio}
            background={section.carouselBackground}
          />
        </ReadingColumn>
      );
    case "phone-mockup":
      return (
        <ReadingColumn key={index} className={spacing}>
          <PhoneMockupSection
            heading={section.heading}
            body={section.body}
            images={section.phoneMockupImages || []}
          />
        </ReadingColumn>
      );
    case "device-showcase":
      return section.deviceAssets ? (
        <ReadingColumn key={index} className={spacing}>
          <ThreejsDeviceSection
            heading={section.heading}
            body={section.body}
            deviceAssets={section.deviceAssets}
          />
        </ReadingColumn>
      ) : null;
    case "metrics":
      return (
        <ReadingColumn key={index} className={spacing}>
          <MetricBar
            heading={section.heading}
            metrics={section.metrics || []}
          />
        </ReadingColumn>
      );
    case "hero-media": {
      const heroSrc = section.images?.[0]?.src ?? caseStudy.coverSrc;
      if (!heroSrc) return null;

      return (
        <HeroMedia
          key={index}
          src={heroSrc}
          alt={
            section.images?.[0]?.alt ??
            `${caseStudy.title} hero`
          }
        />
      );
    }
    case "snapshot":
      return (
        <ReadingColumn key={index} className={spacing}>
          <ProjectSnapshot meta={caseStudy.meta!} />
        </ReadingColumn>
      );
    case "diagram":
      return (
        <ReadingColumn key={index} className={spacing}>
          <DiagramSection
            heading={section.heading}
            diagramType={section.diagramType!}
            diagramData={section.diagramData}
          />
        </ReadingColumn>
      );
    case "comparison":
      return (
        <ReadingColumn key={index} className={spacing}>
          <ComparisonSection
            heading={section.heading}
            items={section.comparisonItems || []}
          />
        </ReadingColumn>
      );
    case "sequence":
      return (
        <ReadingColumn key={index} className={spacing}>
          <SequenceSection
            heading={section.heading}
            items={section.sequenceItems || []}
          />
        </ReadingColumn>
      );
    case "future-state":
      return (
        <ReadingColumn key={index} className={spacing}>
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
        <ReadingColumn key={index} className={spacing}>
          <ExecutiveSummary
            problem={section.executiveSummary?.problem ?? ""}
            solution={section.executiveSummary?.solution ?? ""}
            outcome={section.executiveSummary?.outcome ?? ""}
          />
        </ReadingColumn>
      );
    case "what-i-designed":
      return (
        <ReadingColumn key={index} className={spacing}>
          <WhatIDesigned
            features={section.designedFeatures || []}
            heading={section.heading}
          />
        </ReadingColumn>
      );
    case "results":
      return (
        <ReadingColumn key={index} className={spacing}>
          <OutcomeList
            items={section.outcomeBullets || []}
            heading={section.heading}
            id={id}
          />
        </ReadingColumn>
      );
    case "constraints":
      return (
        <ReadingColumn key={index} className={spacing}>
          <OutcomeList
            items={section.outcomeBullets || []}
            heading={section.heading}
            id={id}
          />
        </ReadingColumn>
      );
    case "key-decisions":
      return (
        <ReadingColumn key={index} className={spacing}>
          <OutcomeList
            items={section.outcomeBullets || []}
            heading={section.heading}
            id={id}
            body={section.body}
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
  const navItems = generateNavItems(caseStudy.sections);

  return (
    <PageShell>
      <article>
        {/* Nav + header side-by-side on desktop, stacked on mobile */}
        {/* Compact section navigation below the desktop-sidebar breakpoint */}
        <div className="sticky top-[52px] md:top-[60px] z-30 -mx-5 -mt-12 mb-10 sm:-mx-6 md:-mt-16 lg:-mt-24 xl:hidden">
          <CaseStudyNav items={navItems} variant="mobile" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[208px_1fr] xl:gap-12">
          {/* Desktop sidebar */}
          <div className="hidden xl:block">
            <CaseStudyNav items={navItems} />
          </div>

          {/* Header + hero + content column */}
          <div className="xl:-ml-[108px]">
            {/* Header */}
            <ReadingColumn>
              <SectionReveal>
                <header id="overview" className="scroll-mt-16">
                  {/* Metadata grid */}
                  <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                    <span className="font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                      Role
                    </span>
                    <span className="font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
                      {caseStudy.role}
                    </span>

                    <span className="font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                      Timeline
                    </span>
                    <span className="font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
                      {caseStudy.timeline}
                    </span>

                    {caseStudy.meta?.scope && (
                      <>
                        <span className="font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                          Scope
                        </span>
                        <span className="font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
                          {caseStudy.meta.scope}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="mt-10 font-sans text-[clamp(2rem,5vw,3rem)] font-medium text-[#151515]">
                    {caseStudy.title}
                  </h1>

                  {/* Subtitle / hook */}
                  {caseStudy.subtitle && (
                    <p className="mt-3 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
                      {caseStudy.subtitle}
                    </p>
                  )}

                  {/* Overview */}
                  <p className="mt-4 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
                    {caseStudy.overview}
                  </p>
                </header>
              </SectionReveal>
            </ReadingColumn>

            {/* Hero — full width */}
            {caseStudy.heroCarousel?.length ? (
              <ReadingColumn className="mt-8 md:mt-12">
                <CarouselImage
                  slides={caseStudy.heroCarousel}
                  aspectRatio={8 / 5}
                  background={caseStudy.heroCarouselBackground ?? "#f5f2ee"}
                />
              </ReadingColumn>
            ) : caseStudy.coverScroll?.src ? (
              <ReadingColumn className="mt-6">
                <CoverScroll
                  src={caseStudy.coverScroll.src}
                  alt={caseStudy.coverScroll.alt}
                  sections={caseStudy.coverScroll.sections}
                  maxWidth="680px"
                  showLaptopFrame={false}
                />
              </ReadingColumn>
            ) : caseStudy.heroMedia ? (
              <HeroMedia
                src={caseStudy.heroMedia.src}
                alt={caseStudy.heroMedia.alt}
              />
            ) : null}

            {/* Content sections */}
            <div className="mt-12">
              {caseStudy.sections.flatMap(
                (section: ContentSectionType, index: number) => {
                  const items: React.ReactNode[] = [];
                  const prev =
                    index > 0 ? caseStudy.sections[index - 1] : undefined;
                  if (shouldInsertDivider(prev, section)) {
                    items.push(<SectionDivider key={`div-${index}`} />);
                  }
                  items.push(renderSection(section, index, caseStudy, prev));
                  return items;
                },
              )}
            </div>

            {/* Back link */}
            <ReadingColumn>
              <SectionReveal>
                <div className="mt-16 text-center md:mt-20">
                  <Link
                    href="/featured-case-studies"
                    className="font-sans text-sm font-medium text-[#A43718] transition-colors duration-[var(--duration-fast)] hover:text-[#A43718]"
                  >
                    &larr; All case studies
                  </Link>
                </div>
              </SectionReveal>

              {/* Previous / Next navigation */}
              <ProjectNav
                prevProject={prevProject}
                nextProject={nextProject}
              />
            </ReadingColumn>
          </div>
        </div>
      </article>
    </PageShell>
  );
}
