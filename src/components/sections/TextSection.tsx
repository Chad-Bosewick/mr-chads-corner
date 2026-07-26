import { cn } from "@/lib/utils";

interface TextSectionProps {
  children: React.ReactNode;
  align?: "center" | "start";
  spacing?: "normal" | "tight";
  className?: string;
}

export function TextSection({
  children,
  align = "center",
  spacing = "normal",
  className,
}: TextSectionProps) {
  return (
    <section
      className={cn(
        "w-full min-w-0",
        align === "center" ? "mx-auto max-w-[680px]" : "max-w-[760px]",
        spacing === "normal" ? "space-y-6 md:space-y-8" : "space-y-5 md:space-y-6",
        className,
      )}
    >
      {children}
    </section>
  );
}
