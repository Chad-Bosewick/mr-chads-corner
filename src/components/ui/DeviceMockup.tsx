"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface DeviceMockupProps {
  type: "laptop" | "phone" | "dual-phone";
  src?: string;
  srcSecondary?: string;
  alt: string;
  altSecondary?: string;
  className?: string;
  /** Whether this entry is coming-soon (adds placeholder overlay) */
  placeholder?: boolean;
}

export function DeviceMockup({
  type,
  src,
  srcSecondary,
  alt,
  altSecondary,
  className,
  placeholder = false,
}: DeviceMockupProps) {
  const isLaptop = type === "laptop";
  const isDualPhone = type === "dual-phone";
  const prefersReducedMotion = useReducedMotion();
  const { ref: dualPhoneRef, isVisible } = useScrollReveal<HTMLDivElement>({
    threshold: 0.35,
    rootMargin: "0px 0px -48px 0px",
  });

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

  const frameShadowClass =
    "shadow-[0_8px_30px_rgba(21,21,21,0.12)] transition-[box-shadow] duration-[320ms] ease-[var(--ease-fluid)] group-hover:shadow-[0_12px_38px_rgba(21,21,21,0.18)]";

  const renderPhoneShell = ({
    imageSrc,
    imageAlt,
    className: shellClassName,
    sizes = "(max-width: 768px) 100vw, 220px",
    style,
  }: {
    imageSrc?: string;
    imageAlt: string;
    className?: string;
    sizes?: string;
    style?: CSSProperties;
  }) => (
    <div className={shellClassName} style={style}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[22px] bg-[#1a1a1a] p-[1.5px]",
          frameShadowClass,
        )}
      >
        <div className="absolute left-1/2 top-0 z-10 h-[18px] w-[80px] -translate-x-1/2 rounded-b-[10px] bg-[#1a1a1a]" />
        <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[20px] bg-[#f0f0f0]">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className={cn(
                "object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)]",
                !placeholder && "group-hover:scale-105",
              )}
              sizes={sizes}
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
  );

  const frontPhoneClass = cn(
    "absolute left-0 top-0 z-10 w-[240px]",
    "transition-[transform,opacity] duration-[900ms] ease-[var(--ease-out)]",
    isVisible || prefersReducedMotion ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
    !prefersReducedMotion && "group-hover:[animation-play-state:paused]",
  );

  const backPhoneClass = cn(
    "absolute right-0 top-12 z-0 w-[225px]",
    "transition-[transform,opacity] duration-[900ms] ease-[var(--ease-out)]",
    isVisible || prefersReducedMotion ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
    !prefersReducedMotion && "group-hover:[animation-play-state:paused]",
  );

  return (
    <div className={cn("relative select-none", className)}>
      {isLaptop ? (
        <div className="relative w-full max-w-[480px]">
          <div
            className={cn(
              "relative overflow-hidden rounded-[6px] bg-[#1a1a1a] p-[1.5px]",
              frameShadowClass,
            )}
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[4px] bg-[#f0f0f0]">
              {src ? (
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)]",
                    !placeholder && "group-hover:scale-105",
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
          <div className="mx-auto mt-[-1px] h-[10px] w-[55%] rounded-b-[6px] bg-[#e8e8e8] shadow-[0_2px_4px_rgba(21,21,21,0.06)]" />
          <div className="mx-auto h-[4px] w-[40%] rounded-b-[3px] bg-[#f0f0f0]" />
        </div>
      ) : isDualPhone ? (
        <div ref={dualPhoneRef} className="relative w-full">
          <div className="md:hidden">
            {renderPhoneShell({
              imageSrc: src,
              imageAlt: alt,
              className: "relative mx-auto w-full max-w-[220px]",
              sizes: "(max-width: 768px) 220px, 220px",
            })}
          </div>

          <div className="relative hidden h-[540px] w-full max-w-[440px] md:block">
            {renderPhoneShell({
              imageSrc: srcSecondary,
              imageAlt: altSecondary ?? `${alt} secondary`,
              className: backPhoneClass,
              sizes: "(max-width: 1024px) 210px, 225px",
              style: prefersReducedMotion
                ? { transitionDelay: "150ms" }
                : {
                    animation: "device-float-secondary 6.4s ease-in-out 150ms infinite",
                    animationPlayState: "running",
                    transitionDelay: "150ms",
                  },
            })}
            {renderPhoneShell({
              imageSrc: src,
              imageAlt: alt,
              className: frontPhoneClass,
              sizes: "(max-width: 1024px) 220px, 240px",
              style: prefersReducedMotion
                ? undefined
                : {
                    animation: "device-float 6s ease-in-out infinite",
                    animationPlayState: "running",
                  },
            })}
          </div>
        </div>
      ) : (
        renderPhoneShell({
          imageSrc: src,
          imageAlt: alt,
          className: "relative w-full max-w-[220px]",
        })
      )}
    </div>
  );
}
