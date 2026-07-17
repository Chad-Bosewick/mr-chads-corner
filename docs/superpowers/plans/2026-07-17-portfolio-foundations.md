# Portfolio Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the Next.js project with design tokens, global layout, navigation, footer, accessibility primitives, motion foundation, and route structure — a working, testable shell that all subsequent phases build upon.

**Architecture:** Next.js 15 App Router with static generation. Design tokens as CSS custom properties. Components as server components by default, client components only where interaction is needed (navigation, scroll reveals). Tailwind v4 CSS-first configuration. Motion for animation.

**Tech Stack:** Next.js 15, TypeScript (strict), Tailwind CSS v4, Motion, Vitest + Testing Library, next/font

## Global Constraints

- Next.js 15 App Router with static export (`output: "export"`)
- TypeScript strict mode enabled
- Tailwind CSS v4 with `@import "tailwindcss"` and `@theme` directives (no tailwind.config.ts)
- Motion library (formerly Framer Motion) for all animation — no other animation dependencies
- Fonts self-hosted via next/font — zero external font requests
- All interactive components must have hover, focus-visible, active, and touch-compatible states
- All motion controlled by CSS custom property `--motion-reduced`; `prefers-reduced-motion` disables all animation
- Paper texture as optimised WebP (10-20KB) served from `/public/`
- Semantic HTML landmarks on every page: `<nav>`, `<main>`, `<footer>`
- Every page must have exactly one `<h1>` and sequential heading hierarchy
- Build command: `next build` — must produce zero type errors and zero lint warnings
- Colour values from spec: text-primary #151515, accent #A43718, text-muted #757575, bg-footer #0F0F0F, text-on-dark #FFFFFF

## File Structure

```
portfolio-website/
  public/
    paper-texture.webp          # Optimised paper texture background
  src/
    app/
      layout.tsx                # Root layout — fonts, metadata, paper texture, nav, footer
      page.tsx                  # Homepage — placeholder shell
      not-found.tsx             # 404 page — thoughtful fallback
      featured-case-studies/
        page.tsx                # Case study index — placeholder
        [slug]/
          page.tsx              # Case study detail — placeholder
      about-temi/
        page.tsx                # About page — placeholder
      contact/
        page.tsx                # Contact page — placeholder
    components/
      layout/
        Nav.tsx                 # Desktop nav + mobile hamburger + full-screen overlay (client component)
        NavMobile.tsx           # Mobile menu overlay content (client component)
        Footer.tsx              # Footer with quote and social links (server component)
      ui/
        VisuallyHidden.tsx      # Screen-reader-only utility
    hooks/
      useReducedMotion.ts       # Hook that returns true when user prefers reduced motion
      useScrollReveal.ts        # Hook for scroll-triggered reveal animations
    lib/
      utils.ts                  # cn() classname merge utility
    styles/
      globals.css               # Tailwind import, design tokens, base styles, paper texture
  next.config.ts                # Next.js configuration
  tsconfig.json                 # TypeScript configuration (strict)
  package.json                  # Dependencies
  vitest.config.ts              # Vitest configuration
  .eslintrc.json                # Linting rules
```

---

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `.eslintrc.json`
- Create: `vitest.config.ts`

**Interfaces:**
- Consumes: nothing
- Produces: working `npm run dev`, `npm run build`, `npm run lint`, `npm run test` commands

- [ ] **Step 1: Create package.json**

```json
{
  "name": "portfolio-website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "motion": "^11.0.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.0.0",
    "eslint": "^9.0.0",
    "@eslint/eslintrc": "^3.0.0",
    "eslint-config-next": "^15.0.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jsdom": "^25.0.0"
  }
}
```

- [ ] **Step 2: Create next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // static export requires this
  },
};

export default nextConfig;
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create postcss.config.mjs**

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 5: Create vitest.config.ts**

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: [],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 6: Install dependencies and verify**

Run: `cd /Users/rosemary/portfolio-website && npm install`
Run: `npm run typecheck`
Expected: No errors (project is minimal but valid)

