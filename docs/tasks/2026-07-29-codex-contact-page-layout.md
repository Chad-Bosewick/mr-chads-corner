# Codex Task: Contact Page — Left-Aligned Layout

## ID: CONTACT-LAYOUT-001
## Type: Layout refinement
## Priority: P1
## Dependencies: foundations branch (CV page changes already committed)
## Design reference: Contact page at `/contact`, aligned with `/about-temi` layout system

---

## Objective

Left-align the Contact page content to match the layout system established on the revised CV page. Currently the page wraps everything in `ReadingColumn` (centered 680px block), which creates a different visual baseline than the rest of the site. The content itself is correct — only the container and alignment need updating.

---

## Required Reading

1. **Current file:** `src/app/contact/page.tsx`
2. **Reference file:** `src/app/about-temi/page.tsx` — the CV page, which uses the target layout pattern (PageShell-wide with inline `max-w-[680px]` on text content)
3. **Layout primitives:** `src/components/layout/PageShell.tsx`

---

## Scope

### In scope

- Remove `ReadingColumn` wrapper from the contact page
- Replace `HeroHeading` usage with inline header markup styled consistently with the CV page hero
- Left-align all content to the `PageShell` grid edge
- Apply inline `max-w-[680px]` to the availability text paragraph (reading-width constraint where needed)
- Spacing adjustments to keep vertical rhythm intact after container change
- Build + type check pass

### Out of scope

- Content changes — email, social links, availability text all stay as-is
- Navigation changes — label and route stay `/contact`
- `HeroHeading` component itself — leave it unchanged, just stop importing it from this page
- Any other page on the site — this is scoped to contact only

---

## What to Change

### 1. `src/app/contact/page.tsx` — full rewrite

**Remove these imports:**
```tsx
import { HeroHeading } from "@/components/sections/HeroHeading";
import { ReadingColumn } from "@/components/layout/PageShell";
```

**Keep these imports (already present or add):**
```tsx
import { SectionReveal } from "@/components/sections/SectionReveal";
import { PageShell } from "@/components/layout/PageShell";
import type { Metadata } from "next";
```

**New heading markup — replace `<HeroHeading>` with inline header:**

The CV page at `/about-temi` uses this pattern for its hero heading:

```tsx
<h1 className="text-[clamp(2rem,5vw,3rem)] font-medium leading-[1.5] text-[#151515]">
  Contact
</h1>
<p className="mt-6 max-w-[680px] text-lg leading-relaxed text-[var(--color-text-muted)]">
  I&rsquo;m always open to thoughtful conversations about product strategy, design systems, and building things that matter.
</p>
```

Note the `mt-6` after the h1 and the `max-w-[680px]` on the subtitle — these are inline constraints, not a wrapping container.

**Spacing:**

Current page uses `mt-12` on each content section and `my-16` on the `<hr>`. These are fine and should be preserved, but the `ReadingColumn` removal means the sections now sit directly in `PageShell` at full width, which is the desired behaviour.

**Content section labels:**

Email label stays `font-sans text-sm uppercase tracking-wider text-[var(--color-text-muted)]`, the link stays `font-sans text-[clamp(1rem,2.5vw,1.125rem)] font-medium text-[#A43718]`.

Social links stay as an `<ul>` list. The `div.mt-12` wrappers are kept — only the container around *all* of them changes.

**Availability section:**

The `<hr>` keeps `my-16` above it. The text paragraph gets an inline `max-w-[680px]` constraint:

```tsx
<p className="max-w-[680px] font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
```

This keeps reading width on the prose without moving the left edge.

**Final structure should be:**

```tsx
export default function ContactPage() {
  return (
    <PageShell>

      {/* Heading */}
      <SectionReveal>
        <h1 className="text-[clamp(2rem,5vw,3rem)] font-medium leading-[1.5] text-[#151515]">
          Contact
        </h1>
        <p className="mt-6 max-w-[680px] text-lg leading-relaxed text-[var(--color-text-muted)]">
          I&rsquo;m always open to thoughtful conversations about product strategy, design systems, and building things that matter.
        </p>
      </SectionReveal>

      {/* Email */}
      <SectionReveal delay={80}>
        <div className="mt-12">
          <p className="font-sans text-sm uppercase tracking-wider text-[var(--color-text-muted)]">Email</p>
          <a
            href="mailto:Addtemi270@gmail.com"
            className="mt-2 inline-block font-sans text-[clamp(1rem,2.5vw,1.125rem)] font-medium text-[#A43718] transition-colors duration-[var(--duration-fast)] hover:text-[#A43718]"
          >
            Addtemi270@gmail.com
          </a>
        </div>
      </SectionReveal>

      {/* Social */}
      <SectionReveal delay={160}>
        <div className="mt-12">
          <p className="font-sans text-sm uppercase tracking-wider text-[var(--color-text-muted)]">Social</p>
          <ul className="mt-3 space-y-2">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-sans text-[clamp(0.875rem,2vw,1rem)] text-[#151515]/70 transition-colors duration-[var(--duration-fast)] hover:text-[#A43718]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </SectionReveal>

      {/* Availability */}
      <SectionReveal delay={240}>
        <hr className="my-16 border-[#151515]/10" />
        <p className="max-w-[680px] font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
          Currently open to freelance collaborations, product design leadership opportunities, and speaking engagements. Based in Lagos, working remotely with teams worldwide.
        </p>
      </SectionReveal>

    </PageShell>
  );
}
```

---

## Verification

1. Open `/contact` in the browser
2. The heading "Contact" should be left-aligned with the page edge, matching where "Temi Adekunle" sits on `/about-temi`
3. Email, Social links, and Availability should all share the same left baseline
4. The availability paragraph should be readable width (~680px) but left-aligned
5. Type check: `npx tsc --noEmit` passes
6. Build: `npx next build` passes

---

## Design Consistency Notes

- The CV page uses inline `max-w-[680px]` on individual text elements rather than wrapping them in `ReadingColumn`. Apply the same pattern here — the left edge stays with `PageShell`, and only the prose width is constrained
- Section spacing (`mt-12` between sections, `my-16` above the hr) stays as-is — these were already correct
- No need to change `SOCIAL_LINKS` data, metadata, or any link targets

---

## Delivery Format

After implementation, provide:
1. **Summary** of what changed and why
2. **Files changed** (expected: 1 file, `src/app/contact/page.tsx`)
3. **Preview instructions** — run the dev server and check `/contact`
4. **Confirmation** that the left edge matches `/about-temi`
