import { HeroHeading } from "@/components/sections/HeroHeading";
import { TextSection } from "@/components/sections/TextSection";
import { ProjectRow } from "@/components/sections/ProjectRow";
import { TestimonialBlock } from "@/components/sections/TestimonialBlock";
import { SectionReveal } from "@/components/sections/SectionReveal";
import { projects } from "@/content/projects";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1038px] px-4 py-12 md:px-6 md:py-16 lg:py-24">
      {/* Hero */}
      <SectionReveal>
        <HeroHeading
          title="Hello!"
          subtitle="I'm Temi Adekunle — product designer who thinks in systems and delivers polished, intentional digital experiences."
        />
      </SectionReveal>

      {/* Editorial intro */}
      <TextSection>
        <SectionReveal delay={80}>
          <p className="text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
            I design products that balance user needs with business outcomes —
            working across strategy, interaction, and execution to ship
            experiences that feel considered rather than assembled. I thrive in
            close collaboration with engineers, where system thinking meets
            implementation reality.
          </p>
        </SectionReveal>

        <SectionReveal delay={160}>
          <p className="text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
            My approach is grounded in understanding context before applying
            process — every product problem has a unique combination of users,
            constraints, and goals that deserves a tailored response rather than
            a templated workflow.
          </p>
        </SectionReveal>
      </TextSection>

      {/* Divider */}
      <SectionReveal delay={240}>
        <hr className="my-16 border-[#151515]/10 md:my-20" />
      </SectionReveal>

      {/* Featured projects heading */}
      <SectionReveal delay={80}>
        <h2 className="font-sans text-[clamp(1.5rem,4vw,2rem)] font-medium text-[#151515]">
          Featured case studies
        </h2>
        <p className="mt-2 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#757575]">
          A selection of recent work spanning productivity, communication, and
          climate technology.
        </p>
      </SectionReveal>

      {/* Project rows with sequential stagger */}
      <div className="mt-8 md:mt-12">
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

      {/* Divider */}
      <SectionReveal>
        <hr className="my-16 border-[#151515]/10 md:my-20" />
      </SectionReveal>

      {/* Testimonial */}
      <div className="max-w-[680px]">
        <TestimonialBlock
          quote="It's clear that Temi cares deeply about the craft of product design — from the structure of the information architecture to the polish of the final interface. A genuine systems thinker who makes the work look effortless."
          attribution="Product Lead"
          role="previous team collaboration"
        />
      </div>

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
            className="mt-6 inline-flex items-center gap-2 font-sans text-[clamp(1rem,2.5vw,1.125rem)] font-medium text-[#A43718] transition-colors duration-[var(--duration-fast)] hover:text-[#A43718]/70"
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
                d="M7 4L13 10L7 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </SectionReveal>
    </div>
  );
}
