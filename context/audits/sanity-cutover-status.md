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
| **Site settings** (Footer text, Contact offices/contact, About leadership/desc) | `src/lib/content/site.ts` | Sanity `settings` overlaid on seed; brand logos stay on seed |
| **Home hero** | `src/lib/content/site.ts` → `useHomeHero` | Sanity `homeHero` slides; images via `ContentImg`; seed (`settings.homeHero`) fallback |
| **Partners strip** (Home) | `src/lib/content/partners.ts` | Sanity `partner` logos via `ContentImg`; seed `partners.data` fallback (replaced the hardcoded logo path list) |
| **Centers** page | `src/lib/content/centers.ts` | address localized in loader; images via `ContentImg` (Sanity ref or local seed) |
| **Experts** page | `src/lib/content/experts.ts` | renders verified expert cards (avatar via `ContentImg`) when `expert` docs exist, else keeps the qualification-framework gap state |
| **News** (list + detail) | `src/lib/content/` → `useNewsList` / `useNewsArticle` in `src/lib/news.ts` | Sanity images resolved to CDN URL strings so the existing `<Img>` render is unchanged; `localizedSlugs` added to the schema; seed fallback preserved |

All ten `fetch*` helpers in `src/lib/sanity.ts` except `fetchPage` are now consumed.

**Bundle safeguard:** `site.ts` is reachable from `Footer` (every page), so it gates on
`VITE_SANITY_PROJECT_ID` and **dynamic-imports** `@/lib/sanity` inside the loaders. This keeps
the ~30 KB-gzip Sanity client out of the global shared chunk when the project id is unset.
`partners.ts` and `centers.ts` use the same dynamic-import pattern.

## Still seed-only — and *why* (these are not just "unwired")

Each of the remaining `fetch*` helpers exists, but the **page and the Sanity schema do not
line up**, so wiring them blindly would ship broken or no-op code. Concrete blockers:

| Surface | `fetch*` helper | Blocker | Unblock step |
|---|---|---|---|
| Page bodies (About / Contact rich content) | `fetchPage` | The Sanity `page` schema is intentionally thin (`key`, `heroImage`, `title`, `intro`, `pillars`, `faq`) and cannot reproduce the seed page bodies (mission/vision/history/leadership, contact highlights/subjects). | Enrich the `page` schema to cover the rendered sections, then overlay like `site.ts` |

## Notes for the live migration

- **News model:** the Sanity `news` schema is one **tri-lingual** doc per article (i18n
  title/excerpt/content). The seed stores articles as **separate per-language docs** with
  `localizedSlugs`. When migrating, consolidate each article into a single Sanity doc and set
  `localizedSlugs` for per-locale URLs. The frontend already resolves either model.
- **Experts:** seed `experts.data` is empty (content gap). Cards appear automatically once
  active `expert` documents exist in Sanity.

## Recommendation

`fetchPage` (page bodies) is the only remaining surface, and it needs the `page` schema
enriched before wiring. Everything else reads Sanity at runtime with a seed fallback.
