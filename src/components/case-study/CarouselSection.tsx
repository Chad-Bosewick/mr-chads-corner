import { SectionReveal } from "@/components/sections/SectionReveal";
import { CarouselImage, type CarouselSlide } from "@/components/case-study/CarouselImage";

interface CarouselSectionProps {
  heading?: string;
  body?: string;
  slides: CarouselSlide[];
  /** Auto-advance interval in ms. Undefined = component default (4000ms). 0 = disabled. */
  autoAdvanceMs?: number;
  /** Optional source aspect ratio for a carousel whose slides do not use the default 16:10 frame. */
  aspectRatio?: number;
  /** Optional carousel transition surface, matched to the source artwork's edge colour. */
  background?: string;
}

export function CarouselSection({ heading, body, slides, autoAdvanceMs, aspectRatio, background }: CarouselSectionProps) {
  return (
    <SectionReveal>
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
        <CarouselImage slides={slides} heading={heading} autoAdvanceMs={autoAdvanceMs} aspectRatio={aspectRatio} background={background} />
      </section>
    </SectionReveal>
  );
}
