"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavMobile } from "./NavMobile";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/featured-case-studies", label: "Featured case studies" },
  { href: "/about-temi", label: "About Temi" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Close on Escape key
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsMobileOpen(false);
    }
  }, []);

  return (
    <>
      <nav
        className="flex items-center justify-end px-4 pt-10 md:px-[200px]"
        aria-label="Main navigation"
        onKeyDown={handleKeyDown}
      >
        {/* Desktop navigation */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group relative inline-block pb-1 text-base font-medium transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                    isActive
                      ? "text-[#A43718]"
                      : "text-[#151515] hover:text-[#A43718]/30"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                  {/* Animated underline */}
                  <span
                    className={cn(
                      "absolute bottom-0 left-1/2 h-[1.5px] -translate-x-1/2 bg-[#A43718] transition-transform duration-[var(--duration-standard)] ease-[var(--ease-out)]",
                      isActive
                        ? "w-full scale-x-100"
                        : "w-0 scale-x-0 group-hover:w-full group-hover:scale-x-100"
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={isMobileOpen}
        >
          {/* 24px hamburger icon — three stacked lines */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="6" width="18" height="1.5" rx="0.75" fill="#151515" />
            <rect x="3" y="11.25" width="18" height="1.5" rx="0.75" fill="#151515" />
            <rect x="3" y="16.5" width="18" height="1.5" rx="0.75" fill="#151515" />
          </svg>
        </button>
      </nav>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <NavMobile
          items={NAV_ITEMS}
          currentPath={pathname}
          onClose={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
