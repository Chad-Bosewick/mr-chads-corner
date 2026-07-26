import { SectionReveal } from "@/components/sections/SectionReveal";

interface ComparisonItem {
  label: string;
  content: string;
}

interface ComparisonSectionProps {
  heading?: string;
  items: ComparisonItem[];
}

export function ComparisonSection({ heading, items }: ComparisonSectionProps) {
  if (!items.length) return null;

  return (
    <SectionReveal>
      <section aria-label={heading ?? "Comparison"}>
        {heading && (
          <h2 className="mb-6 font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">
            {heading}
          </h2>
        )}
        <div className="grid gap-0 md:grid-cols-2">
          {items.map((item, i) => (
            <div key={item.label} className="relative">
              {/* Thin divider between columns on desktop */}
              {i > 0 && (
                <div className="absolute inset-y-0 left-0 hidden w-px bg-[#151515]/10 md:block" />
              )}

              <div className={i === 0 ? "py-6 md:py-0 md:pr-6" : "py-6 md:py-0 md:pl-6"}>
                <h3
                  className="font-sans text-sm font-medium uppercase tracking-widest text-[#A43718]"
                >
                  {item.label}
                </h3>
                <p className="mt-3 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SectionReveal>
  );
}
