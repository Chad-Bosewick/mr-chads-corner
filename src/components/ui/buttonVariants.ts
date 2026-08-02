export const buttonVariants = {
  primary:
    "inline-flex min-h-11 items-center justify-center rounded-full bg-[#151515] px-7 font-sans text-[#f5f2ee] transition-colors duration-[var(--duration-fast)] hover:bg-[#A43718] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]",
  secondary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#A43718]/30 bg-[#A43718]/5 px-5 font-sans text-sm font-medium text-[#A43718] transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-[#A43718]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]",
  tertiary:
    "inline-flex items-center gap-2 font-sans text-[clamp(1rem,2.5vw,1.125rem)] font-medium text-[#A43718] transition-colors duration-[var(--duration-fast)] hover:text-[#A43718] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]",
} as const;
