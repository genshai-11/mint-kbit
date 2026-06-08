# Source Transfer Audit

Source: `C:\Users\gensh\OneDrive\Máy tính\LUCY\PROJECT-WORKPLACE\JOLLY\kbit`

Target: `C:\Users\gensh\OneDrive\Máy tính\LUCY\PROJECT-WORKPLACE\JOLLY\kbit-new-project`

## Rule
Only content/data/assets were transferred. No Next.js/source/design-reference files were migrated.

## Seed counts
| File | Count |
|---|---:|
| `asset-manifest.json` | 70 |
| `centers.json` | 1 |
| `content-gaps.json` | 10 |
| `events.json` | 4 |
| `experts.json` | 0 |
| `membership.json` | 3 |
| `news.json` | 6 |
| `pages.json` | 9 |
| `partners.json` | 10 |
| `raw-content.json` | 3 |
| `settings.json` | 9 |
| `testimonials.json` | 0 |
| `url-inventory.json` | 80 |

## Asset transfer
- Asset files copied: **70**
- Asset bytes copied: **204,007,621**

## Direct files copied
- `data/seed/*.json` → `data/seed/*.json`
- `data/assets/**` → `data/assets/**`
- `data/CONTENT_GAPS.md` → `data/CONTENT_GAPS.md`

## Preserved untouched
- `Plan/`
- `stitch-frontend/`

## Not copied
- old `src/`
- old `prisma/`
- old `react/`
- old Next.js config/package files
- Stitch design refs as migration input

## Content risks preserved
- Experts: 0 records
- Testimonials: 0 records
- Production image hosting: unresolved
- `zh` crawl data exists but v1 locale contract remains `en | vi | ko`
