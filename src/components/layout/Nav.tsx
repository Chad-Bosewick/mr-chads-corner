"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavMobile } from "./NavMobile";
import { ContentRail } from "./PageShell";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/featured-case-studies", label: "Featured case studies" },
  { href: "/about-temi", label: "About Temi" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const lastActiveElement = useRef<Element | null>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Save and restore focus when menu opens/closes
  useEffect(() => {
    if (isMobileOpen) {
      lastActiveElement.current = document.activeElement;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Restore focus to the hamburger button when menu closes
      if (lastActiveElement.current instanceof HTMLElement) {
        lastActiveElement.current.focus();
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const openMenu = useCallback(() => {
    setIsMobileOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  return (
    <>
      <nav
        className="relative z-10 pt-10"
        aria-label="Main navigation"
      >
        <ContentRail className="flex items-center justify-end">
          {/* Desktop navigation */}
          <ul className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative inline-block pb-1 font-sans text-base font-medium transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                      isActive
                        ? "text-[#A43718]"
                        : "text-[#151515] hover:text-[#A43718]"
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

          {/* Mobile hamburger — minimum 44x44 hit area */}
          <button
            ref={hamburgerRef}
            className="flex items-center justify-center p-3 md:hidden"
            onClick={openMenu}
            aria-label="Open navigation menu"
            aria-expanded={isMobileOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="6" width="18" height="1.5" rx="0.75" fill="#151515" />
              <rect x="3" y="11.25" width="18" height="1.5" rx="0.75" fill="#151515" />
              <rect x="3" y="16.5" width="18" height="1.5" rx="0.75" fill="#151515" />
            </svg>
          </button>
        </ContentRail>
      </nav>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <NavMobile
          items={NAV_ITEMS}
          currentPath={pathname}
          onClose={closeMenu}
        />
      )}
    </>
  );
}
