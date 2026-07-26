# CODEX IMPLEMENTATION TASK

## Task ID

T-010

## Title

Remove personal social links from Footer and Contact page

## Objective

Remove Instagram and Twitter/X from the social links in the Footer and Contact page. Keep only professional links (LinkedIn, Dribbble, Behance) and email.

## Product context

Professional portfolio websites should only link to professional platforms. Instagram and Twitter/X are personal social networks that don't add credibility for a product design portfolio. A senior stakeholder (the user's former boss) flagged this as inappropriate for professional identification.

## User story

As a hiring manager or potential client visiting the portfolio, I should only see professional platforms (LinkedIn, Dribbble, Behance) so the site feels like a professional credential — not a personal social hub.

## Scope

- Remove Instagram and Twitter/X from `src/components/layout/Footer.tsx` SOCIAL_LINKS
- Update `src/app/contact/page.tsx` SOCIAL_LINKS to match (no Instagram/Twitter/X)
- Ensure the remaining links (LinkedIn, Dribbble, Behance) are in a sensible order

## Out of scope

- Removing email (stays)
- Removing any links from the PDF that weren't yet added (Medium, resume, etc.)
- Changing the component structure or styling

## Design source

- User's former boss feedback: personal social links don't belong on a professional portfolio
- The PDF contained: Instagram, LinkedIn, Dribbble, Twitter/X, Behance
- Keep: LinkedIn (professional networking), Dribbble (design portfolio), Behance (design portfolio)
- Remove: Instagram (personal), Twitter/X (personal)

## Technical context

- Footer SOCIAL_LINKS: `src/components/layout/Footer.tsx` lines 3-10
- Contact SOCIAL_LINKS: `src/app/contact/page.tsx` lines 11-25
- Both arrays have the same shape: `{ label: string; href: string }[]`

## Functional requirements

1. Instagram link removed from Footer
2. Instagram link removed from Contact page
3. Twitter/X link removed from Footer
4. Twitter/X link removed from Contact page
5. Footer Behance link stays (already added)
6. Contact Behance link stays (already added)
7. Order: LinkedIn, Dribbble, Behance (professional-first, design platforms after)

## Acceptance criteria

- [ ] Footer renders LinkedIn, Dribbble, Behance only (no Instagram, no Twitter/X)
- [ ] Contact page renders same three links
- [ ] All remaining links point to correct URLs
- [ ] Links open in new tabs with `rel="noopener noreferrer"`
- [ ] `npm run build` passes

## Likely files affected

- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/app/contact/page.tsx`

## Required output

Return:

1. implementation summary
2. files changed
3. confirmation build, lint pass
