import { SectionReveal } from "@/components/sections/SectionReveal";

interface ContentSectionProps {
  heading?: string;
  id?: string;
  children: React.ReactNode;
}

export function ContentSection({ heading, id, children }: ContentSectionProps) {
  return (
    <SectionReveal>
      <section id={id} className="scroll-mt-16">
        {heading && (
          <h2 className="font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">
            {heading}
          </h2>
        )}
        <div className="mt-6 space-y-6 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70 [&_strong]:font-semibold [&_strong]:text-[#151515]/90">
          {children}
        </div>
      </section>
    </SectionReveal>
  );
}
