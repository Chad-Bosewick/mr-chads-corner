"use client";

import { SectionReveal } from "@/components/sections/SectionReveal";
import { useCountUp } from "@/hooks/useCountUp";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Metric {
  label: string;
  value: string;
}

interface MetricBarProps {
  heading?: string;
  metrics: Metric[];
}

function parseMetricValue(
  value: string,
): { numeric: number; prefix: string; suffix: string } | null {
  const match = value.match(/^([+\-]?)(\d+)(.*)$/);
  if (!match) return null;
  return {
    prefix: match[1],
    numeric: Number.parseInt(match[2], 10),
    suffix: match[3],
  };
}

function AnimatedMetric({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: number;
}) {
  const parsed = parseMetricValue(value);
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const animatedValue = useCountUp(
    parsed?.numeric ?? 0,
    1500,
    isVisible ? delay : 99999,
  );

  if (!parsed) {
    return (
      <div ref={ref} className="flex flex-col">
        <span className="font-sans text-[clamp(1.75rem,4vw,2.5rem)] font-medium text-[#A43718]">
          {value}
        </span>
        <span className="mt-1 font-sans text-sm text-[var(--color-text-muted)]">{label}</span>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex flex-col">
      <span className="font-sans text-[clamp(1.75rem,4vw,2.5rem)] font-medium text-[#A43718]">
        {parsed.prefix}
        {animatedValue}
        {parsed.suffix}
      </span>
      <span className="mt-1 font-sans text-sm text-[var(--color-text-muted)]">{label}</span>
    </div>
  );
}

export function MetricBar({ heading, metrics }: MetricBarProps) {
  return (
    <SectionReveal>
      <section>
        {heading && (
          <h2 className="mb-6 font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">
            {heading}
          </h2>
        )}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {metrics.map((metric, i) => (
            <AnimatedMetric
              key={metric.label}
              value={metric.value}
              label={metric.label}
              delay={i * 100}
            />
          ))}
        </div>
      </section>
    </SectionReveal>
  );
}
