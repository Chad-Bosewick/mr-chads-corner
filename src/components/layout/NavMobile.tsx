"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavMobileProps {
  items: { href: string; label: string }[];
  currentPath: string;
  onClose: () => void;
}

export function NavMobile({ items, currentPath, onClose }: NavMobileProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const firstLink = overlayRef.current?.querySelector("a");
    firstLink?.focus();
  }, []);

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
    >
      <button
        className="absolute right-6 top-6"
        onClick={onClose}
        aria-label="Close navigation menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="none" stroke="#FFFFFF" stroke-width="1.5" />
          <path d="M8 8L16 16M16 8L8 16" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>

      <ul className="flex flex-col items-center gap-8">
        {items.map((item, index) => {
          const isActive = currentPath === item.href;
          return (
            <li
              key={item.href}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <Link
                href={item.href}
                className={cn(
                  "text-2xl font-medium transition-colors",
                  isActive
                    ? "text-[#757575]"
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
