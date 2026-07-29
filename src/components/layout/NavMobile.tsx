"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavMobileProps {
  items: { href: string; label: string }[];
  currentPath: string;
  onClose: () => void;
}

/** Select all focusable elements within a container */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )
  );
}

export function NavMobile({ items, currentPath, onClose }: NavMobileProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Focus the first link on mount
  useEffect(() => {
    const firstLink = overlayRef.current?.querySelector("a");
    firstLink?.focus();
  }, []);

  // Trap focus within the dialog
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && overlayRef.current) {
        const focusable = getFocusableElements(overlayRef.current);
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  // Close on backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-label="Navigation menu"
      aria-modal="true"
      className="animate-slide-in-left fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: '#0F0F0F',
        backgroundImage: 'url(/menu-bg-mobile.webp)',
        backgroundRepeat: 'repeat',
        backgroundSize: 'cover',
      }}
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
    >
      {/* Close button — p-3 ensures ≥44×44 hit area around the 24×24 icon */}
      <button
        className="absolute right-6 top-6 flex items-center justify-center p-3"
        onClick={onClose}
        aria-label="Close navigation menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M8 8L16 16M16 8L8 16" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <ul className="flex flex-col items-center gap-8">
        {items.map((item, index) => {
          const isActive = currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href));
          return (
            <li
              key={item.href}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <Link
                href={item.href}
                className={cn(
                  "inline-block px-4 py-3 font-sans text-2xl font-medium transition-colors",
                  isActive
                    ? "text-white/60"
                    : "text-[#FFFFFF] hover:text-[#A43718]"
                )}
                aria-current={isActive ? "page" : undefined}
                onClick={onClose}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
