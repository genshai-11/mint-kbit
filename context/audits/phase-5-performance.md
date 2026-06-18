# Phase 5 — Performance Pass (evidence)

Date: 2026-06-18

## Checklist outcome

| Item | Status | Evidence |
|---|---|---|
| Route-level lazy loading (`React.lazy` + `Suspense`) | ✅ already in place | `src/App.tsx` lazy-imports every page; `<Suspense fallback>` wraps routes |
| JSON split by entity (no single giant import) | ✅ fixed this pass | `src/lib/data.ts` is now a pure re-export barrel; each seed file lives in its own module under `src/lib/seed/` |
| Bundle report | ✅ recorded below | `npm run build` output; `npm run analyze` writes `dist/stats.html` |
| Image audit — WebP via `srcset` | ✅ | `src/components/Img.tsx` + `ContentImg.tsx` emit `srcSet` (local manifest + Sanity CDN), `loading`, `decoding="async"`, `width/height` |
| Font audit — `font-display: swap`, no extra render block | ✅ | `index.html` Google Fonts URL ends with `&display=swap`; `preconnect` to `fonts.googleapis.com` + `fonts.gstatic.com` |
| Core Web Vitals baseline | ⏳ targets recorded; live Lighthouse run pending on a deployed/preview URL | targets below |

## Root cause fixed

`src/lib/data.ts` statically imported all 8 seed JSON files into **one** module and
re-exported them. Because `Footer` (rendered on every page) imported from that barrel,
and `lib/news.ts` pulled `news` (65 KB) through it, Rollup placed the entire seed corpus
into a single shared chunk loaded on **every** route.

Fix: split each entity into its own module (`src/lib/seed/*.ts`) and turn `data.ts` into a
side-effect-free re-export barrel. Consumers' imports are unchanged, but Rollup now
code-splits each JSON by the routes that actually use it. The duplicated `localize()`
helper (6 copies, all `any`-typed) was consolidated into `src/lib/i18n.ts` and re-exported
through `data.ts`.

## Bundle: before → after (gzipped)

| Chunk | Before | After | Note |
|---|---|---|---|
| `Footer` shared chunk | 18.57 KB | **6.62 KB** | no longer drags `news.json`; only `settings.json` + asset manifest remain |
| `news` (news.json seed) | bundled in Footer/global | **10.82 KB, own chunk** | loads only on News / News Detail routes |
| `pages` seed | bundled in barrel | 1.42 KB, own chunk | |
| `centers` seed | bundled in barrel | 0.26 KB, own chunk | |

Estimated initial JS for the Home route (gzipped): `index` 60.9 + `vendor` 17.2 +
`icons` 23.2 + `Footer` shared 6.6 + `Home` 4.3 ≈ **~112 KB** — within the < 200 KB budget.

Notes / future opportunities:
- `events.json` seed chunk is ~17 KB gzip and loads on Home (event teaser), Events, and
  Event Detail. Once the Sanity cutover is complete the seed becomes fallback-only and can
  be trimmed.
- `icons` chunk (`@phosphor-icons/react`) is ~23 KB gzip. Per-icon imports already
  tree-shake; further savings would require an icon sprite or SVG inlining.
- The asset manifest (`data/assets-opt/manifest.json`, ~37 KB raw) is bundled into the
  shared chunk because `assetSrc` is used site-wide. It disappears once images move fully
  to the Sanity CDN (Phase 6c).

## Core Web Vitals targets (to validate on preview/canary)

| Metric | Target |
|---|---|
| LCP | < 2.5 s |
| CLS | < 0.1 |
| INP (replaces FID) | < 200 ms |

Run `npm run build && npm run preview`, then Lighthouse against the preview URL to capture
the live baseline before production cutover.