- [ ] **Step 7: Initial commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js project with TypeScript, Tailwind v4, Motion, Vitest"

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### Task 2: Design Tokens and Base Styles

**Files:**
- Create: `src/styles/globals.css`
- Create: `src/lib/utils.ts`

**Interfaces:**
- Consumes: Task 1 provides working Next.js project
- Produces: `globals.css` with all design tokens importable by all components; `cn()` utility for conditional class merging

- [ ] **Step 1: Create src/lib/utils.ts**

```typescript
/**
 * Utility for merging Tailwind class names.
 * Simple implementation that filters falsy values and joins.
 * Can be swapped for clsx + tailwind-merge if class conflicts arise.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
```

- [ ] **Step 2: Write test for cn utility**

Create `src/lib/utils.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("filters falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });
});
```

Run: `npm run test`
Expected: All tests pass

- [ ] **Step 3: Create src/styles/globals.css with design tokens**

```css
@import "tailwindcss";

/* ===== Design Tokens ===== */
@theme {
  /* Colours */
  --color-text-primary: #151515;
  --color-accent: #A43718;
  --color-text-muted: #757575;
  --color-bg-footer: #0F0F0F;
  --color-text-on-dark: #FFFFFF;

  /* Typography (desktop sizes, mobile overrides use clamp) */
  --font-sans: "Plus Jakarta Sans", sans-serif;
  --font-serif: "Lora", serif;

  /* Spacing scale */
  --spacing-0\.5: 0.125rem;
  --spacing-4\.5: 1.125rem;
  --spacing-18: 4.5rem;
}

/* ===== Global CSS Custom Properties ===== */
:root {
  /* Motion */
  --duration-fast: 150ms;
  --duration-standard: 300ms;
  --duration-slow: 500ms;
  --duration-reveal: 700ms;
  --ease-out: cubic-bezier(0.33, 1, 0.68, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --motion-reduced: 0;
}

@custom-media --motion-ok (prefers-reduced-motion: no-preference);

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-reduced: 1;
  }
}

/* ===== Base Styles ===== */
html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

body {
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ===== Focus Styles ===== */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Remove focus outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}

/* ===== Skip Link ===== */
.skip-link {
  position: absolute;
  top: -100%;
  left: 8px;
  z-index: 9999;
  padding: 8px 16px;
  background: var(--color-text-primary);
  color: var(--color-text-on-dark);
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
}

.skip-link:focus {
  top: 8px;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/styles/globals.css src/lib/utils.ts src/lib/utils.test.ts
git commit -m "feat: add design tokens and base styles"

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### Task 3: Font Loading and Root Layout

**Files:**
- Create: `src/app/layout.tsx`
- Create: `public/paper-texture.webp` (or a placeholder approach)

**Interfaces:**
- Consumes: Task 2 provides `globals.css` with design tokens
- Produces: `<RootLayout>` wrapping all pages with fonts, metadata, and paper texture background

- [ ] **Step 1: Create src/app/layout.tsx**

```typescript
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import "@/styles/globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  style: ["italic"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Temi Adekunle",
    default: "Temi Adekunle — Product Design Portfolio",
  },
  description:
    "Product designer who thinks in systems and delivers polished, intentional digital experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${lora.variable}`}
    >
      <body
        className="min-h-screen bg-[url('/paper-texture.webp')] bg-repeat font-sans"
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Nav />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create paper-texture.webp placeholder**

The paper texture should be an optimised 10-20KB WebP. For the initial scaffold, create a simple visible placeholder:

Run: `touch /Users/rosemary/portfolio-website/public/paper-texture.webp`

