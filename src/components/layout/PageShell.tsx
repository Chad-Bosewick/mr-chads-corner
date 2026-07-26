import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export const pageShellClass =
  "relative z-10 mx-auto box-border w-full min-w-0 max-w-[1120px] px-5 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-24";

export const contentRailClass =
  "relative z-10 mx-auto box-border w-full min-w-0 max-w-[1120px] px-5 sm:px-6 lg:px-8";

export const readingColumnClass = "w-full min-w-0 max-w-[680px] mx-auto";

export function PageShell({ children, className }: PageShellProps) {
  return <div className={cn(pageShellClass, className)}>{children}</div>;
}

export function ContentRail({ children, className }: PageShellProps) {
  return <div className={cn(contentRailClass, className)}>{children}</div>;
}

export function ReadingColumn({ children, className }: PageShellProps) {
  return <div className={cn(readingColumnClass, className)}>{children}</div>;
}
