import { SectionReveal } from "@/components/sections/SectionReveal";

interface ContentSectionProps {
  heading?: string;
  children: React.ReactNode;
}

export function ContentSection({ heading, children }: ContentSectionProps) {
  return (
    <SectionReveal>
      <section className="my-12 md:my-16">
        {heading && (
          <h2 className="font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">
            {heading}
          </h2>
        )}
        <div className="mt-4 space-y-4 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
          {children}
        </div>
      </section>
    </SectionReveal>
  );
}
