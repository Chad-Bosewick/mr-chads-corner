# CODEX IMPLEMENTATION TASK

## Task ID

T-003

## Title

Make sitemap and robots domain-aware (QA Major)

## Objective

Replace the hardcoded `https://mrchad.netlify.app` URL in `sitemap.ts` and `robots.ts` with a configurable base URL, defaulting to a sensible production value but allowing environment-specific overrides.

## Product context

Both `sitemap.ts` and `robots.ts` currently hardcode `https://mrchad.netlify.app`. This means preview deploys, branch deploys, or a future custom domain will all reference the wrong URL in sitemap and robots — creating incorrect SEO signals.

## User story

As a deployer, I want sitemap and robots to automatically reference the correct deployment domain so crawlers always index the right URLs.

## Scope

- Modify `src/app/sitemap.ts`
- Modify `src/app/robots.ts`
- Use `process.env.NEXT_PUBLIC_SITE_URL` with a fallback to a sensible default
- The default should be configurable at build time

## Out of scope

- Adding a CMS or environment-config system
- Changing any other route or component
- SEO enhancements beyond the domain fix

## Technical context

- Both files have `export const dynamic = "force-static"` (required for static export)
- Static export evaluates env vars at build time — so `process.env.NEXT_PUBLIC_SITE_URL` is resolved during `npm run build`
- Netlify sets `process.env.URL` or `process.env.DEPLOY_PRIME_URL` automatically, but these are Netlify-specific — let's use a generic NEXT_PUBLIC_ prefix for framework-agnostic compatibility

## Approach

```typescript
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mrchad.netlify.app";
```

This keeps the existing URL as the production default while allowing any deploy to override via env var. For Netlify, the user would set `NEXT_PUBLIC_SITE_URL` in the Netlify UI, or it can be set in `netlify.toml`.

## Functional requirements

1. `process.env.NEXT_PUBLIC_SITE_URL` must be used as the base URL when set
2. Fall back to `https://mrchad.netlify.app` when the env var is not set
3. Both `sitemap.ts` and `robots.ts` must use the same base URL
4. Static export must still work (env vars resolved at build time)

## Acceptance criteria

- [ ] Build with `NEXT_PUBLIC_SITE_URL` set generates sitemap with that URL
- [ ] Build without `NEXT_PUBLIC_SITE_URL` generates sitemap with `https://mrchad.netlify.app`
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

## Likely files affected

- Modify: `src/app/sitemap.ts`
- Modify: `src/app/robots.ts`

## Required output

Return:

1. implementation summary
2. files changed
3. test showing both env-var-present and fallback cases
4. confirmation build, lint pass
