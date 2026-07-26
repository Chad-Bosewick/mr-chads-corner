import { SectionReveal } from "@/components/sections/SectionReveal";
import { CarouselImage } from "@/components/case-study/CarouselImage";

interface CarouselSlide {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  scroll?: boolean;
}

interface CarouselSectionProps {
  heading?: string;
  slides: CarouselSlide[];
  /** Auto-advance interval in ms. Undefined = component default (4000ms). 0 = disabled. */
  autoAdvanceMs?: number;
}

export function CarouselSection({ heading, slides, autoAdvanceMs }: CarouselSectionProps) {
  return (
    <SectionReveal>
      <section>
        {heading && (
          <h2 className="mb-6 font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">
            {heading}
          </h2>
        )}
        <CarouselImage slides={slides} heading={heading} autoAdvanceMs={autoAdvanceMs} />
      </section>
    </SectionReveal>
  );
}
