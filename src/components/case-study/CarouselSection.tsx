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
  /** Optional source aspect ratio for a carousel whose slides do not use the default 16:10 frame. */
  aspectRatio?: number;
  /** Optional carousel transition surface, matched to the source artwork's edge colour. */
  background?: string;
}

export function CarouselSection({ heading, slides, autoAdvanceMs, aspectRatio, background }: CarouselSectionProps) {
  return (
    <SectionReveal>
      <section>
        {heading && (
          <h2 className="mb-6 font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">
            {heading}
          </h2>
        )}
        <CarouselImage slides={slides} heading={heading} autoAdvanceMs={autoAdvanceMs} aspectRatio={aspectRatio} background={background} />
      </section>
    </SectionReveal>
  );
}
