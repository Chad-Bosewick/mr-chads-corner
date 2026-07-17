import { SectionReveal } from "./SectionReveal";

interface TestimonialBlockProps {
  quote: string;
  attribution: string;
  role?: string;
}

export function TestimonialBlock({
  quote,
  attribution,
  role,
}: TestimonialBlockProps) {
  return (
    <SectionReveal>
      <blockquote className="border-l-2 border-[#A43718] pl-6">
        <p className="font-serif text-[clamp(1rem,2.5vw,1.25rem)] italic leading-relaxed text-[#151515]/80">
          &ldquo;{quote}&rdquo;
        </p>
        <footer className="mt-4">
          <cite className="not-italic">
            <span className="font-sans text-sm font-medium text-[#151515]">
              {attribution}
            </span>
            {role && (
              <span className="font-sans text-sm text-[#757575]">
                , {role}
              </span>
            )}
          </cite>
        </footer>
      </blockquote>
    </SectionReveal>
  );
}
