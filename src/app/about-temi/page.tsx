import { HeroHeading } from "@/components/sections/HeroHeading";
import { SectionReveal } from "@/components/sections/SectionReveal";
import { TextSection } from "@/components/sections/TextSection";
import { PageShell, ReadingColumn } from "@/components/layout/PageShell";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Temi Adekunle",
  description:
    "Product designer who thinks in systems — background, approach, and what drives the work.",
};

const TRAVEL_PHOTOS = [
  {
    src: "/images/interests/christ-the-redeemer.webp",
    alt: "Christ the Redeemer statue overlooking Rio de Janeiro",
    location: "Rio de Janeiro, Brazil",
  },
  {
    src: "/images/interests/lalibela.webp",
    alt: "Rock-hewn church in Lalibela",
    location: "Lalibela, Ethiopia",
  },
  {
    src: "/images/interests/stamford-bridge.webp",
    alt: "Stamford Bridge stadium",
    location: "Stamford Bridge, London",
  },
  {
    src: "/images/interests/teotihuacan.webp",
    alt: "Pyramid of the Sun at Teotihuacan",
    location: "Teotihuacan, Mexico",
  },
  {
    src: "/images/interests/times-square.webp",
    alt: "Times Square at dusk",
    location: "New York City, USA",
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      {/* Hero */}
      <SectionReveal>
        <HeroHeading
          title="About Temi Adekunle"
          subtitle="Product designer with a bias toward clarity, systems thinking, and work that holds up under scrutiny."
        />
      </SectionReveal>

      {/* Background */}
      <ReadingColumn>
        <TextSection>
          <SectionReveal delay={80}>
            <p className="text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
              I&rsquo;ve spent the past several years working across early-stage
              startups and established product teams, leading design for
              productivity tools, communication platforms, and data-heavy
              applications. My work spans the full product design spectrum —
              from user research and information architecture through to visual
              design, prototyping, and design-system architecture.
            </p>
          </SectionReveal>

          <SectionReveal delay={160}>
            <p className="text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
              What drives me is the intersection of structure and craft. I
              believe great products are built on clear thinking before polished
              pixels — and that the best design decisions are the ones that make
              complex systems feel inevitable rather than clever. I work best in
              close partnership with engineers, where design intent meets
              implementation constraints, and the result is better for both.
            </p>
          </SectionReveal>

          <SectionReveal delay={240}>
            <p className="text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
              Before product design, I studied biochemistry — a background that
              taught me to think in systems, process, and the relationship
              between cause and effect. Those principles carry through
              everything I design today, whether it&rsquo;s mapping a user
              journey or building a design system component.
            </p>
          </SectionReveal>
        </TextSection>
      </ReadingColumn>

      {/* Divider */}
      <SectionReveal>
        <hr className="my-20 border-[#151515]/10 md:my-24" />
      </SectionReveal>

      {/* Interests section */}
      <SectionReveal>
        <h2 className="font-sans text-[clamp(1.5rem,4vw,2rem)] font-medium text-[#151515]">
          Beyond the work
        </h2>
        <p className="mt-2 max-w-[680px] font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[var(--color-text-muted)]">
          I&rsquo;m drawn to places with strong identity — cities and landscapes
          that tell a story through their architecture, culture, and people. These
          are a few from my travels.
        </p>
      </SectionReveal>

      {/* Travel gallery — 3 + 2 grid */}
      <div className="mt-8 grid gap-4 md:grid-cols-6 md:gap-6">
        {/* First row: first three photos — wide, medium, wide */}
        {TRAVEL_PHOTOS.slice(0, 3).map((photo, i) => (
          <SectionReveal key={photo.location} delay={i * 80} className="md:col-span-2">
            <figure>
              <div
                className={`overflow-hidden bg-[#f0f0f0] ${
                  i === 1 ? "aspect-[4/5]" : "aspect-[4/3]"
                }`}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
              <figcaption className="mt-2 font-sans text-sm text-[#757565]">
                {photo.location}
              </figcaption>
            </figure>
          </SectionReveal>
        ))}
      </div>

      {/* Second row: remaining 2 photos — centered */}
      <div className="mt-4 grid gap-4 md:grid-cols-6 md:gap-6">
        {TRAVEL_PHOTOS.slice(3).map((photo, i) => (
          <SectionReveal key={photo.location} delay={i * 80} className="md:col-span-3">
            <figure>
              <div className="overflow-hidden bg-[#f0f0f0]">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
              <figcaption className="mt-2 font-sans text-sm text-[#757565]">
                {photo.location}
              </figcaption>
            </figure>
          </SectionReveal>
        ))}
      </div>
    </PageShell>
  );
}