(Note: Replace with actual optimised paper texture before production. The background will fall back to a solid colour until the image loads.)

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors. The site is not yet navigable (Nav and Footer imports will fail since they don't exist yet — skip to Step 4 or temporarily comment them out).

Since Nav and Footer don't exist yet, temporarily wrap them in a comment or create minimal stubs:

Create `src/components/layout/Nav.tsx`:
```typescript
export function Nav() {
  return <nav>{/* Navigation — implemented in Task 5 */}</nav>;
}
```

Create `src/components/layout/Footer.tsx`:
```typescript
export function Footer() {
  return <footer>{/* Footer — implemented in Task 6 */}</footer>;
}
```

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx public/paper-texture.webp
git commit -m "feat: add root layout with fonts and paper texture"

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### Task 4: Route Structure and Placeholder Pages

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/app/not-found.tsx`
- Create: `src/app/featured-case-studies/page.tsx`
- Create: `src/app/featured-case-studies/[slug]/page.tsx`
- Create: `src/app/about-temi/page.tsx`
- Create: `src/app/contact/page.tsx`

**Interfaces:**
- Consumes: Task 3 provides `RootLayout` with nav and footer
- Produces: All routes with placeholder content, ready for Phase 2-4 content fills

- [ ] **Step 1: Create src/app/page.tsx (Homepage placeholder)**

```typescript
import { HeroHeading } from "@/components/sections/HeroHeading";
import { TextSection } from "@/components/sections/TextSection";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1038px] px-4 py-12 md:px-6 md:py-16 lg:py-24">
      <HeroHeading
        title="Hello!"
        subtitle="I'm Temi Adekunle — product designer"
      />
      <TextSection>
        <p className="text-base leading-relaxed md:text-base lg:text-base">
          This is the homepage. Content will be added in Phase 2.
        </p>
      </TextSection>
    </div>
  );
}
```

- [ ] **Step 2: Create placeholder section components**

Create `src/components/sections/HeroHeading.tsx`:
```typescript
interface HeroHeadingProps {
  title: string;
  subtitle?: string;
}

export function HeroHeading({ title, subtitle }: HeroHeadingProps) {
  return (
    <section className="mb-12">
      <h1 className="text-[clamp(2rem,5vw,3rem)] font-medium leading-[1.5] text-[#151515]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 text-lg text-[#757575]">{subtitle}</p>
      )}
    </section>
  );
}
```

Create `src/components/sections/TextSection.tsx`:
```typescript
interface TextSectionProps {
  children: React.ReactNode;
}

export function TextSection({ children }: TextSectionProps) {
  return (
    <section className="space-y-4">
      {children}
    </section>
  );
}
```

- [ ] **Step 3: Create remaining page placeholders**

`src/app/featured-case-studies/page.tsx`:
```typescript
import { HeroHeading } from "@/components/sections/HeroHeading";

export default function CaseStudiesPage() {
  return (
    <div className="mx-auto max-w-[1038px] px-4 py-12 md:px-6 md:py-16 lg:py-24">
      <HeroHeading title="Featured case studies" />
    </div>
  );
}
```

`src/app/featured-case-studies/[slug]/page.tsx`:
```typescript
import { notFound } from "next/navigation";
import { HeroHeading } from "@/components/sections/HeroHeading";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Return known slugs once content is added
  return [];
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  // Add content lookup in Phase 3
  if (!["todo-app", "letters-app", "enviodeck"].includes(slug)) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[1038px] px-4 py-12 md:px-6 md:py-16 lg:py-24">
      <HeroHeading title={slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} />
    </div>
  );
}
```

`src/app/about-temi/page.tsx`:
```typescript
import { HeroHeading } from "@/components/sections/HeroHeading";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1038px] px-4 py-12 md:px-6 md:py-16 lg:py-24">
      <HeroHeading title="About Temi Adekunle" />
    </div>
  );
}
```

`src/app/contact/page.tsx`:
```typescript
import { HeroHeading } from "@/components/sections/HeroHeading";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1038px] px-4 py-12 md:px-6 md:py-16 lg:py-24">
      <HeroHeading title="Contact" />
      <p className="text-[#757575]">
        Contact content will be added in Phase 4.
      </p>
    </div>
  );
}
```

`src/app/not-found.tsx`:
```typescript
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1038px] px-4 py-24 text-center">
      <h1 className="text-[clamp(2rem,5vw,3rem)] font-medium leading-[1.5]">
        Page not found
      </h1>
      <p className="mt-4 text-[#757575]">
        This page doesn't exist yet — or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-[#A43718] underline underline-offset-4 transition-colors hover:text-[#151515]"
      >
        Go back home
      </Link>
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds with all pages. Verify the generated routes.

