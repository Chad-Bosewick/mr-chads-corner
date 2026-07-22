import { SectionReveal } from "@/components/sections/SectionReveal";
import type { DiagramData } from "@/content/case-studies";

interface DiagramSectionProps {
  heading?: string;
  diagramType: string;
  diagramData?: DiagramData;
}

/* -------------------------------------------------------------------------- */
/*  Sub-components — one per diagram type                                     */
/* -------------------------------------------------------------------------- */

function ProblemDiagram({ data }: { data: NonNullable<DiagramData["problemDiagram"]> }) {
  return (
    <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-0">
      {/* Left card */}
      <div className="flex w-full max-w-sm flex-col items-center text-center md:w-1/3">
        <span className="mb-2 text-xs font-medium uppercase tracking-widest text-[#757575]">
          {data.leftLabel}
        </span>
        <p className="font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
          {data.leftStatement}
        </p>
      </div>

      {/* Centre connector */}
      <div className="flex flex-col items-center gap-2 px-4">
        <div className="hidden h-px w-12 bg-[#151515]/15 md:block" />
        <span className="inline-block rounded-full bg-[#A43718] px-3 py-1 text-xs font-medium text-white">
          {data.centre}
        </span>
        <div className="hidden h-px w-12 bg-[#151515]/15 md:block" />
      </div>

      {/* Right card */}
      <div className="flex w-full max-w-sm flex-col items-center text-center md:w-1/3">
        <span className="mb-2 text-xs font-medium uppercase tracking-widest text-[#757575]">
          {data.rightLabel}
        </span>
        <p className="font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
          {data.rightStatement}
        </p>
      </div>
    </div>
  );
}

