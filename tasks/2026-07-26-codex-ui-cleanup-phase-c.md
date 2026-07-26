# CODEX IMPLEMENTATION TASK

## Task ID

UI-CLEANUP-004

## Title

Phase C: SEO metadata foundation — metadataBase, Open Graph, Twitter cards, sitemap dates, stale copy

## Objective

Establish a proper SEO metadata foundation for the portfolio. Add `metadataBase` for canonical URL resolution, implement Open Graph and Twitter card metadata for social sharing, fix the sitemap to use stable build-time dates instead of `new Date()` on every build, and correct a remaining stale "fintech" reference in the case studies index.

## Product context

The portfolio is in a Perfect UI cleanup phase. The site has basic `title` and `description` metadata on most pages, but is missing the infrastructure that makes social sharing, search indexing, and link previews work correctly. Without `metadataBase`, Next.js cannot generate absolute URLs for canonical links or OG images. Without OG/Twitter tags, shared links on LinkedIn, Twitter/X, Slack, and iMessage render with no preview image, no description, and generic platform-generated titles.

## User story

As someone who receives a link to this portfolio on LinkedIn, Twitter/X, Slack, or iMessage, I see a rich preview with the site name, a descriptive title, a summary of what the portfolio is about, and a preview image — so I understand what I'm about to visit and feel confident clicking through.

## Scope

### 1. Add `metadataBase` to root layout

**File:** `src/app/layout.tsx`

Add `metadataBase` to the root `metadata` export. This tells Next.js how to resolve relative URLs for canonical links, Open Graph images, and sitemap entries.

```ts
metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mrchad.netlify.app"),
```

This should be the first property in the metadata object, before `title`.

### 2. Add Open Graph metadata to root layout

**File:** `src/app/layout.tsx`

Add an `openGraph` block to the root metadata export:

```ts
openGraph: {
  title: "Temi Adekunle — Product Design Portfolio",
  description: "Product designer who thinks in systems and delivers polished, intentional digital experiences.",
  url: "/",
  siteName: "Temi Adekunle",
  locale: "en_US",
  type: "website",
},
```

Notes:
- The `url` is relative to `metadataBase` — Next.js resolves it.
- No `images` property yet — see item 6 below for the social preview image question.
- Individual case study pages can override `openGraph.title` and `openGraph.description` via their existing `generateMetadata` if needed, but the root defaults should be correct for most routes.

### 3. Add Twitter card metadata to root layout

**File:** `src/app/layout.tsx`

Add a `twitter` block to the root metadata export:

```ts
twitter: {
  card: "summary_large_image",
  title: "Temi Adekunle — Product Design Portfolio",
  description: "Product designer who thinks in systems and delivers polished, intentional digital experiences.",
},
```

Notes:
- `summary_large_image` is the standard card type for portfolio/professional sites.
- Same situation as OG — no `images` property yet, but the structure is ready.

### 4. Fix sitemap dates

**File:** `src/app/sitemap.ts`

**Problem:** Every entry uses `new Date()`, which means the sitemap changes on every build even when no content changed. This wastes crawl budget and triggers unnecessary re-indexing.

**Fix:** Use a single stable date for the sitemap. Two options:

**Option A (preferred):** Use a hardcoded build date constant at the top of the file:
```ts
const BUILD_DATE = "2026-07-26";
```
Update this date manually when meaningful content changes are deployed. Simple, predictable, no runtime cost.

**Option B:** Use the git commit date of the build. This requires a build-time environment variable or a script that runs during `next build`. More automated but more complex.

Either approach is acceptable. Option A is recommended for a portfolio site with infrequent updates.

Also update the `lastModified` on each entry to use this stable date instead of `new Date()`.

### 5. Fix stale "fintech" in case studies index

**File:** `src/app/featured-case-studies/page.tsx` (line 11)

**Problem:** The metadata `description` and the visible subtitle both still say "fintech":

```ts
description:
  "A selection of recent work spanning productivity, communication, fintech, and developer tools.",
```

**Fix:** Update to match the current project categories. Based on `projects.ts`:
- Talent Platform (Credlane)
- Productivity (Travecs)
- Content Creation (Draftly)
- Developer Tools (Testground)
- Communication (Tidepool)

Suggested replacement:
```ts
description:
  "A selection of recent work spanning talent platforms, productivity, communication, and developer tools.",
```

Also update the visible subtitle on line 19 to match (it uses the same string).

### 6. Social preview image — decision required from Owner

**This item needs Owner input before implementation.** The metadata structure is ready for an `images` property on both `openGraph` and `twitter`, but the actual image file needs to be created or exported.

**Options:**

**A) Create a static social preview image:**
- Design a 1200×630px image (OG standard) with the portfolio branding.
- Save to `public/images/og-preview.png` (or `.webp`).
- Add to both `openGraph.images` and `twitter.images` in root metadata.
- Codex can wire up the metadata once the image exists.

