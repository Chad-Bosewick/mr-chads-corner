import { SectionReveal } from "@/components/sections/SectionReveal";

interface Metric {
  label: string;
  value: string;
}

interface MetricBarProps {
  heading?: string;
  metrics: Metric[];
}

export function MetricBar({ heading, metrics }: MetricBarProps) {
  return (
    <SectionReveal>
      <section className="my-12 md:my-16">
        {heading && (
          <h2 className="mb-6 font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">
            {heading}
          </h2>
        )}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex flex-col">
              <span className="font-sans text-[clamp(1.75rem,4vw,2.5rem)] font-medium text-[#A43718]">
                {metric.value}
              </span>
              <span className="mt-1 font-sans text-sm text-[#757575]">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </SectionReveal>
  );
}
