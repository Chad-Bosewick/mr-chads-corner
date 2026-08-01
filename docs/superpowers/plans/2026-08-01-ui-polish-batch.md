# UI Polish Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship seven small, independent product-polish items — timeline tooltip copy, a sliding carousel indicator, a breathing availability dot + footer email label, session-only interest-card hearts, a mailto ice-breaker contact form, and a looping ASCII wordmark scribble.

**Architecture:** All six files are leaf components or content data. No shared state, no new dependencies, no routing or content-model changes. Each task is self-contained and independently testable. The one substantial build (Task 6) reuses the project's existing canvas-ASCII pattern (`FooterAscii`, the hero unravel shader): a 15fps rAF loop, `MAX_DPR = 2`, IntersectionObserver gating, and a static fallback under `prefers-reduced-motion`.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind 4, `motion/react`, Vitest + Testing Library, `@/` path alias → `src/`.

## Global Constraints

- No new dependencies anywhere.
- Every new animation must be disabled under `prefers-reduced-motion` (static fallback).
- All interactive targets stay ≥ 44×44px; visible focus rings on all interactive elements.
- No layout shift from any change (only opacity/transform animates).
- The site is a **static Next.js export** (`next build` → `out/`, Netlify). There is no backend — the contact form must compose a `mailto:` URL.
- The footer wordmark animation is decorative: `aria-hidden`, and reduced-motion / no-JS users get the existing static "Temi Adekunle" wordmark.
- Tests run via `npm test` (vitest run). Follow the existing test conventions in `src/components/case-study/CarouselImage.test.tsx` (mock `next/image` and `@/hooks/useReducedMotion`).
- Commit after each task. **Never stage** `tsconfig.tsbuildinfo`, `next-env.d.ts`, or the repo's other pre-existing untracked files.

---

### Task 1: Timeline tooltip copy

**Files:**
- Modify: `src/content/timeline.ts:18`
- Test: `src/content/timeline.test.ts` (new)

**Interfaces:**
- Consumes: nothing — pure data.
- Produces: unchanged `TIMELINE_MILESTONES` export shape. No other file changes (the tooltip canvas, sr-only list, and `TimelineHero` all read this file).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { TIMELINE_MILESTONES } from "./timeline";

