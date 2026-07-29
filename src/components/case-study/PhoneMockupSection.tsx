"use client";

import { SectionReveal } from "@/components/sections/SectionReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PhoneBezel } from "@/components/case-study/TodoCaseStudySlide";

interface PhoneMockupImage {
  src: string;
  alt: string;
  caption?: string;
}

interface PhoneMockupSectionProps {
  heading?: string;
  body?: string;
  images: PhoneMockupImage[];
}

export function PhoneMockupSection({
  heading,
  body,
  images,
}: PhoneMockupSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const isPair = images.length === 2;

  return (
    <SectionReveal
      variant={prefersReducedMotion ? "fade-in" : "fade-up"}
      duration={prefersReducedMotion ? "0ms" : undefined}
    >
      <section>
        {heading && (
          <h2 className="mb-6 font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">
            {heading}
          </h2>
        )}
        {body && (
          <div className="mb-6 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
            <p dangerouslySetInnerHTML={{ __html: body }} />
          </div>
        )}
        <div className="flex items-start justify-center gap-4">
          {images.slice(0, 2).map((image) => (
            <figure
              key={image.src}
              className={isPair ? "w-[calc((100%-1rem)/2)] max-w-[180px]" : "w-full max-w-[180px]"}
            >
              <PhoneBezel
                src={image.src}
                alt={image.alt}
                sizes="(max-width: 768px) 45vw, 180px"
              />
              {image.caption && (
                <figcaption className="mt-2 font-sans text-sm text-[var(--color-text-muted)]">
                  {image.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </section>
    </SectionReveal>
  );
}
