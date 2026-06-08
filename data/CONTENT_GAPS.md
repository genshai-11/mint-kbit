# KBIT Content Gaps — updated 2026-06-05

## Resolved/updated from live crawl
- Events: live API has 4 events; mapped to `data/seed/events.json`.
- News: live API has 2 English news groups; mapped to `data/seed/news.json` with localized slugs where available.
- Centers: live API has 1 center; mapped to `data/seed/centers.json`.
- Assets: downloaded to `data/assets/`; see `data/seed/asset-manifest.json`.

## Still open
- Experts: live API still returns 0 records. Need client provide 50+ doctor profiles + portraits.
- Membership tiers: still require client confirmation of package prices/benefits.
- High-quality hero assets: experts/contact/centers still use placeholder images.
- `zh` locale exists on live sitemap/API but current project content contract only defines `en | vi | ko`; `zh` captured in raw crawl, not mapped into typed seeds.
- Production image hosting: local files in `data/assets/` still need final upload/copy target before production.
