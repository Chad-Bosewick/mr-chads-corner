/**
 * Utility for merging Tailwind class names.
 * Simple implementation that filters falsy values and joins.
 * Can be swapped for clsx + tailwind-merge if class conflicts arise.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
