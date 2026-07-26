import { SectionReveal } from "@/components/sections/SectionReveal";

interface EditorialCardProps {
  label: string;
  heading?: string;
  children: React.ReactNode;
}

export function EditorialCard({ label, heading, children }: EditorialCardProps) {
  return (
    <SectionReveal>
      <div className="my-12 rounded-lg border border-[#151515]/10 bg-[#f8f8f8] p-6 md:my-16 md:p-8">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          {label}
        </p>
        {heading && (
          <h2 className="mt-2 font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">
            {heading}
          </h2>
        )}
        <div className="mt-4 space-y-4 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
          {children}
        </div>
      </div>
    </SectionReveal>
  );
}
