import { SectionReveal } from "@/components/sections/SectionReveal";
import Image from "next/image";

interface SequenceItem {
  step: number;
  label: string;
  description?: string;
  src?: string;
  alt?: string;
}

interface SequenceSectionProps {
  heading?: string;
  items: SequenceItem[];
}

/**
 * Returns the Tailwind grid-cols class for desktop.
 * Uses arbitrary values so the column count is dynamic.
 */
function desktopGridClass(cols: number): string {
  if (cols <= 1) return "md:grid-cols-1";
  if (cols === 2) return "md:grid-cols-2";
  if (cols === 3) return "md:grid-cols-3";
  if (cols === 4) return "md:grid-cols-4";
  return "md:grid-cols-5";
}

export function SequenceSection({ heading, items }: SequenceSectionProps) {
  if (!items.length) return null;

  // Cap desktop columns at 5 for readability
  const desktopCols = Math.min(items.length, 5);

  return (
    <SectionReveal>
      <section aria-label={heading ?? "Sequence"}>
        {heading && (
          <h2 className="mb-6 font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">
            {heading}
          </h2>
        )}

        {/*
          Mobile: horizontal scroll with snap, each card min-w-[280px]
          Tablet (sm): 2-column grid, no scroll
          Desktop (md): N-column grid capped at 5, no scroll
        */}
        <div
          className={`flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 md:gap-6 ${desktopGridClass(desktopCols)}`}
          role="list"
          aria-label={heading ?? "Step sequence"}
        >
          {items.map((item) => (
            <div
              key={item.step}
              className="flex min-w-[280px] flex-col snap-center sm:min-w-0 sm:snap-align-none md:w-auto"
              role="listitem"
            >
              {/* Step number */}
              <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#A43718] font-sans text-sm font-medium text-white">
                {item.step}
              </span>

              {/* Optional image */}
              {item.src && (
                <figure className="mb-3">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-[#f0f0f0]">
                    <Image
                      src={item.src}
                      alt={item.alt ?? ""}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 280px, (max-width: 768px) 50vw, 20vw"
                    />
                  </div>
                </figure>
              )}

              {/* Label */}
              <h3 className="font-sans text-sm font-medium text-[#151515]">
                {item.label}
              </h3>

              {/* Optional description */}
              {item.description && (
                <p className="mt-1 font-sans text-[clamp(0.8125rem,1.5vw,0.875rem)] leading-relaxed text-[var(--color-text-muted)]">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </SectionReveal>
  );
}
