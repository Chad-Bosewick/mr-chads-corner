import { SectionReveal } from "@/components/sections/SectionReveal";

interface ExecutiveSummaryProps {
  problem: string;
  solution: string;
  outcome: string;
}

export function ExecutiveSummary({ problem, solution, outcome }: ExecutiveSummaryProps) {
  const items = [
    { label: "Problem", text: problem },
    { label: "Solution", text: solution },
    { label: "Outcome", text: outcome },
  ];

  return (
    <SectionReveal>
      <section className="my-12 md:my-16">
        <div className="space-y-4">
          {items.map((item) => (
            <p key={item.label} className="font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
              <strong className="font-medium text-[#151515]">{item.label}.</strong>{" "}
              {item.text}
            </p>
          ))}
        </div>
      </section>
    </SectionReveal>
  );
}
