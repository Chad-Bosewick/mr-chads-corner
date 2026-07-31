import { EditorialHero } from "@/components/sections/EditorialHero";
import { TextSection } from "@/components/sections/TextSection";
import { ProjectRow } from "@/components/sections/ProjectRow";
import { TestimonialBlock } from "@/components/sections/TestimonialBlock";
import { SectionReveal } from "@/components/sections/SectionReveal";
import { PageShell, ReadingColumn } from "@/components/layout/PageShell";
import { projects } from "@/content/projects";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <PageShell>
      {/* Editorial hero */}
      <EditorialHero
        name="Temi Adekunle"
        tagline="Product designer who thinks in systems and creates polished, intentional digital experiences across B2B and B2C products."
      />

      {/* Editorial intro */}
      <TextSection align="start" spacing="tight" className="mt-5 md:mt-6">
        <SectionReveal delay={80}>
          <p className="max-w-[700px] text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70 [text-wrap:pretty]">
            Hands-on experience leading end-to-end design
            for early-stage digital products. I design where user needs and
            business outcomes converge.
          </p>
        </SectionReveal>

        <SectionReveal delay={160}>
          <p className="max-w-[700px] text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70 [text-wrap:pretty]">
            I work alongside engineers, from first principles through
            implementation. Each product problem demands its own
            response, shaped by context, constraints, and goals.
          </p>
        </SectionReveal>
      </TextSection>

      {/* Featured case studies */}
      <SectionReveal delay={80} className="mt-16 md:mt-20">
        <div className="space-y-3">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            SELECTED WORK
          </p>
          <h2 className="font-sans text-[clamp(1.5rem,4vw,2rem)] font-medium leading-[1.1] text-[#151515]">
            Featured case studies
          </h2>
          <p className="font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[var(--color-text-muted)]">
            A curation of recent product design work across talent platforms,
            productivity, communication, and developer tools.
          </p>
        </div>
      </SectionReveal>

      {/* Project rows with sequential stagger */}
      <div className="mt-8 md:mt-12">
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
              device={project.device}
              sector={project.sector}
              delay={index * 100}
            />
          ))}
      </div>

      {/* Divider */}
      <SectionReveal>
        <hr className="my-16 border-[#151515]/10 md:my-20" />
      </SectionReveal>

      {/* Testimonial */}
      <ReadingColumn>
        <TestimonialBlock
          quote="It's clear that Temi cares deeply about the craft of product design, from the structure of the information architecture to the polish of the final interface. A genuine systems thinker who makes the work look effortless."
          attribution="Product Lead"
          role="previous team collaboration"
        />
      </ReadingColumn>

      {/* Closing CTA */}
      <SectionReveal>
        <div className="mt-24 md:mt-32">
          <p className="font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
            Interested in working together? I&rsquo;m always open to thoughtful
            conversations about product strategy, design systems, and building
            things that matter.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 font-sans text-[clamp(1rem,2.5vw,1.125rem)] font-medium text-[#A43718] transition-colors duration-[var(--duration-fast)] hover:text-[#A43718]"
          >
            Get in touch
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 4.75L13 10L7 15.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </SectionReveal>
    </PageShell>
  );
}