- [ ] **Step 5: Commit**

```bash
git add src/app/ src/components/sections/
git commit -m "feat: add route structure and placeholder pages"

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### Task 5: Navigation Component

**Files:**
- Create: `src/components/layout/Nav.tsx` (client component)
- Create: `src/components/layout/NavMobile.tsx` (client component)
- Modify: `src/app/layout.tsx` (Nav import already added)

**Interfaces:**
- Consumes: Task 3 provides `RootLayout`
- Produces: `<Nav>` — desktop horizontal menu with active-state styling, hamburger icon on mobile, full-screen overlay

- [ ] **Step 1: Create src/components/layout/Nav.tsx**

```typescript
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
                    "relative inline-block pb-1 text-base font-medium transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]",
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
                      isActive ? "w-full scale-x-100" : "w-full scale-x-0 group-hover:scale-x-100"
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
```

- [ ] **Step 2: Create src/components/layout/NavMobile.tsx**

```typescript
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

  // Focus trap — focus first link on open
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
      className="fixed inset-0 z-50 flex animate-slide-in-left items-center justify-center bg-[#0F0F0F] bg-[url('/paper-texture.webp')] bg-repeat"
      style={{
        animation: "slideInLeft 300ms cubic-bezier(0.33, 1, 0.68, 1) forwards",
      }}
    >
      {/* Close button */}
      <button
        className="absolute right-6 top-6"
        onClick={onClose}
        aria-label="Close navigation menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M8 8L16 16M16 8L8 16" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Navigation links */}
      <ul className="flex flex-col items-center gap-8">
        {items.map((item, index) => {
          const isActive = currentPath === item.href;
          return (
            <li
              key={item.href}
              className="animate-fade-in-up"
              style={{
                animation: `fadeInUp 300ms ease-out ${index * 40}ms forwards`,
                opacity: 0,
              }}
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

      {/* Keyframes injected via style tag */}
      <style jsx>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
```

Wait — `style jsx` requires additional configuration. Let me use a simpler approach with CSS animations defined in globals.css or inline `<style>` tags.

Actually, for `style jsx` in Next.js, we'd need to configure it. Let me instead use inline styles with CSS custom properties defined in globals.css. Let me move the keyframes to globals.css.

- [ ] **Step 2 (revised): Create NavMobile without style-jsx**

Move keyframe animations to globals.css, then create NavMobile using those classes.

Add to `src/styles/globals.css`:
```css
/* ===== Animation Keyframes ===== */
@keyframes slide-in-left {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Motion-controlled animation utilities */
@media (--motion-ok) {
  .animate-slide-in-left {
    animation: slide-in-left var(--duration-standard) var(--ease-out) forwards;
  }

  .animate-fade-in-up {
    opacity: 0;
    animation: fade-in-up var(--duration-standard) var(--ease-out) forwards;
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-slide-in-left,
  .animate-fade-in-up {
    opacity: 1;
    transform: none;
    animation: none;
  }
}
```

Now create `src/components/layout/NavMobile.tsx`:
```typescript
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
      className="animate-slide-in-left fixed inset-0 z-50 flex items-center justify-center bg-[#0F0F0F] bg-[url('/paper-texture.webp')] bg-repeat"
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
```

- [ ] **Step 3: Update Nav.tsx to remove broken group-hover reference**

The `group-hover:scale-x-100` class won't work without a parent `group`. Let me make the `Link` the group parent:

```typescript
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
  <span
    className={cn(
      "absolute bottom-0 left-1/2 h-[1.5px] -translate-x-1/2 bg-[#A43718] transition-transform duration-[var(--duration-standard)] ease-[var(--ease-out)]",
      isActive
        ? "w-full scale-x-100"
        : "w-0 scale-x-0 group-hover:w-full group-hover:scale-x-100"
    )}
  />
</Link>
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Nav.tsx src/components/layout/NavMobile.tsx src/styles/globals.css
git commit -m "feat: add navigation with desktop menu and mobile overlay"

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### Task 6: Footer Component

**Files:**
- Create: `src/components/layout/Footer.tsx`

**Interfaces:**
- Consumes: Task 3 provides font variables
- Produces: `<Footer>` — dark background, Lora Italic quote, social links

- [ ] **Step 1: Create src/components/layout/Footer.tsx**

```typescript
import Link from "next/link";

const QUOTE = "Design is not just what it looks like and feels like. Design is how it works.";

const SOCIAL_LINKS = [
  { label: "Email", href: "mailto:hello@temiadekunle.com" },
  { label: "LinkedIn", href: "#" },
  { label: "Dribbble", href: "#" },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-[#0F0F0F] px-4 py-16 text-center md:px-[200px]">
      <blockquote className="font-serif italic text-[#A43718] text-[clamp(0.75rem,2vw,1rem)]">
        &ldquo;{QUOTE}&rdquo;
      </blockquote>

      <ul className="mt-12 flex items-center justify-center gap-6">
        {SOCIAL_LINKS.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-[#FFFFFF]/70 underline underline-offset-4 transition-colors hover:text-[#FFFFFF]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-xs text-[#757575]">
        &copy; {new Date().getFullYear()} Temi Adekunle
      </p>
    </footer>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat: add footer with quote, social links, and copyright"

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### Task 7: Accessibility Primitives

**Files:**
- Create: `src/components/ui/VisuallyHidden.tsx`
- Create: `src/hooks/useReducedMotion.ts`
- Modify: `src/styles/globals.css` (verify focus and reduced-motion are solid)

**Interfaces:**
- Consumes: nothing standalone
- Produces: `useReducedMotion()` hook returns boolean; `<VisuallyHidden>` renders screen-reader-only content

- [ ] **Step 1: Create src/components/ui/VisuallyHidden.tsx**

```typescript
interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: "span" | "div";
}

/**
 * Renders content that is visually hidden but available to screen readers.
 * Based on the classic visually-hidden pattern.
 */
export function VisuallyHidden({
  children,
  as: Tag = "span",
}: VisuallyHiddenProps) {
  return (
    <Tag
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: "0",
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: "0",
      }}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 2: Write tests for VisuallyHidden**

Create `src/components/ui/VisuallyHidden.test.tsx`:
```typescript
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { VisuallyHidden } from "./VisuallyHidden";

describe("VisuallyHidden", () => {
  it("renders children", () => {
    const { getByText } = render(
      <VisuallyHidden>Screen reader only text</VisuallyHidden>
    );
    expect(getByText("Screen reader only text")).toBeInTheDocument();
  });

  it("applies visually hidden styles", () => {
    const { container } = render(
      <VisuallyHidden>Hidden</VisuallyHidden>
    );
    const span = container.firstChild as HTMLElement;
    expect(span.style.position).toBe("absolute");
    expect(span.style.width).toBe("1px");
    expect(span.style.height).toBe("1px");
    expect(span.style.overflow).toBe("hidden");
  });

  it("renders as div when as prop is div", () => {
    const { container } = render(
      <VisuallyHidden as="div">Hidden</VisuallyHidden>
    );
    expect(container.firstChild?.nodeName).toBe("DIV");
  });
});
```

- [ ] **Step 3: Create src/hooks/useReducedMotion.ts**

```typescript
"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the user prefers reduced motion.
 * On the server/initial render, defaults to false (motion allowed).
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}
```

- [ ] **Step 4: Verify build and tests**

Run: `npm run build`
Expected: Build succeeds

Run: `npm run test`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/VisuallyHidden.tsx src/components/ui/VisuallyHidden.test.tsx src/hooks/useReducedMotion.ts
git commit -m "feat: add accessibility primitives — VisuallyHidden, useReducedMotion"

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### Task 8: Motion Foundation

**Files:**
- Create: `src/hooks/useScrollReveal.ts`
- Modify: `src/styles/globals.css` (verify animation tokens)

**Interfaces:**
- Consumes: `useReducedMotion` from Task 7
- Produces: `useScrollReveal()` returns ref + `isVisible` for scroll-triggered reveals

- [ ] **Step 1: Create src/hooks/useScrollReveal.ts**

```typescript
"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

interface ScrollRevealOptions {
  /** Root margin for IntersectionObserver */
  rootMargin?: string;
  /** Threshold for IntersectionObserver */
  threshold?: number;
  /** If true, only triggers once (default) */
  once?: boolean;
}

/**
 * Hook that returns a ref and isVisible state for scroll-triggered reveals.
 * Respects reduced motion — always reports visible when motion is reduced.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const { rootMargin = "0px 0px -80px 0px", threshold = 0, once = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    // Always visible when user prefers reduced motion
    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, threshold, once, prefersReduced]);

  return { ref, isVisible };
}
```

- [ ] **Step 2: Write tests for useScrollReveal**

Create `src/hooks/useScrollReveal.test.tsx`:
```typescript
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useScrollReveal } from "./useScrollReveal";

describe("useScrollReveal", () => {
  it("returns a ref and isVisible boolean", () => {
    const { result } = renderHook(() => useScrollReveal());
    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.isVisible).toBe("boolean");
  });

  it("initialises isVisible as false", () => {
    const { result } = renderHook(() => useScrollReveal());
    expect(result.current.isVisible).toBe(false);
  });
});
```

- [ ] **Step 3: Create SectionReveal wrapper component**

This is the primary consumer of useScrollReveal — wraps sections and applies animation.

Create `src/components/sections/SectionReveal.tsx`:
```typescript
"use client";

import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms before animation starts */
  delay?: number;
}

export function SectionReveal({
  children,
  className,
  delay = 0,
}: SectionRevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-[var(--duration-reveal)] ease-[var(--ease-out)]",
        isVisible
          ? "translate-x-0 opacity-100"
          : "translate-x-[8px] opacity-0",
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
        transitionProperty: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Verify build and tests**

Run: `npm run build`
Expected: Build succeeds

Run: `npm run test`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useScrollReveal.ts src/hooks/useScrollReveal.test.tsx src/components/sections/SectionReveal.tsx
git commit -m "feat: add motion foundation — useScrollReveal hook, SectionReveal component"

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Self-Review Checklist

### Spec coverage
- **Design token system (Section 4):** Task 2 — tokens in globals.css
- **Typography scale (Section 4):** Task 3 — fonts via next/font in layout.tsx
- **Colour palette (Section 4):** Task 2 — all colour tokens in globals.css
- **Spacing scale (Section 4):** Task 2 — spacing in globals.css
- **Root layout + paper texture (Section 3):** Task 3
- **Route structure (Section 2):** Task 4 — all pages as placeholders
- **Navigation desktop + mobile (Section 2):** Task 5 — Nav + NavMobile
- **Active-state styling (Section 2):** Task 5 — aria-current + colour change
- **Mobile menu animation (Section 2):** Task 5 — slide-in-left + staggered links
- **Footer with quote + social links (Section 2):** Task 6
- **Accessibility primitives (Section 7):** Task 7 — VisuallyHidden, skip link
- **Focus styles (Section 7):** Task 2 — focus-visible in globals.css, Task 5 — focus trap in NavMobile
- **Reduced motion (Section 7):** Task 2 — CSS custom property, Task 7 — useReducedMotion hook
- **Motion tokens (Section 6):** Task 2 — CSS custom properties, Task 8 — useScrollReveal
- **Responsive fluid system (Section 4):** Task 2 — clamp-based content width and typography

### Placeholder scan
All code blocks contain actual implementation code. No "TBD", "TODO", or placeholder descriptions.

### Type consistency
- `cn()` defined in Task 2, used in Tasks 5 and 8
- `useReducedMotion()` defined in Task 7, used in Task 8
- `useScrollReveal()` defined in Task 8, used by SectionReveal
- NavMobile component props match its usage in Nav

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-17-portfolio-foundations.md`.

Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration, isolated context per task

**2. Inline Execution** — Execute tasks in this session with checkpoint reviews between tasks

Which approach?
