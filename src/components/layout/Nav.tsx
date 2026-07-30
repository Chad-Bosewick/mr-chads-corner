"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavMobile } from "./NavMobile";
import { ContentRail } from "./PageShell";

const NAV_ITEMS = [
  { href: "/featured-case-studies", label: "Featured case studies" },
  { href: "/about-temi", label: "About Temi" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const lastActiveElement = useRef<Element | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsScrolled(!entry.isIntersecting);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

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
      <div ref={sentinelRef} className="-mb-px h-px" aria-hidden="true" />
      <nav
        className={cn(
          "sticky top-0 z-40 py-3 transition-colors duration-[var(--duration-standard)] ease-[var(--ease-out)] md:py-4",
          isScrolled && "bg-[#f5f2ee]/80 backdrop-blur-md",
        )}
        aria-label="Main navigation"
      >
        <ContentRail className="flex items-center justify-between">
          <Link
            href="/"
            className="-m-1 rounded-lg p-1 transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]"
            aria-label="Temi Adekunle — home"
          >
            <Image
              src="/images/social/mr chad.png"
              alt=""
              width={28}
              height={28}
              priority
              className="size-7 rounded object-cover"
            />
          </Link>

          {/* Desktop navigation */}
          <ul className="hidden items-center gap-6 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-block font-sans text-base font-medium transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                      isActive
                        ? "text-[#A43718]"
                        : "text-[#151515] hover:text-[#A43718]"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile hamburger — minimum 44x44 hit area */}
          <button
            ref={hamburgerRef}
            className="-mr-3 flex items-center justify-center p-3 md:hidden"
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
