"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function TodoDeviceAnnotations({ isVisible }: { isVisible: boolean }) {
  const pathTransition = (delay: number) => ({
    duration: 0.28,
    delay: isVisible ? delay : 0,
    ease: "easeOut" as const,
  });
  const labelTransition = (delay: number) => ({
    duration: 0.2,
    delay: isVisible ? delay + 0.08 : 0,
    ease: "easeOut" as const,
  });

  return (
    <div className="pointer-events-none absolute inset-0 z-20 hidden md:block" aria-hidden="true">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 480 300"
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.path
          d="M78 66H142L205 87"
          stroke="rgba(21,21,21,0.3)"
          strokeWidth="1"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: isVisible ? 1 : 0, pathLength: isVisible ? 1 : 0 }}
          transition={pathTransition(0)}
        />
        <motion.path
          d="M82 177H148L202 166"
          stroke="rgba(21,21,21,0.3)"
          strokeWidth="1"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: isVisible ? 1 : 0, pathLength: isVisible ? 1 : 0 }}
          transition={pathTransition(0.06)}
        />
        <motion.path
          d="M406 145H344L295 168"
          stroke="rgba(21,21,21,0.3)"
          strokeWidth="1"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: isVisible ? 1 : 0, pathLength: isVisible ? 1 : 0 }}
          transition={pathTransition(0.12)}
        />
        <motion.path
          d="M400 244H324L240 254"
          stroke="rgba(21,21,21,0.3)"
          strokeWidth="1"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: isVisible ? 1 : 0, pathLength: isVisible ? 1 : 0 }}
          transition={pathTransition(0.18)}
        />
        {[
          [205, 87],
          [202, 166],
          [295, 168],
          [240, 254],
        ].map(([cx, cy], index) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="2.5"
            fill="#A43718"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.4 }}
            transition={labelTransition(index * 0.06)}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        ))}
      </svg>

      <motion.span
        className="absolute left-3 top-[18%] font-sans text-[9px] font-medium uppercase tracking-[0.12em] text-[#151515]/70"
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -5 }}
        transition={labelTransition(0)}
      >
        E-paper task display
      </motion.span>
      <motion.span
        className="absolute left-3 top-[55%] font-sans text-[9px] font-medium uppercase tracking-[0.12em] text-[#151515]/70"
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -5 }}
        transition={labelTransition(0.06)}
      >
        Screen control keys
      </motion.span>
      <motion.span
        className="absolute right-3 top-[44%] text-right font-sans text-[9px] font-medium uppercase tracking-[0.12em] text-[#151515]/70"
        initial={{ opacity: 0, x: 5 }}
        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 5 }}
        transition={labelTransition(0.12)}
      >
        AI emoji display
      </motion.span>
      <motion.span
        className="absolute bottom-[13%] right-3 text-right font-sans text-[9px] font-medium uppercase tracking-[0.12em] text-[#151515]/70"
        initial={{ opacity: 0, x: 5 }}
        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 5 }}
        transition={labelTransition(0.18)}
      >
        Push to speak
      </motion.span>
    </div>
  );
}

interface DeviceMockupProps {
  type: "laptop" | "phone" | "dual-phone";
  src?: string;
  srcSecondary?: string;
  alt: string;
  altSecondary?: string;
  className?: string;
  /** Whether the parent project card is hovered or keyboard-focused. */
  isInteractionActive?: boolean;
  /** Optional informational overlay for a device-specific editorial treatment. */
  annotationSet?: "todo-device";
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
  isInteractionActive = false,
  annotationSet,
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

  const showTodoAnnotations =
    annotationSet === "todo-device" && isInteractionActive && !prefersReducedMotion;

  const renderPhoneShell = ({
    imageSrc,
    imageAlt,
    className: shellClassName,
    sizes = "(max-width: 768px) 100vw, 220px",
    disableImageHoverScale = false,
  }: {
    imageSrc?: string;
    imageAlt: string;
    className?: string;
    sizes?: string;
    disableImageHoverScale?: boolean;
  }) => (
    <div className={shellClassName}>
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
                !placeholder && !disableImageHoverScale && "group-hover:scale-105",
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
  );

  const backPhoneClass = cn(
    "absolute right-0 top-12 z-0 w-[225px]",
    "transition-[transform,opacity] duration-[900ms] ease-[var(--ease-out)]",
    isVisible || prefersReducedMotion ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
  );

  const dualPhoneIsActive = isInteractionActive && !prefersReducedMotion;
  const dualPhoneMotion = (direction: "front" | "back") => ({
    animate: dualPhoneIsActive
      ? {
          // 212px-wide frames + a 16px gap fill the 440px stage exactly.
          // The scale ratios normalize the original 240px and 225px bezels.
          x: 0,
          y: direction === "front" ? 0 : -48,
          scale: direction === "front" ? 212 / 240 : 212 / 225,
        }
      : {
          x: 0,
          y: prefersReducedMotion
            ? 0
            : direction === "front"
              ? [0, -3, 0]
              : [0, -2, 0],
          scale: 1,
        },
    transition: dualPhoneIsActive || prefersReducedMotion
      ? { type: "spring" as const, duration: 0.38, bounce: 0 }
      : {
          x: { type: "spring" as const, duration: 0.38, bounce: 0 },
          scale: { type: "spring" as const, duration: 0.38, bounce: 0 },
          y: {
            duration: direction === "front" ? 6 : 6.4,
            ease: "easeInOut" as const,
            repeat: Infinity,
            repeatType: "mirror" as const,
            delay: direction === "back" ? 0.15 : 0,
          },
        },
  });

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
              {annotationSet === "todo-device" && (
                <TodoDeviceAnnotations isVisible={showTodoAnnotations} />
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
            <div className={backPhoneClass} style={{ transitionDelay: "150ms" }}>
              <motion.div
                initial={false}
                className="w-full will-change-transform"
                style={{ transformOrigin: "right top" }}
                {...dualPhoneMotion("back")}
              >
                {renderPhoneShell({
                  imageSrc: srcSecondary,
                  imageAlt: altSecondary ?? `${alt} secondary`,
                  className: "w-full",
                  sizes: "(max-width: 1024px) 210px, 225px",
                  disableImageHoverScale: true,
                })}
              </motion.div>
            </div>
            <div className={frontPhoneClass}>
              <motion.div
                initial={false}
                className="w-full will-change-transform"
                style={{ transformOrigin: "left top" }}
                {...dualPhoneMotion("front")}
              >
                {renderPhoneShell({
                  imageSrc: src,
                  imageAlt: alt,
                  className: "w-full",
                  sizes: "(max-width: 1024px) 220px, 240px",
                  disableImageHoverScale: true,
                })}
              </motion.div>
            </div>
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