function EvolutionDiagram({ data }: { data: NonNullable<DiagramData["evolutionStages"]> }) {
  return (
    <figure>
      <div className="flex flex-col items-start gap-0 md:flex-row md:items-start md:justify-between">
        {data.map((stage, i) => (
          <div key={stage.stage} className="flex w-full items-start gap-4 md:w-auto md:flex-1">
            {/* Step number + arrow */}
            <div className="flex flex-col items-center">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#A43718] font-sans text-sm font-medium text-white">
                {i + 1}
              </span>
              {i < data.length - 1 && (
                <div className="hidden h-px w-12 bg-[#151515]/15 md:block" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <h4 className="font-sans text-sm font-medium text-[#151515]">
                {stage.stage}
              </h4>
              <p className="mt-1 font-sans text-[clamp(0.8125rem,1.5vw,0.875rem)] leading-relaxed text-[#757575]">
                {stage.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function EcosystemDiagram({ data }: { data: NonNullable<DiagramData["ecosystemRoles"]> }) {
  return (
    <figure>
      <div className="grid gap-6 md:grid-cols-3">
        {data.map((role, i) => (
          <div key={role.name} className="relative">
            {/* Connecting line (desktop only, between cards) */}
            {i < data.length - 1 && (
              <div className="absolute right-0 top-8 hidden h-px w-full bg-[#151515]/10 md:block" />
            )}
            <div className="relative z-10 rounded-lg border border-[#151515]/10 bg-[#f0f0f0]/50 p-5">
              <h4 className="font-sans text-sm font-medium text-[#151515]">
                {role.name}
              </h4>
              <p className="mt-2 font-sans text-[clamp(0.8125rem,1.5vw,0.875rem)] leading-relaxed text-[#757575]">
                {role.description}
              </p>
              {role.permissions.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {role.permissions.map((p) => (
                    <li
                      key={p}
                      className="rounded-full bg-[#A43718]/10 px-2.5 py-0.5 text-xs font-medium text-[#A43718]"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function ChangeFrameworkDiagram({ data }: { data: NonNullable<DiagramData["changeRows"]> }) {
  return (
    /* Desktop: table. Mobile: stacked cards. */
    <figure>
      {/* Desktop table */}
      <table className="hidden w-full border-collapse md:table">
        <thead>
          <tr>
            <th className="border-b border-[#151515]/10 px-4 py-3 text-left font-sans text-xs font-medium uppercase tracking-widest text-[#757575]">
              Change
            </th>
            <th className="border-b border-[#151515]/10 px-4 py-3 text-left font-sans text-xs font-medium uppercase tracking-widest text-[#757575]">
              Affected Systems
            </th>
            <th className="border-b border-[#151515]/10 px-4 py-3 text-left font-sans text-xs font-medium uppercase tracking-widest text-[#757575]">
              Our Response
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td className="border-b border-[#151515]/5 px-4 py-3 font-sans text-sm text-[#151515]">
                {row.change}
              </td>
              <td className="border-b border-[#151515]/5 px-4 py-3 font-sans text-sm text-[#757575]">
                {row.systems}
              </td>
              <td className="border-b border-[#151515]/5 px-4 py-3 font-sans text-sm text-[#151515]/70">
                {row.response}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile stacked cards */}
      <div className="flex flex-col gap-4 md:hidden">
        {data.map((row, i) => (
          <div
            key={i}
            className="rounded-lg border border-[#151515]/10 bg-[#f0f0f0]/50 p-4"
          >
            <h4 className="font-sans text-sm font-medium text-[#151515]">
              {row.change}
            </h4>
            <p className="mt-1 font-sans text-xs font-medium text-[#A43718]">
              {row.systems}
            </p>
            <p className="mt-2 font-sans text-[clamp(0.8125rem,1.5vw,0.875rem)] leading-relaxed text-[#757575]">
              {row.response}
            </p>
          </div>
        ))}
      </div>
    </figure>
  );
}

function TeamWorkflowDiagram({ data }: { data: NonNullable<DiagramData["workflowSteps"]> }) {
  return (
    <figure>
      <div
        className="flex flex-col gap-0 md:flex-row md:items-start md:justify-between"
        role="list"
        aria-label="Team workflow steps"
      >
        {data.map((step, i) => (
          <div
            key={step}
            className="flex w-full items-center gap-4 md:w-auto md:flex-1"
            role="listitem"
          >
            {/* Step number + arrow */}
            <div className="flex flex-col items-center">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#151515] font-sans text-sm font-medium text-white">
                {i + 1}
              </span>
              {i < data.length - 1 && (
                <div className="hidden h-px w-8 bg-[#151515]/15 md:block" />
              )}
            </div>

            {/* Label */}
            <div className="flex-1 pb-6">
              <p className="font-sans text-[clamp(0.8125rem,1.5vw,0.875rem)] leading-snug text-[#151515]/70">
                {step}
              </p>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                           */
/* -------------------------------------------------------------------------- */

export function DiagramSection({
  heading,
  diagramType,
  diagramData,
}: DiagramSectionProps) {
  if (!diagramData) return null;

  let diagram: React.ReactNode = null;

  switch (diagramType) {
    case "problem":
      diagram = diagramData.problemDiagram && (
        <ProblemDiagram data={diagramData.problemDiagram} />
      );
      break;
    case "evolution":
      diagram = diagramData.evolutionStages && (
        <EvolutionDiagram data={diagramData.evolutionStages} />
      );
      break;
    case "ecosystem":
      diagram = diagramData.ecosystemRoles && (
        <EcosystemDiagram data={diagramData.ecosystemRoles} />
      );
      break;
    case "change-framework":
      diagram = diagramData.changeRows && (
        <ChangeFrameworkDiagram data={diagramData.changeRows} />
      );
      break;
    case "team-workflow":
      diagram = diagramData.workflowSteps && (
        <TeamWorkflowDiagram data={diagramData.workflowSteps} />
      );
      break;
    default:
      return null;
  }

  return (
    <SectionReveal>
      <section className="my-12 md:my-16" aria-label={heading ?? "Diagram"}>
        {heading && (
          <h2 className="mb-6 font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">
            {heading}
          </h2>
        )}
        <div className="font-sans text-[clamp(0.875rem,2vw,1rem)]">
          {diagram}
        </div>
      </section>
    </SectionReveal>
  );
}