describe("TIMELINE_MILESTONES", () => {
  it("uses consistent, grammatically correct notes", () => {
    const h2 = TIMELINE_MILESTONES.find((m) => m.year === "H2 2023");
    expect(h2?.note).toBe(
      "Completed the Google UX Design Certificate and built my design foundation.",
    );
    const y2024 = TIMELINE_MILESTONES.find((m) => m.year === "2024");
    expect(y2024?.note).toBe(
      "Became an HNG Design Finalist and proved I could grow quickly.",
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/content/timeline.test.ts`
Expected: FAIL — H2 2023 note currently starts with "Later in 2023, ".

- [ ] **Step 3: Trim the redundant date prefix**

In `src/content/timeline.ts`, change line 18 from:

```ts
    note: "Later in 2023, completed the Google UX Design Certificate and built my design foundation.",
```

to:

```ts
    note: "Completed the Google UX Design Certificate and built my design foundation.",
```

Do **not** touch the 2024 note — "Became an HNG Design Finalist and proved I could grow quickly." is already correct ("an HNG" follows the spoken vowel sound; the year is already in the `year` label, matching the other four notes).

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/content/timeline.test.ts`
Expected: PASS (both assertions).

- [ ] **Step 5: Commit**

```bash
git add src/content/timeline.ts src/content/timeline.test.ts
git commit -m "fix: trim redundant date prefix in H2 2023 timeline note"
```

---

### Task 2: Carousel sliding pill indicator

**Files:**
- Modify: `src/components/case-study/CarouselImage.tsx`
- Test: `src/components/case-study/CarouselImage.test.tsx`

**Interfaces:**
- Consumes: `CarouselImage` props and the existing `activeIndex`, `goTo`, `prefersReducedMotion` state (unchanged).
- Produces: a decorative `.carousel-pill` element whose inline `transform` is `translateY(-50%) translateX(Npx)` where `N = activeIndex * DOT_SPACING + DOT_PILL_OFFSET`. Later tasks don't depend on it, but the test asserts this exact format.

- [ ] **Step 1: Add the spacing constants**

Near the other constants at the top of `CarouselImage.tsx` (after `DEFAULT_AUTO_ADVANCE_MS`):

```ts
/* Dot indicator track — each dot button is 24px wide with an 8px gap (gap-2). */
const DOT_SPACING = 32;   // center-to-center distance between dots
const DOT_PILL_OFFSET = 2; // keeps the 20px pill centered on the 24px dot button
```

- [ ] **Step 2: Write the failing tests**

Add these two tests to `CarouselImage.test.tsx` (inside the existing `describe("CarouselImage")`, using the existing `slides` fixture):

```ts
it("slides a single active pill to the current dot", () => {
  const { container } = render(<CarouselImage slides={slides} heading="Workflow" />);
  const pill = container.querySelector(".carousel-pill") as HTMLElement;
  expect(pill).not.toBeNull();
  expect(pill.style.transform).toContain("translateX(2px)");

  fireEvent.click(screen.getByLabelText("Next slide"));
  expect(pill.style.transform).toContain("translateX(34px)");

  fireEvent.click(screen.getByLabelText("Next slide"));
  expect(pill.style.transform).toContain("translateX(66px)");
});

it("renders the pill without sliding under reduced motion", () => {
  motionPreference.reduced = true;
  const { container } = render(<CarouselImage slides={slides} heading="Workflow" />);
  const pill = container.querySelector(".carousel-pill") as HTMLElement;
  expect(pill).toHaveClass("transition-none");
  expect(pill.style.transform).toContain("translateX(2px)");
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- src/components/case-study/CarouselImage.test.tsx`
Expected: FAIL — `.carousel-pill` not found.

- [ ] **Step 4: Replace the width-morph dots with the sliding pill**

In `CarouselImage.tsx`, replace the entire dot-indicator block (currently the `{/* Dot indicators */}` `<div className="flex items-center gap-2">…` containing the per-dot `span` that morphs `w-2`→`w-5`) with:

```tsx
{/* Dot indicators — a single pill slides between equal dots */}
<div
  className="relative flex"
  style={{ width: `${slides.length * DOT_SPACING}px` }}
>
  <div className="flex items-center">
    {slides.map((_, i) => (
      <button
        key={i}
        onClick={() => goTo(i, i >= activeIndex ? "next" : "prev")}
        className="group flex h-11 w-6 items-center justify-center rounded-sm"
        aria-label={`Go to slide ${i + 1}`}
        aria-current={i === activeIndex ? "true" : undefined}
      >
        <span
          className="h-2 w-2 rounded-full bg-[#151515]/20 transition-colors duration-[var(--duration-fast)] group-hover:bg-[#151515]/40"
        />
      </button>
    ))}
  </div>
  <span
    aria-hidden="true"
    className={cn(
      "carousel-pill pointer-events-none absolute top-1/2 h-2 w-5 rounded-full bg-[#151515]",
      prefersReducedMotion
        ? "transition-none"
        : "transition-transform duration-[500ms] ease-[var(--ease-fluid)]",
    )}
    style={{
      transform: `translateY(-50%) translateX(${
        activeIndex * DOT_SPACING + DOT_PILL_OFFSET
      }px)`,
    }}
  />
</div>
```

Keep the `className` on the wrapper minimal — do not reintroduce `gap-2` on the outer `div`; the spacing is now explicit via `DOT_SPACING`. The pill width `w-5` (20px) matches the old active dot width, and every dot button keeps its `h-11 w-6` (44×24px) target.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- src/components/case-study/CarouselImage.test.tsx`
Expected: PASS — all existing tests plus the two new ones. (Existing tests query slide divs and arrow buttons; they do not depend on the removed dot `<span>` classes.)

- [ ] **Step 6: Commit**

```bash
git add src/components/case-study/CarouselImage.tsx src/components/case-study/CarouselImage.test.tsx
git commit -m "feat: slide active carousel indicator pill between dots"
```

---

### Task 3: Footer availability dot breathe + email label

**Files:**
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/styles/globals.css`

**Interfaces:**
- Consumes: nothing.
- Produces: the `.animate-availability-breathe` CSS class; the footer `SOCIAL_LINKS[0].label` becomes `"Email"` (href unchanged).

- [ ] **Step 1: Add the breathing keyframe + class**

In `src/styles/globals.css`, after the existing `@keyframes fade-in-up { … }` block (around line 124), add:

```css
@keyframes availability-breathe {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 1; }
}
```

Inside the existing `@media (prefers-reduced-motion: no-preference)` block (after the `.animate-fade-in-up` rule, ~line 135), add:

```css
  .animate-availability-breathe {
    animation: availability-breathe 2.8s ease-in-out infinite;
  }
```

Because the class is only defined inside the `no-preference` media block, reduced-motion and no-JS users see a static dot with no extra CSS needed.

- [ ] **Step 2: Apply the class to the availability dot**

In `src/components/layout/Footer.tsx`, on the status-dot `<span>` (currently `className="size-2 rounded-full bg-[#48B36A] shadow-[0_0_0_4px_rgba(72,179,106,0.12)]"`), append `animate-availability-breathe`:

```tsx
<span
  className="animate-availability-breathe size-2 rounded-full bg-[#48B36A] shadow-[0_0_0_4px_rgba(72,179,106,0.12)]"
  aria-hidden="true"
/>
```

- [ ] **Step 3: Change the footer email link label**

In `src/components/layout/Footer.tsx`, in the `SOCIAL_LINKS` array, change the first entry:

```ts
{
  label: "Email",
  href: "mailto:Addtemi270@gmail.com",
},
```

The `href` and the `mailto:` behavior are unchanged; the footer list now reads **Email · LinkedIn · Dribbble · Download CV**. (The `key` on the `<li>` is `link.label`, now `"Email"` — still unique.)

- [ ] **Step 4: Verify**

Run: `npm run typecheck` and `npm run lint`.
Expected: both pass. There is no unit test for the footer (it renders canvas components); validate manually per Task 6's validation section and in the browser later.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Footer.tsx src/styles/globals.css
git commit -m "feat: breathe footer availability dot; label email link as Email"
```

---

### Task 4: Interest-card hearts (session like)

**Files:**
- Modify: `src/components/sections/InterestCard.tsx`
- Modify: `src/styles/globals.css`
- Test: `src/components/sections/InterestCard.test.tsx` (new)

**Interfaces:**
- Consumes: existing `InterestItem` interface (unchanged), `useReducedMotion`.
- Produces: `InterestCard` still accepts `{ interest, className }` and renders one card. A heart button (sibling of the card body button) toggles local `liked` state and reports it via `aria-pressed`.

- [ ] **Step 1: Add the heart-pop keyframe**

In `src/styles/globals.css`, after the `availability-breathe` keyframes (from Task 3), add:

```css
@keyframes heart-pop {
  0% { transform: scale(1); }
  45% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
```

Inside the `@media (prefers-reduced-motion: no-preference)` block, add:

```css
  .animate-heart-pop {
    animation: heart-pop 0.35s var(--ease-out);
  }
```

- [ ] **Step 2: Write the failing tests**

Create `src/components/sections/InterestCard.test.tsx`:

```tsx
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InterestCard, type InterestItem } from "./InterestCard";

const motionPreference = vi.hoisted(() => ({ reduced: false }));

vi.mock("next/image", () => ({
  default: ({ fill: _fill, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={alt ?? ""} />
  ),
}));

vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => motionPreference.reduced,
}));

const interest: InterestItem = {
  category: "Education",
  emoji: "🎓",
  items: ["University of Lagos", "Google UX Design (Coursera)"],
  imageSrc: "/images/interests/education.jpg",
  alt: "Shelves of books in a warmly lit library",
};

describe("InterestCard", () => {
  it("toggles the heart without opening the popover", () => {
    render(<InterestCard interest={interest} />);

    const heart = screen.getByRole("button", { name: /Like this interest/ });
    const card = screen.getByRole("button", { name: /Education:/ });

    expect(heart).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(heart);
    expect(heart).toHaveAttribute("aria-pressed", "true");
    expect(card).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(heart);
    expect(heart).toHaveAttribute("aria-pressed", "false");
  });

  it("keeps the popover toggle independent from the heart", () => {
    render(<InterestCard interest={interest} />);

    const heart = screen.getByRole("button", { name: /Like this interest/ });
    const card = screen.getByRole("button", { name: /Education:/ });

    fireEvent.click(card);
    expect(card).toHaveAttribute("aria-expanded", "true");
    expect(heart).toHaveAttribute("aria-pressed", "false");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- src/components/sections/InterestCard.test.tsx`
Expected: FAIL — the current card renders a single button (the heart `getByRole` finds nothing / no `aria-pressed`).

- [ ] **Step 4: Restructure the card**

Rewrite `src/components/sections/InterestCard.tsx`:

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface InterestItem {
  category: string;
  emoji: string;
  items: string[];
  imageSrc: string;
  alt: string;
}

interface InterestCardProps {
  interest: InterestItem;
  className?: string;
}

const HEART_PATH =
  "M12 20.3s-7.3-4.6-9.3-9.4C1.3 7.4 3.4 4.3 6.6 4.3c2 0 3.6 1.1 4.4 2.6.8-1.5 2.4-2.6 4.4-2.6 3.2 0 5.3 3.1 3.9 6.6-2 4.8-9.3 9.4-9.3 9.4z";

export function InterestCard({ interest, className }: InterestCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const gradId = `interest-heart-${interest.category.toLowerCase().replace(/\s+/g, "-")}`;
  const label = `${interest.category}: ${interest.items.join(", ")}`;

  return (
    <div className={cn("relative", className)}>
      {/* Card body — expands the item popover */}
      <button
        type="button"
        className={cn(
          "group relative block w-full overflow-hidden rounded-2xl bg-[#151515] text-left ring-1 ring-black/10",
          "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]",
          "active:scale-[0.96] transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out)]",
          !imageLoaded && !imageError && "animate-pulse",
        )}
        style={{ aspectRatio: "4 / 3" }}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={label}
      >
        {!imageError && (
          <Image
            src={interest.imageSrc}
            alt={interest.alt}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className={cn(
              "object-cover",
              prefersReducedMotion
                ? "transition-opacity duration-[var(--duration-standard)] ease-[var(--ease-out)]"
                : "transition-[transform,opacity] duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0",
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent group-hover:from-black/90",
            "transition-opacity duration-[var(--duration-standard)] ease-[var(--ease-out)]",
            !prefersReducedMotion && "group-hover:opacity-100",
          )}
        />

        {imageError && (
          <span className="absolute inset-0 flex items-center justify-center text-5xl" aria-hidden="true">
            {interest.emoji}
          </span>
        )}

        <span className="absolute inset-x-0 bottom-0 p-4 font-sans text-base font-medium text-[#f5f2ee]">
          {interest.emoji} {interest.category}
        </span>

        <span
          className={cn(
            "pointer-events-none absolute inset-x-4 bottom-4 z-[3] rounded-xl bg-black/65 p-3 text-sm font-medium text-[#f5f2ee] backdrop-blur-sm",
            "transition-[opacity,transform] duration-[var(--duration-standard)] ease-[var(--ease-out)]",
            "translate-y-1 opacity-0",
            isOpen && "translate-y-0 opacity-100",
            !isOpen && !prefersReducedMotion && "group-hover:translate-y-0 group-hover:opacity-100",
          )}
        >
          {interest.emoji} {interest.items.join(" · ")}
        </span>
      </button>

      {/* Like heart — sibling of the card button, never opens the popover */}
      <button
        type="button"
        onClick={() => setLiked((value) => !value)}
        aria-pressed={liked}
        aria-label={`Like this interest: ${interest.items.join(", ")}`}
        className={cn(
          "absolute right-2 top-2 z-[2] flex h-11 w-11 items-center justify-center rounded-full",
          "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]",
          "transition-colors duration-[var(--duration-fast)]",
          liked ? "text-[#A43718]" : "text-[#f5f2ee]",
        )}
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill={liked ? `url(#${gradId})` : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
          aria-hidden="true"
          className={cn("transition-transform", liked && !prefersReducedMotion && "animate-heart-pop")}
        >
          <path d={HEART_PATH} />
        </svg>
      </button>

      {/* Gradient fill for the liked state — unique id per card */}
      <svg className="absolute size-0" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A43718" />
            <stop offset="100%" stopColor="#E3855B" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
```

Key points: the heart is a **sibling** of the card-body button (never nested, so no invalid HTML and no click bubbling into the popover). The heart sits `absolute right-2 top-2 z-[2]` above the button. State is local `useState` → session-only; reloading resets it (per spec D5 — no fabricated aggregate numbers).

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- src/components/sections/InterestCard.test.tsx`
Expected: PASS. Then `npm run typecheck` — ensure `next/image`'s `fill` prop typing still resolves (the test mocks it; the component itself is unchanged in that regard).

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/InterestCard.tsx src/components/sections/InterestCard.test.tsx src/styles/globals.css
git commit -m "feat: add session-only like heart to interest cards"
```

---

### Task 5: Contact ice-breaker form (mailto)

**Files:**
- Create: `src/components/contact/ContactForm.tsx`
- Test: `src/components/contact/ContactForm.test.tsx` (new)
- Modify: `src/app/contact/page.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `buildMailtoUrl(name: string, role: string, message: string): string` (exported, pure) and a `ContactForm` client component with fields `name`, `role`, `message` and a submit handler that sets `window.location.href` to the composed URL.

- [ ] **Step 1: Write the failing tests**

Create `src/components/contact/ContactForm.test.tsx`:

```ts
import { describe, expect, it } from "vitest";
import { buildMailtoUrl } from "./ContactForm";

describe("buildMailtoUrl", () => {
  it("composes a name — role subject and a message body", () => {
    const url = buildMailtoUrl("Temi", "Designer", "Hello there");
    expect(url.startsWith("mailto:Addtemi270@gmail.com?")).toBe(true);
    const params = new URLSearchParams(url.split("?")[1]);
    expect(params.get("subject")).toBe("Temi — Designer");
    expect(params.get("body")).toBe("Hello there");
  });

  it("omits the role from the subject when empty", () => {
    const url = buildMailtoUrl("Temi", "", "Hi");
    const params = new URLSearchParams(url.split("?")[1]);
    expect(params.get("subject")).toBe("Temi");
  });

  it("preserves line breaks in the body", () => {
    const url = buildMailtoUrl("Temi", "Founder", "Line one\nLine two");
    const params = new URLSearchParams(url.split("?")[1]);
    expect(params.get("body")).toBe("Line one\nLine two");
  });

  it("trims the name before composing", () => {
    const url = buildMailtoUrl("  Temi  ", "Founder", "Hi");
    const params = new URLSearchParams(url.split("?")[1]);
    expect(params.get("subject")).toBe("Temi — Founder");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/contact/ContactForm.test.tsx`
Expected: FAIL — module not found (`buildMailtoUrl` undefined).

- [ ] **Step 3: Create the ContactForm component**

Create `src/components/contact/ContactForm.tsx`:

```tsx
"use client";

import { useState } from "react";

const MAX_MESSAGE_LENGTH = 600;
const EMAIL = "Addtemi270@gmail.com";

export function buildMailtoUrl(name: string, role: string, message: string): string {
  const subject = [name.trim(), role.trim()].filter(Boolean).join(" — ");
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

const fieldClass =
  "mt-2 w-full min-h-11 rounded-lg border border-[#151515]/15 bg-white px-4 font-sans text-[#151515] outline-none transition-colors focus-visible:border-[#A43718] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]";
const labelClass =
  "font-sans text-sm uppercase tracking-wider text-[var(--color-text-muted)]";

export function ContactForm() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName) {
      setError("Please add your name.");
      return;
    }
    if (!trimmedMessage) {
      setError("Please write a short message.");
      return;
    }
    setError("");
    window.location.href = buildMailtoUrl(trimmedName, role, trimmedMessage);
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Contact form"
      className="mt-12 max-w-[680px] space-y-6"
    >
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          autoComplete="name"
          className={fieldClass}
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="contact-role" className={labelClass}>
          Role
        </label>
        <input
          id="contact-role"
          type="text"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          autoComplete="organization-title"
          className={fieldClass}
          placeholder="Designer, Founder, Student…"
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="contact-message" className={labelClass}>
            Message
          </label>
          <span className="font-sans text-xs tabular-nums text-[var(--color-text-muted)]">
            {message.length}/{MAX_MESSAGE_LENGTH}
          </span>
        </div>
        <textarea
          id="contact-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          rows={5}
          maxLength={MAX_MESSAGE_LENGTH}
          className={`${fieldClass} resize-y`}
          placeholder="A quick hello and why you're reaching out…"
        />
      </div>

      {error && (
        <p role="alert" className="font-sans text-sm text-[#A43718]">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#151515] px-7 font-sans text-[#f5f2ee] transition-colors duration-[var(--duration-fast)] hover:bg-[#A43718] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]"
      >
        Send message
      </button>

      <p className="font-sans text-sm text-[var(--color-text-muted)]">
        This opens your email app with your message ready to send.
      </p>
    </form>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/components/contact/ContactForm.test.tsx`
Expected: PASS.

- [ ] **Step 5: Wire the form into the contact page**

In `src/app/contact/page.tsx`:

1. Add the import: `import { ContactForm } from "@/components/contact/ContactForm";`
2. Delete the `SOCIAL_LINKS` const (lines 23–32).
3. Delete the Email section and the Social section (the two `SectionReveal` blocks that render the email `<a>` and the social `<ul>`).
4. After the hero `SectionReveal`, insert the form inside its own reveal:

```tsx
      {/* Ice-breaker form */}
      <SectionReveal delay={80}>
        <ContactForm />
      </SectionReveal>
```

5. Keep the existing availability paragraph at the bottom (its `SectionReveal delay` can stay `240`). The page must not render any email or social link under the form — the footer remains the single home for contact links (spec G).

- [ ] **Step 6: Verify the page**

Run: `npm run typecheck` and `npm run lint`.
Expected: both pass — no unused imports/vars remain (`DESCRIPTION` is still used by metadata; `SectionReveal`, `PageShell`, `Metadata` all still used).

- [ ] **Step 7: Commit**

```bash
git add src/components/contact/ContactForm.tsx src/components/contact/ContactForm.test.tsx src/app/contact/page.tsx
git commit -m "feat: replace contact page links with mailto ice-breaker form"
```

---

### Task 6: Footer wordmark ASCII scribble

**Files:**
- Modify: `src/components/layout/FooterAsciiBrand.tsx`
- Test: `src/components/layout/FooterAsciiBrand.test.tsx` (new)

**Interfaces:**
- Consumes: `useReducedMotion` (project hook), `WORDMARK_ID` for the reduced-motion SVG.
- Produces: a client component `FooterAsciiBrand` that renders the existing static "Temi Adekunle" SVG for reduced-motion / no-JS, and a `<canvas>` for everyone else. Exports nothing new.

- [ ] **Step 1: Write the failing tests**

Create `src/components/layout/FooterAsciiBrand.test.tsx`:

```tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FooterAsciiBrand } from "./FooterAsciiBrand";

const motionPreference = vi.hoisted(() => ({ reduced: false }));

vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => motionPreference.reduced,
}));

describe("FooterAsciiBrand", () => {
  beforeEach(() => {
    motionPreference.reduced = false;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
    // jsdom has no canvas 2d context; the component must guard with getContext null check.
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as never;
  });

  it("renders the static wordmark under reduced motion", () => {
    motionPreference.reduced = true;
    render(<FooterAsciiBrand />);
    expect(screen.getByText("Temi Adekunle")).toBeInTheDocument();
  });

  it("renders a canvas wordmark when motion is allowed", () => {
    render(<FooterAsciiBrand />);
    expect(document.querySelector("canvas")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/layout/FooterAsciiBrand.test.tsx`
Expected: FAIL — the current component is a server component with no hooks and renders `<text>Temi Adekunle</text>` unconditionally (so the second test fails: no canvas, and `getByText` works but there's no motion-aware branch).

- [ ] **Step 3: Rewrite as a canvas ASCII scribble**

Replace the entire contents of `src/components/layout/FooterAsciiBrand.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const WORDMARK_ID = "footer-wordmark-dots";
const WORDMARK_A = "Temi Adekunle";
const WORDMARK_B = "Chad Bosewick";

const CELL = 6;                 // sampling grid cell size (px)
const FRAME_INTERVAL = 1000 / 15;
const MAX_DPR = 2;
const HOLD_MS = 2500;           // hold a name
const MORPH_MS = 1200;          // scribble between names
const CYCLE_MS = 2 * (HOLD_MS + MORPH_MS);
const PARTICLE_CAP = 600;

const FONT_ADVANCE = 0.62;      // avg em advance for the weighted sans-serif
const TARGET_WIDTH = 0.92;      // name spans ~92% of the band width

interface Vec {
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  ax: Vec | null;   // anchor in "Temi Adekunle"
  bx: Vec | null;   // anchor in "Chad Bosewick"
  phase: number;    // deterministic stagger 0..1
}

type Phase = "holdA" | "morphAB" | "holdB" | "morphBA";

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Rasterize a name into the set of occupied grid-cell indices. */
function sampleCells(name: string, w: number, h: number): Set<number> {
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const octx = off.getContext("2d");
  if (!octx) return new Set();

  const fontSize = Math.min(h * 0.85, (w * TARGET_WIDTH) / (name.length * FONT_ADVANCE));
  octx.clearRect(0, 0, w, h);
  octx.fillStyle = "#fff";
  octx.font = `600 ${fontSize}px Arial, Helvetica, sans-serif`;
  octx.textAlign = "center";
  octx.textBaseline = "middle";
  octx.fillText(name, w / 2, h / 2);

  const data = octx.getImageData(0, 0, w, h).data;
  const cols = Math.ceil(w / CELL);
  const rows = Math.ceil(h / CELL);
  const cells = new Set<number>();
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const px = Math.min(w - 1, Math.floor(cx * CELL + CELL / 2));
      const py = Math.min(h - 1, Math.floor(cy * CELL + CELL / 2));
      if (data[(py * w + px) * 4 + 3] > 128) cells.add(cy * cols + cx);
    }
  }
  return cells;
}

/** Where a particle should sit, and how visible it is, for the current phase. */
function particleTarget(
  p: Particle,
  phase: Phase,
  t: number,
  now: number,
): { x: number; y: number; alpha: number } | null {
  if (phase === "holdA" || phase === "holdB") {
    const visible = phase === "holdA" ? p.ax : p.bx;
    if (!visible) return null;
    return {
      x: visible.x + Math.sin(now * 0.001 + p.phase * Math.PI * 2) * 1.5,
      y: visible.y + Math.cos(now * 0.0013 + p.phase * Math.PI * 2),
      alpha: 1,
    };
  }

  const movingToB = phase === "morphAB";
  const from = movingToB ? p.ax : p.bx;
  const to = movingToB ? p.bx : p.ax;
  if (!from && !to) return null;

  const progress = easeInOutCubic(
    Math.max(0, Math.min(1, t * 1.3 - p.phase * 0.3)),
  );

  if (from && to) {
    const wobble = Math.sin(now * 0.015 + p.phase * Math.PI * 2) * 2.5 * progress;
    return {
      x: from.x + (to.x - from.x) * progress + wobble,
      y: from.y + (to.y - from.y) * progress,
      alpha: 1,
    };
  }
  if (to) {
    const appear = easeInOutCubic(
      Math.max(0, Math.min(1, (t - 0.45) * 2 - p.phase * 0.2)),
    );
    return { x: to.x, y: to.y, alpha: appear };
  }
  const vanish = easeInOutCubic(
    Math.max(0, Math.min(1, t * 2 + p.phase * 0.2)),
  );
  return { x: from!.x, y: from!.y, alpha: 1 - vanish };
}

/** The static dot-matrix SVG wordmark (reduced motion / no-JS). */
function StaticWordmark() {
  return (
    <svg
      viewBox="0 0 1120 340"
      className="block w-full text-white/[0.16]"
      role="presentation"
    >
      <defs>
        <pattern
          id={WORDMARK_ID}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="3" cy="3" r="0.9" fill="currentColor" />
        </pattern>
        <mask
          id={`${WORDMARK_ID}-mask`}
          x="0"
          y="0"
          width="1120"
          height="340"
          maskUnits="userSpaceOnUse"
        >
          <text
            x="560"
            y="270"
            textAnchor="middle"
            textLength="1092"
            lengthAdjust="spacingAndGlyphs"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="210"
            fontWeight="600"
            letterSpacing="-12"
            fill="white"
          >
            {WORDMARK_A}
          </text>
        </mask>
      </defs>
      <rect
        width="1120"
        height="340"
        fill={`url(#${WORDMARK_ID})`}
        mask={`url(#${WORDMARK_ID}-mask)`}
      />
    </svg>
  );
}

export function FooterAsciiBrand() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return; // jsdom / unsupported environments

    let particles: Particle[] = [];
    let rafId = 0;
    let lastFrame = 0;
    let disposed = false;
    let inView = false;

    function build(w: number, h: number) {
      const cols = Math.ceil(w / CELL);
      const rows = Math.ceil(h / CELL);
      const cellsA = sampleCells(WORDMARK_A, w, h);
      const cellsB = sampleCells(WORDMARK_B, w, h);
      if (cellsA.size === 0 && cellsB.size === 0) return;

      const all = new Set<number>([...cellsA, ...cellsB]);
      const list = [...all];
      const step = Math.max(1, Math.ceil(list.length / PARTICLE_CAP));
      particles = [];
      for (let i = 0; i < list.length; i += step) {
        const idx = list[i];
        const cx = (idx % cols) * CELL + CELL / 2;
        const cy = Math.floor(idx / cols) * CELL + CELL / 2;
        particles.push({
          x: cx,
          y: cy,
          ax: cellsA.has(idx) ? { x: cx, y: cy } : null,
          bx: cellsB.has(idx) ? { x: cx, y: cy } : null,
          phase: ((i * 7) % 100) / 100,
        });
      }
    }

    function resize() {
      const rect = wrapper.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.ceil(w * dpr);
      canvas.height = Math.ceil(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build(w, h);
    }

    function draw(now: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!inView || particles.length === 0) return;

      const pos = now % CYCLE_MS;
      let phase: Phase;
      let t = 0;
      if (pos < HOLD_MS) {
        phase = "holdA";
      } else if (pos < HOLD_MS + MORPH_MS) {
        phase = "morphAB";
        t = (pos - HOLD_MS) / MORPH_MS;
      } else if (pos < 2 * HOLD_MS + MORPH_MS) {
        phase = "holdB";
      } else {
        phase = "morphBA";
        t = (pos - (2 * HOLD_MS + MORPH_MS)) / MORPH_MS;
      }

      ctx.fillStyle = "rgba(245, 242, 238, 1)";
      ctx.font = "4px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (const p of particles) {
        const r = particleTarget(p, phase, t, now);
        if (!r) continue;
        ctx.globalAlpha = 0.16 * r.alpha;
        ctx.fillText("·", r.x, r.y);
      }
      ctx.globalAlpha = 1;
    }

    function tick(ts: number) {
      if (disposed) return;
      if (ts - lastFrame >= FRAME_INTERVAL) {
        lastFrame = ts;
        draw(ts);
      }
      rafId = requestAnimationFrame(tick);
    }

    resize();

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          lastFrame = performance.now();
          rafId = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0 },
    );
    io.observe(wrapper);

    const ro = new ResizeObserver(() => resize());
    ro.observe(wrapper);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
    };
  }, [prefersReducedMotion]);

  const showCanvas = mounted && !prefersReducedMotion;

  return (
    <div
      className="mt-14 h-[clamp(6.5rem,21vw,15rem)] overflow-hidden"
      aria-hidden="true"
    >
      {showCanvas ? (
        <div ref={wrapperRef} className="h-full w-full">
          <canvas ref={canvasRef} className="block h-full w-full" />
        </div>
      ) : (
        <StaticWordmark />
      )}
    </div>
  );
}
```

Notes for the implementer:
- The `aria-hidden` wrapper and the `mt-14 h-[clamp(...)]` sizing are preserved exactly, so layout is unchanged.
- `mounted` guards against a hydration mismatch: first render (SSR / no-JS) is the static SVG; the canvas only appears after mount when motion is allowed.
- `particleTarget` handles hold vs. morph, appear/disappear for particles that only exist in one name, and the scribble wobble. Reduced-motion users never reach the canvas effect.
- The static SVG is byte-for-byte the previous component's output (`Temi Adekunle`), so reduced-motion / no-JS is unchanged (spec D4).

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/components/layout/FooterAsciiBrand.test.tsx`
Expected: PASS.

- [ ] **Step 5: Verify build integrity**

Run: `npm run typecheck`, `npm run lint`, `npm run build`.
Expected: all pass. The canvas component is rendered inside the already-client `Footer`; Next static export will render the static SVG for the initial HTML.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/FooterAsciiBrand.tsx src/components/layout/FooterAsciiBrand.test.tsx
git commit -m "feat: loop footer wordmark ascii scribble Temi Adekunle <-> Chad Bosewick"
```

---

## Post-plan verification

- [ ] Run the full suite: `npm test` — all suites pass.
- [ ] Run `npm run typecheck` and `npm run lint` — clean.
- [ ] Browser QA at 375px and 1440px, plus `prefers-reduced-motion` emulation, per spec §9 Validation:
  - Hover/advance the timeline — H2 2023 tooltip reads "Completed the Google UX Design Certificate and built my design foundation."
  - Click carousel dots + arrows + keyboard — the pill slides between equal dots; `aria-current` tracks the active slide.
  - Footer — the dot breathes on a ~2.8s cycle; the wordmark scribbles between the two names and pauses when the footer is off screen; link list reads Email · LinkedIn · Dribbble · Download CV.
  - About page — liking an interest card fills the heart (0→1), doesn't open the popover; the popover still works.
  - Contact page — the form submits a correctly composed mailto draft; no email/social link under the form; availability paragraph remains.
  - Reduced-motion — static dot, static "Temi Adekunle" wordmark, pill snaps, heart fills without the pop.
- [ ] Hand to **ChatGPT** for independent QA per the project pipeline (stage 7).
