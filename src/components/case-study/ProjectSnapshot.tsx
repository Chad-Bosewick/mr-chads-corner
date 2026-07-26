import { SectionReveal } from "@/components/sections/SectionReveal";
import type { CaseStudyMeta } from "@/content/case-studies";

interface ProjectSnapshotProps {
  meta: CaseStudyMeta;
}

export function ProjectSnapshot({ meta }: ProjectSnapshotProps) {
  const rows = [
    ["Role", meta.role],
    ["Timeline", meta.timeline],
    ["Date", meta.date],
    ["Platform", meta.platform],
    ["Team", meta.team],
    ["Scope", meta.scope],
    ["Status", meta.status],
  ];

  return (
    <SectionReveal>
      <section>
        <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3">
          {rows.map(([label, value]) => (
            <div key={label} className="contents">
              <span className="font-sans text-sm font-medium text-[var(--color-text-muted)]">{label}</span>
              <span className="font-sans text-sm text-[#151515]/70">{value}</span>
            </div>
          ))}
        </div>
      </section>
    </SectionReveal>
  );
}
