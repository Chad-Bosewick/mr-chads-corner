import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Project } from "@/content/projects";

interface ProjectNavProps {
  prevProject: Project | null;
  nextProject: Project | null;
}

export function ProjectNav({ prevProject, nextProject }: ProjectNavProps) {
  if (!prevProject && !nextProject) return null;

  return (
    <nav
      aria-label="Previous and next case study"
      className="mt-24 border-t border-[#151515]/10 pt-12 md:mt-32"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {prevProject ? (
          <Link
            href={`/featured-case-studies/${prevProject.slug}`}
            className="group flex flex-col"
          >
            <span className="font-sans text-sm text-[var(--color-text-muted)]">
              Previous
            </span>
            <span className="mt-1 font-sans text-[clamp(1rem,2.5vw,1.125rem)] font-medium text-[#151515] transition-all duration-[300ms] ease-[var(--ease-spring)] group-hover:-translate-x-1 group-hover:text-[#A43718] motion-reduce:duration-0 motion-reduce:transform-none">
              {prevProject.title}
            </span>
            <span className="mt-1 font-sans text-sm text-[var(--color-text-muted)]">
              {prevProject.category}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextProject ? (
          <Link
            href={`/featured-case-studies/${nextProject.slug}`}
            className={cn(
              "group flex flex-col",
              prevProject ? "md:text-right" : "md:col-start-2"
            )}
          >
            <span className="font-sans text-sm text-[var(--color-text-muted)]">Next</span>
            <span className="mt-1 font-sans text-[clamp(1rem,2.5vw,1.125rem)] font-medium text-[#151515] transition-all duration-[300ms] ease-[var(--ease-spring)] group-hover:translate-x-1 group-hover:text-[#A43718] motion-reduce:duration-0 motion-reduce:transform-none">
              {nextProject.title}
            </span>
            <span className="mt-1 font-sans text-sm text-[var(--color-text-muted)]">
              {nextProject.category}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}
