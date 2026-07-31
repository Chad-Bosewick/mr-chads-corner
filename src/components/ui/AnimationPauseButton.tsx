"use client";

interface AnimationPauseButtonProps {
  isPaused: boolean;
  onToggle: () => void;
  label?: string;
  className?: string;
}

/** A compact, accessible control for visitor-controlled looping animation. */
export function AnimationPauseButton({
  isPaused,
  onToggle,
  label = "animation",
  className,
}: AnimationPauseButtonProps) {
  const action = isPaused ? "Resume" : "Pause";

  return (
    <button
      type="button"
      onClick={(e) => {
        // This button sometimes sits inside a card-level <Link>. Stop the
        // click from bubbling so pausing never triggers navigation.
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      aria-label={`${action} ${label}`}
      aria-pressed={isPaused}
      className={`flex h-8 w-8 items-center justify-center rounded-full border border-[#151515]/10 bg-white/80 text-[#151515] shadow-sm backdrop-blur-sm transition-[background-color,color,transform] duration-[var(--duration-fast)] hover:bg-white active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718] motion-reduce:transition-none ${className ?? ""}`}
    >
      {isPaused ? (
        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 2.9a1 1 0 0 1 1.52-.86l7.2 4.48a1.75 1.75 0 0 1 0 2.96l-7.2 4.48A1 1 0 0 1 4 13.1V2.9Z" />
        </svg>
      ) : (
        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 3.5A1.5 1.5 0 0 1 5.5 2h.75a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 12.5v-9Zm4.25 0A1.5 1.5 0 0 1 9.75 2h.75A1.5 1.5 0 0 1 12 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-.75a1.5 1.5 0 0 1-1.5-1.5v-9Z" />
        </svg>
      )}
    </button>
  );
}
