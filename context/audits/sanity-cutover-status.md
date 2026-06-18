# Sanity CMS Cutover — Status & Remaining Work

Date: 2026-06-18

All public surfaces keep a **local seed fallback**: when `VITE_SANITY_PROJECT_ID` is unset
(`sanityEnabled === false`) or a fetch fails/returns empty, the page renders from
`data/seed/*`. Sanity is an overlay, never a hard dependency.

## Runtime-wired to Sanity (read live, seed fallback)

| Surface | Loader | Notes |
|---|---|---|
| Events (list, detail, gallery, program library) | `src/lib/content/events.ts` | full mapping, images via Sanity CDN |
| Membership | `src/lib/content/membership.ts` | `membershipProgram` singleton |
| **Site settings** (Footer text, Contact offices/contact, About leadership/desc) | `src/lib/content/site.ts` *(new)* | Sanity `settings` overlaid on seed; brand logos + home hero stay on seed |
| **Centers** page | `src/lib/content/centers.ts` *(new)* | address localized in loader; images via `ContentImg` (Sanity ref or local seed) |

The unused `fetchSettings` / `fetchCenters` GROQ helpers in `src/lib/sanity.ts` are now
consumed.

## Still seed-only — and *why* (these are not just "unwired")

Each of the remaining `fetch*` helpers exists, but the **page and the Sanity schema do not
line up**, so wiring them blindly would ship broken or no-op code. Concrete blockers:

| Surface | `fetch*` helper | Blocker | Unblock step |
|---|---|---|---|
| Home hero | `fetchHomeHero` | Home maps `settings.homeHero` text but pulls hero **images from a hardcoded `HERO_ASSET_KEYS` array**. Sanity stores hero in a separate `homeHero` doc with image refs. | Add `useHomeHero(locale)`, drop `HERO_ASSET_KEYS`, render slides with `ContentImg` |
| Partners strip (Home) | `fetchPartners` | The Home strip renders a **hardcoded list of logo paths**, not `partners.data`. No consumer reads partner records. | Replace the hardcoded list with `usePartners()` → seed `partners.data` → hardcoded fallback |
| Experts | `fetchExperts` | The Experts page renders a **gap-state from `pages.experts`**, not from `expert` documents. No card UI exists. | Build an expert-card grid that renders `expert` docs when present, else the gap state |
| News (list + detail) | `fetchNews`, `fetchNewsArticle` | `lib/news.ts` is built on seed-only fields: `localizedSlugs` (absent from the Sanity `news` schema) and inline-image rewriting via `images[].originalUrl`/`localPath`. Sanity stores images as refs by `role`. | Add `localizedSlugs` to the `news` schema (or resolve slugs differently) and rewrite `rewriteNewsHtml` to map inline images to Sanity CDN URLs |
| Page bodies (About / Contact rich content) | `fetchPage` | The Sanity `page` schema is intentionally thin (`key`, `heroImage`, `title`, `intro`, `pillars`, `faq`) and cannot reproduce the seed page bodies (mission/vision/history/leadership, contact highlights/subjects). | Enrich the `page` schema to cover the rendered sections, then overlay like `site.ts` |

## Recommendation

Treat the five rows above as scoped follow-ups, each gated on a small schema/page change —
not a single mechanical "wire the fetchers" task. Home hero and Partners are the cheapest
next wins; News and Page bodies need schema work first.
