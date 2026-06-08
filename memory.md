# Memory - Shared Motion System

Last updated: 2026-06-08

## What was built

- Updated `src/styles/tokens.css` with shared motion tokens:
  - `--ease-out-expo`, `--ease-soft`, `--ease-gold`
  - `--duration-instant`, `--duration-fast`, `--duration-base`, `--duration-slow`, `--duration-page`
- Updated `src/styles/global.css` with shared motion utilities:
  - `.page-transition`
  - `.reveal`, `.reveal-soft`, `.reveal-clip`
  - `.reveal--delay-1` through `.reveal--delay-6`
  - `.motion-surface`, `.motion-underline`, `.motion-hairline`, `.ambient-drift`
  - Reduced-motion fallbacks for all shared motion utilities.
- Updated `src/App.tsx`:
  - Added route-level page transition wrapper keyed by `location.pathname`.
- Updated `src/components/PageHero.module.css`:
  - Added PageHero content entrance, watermark entrance/drift, and bottom hairline sweep.
  - Added reduced-motion fallback.
- Updated `src/pages/Events.tsx`:
  - Applied shared global motion utilities to filter bar, featured event, and event cards.
- Updated `context/07-ui-system.md`:
  - Documented shared motion tokens, global utility classes, implementation rules, PageHero motion, and updated load-time animation rules.

## Decisions made

- Motion should be centralized as shared global utilities before page-specific custom animation.
- Inner pages inherit dynamic motion primarily through `PageHero` and `.page-transition`.
- Page-specific CSS animation remains allowed only for unique compositions like Home hero stats, footer seal, and partner marquee.

## Problems solved

- Previous motion guidance was mostly descriptive and Home-specific. It now has reusable CSS primitives other pages can adopt consistently.
- Events page now demonstrates how non-Home pages can use shared utilities without inventing separate motion patterns.

## Current state

- `npm run build` passes.
- `07-ui-system.md` is now aligned with implemented motion utilities in `tokens.css` and `global.css`.

## Next session starts with

1. Apply `.motion-surface`, `.motion-underline`, `.reveal-soft`, or `.reveal-clip` to remaining page components as they are built/polished.
2. Visual-check route transitions and PageHero watermark drift in a normal browser.
3. Continue Phase 4a QA before moving into Phase 4b pages.

## Open questions

- Whether route-level `.page-transition` should animate on every locale switch or only page-to-page navigation.
- Whether future pages should use global utility classes directly or wrap them in shared React components.

---

# Memory - Events Grid and Event Detail

Last updated: 2026-06-08

## What was built

- Redesigned `src/pages/Events.tsx` program grid:
  - Added Program Index header and count summary.
  - Converted event cards into full-card links to `/:locale/events/:slug`.
  - Added card type chips, icon-backed date/location metadata, language footer, staggered reveal delay, and arrow motion.
  - Updated featured event CTAs to include internal detail navigation and external original listing.
- Rebuilt `src/pages/Events.module.css`:
  - Added subtle `PROGRAMS` watermark animation behind the grid.
  - Added stronger card hover motion, gold hairline sweep, image zoom/saturation motion, and responsive header behavior.
- Added `src/pages/EventDetail.tsx` and `src/pages/EventDetail.module.css`:
  - Hero with full cover image, status badge, back link, title, intro copy, and glass facts panel.
  - Program brief section rendering long seeded descriptions with paragraph breaks.
  - Participation side card for capacity, seats, registration, and format.
  - Gallery from seeded event images.
  - Related events section.
- Confirmed `src/App.tsx` already routes `events/:slug` to lazy-loaded `EventDetail`.

## Verification

- `npm run build` passes.
- Local server returned `200` for `/en/events`.
- Local server returned `200` for `/en/events/kat-2025-1st-korea-vietnam-k-beauty-advanced-skill-training-2025`.

## Notes

- The project directory is not a Git worktree in this environment (`.git` is absent), so no `git diff` or `git status` was available.

---

# Memory - Legacy Domain Boundary

Last updated: 2026-06-08

## Decision

- Public UI must never link, redirect, load images, submit forms, or expose download URLs pointing to `kbitassociation.com` or `api.kbitassociation.com`.
- The old site is only a migration/reference source.
- Any content, asset, PDF, or registration form needed by the current website must be copied into this project and served locally.
- `sourceUrl`, `sourceId`, `originalUrl`, and crawl inventories may remain only in `data/seed/` for traceability.

## Changes made

- Updated `AGENTS.md` with the migration boundary and gate rule.
- Updated `context/07-ui-system.md` with the public site boundary.
- Removed public “Original listing” CTAs from Events and Event Detail.
- Replaced those CTAs with on-site routes:
  - Featured event: detail route + `/contact`
  - Event detail fact panel: `/contact`

## Verification

- `rg` over `src` and `index.html` found no `kbitassociation.com`, `api.kbitassociation.com`, `sourceUrl`, or `Original listing` usage.
- `npm run build` passes.

---

# Memory - Membership, Motion, Favicon, Experts

Last updated: 2026-06-08

## What was built

- Added local app icons:
  - `public/favicon.png`
  - `public/apple-icon.png`
  - `index.html` now references both locally.
- Added local membership registration form files under `public/forms/`.
- Replaced `data/seed/membership.json` with migrated membership content:
  - Membership structure
  - Detailed benefits
  - Requirements
  - Fee policy
  - Local registration forms
- Rebuilt `src/pages/Membership.tsx` and `Membership.module.css` into a full on-site page with section index, structure cards, benefits, requirements, fee cards, and local form downloads.
- Enhanced Home motion in `Home.module.css`:
  - Stats frame sheen
  - Stat icon pulse
  - About watermark drift
  - About visual hover/image settle
- Improved Contact:
  - Added response-flow panel
  - Added contact watermark drift and richer image/surface motion
- Changed navigation and `/partners` behavior:
  - Nav now links to Experts instead of Partners.
  - `/partners` redirects on-site to `/experts`.
- Rebuilt Experts into an editorial page with stats, verification framework, vetting steps, and collaboration cards.
- Updated `context/07-ui-system.md` with local favicon/forms, motion expectations, and Partners redirect behavior.

## Verification

- `npm run build` passes.
- `rg` over `src`, `index.html`, and `public` finds no legacy domain usage.
- Local server returned `200` for:
  - `/favicon.png`
  - `/forms/kbit-standard-member-registration.pdf`
  - `/en/membership`
  - `/en/contact`
  - `/en/partners`
  - `/en/experts`
