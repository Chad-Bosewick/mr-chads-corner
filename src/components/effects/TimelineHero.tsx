"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getTimelineMarkerPositions, TIMELINE_MILESTONES } from "@/content/timeline";
import { useTimelineHero } from "@/hooks/useTimelineHero";

/* ── Constants ────────────────────────────────────────────────── */

const IDLE_RESUME_MS = 4000;
const TOOLTIP_MARKER_GAP = 24;
const TOOLTIP_MAX_WIDTH = 300;
const TOOLTIP_MIN_WIDTH = 220;
const TOOLTIP_EDGE_GUTTER = 12;

/* ── Component ────────────────────────────────────────────────── */

export function TimelineHero({ animate = true }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [width, setWidth] = useState(0);
  const [overrideIndex, setOverrideIndex] = useState<number | null>(null);

  /* Hook returns the active index — from auto-advance or override */
  const activeIndex = useTimelineHero(canvasRef, animate, false, overrideIndex);

  /* The tooltip always follows the hook's activeIndex */
  const displayIndex = overrideIndex !== null ? overrideIndex : activeIndex;

  /* ── Idle timer — clear override after inactivity ── */
  const startIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setOverrideIndex(null);
      idleTimerRef.current = null;
    }, IDLE_RESUME_MS);
  }, []);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  /* ── Width tracking ── */
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

  /* ── Layout calculations ── */
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
    displayIndex !== null &&
    displayIndex >= 0 &&
    displayIndex < TIMELINE_MILESTONES.length
      ? TIMELINE_MILESTONES[displayIndex]
      : null;

  const tooltipX =
    displayIndex !== null && markerPositions[displayIndex] !== undefined
      ? markerPositions[displayIndex]
      : null;

  const safeTooltipX = useMemo(() => {
    if (tooltipX === null || width <= 0) return tooltipX;
    const safeHalf = tooltipWidth / 2 + TOOLTIP_EDGE_GUTTER;
    const minX = Math.min(safeHalf, width / 2);
    const maxX = Math.max(width - safeHalf, minX);
    return Math.max(minX, Math.min(tooltipX, maxX));
  }, [tooltipWidth, tooltipX, width]);

  const canvasTop = width < 500 ? 76 : 80;

  /* ── Interaction handlers ── */
  const focusMilestone = useCallback((index: number) => {
    clearIdleTimer();
    setOverrideIndex(index);
  }, [clearIdleTimer]);

  const dismissMilestone = useCallback(() => {
    startIdleTimer();
  }, [startIdleTimer]);

  return (
    <div
      ref={wrapperRef}
      className="relative mt-2 select-none pt-[76px] md:pt-[80px]"
      style={{ touchAction: "manipulation" }}
      role="group"
      aria-label="Career timeline"
      onMouseLeave={dismissMilestone}
      onPointerDown={(event) => {
        if (!(event.target as Element).closest("button")) dismissMilestone();
      }}
    >
      <canvas ref={canvasRef} data-timeline="true" className="block h-[90px] w-full md:h-[120px] bg-[#f5f2ee] will-change-transform" aria-hidden="true" />
      {markerPositions.map((position, index) => (
        <button
          key={TIMELINE_MILESTONES[index].id}
          type="button"
          aria-label={`Show ${TIMELINE_MILESTONES[index].year} milestone`}
          aria-describedby="timeline-tooltip"
          onMouseEnter={() => focusMilestone(index)}
          onFocus={() => focusMilestone(index)}
          onClick={(event) => {
            event.stopPropagation();
            focusMilestone(index);
          }}
          className="absolute z-10 size-11 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]"
          style={{ left: position, top: canvasTop + groundY }}
        />
      ))}
      <ul className="sr-only">
        {TIMELINE_MILESTONES.map((milestone) => (
          <li key={milestone.id}>{milestone.year}: {milestone.note}</li>
        ))}
      </ul>

      {/* ── Tooltip ── */}
      <AnimatePresence mode="wait" initial={false}>
        {currentMilestone && safeTooltipX !== null && (
          <motion.div
            key={`${currentMilestone.id}-${displayIndex}`}
            id="timeline-tooltip"
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
            <div
              className="rounded-[14px] bg-[#f5f2ee] px-[18px] py-3 shadow-[0_14px_32px_rgba(21,21,21,0.10)]"
            >
              <div className="mb-1.5 flex items-center gap-[7px]">
                <span className="block h-[7px] w-[7px] rounded-full bg-[#A43718]" />
                <span className="block font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  {currentMilestone.year}
                </span>
              </div>
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
