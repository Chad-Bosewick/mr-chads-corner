"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface DeviceMockupProps {
  type: "laptop" | "phone";
  src?: string;
  alt: string;
  className?: string;
  /** Whether this entry is coming-soon (adds placeholder overlay) */
  placeholder?: boolean;
}

export function DeviceMockup({
  type,
  src,
  alt,
  className,
  placeholder = false,
}: DeviceMockupProps) {
  const isLaptop = type === "laptop";

  const placeholderScreen = (
    <div
      className="absolute inset-0 bg-[linear-gradient(135deg,#f7f4ef_0%,#ece7df_45%,#f2eee8_100%)]"
      aria-hidden="true"
    >
      <div className="absolute left-[12%] top-[18%] h-[1px] w-[48%] bg-[#151515]/10" />
      <div className="absolute left-[12%] top-[30%] h-[1px] w-[70%] bg-[#151515]/8" />
      <div className="absolute left-[12%] top-[42%] h-[1px] w-[56%] bg-[#151515]/8" />
      <div className="absolute bottom-[18%] right-[14%] h-8 w-8 rounded-full bg-[#A43718]/15" />
    </div>
  );

  return (
    <div className={cn("relative select-none", className)}>
      {isLaptop ? (
        // ── Laptop mockup ──
        <div className="relative w-full max-w-[480px]">
          {/* Screen with bezel */}
          <div className="relative overflow-hidden rounded-[8px] bg-[#1a1a1a] p-[3px] shadow-[0_8px_30px_rgba(21,21,21,0.12)]">
            {/* Screen content */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[5px] bg-[#f0f0f0]">
              {src ? (
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)]",
                    !placeholder && "group-hover:scale-105"
                  )}
                  sizes="(max-width: 768px) 100vw, 480px"
                />
              ) : (
                placeholderScreen
              )}
              {placeholder && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#151515]/5 to-[#151515]/20" />
              )}
            </div>
          </div>
          {/* Base/stand */}
          <div className="mx-auto mt-[-1px] h-[10px] w-[55%] rounded-b-[6px] bg-[#e8e8e8] shadow-[0_2px_4px_rgba(21,21,21,0.06)]" />
          {/* Keyboard deck hint */}
          <div className="mx-auto h-[4px] w-[40%] rounded-b-[3px] bg-[#f0f0f0]" />
        </div>
      ) : (
        // ── Phone mockup ──
        <div className="relative w-full max-w-[220px]">
          {/* Body with bezel */}
          <div className="relative overflow-hidden rounded-[24px] bg-[#1a1a1a] p-[3px] shadow-[0_8px_30px_rgba(21,21,21,0.12)]">
            {/* Notch */}
            <div className="absolute left-1/2 top-0 z-10 h-[18px] w-[80px] -translate-x-1/2 rounded-b-[10px] bg-[#1a1a1a]" />
            {/* Screen */}
            <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[21px] bg-[#f0f0f0]">
              {src ? (
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)]",
                    !placeholder && "group-hover:scale-105"
                  )}
                  sizes="(max-width: 768px) 100vw, 220px"
                />
              ) : (
                placeholderScreen
              )}
              {placeholder && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#151515]/5 to-[#151515]/20" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
