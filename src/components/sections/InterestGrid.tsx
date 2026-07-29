"use client";

import { SectionReveal } from "./SectionReveal";
import { InterestCard, type InterestItem } from "./InterestCard";

interface InterestGridProps {
  interests: InterestItem[];
}

export function InterestGrid({ interests }: InterestGridProps) {
  return (
    <section
      aria-label="Interests"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
    >
      {/* Education — top-left, spans 2 cols and 2 rows */}
      {interests.length >= 1 && (
        <SectionReveal
          key={interests[0].category}
          delay={0}
          className="sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2"
        >
          <InterestCard interest={interests[0]} />
        </SectionReveal>
      )}

      {/* Sports — top-right */}
      {interests.length >= 2 && (
        <SectionReveal key={interests[1].category} delay={80}>
          <InterestCard interest={interests[1]} />
        </SectionReveal>
      )}

      {/* Gaming — directly under Sports */}
      {interests.length >= 6 && (
        <SectionReveal key={interests[5].category} delay={160}>
          <InterestCard interest={interests[5]} />
        </SectionReveal>
      )}

      {/* Books — starts below Education, left */}
      {interests.length >= 3 && (
        <SectionReveal key={interests[2].category} delay={240}>
          <InterestCard interest={interests[2]} />
        </SectionReveal>
      )}

      {/* Films — middle */}
      {interests.length >= 4 && (
        <SectionReveal key={interests[3].category} delay={320}>
          <InterestCard interest={interests[3]} />
        </SectionReveal>
      )}

      {/* Podcasts — right, at the bottom */}
      {interests.length >= 5 && (
        <SectionReveal key={interests[4].category} delay={400}>
          <InterestCard interest={interests[4]} />
        </SectionReveal>
      )}
    </section>
  );
}
