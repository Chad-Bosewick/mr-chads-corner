import { SectionReveal } from "@/components/sections/SectionReveal";
import { ReadingColumn } from "@/components/layout/PageShell";

export function SectionDivider() {
  return (
    <ReadingColumn>
      <SectionReveal>
        <hr className="my-12 border-[#151515]/10 md:my-16" />
      </SectionReveal>
    </ReadingColumn>
  );
}