**B) Use the site itself as the preview (dynamic OG):**
- Not recommended for a static export — requires a server to render OG images dynamically.
- Skip for now.

**C) Defer the image, wire up the metadata structure only:**
- Add the `openGraph` and `twitter` blocks without `images`.
- Social platforms will fall back to a generic preview.
- Add the image later when designed.

**Recommendation:** Option C for now. Wire the metadata structure in this task. The Owner designs or exports the social preview image separately, and Codex adds the `images` property in a follow-up task.

**Codex: implement everything except the `images` property. Note in your output that the social preview image is pending Owner delivery.**

## Out of scope

- Designing or creating the social preview image (Owner responsibility).
- Per-page `openGraph` overrides for individual case studies (their `generateMetadata` already provides title/description — OG will inherit from root).
- Structured data / JSON-LD (future enhancement, not part of this cleanup pass).
- Analytics or tracking scripts.
- Meta robots tags (the existing `robots.ts` already handles this correctly).
- RSS feed.
- Performance or accessibility changes.

## Dependencies

- Environment variable `NEXT_PUBLIC_SITE_URL` must be set in the deployment environment (already used by `robots.ts` and `sitemap.ts`).
- Social preview image does not block this task — metadata structure is wired without it.

## Design source

- Codex review finding P2-7 from `CODEX_REVIEW_DEFERRED.md`.
- Next.js Metadata API documentation.
- No Figma inspection required.

## Technical context

- Framework: Next.js App Router, React, TypeScript
- Root metadata is defined in `src/app/layout.tsx` as a static `Metadata` export.
- Individual pages override via `export const metadata` or `export async function generateMetadata`.
- `metadataBase` is required for Next.js to resolve relative URLs to absolute URLs in metadata.
- The site deploys to Netlify as a static export.
- OG image standard: 1200×630px, under 300KB recommended.

## Functional requirements

1. `metadataBase` is set in root layout, resolving to the production URL.
2. Open Graph metadata is present with title, description, siteName, locale, and type.
3. Twitter card metadata is present with card type, title, and description.
4. Sitemap uses stable dates instead of `new Date()` on every build.
5. Case studies index page no longer references "fintech".
6. Metadata structure is ready for social preview images (images property can be added later).
7. All existing page-level metadata continues to work correctly.

## Visual requirements

No visual changes on the rendered site. These changes affect:
- HTML `<head>` meta tags (viewable in browser DevTools).
- Social sharing previews (LinkedIn, Twitter/X, Slack, iMessage).
- Search engine result snippets.
- Sitemap.xml content.

## Interaction requirements

None.

## Responsive requirements

None. Metadata is head-level and breakpoint-independent.

## Accessibility requirements

No accessibility impact. Metadata is consumed by browsers, crawlers, and social platforms, not by assistive technology directly.

## Performance requirements

No performance impact. Metadata is static HTML in `<head>`.

## Likely files affected

- `src/app/layout.tsx` — metadataBase, openGraph, twitter blocks
- `src/app/sitemap.ts` — stable dates
- `src/app/featured-case-studies/page.tsx` — stale "fintech" copy in metadata and subtitle

## Acceptance criteria

- [ ] `metadataBase` is set in root layout and resolves to the production URL.
- [ ] `openGraph` block is present with title, description, siteName, locale, type.
- [ ] `twitter` block is present with card: "summary_large_image", title, description.
- [ ] Sitemap entries use stable dates, not `new Date()`.
- [ ] Case studies index metadata and subtitle no longer reference "fintech".
- [ ] Social preview image `images` property is NOT present (pending Owner delivery) — noted in output.
- [ ] View-source or DevTools confirms correct `<meta property="og:...">` and `<meta name="twitter:...">` tags.
- [ ] TypeScript passes: `npx tsc --noEmit`.
- [ ] Tests pass: `npx vitest run`.
- [ ] Production build passes: `npx next build`.
- [ ] `git diff --check` passes.

## Required tests

- All existing tests must continue to pass.
- No new tests required — metadata exports are static configuration, not runtime behavior.

## Verification method

After implementation, verify with:

1. **View-source** on the homepage: check `<head>` for `og:title`, `og:description`, `og:site_name`, `twitter:card`, `twitter:title`, `twitter:description`.
2. **Sitemap check:** `curl https://<preview-url>/sitemap.xml` — confirm dates are stable, not today's date on every entry.
3. **LinkedIn sharing debugger** or **Twitter CardValidator**: paste the preview URL and confirm the card renders with correct title and description.
4. **DevTools → Elements → <head>:** confirm `metadataBase` resolves `og:url` to an absolute URL.

## Required output

Return:

1. Implementation summary
2. Files changed
3. Exact metadata added (copy the object for owner review)
4. Sitemap date strategy used
5. Confirmation that "fintech" is removed from case studies index
6. Note that social preview image is pending Owner delivery
7. View-source verification instructions
8. Tests performed (tsc, vitest, build)
9. Any deviations or assumptions
10. Known limitations
