"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getTimelineMarkerPositions, TIMELINE_MILESTONES } from "@/content/timeline";
import { useTimelineHero } from "@/hooks/useTimelineHero";

/* ── Constants ────────────────────────────────────────────────── */

const TOOLTIP_MARKER_GAP = 24; // px between tooltip card and focused marker/mascot
const TOOLTIP_MAX_WIDTH = 300;
const TOOLTIP_MIN_WIDTH = 220;
const TOOLTIP_EDGE_GUTTER = 12;

/* ── Component ────────────────────────────────────────────────── */

export function TimelineHero({ animate = true }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  const activeIndex = useTimelineHero(canvasRef, animate);

  /* Track width changes for marker positions — guarded to avoid unnecessary re-renders */
  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;

    const update = () => setWidth((prev) => {
      const w = node.clientWidth;
      return w !== prev ? w : prev;
    });
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const canvasHeight = width < 500 ? 90 : 120;
  const groundY = Math.floor(canvasHeight * 0.58);
  const tooltipWidth = useMemo(() => {
    if (width <= 0) return TOOLTIP_MAX_WIDTH;

    return Math.min(
      TOOLTIP_MAX_WIDTH,
      Math.max(TOOLTIP_MIN_WIDTH, width - TOOLTIP_EDGE_GUTTER * 2),
    );
  }, [width]);
  const markerPositions = useMemo(
    () => getTimelineMarkerPositions(width, TIMELINE_MILESTONES.length),
    [width],
  );

  const currentMilestone =
    activeIndex !== null && activeIndex >= 0 && activeIndex < TIMELINE_MILESTONES.length
      ? TIMELINE_MILESTONES[activeIndex]
      : null;

  const tooltipX =
    activeIndex !== null && currentMilestone && markerPositions[activeIndex] !== undefined
      ? markerPositions[activeIndex]
      : null;

  /* Clamp so the full tooltip stays visible on first/last markers */
  const safeTooltipX = useMemo(() => {
    if (tooltipX === null || width <= 0) return tooltipX;

    const safeHalf = tooltipWidth / 2 + TOOLTIP_EDGE_GUTTER;
    const minX = Math.min(safeHalf, width / 2);
    const maxX = Math.max(width - safeHalf, minX);

    return Math.max(minX, Math.min(tooltipX, maxX));
  }, [tooltipWidth, tooltipX, width]);

  return (
    <div
      ref={wrapperRef}
      className="relative mt-2 select-none pt-[76px] md:pt-[80px]"
      style={{ touchAction: "manipulation" }}
      role="group"
      aria-label="Career timeline with auto-play milestones"
    >
      <canvas ref={canvasRef} data-timeline="true" className="block h-[90px] w-full md:h-[120px] bg-[#f5f2ee] will-change-transform" aria-hidden="true" />

      {/* ── Tooltip ── */}
      <AnimatePresence mode="wait" initial={false}>
        {currentMilestone && safeTooltipX !== null && (
          <motion.div
            key={currentMilestone.id}
            role="tooltip"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: [0.33, 1, 0.68, 1] }}
            style={{
              left: safeTooltipX,
              bottom: canvasHeight - groundY + TOOLTIP_MARKER_GAP,
              width: tooltipWidth,
            }}
            className="pointer-events-none absolute z-20 -translate-x-1/2"
          >
            {/* Card */}
            <div
              className={`rounded-[14px] bg-[#f5f2ee] px-[18px] py-3 shadow-[0_14px_32px_rgba(21,21,21,0.10)]`}
            >
              {/* Header row: accent dot + year */}
              <div className="mb-1.5 flex items-center gap-[7px]">
                <span className="block h-[7px] w-[7px] rounded-full bg-[#A43718]" />
                <span className="block font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  {currentMilestone.year}
                </span>
              </div>

              {/* Note */}
              <p className="text-[12px] font-normal leading-snug text-[#151515]/70">
                {currentMilestone.note}
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
