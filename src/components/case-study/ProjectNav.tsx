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
            <span className="font-sans text-sm text-[#757575]">
              Previous
            </span>
            <span className="mt-1 font-sans text-[clamp(1rem,2.5vw,1.125rem)] font-medium text-[#151515] transition-colors duration-[var(--duration-fast)] group-hover:text-[#A43718]">
              {prevProject.title}
            </span>
            <span className="mt-1 font-sans text-sm text-[#757575]">
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
              prevProject ? "text-right" : "md:col-start-2"
            )}
          >
            <span className="font-sans text-sm text-[#757575]">Next</span>
            <span className="mt-1 font-sans text-[clamp(1rem,2.5vw,1.125rem)] font-medium text-[#151515] transition-colors duration-[var(--duration-fast)] group-hover:text-[#A43718]">
              {nextProject.title}
            </span>
            <span className="mt-1 font-sans text-sm text-[#757575]">
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
