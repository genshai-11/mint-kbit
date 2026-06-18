# 03 — Build Plan

Status: **Active — Design system defined; public rollout in progress**

## Evidence-based setup checklist

- [x] Target folder inspected: `Plan/` and `stitch-frontend/` exist.
- [x] Project OS created.
- [x] Content seed JSON transferred.
- [x] Local assets transferred.
- [x] Content gaps transferred.
- [x] Stitch references preserved untouched and deferred.
- [x] UI design system defined in `context/07-ui-system.md`.
- [x] Image optimization plan documented.
- [x] React + Vite scaffold created.
- [x] Image optimization pipeline run (`data/assets/` → `data/assets-opt/`).
- [x] Public shell renders from transferred seed.
- [x] First bundle/load-time evidence recorded.

Setup progress: **12/12 checklist items complete**.
Implementation progress: **public rollout complete for current content surfaces; shared route motion layer added across public pages**.

---

## Phases

### Phase 0 — Project OS + transfer
Status: **complete**.

### Phase 1 — Scaffold gate
Status: **cleared by Lucy (2026-06-08)**.

### Phase 2 — Clean React scaffold
**Next to execute:**

1. Create Vite React TS app inside `kbit-new-project/`
   ```bash
   npm create vite@latest . -- --template react-ts
   ```
2. Install core dependencies:
   ```bash
   npm install react-router-dom @phosphor-icons/react
   npm install -D vite-imagetools
   ```
3. Set up route shell: `/:locale` prefix with `en | vi | ko` default redirect
4. Wire static JSON data loaders from `data/seed/`
5. Apply design system CSS variables from `context/07-ui-system.md` as `/src/styles/tokens.css`
6. Add bundle analysis tooling (`rollup-plugin-visualizer` or `vite-bundle-visualizer`)

### Phase 3 — Image optimization pipeline
**Must run before any image component is built.**

**Tool:** Sharp CLI (Node.js)
```bash
npm install -D sharp
```

**Script to create:** `scripts/optimize-images.mjs`

Responsibilities:
- Read all `.jpg`, `.jpeg`, `.png` files under `data/assets/`
- Output WebP variants at 400w, 800w, 1200w, 1600w (only for files that are ≥ that width)
- Quality: **82** (WebP)
- Write to `data/assets-opt/` preserving subfolder structure
- Generate `data/assets-opt/manifest.json` mapping original filename → optimized variants

**Expected savings (top offenders):**

| Asset | Source size | Target WebP | Est. saving |
|---|---|---|---|
| event-12-detail-1 | 22.9 MB | ~350 KB | 98% |
| event-12-detail-2 | 10.9 MB | ~280 KB | 97% |
| event-12-bannerimageurl | 10.4 MB | ~260 KB | 97% |
| news inline images (×9) | 3.8–9 MB ea | ~200 KB ea | 95% |
| event banner PNGs (×8) | 2.7–6.4 MB ea | ~150 KB ea | 96% |
| home banners (×3) | ~1–2 MB ea | ~120 KB ea | 90% |

**Total current assets:** estimated ~180 MB raw
**Total after optimization:** estimated ~8–12 MB
**Reduction:** ~93–96%

**React image component contract (from `07-ui-system.md`):**
- `srcset` with 400w / 800w / 1200w WebP variants
- `loading="lazy"` (except first hero: `loading="eager"` + `<link rel="preload">`)
- Explicit `width` + `height` for CLS prevention
- LQIP: 20px blurred inline base64 placeholder

### Phase 4a — UI pilot (Home + Events + Event Detail)

**Status: complete.**

Pilot the design system on the three highest-signal surfaces first — enough to validate the full motion + content treatment in a real browser.

Skills required before writing any component:
- `superpowers:brainstorming` → explore layout intent
- `frontend-design:frontend-design` → execute with design quality
- `superpowers:verification-before-completion` + `run` + `verify` → confirm before marking done

Pages to build:

1. **Home** — Hero carousel, Stats panel, About teaser, Events teaser, Partners strip, CTA band
2. **Events** — Featured event, Upcoming grid, filter tabs
3. **Event Detail** — Program detail, timeline sections, gallery lightbox, related programs

After the pilot passes the Visual QA checklist in `context/07-ui-system.md`:
- Identify what token/component/layout decisions need to change
- Update `context/07-ui-system.md` with any design improvements
- Reuse the same motion vocabulary on remaining pages
- Phase 4b continues with the remaining content surfaces

All pages: `/:locale/` route prefix. Locale switcher in nav updates URL prefix and re-renders.

### Phase 4b — Remaining pages

**Gated: continue with the same UI system and motion rules from `context/07-ui-system.md`.**

Done so far: **News, News Detail, About, Contact, Membership, Centers, Experts; Partners redirects on-site to Experts**.

4. **News** — Featured article, News grid, category filter ✓
5. **Membership** ✓
6. **About** — Mission/Vision, Leadership, Map ✓
7. **Partners** - on-site redirect to Experts
8. **Contact** — Form + Office cards ✓
9. **Experts** — Gap state ✓
10. **Centers** — Center cards ✓

### Phase 5 — Performance pass
**Status: mostly complete — see `context/audits/phase-5-performance.md`. CWV live run pending on preview.**

- [x] Route-level lazy loading (`React.lazy` + `Suspense`) — `src/App.tsx`
- [x] JSON split by entity (no single giant import) — `src/lib/data.ts` is a re-export barrel; seed files live in `src/lib/seed/*`; shared Footer chunk dropped from 18.6 KB → 6.6 KB gzip
- [x] Bundle report: ~112 KB initial JS gzipped for Home (budget < 200 KB)
- [x] Image audit: WebP via `srcset` in `Img`/`ContentImg`
- [x] Font audit: `font-display: swap` active, fonts preconnected
- [ ] Core Web Vitals baseline (LCP/CLS/INP) — run Lighthouse against preview/canary before production

### Phase 6 — Sanity CMS + Content Management
**Status: in progress — event runtime sync implemented 2026-06-17; Studio/schema/client/migration tooling verified; membership schema/migration added and live `membershipProgram` migrated through Sanity CLI account; remaining work is preview QA, release controls, and optional full content-page cutover beyond Events/Membership.**

#### 6a — Sanity project setup

- ✅ Frontend Sanity dependencies installed: `@sanity/client`, `@sanity/image-url`.
- ✅ Sanity Studio scaffold exists in `studio/` and builds locally.
- ✅ Env examples added at `.env.example` and `studio/.env.example`.
- ✅ Sanity project/dataset read env is configured locally (`q9mwbl6e`, `production`).
- ✅ Membership write migration completed through Sanity CLI user-token flow, without storing `SANITY_TOKEN` in `.env.local`.
- ⏳ Lucy/project owner must confirm CORS origins in Sanity Manage before production.

#### 6b — Schema definitions

Định nghĩa schema trong `studio/schemas/` cho từng content type:

| Schema | Fields chính |
|---|---|
| `event` | title(i18n), slug, description(i18n), coverImage, startAt, endAt, location(i18n), status, fee, speakerSlugs, images[] |
| `news` | title(i18n), slug, excerpt(i18n), content(i18n, PortableText), coverImage, tags, publishedAt, status |
| `homeHero` | slides[]: {image, heading(i18n), sub(i18n)} |
| `settings` | stats, contact, offices[], social, brand |
| `page` | key (membership/about/…), sections[] (i18n blocks) |
| `expert` | name, slug, bio(i18n), avatar, role(i18n) |
| `partner` | name, logo, url, tier |
| `center` | name(i18n), slug, address(i18n), image |
| `membershipProgram` | membership types, benefits, requirements, fees, registration forms |

Tất cả `i18n` fields dùng pattern:
```js
{ en: string, vi: string, ko: string }
```

#### 6c — Image migration (assets → Sanity CDN)

- Migration script now prefers optimized WebP assets from `data/assets-opt/manifest.json` before falling back to raw assets.
- Upload optimized assets to Sanity Asset API bằng migration script
- Sau khi upload: mọi image reference dùng `@sanity/image-url` builder
- Frontend `<Img>` component tạo `srcset` từ Sanity CDN URL:
  ```
  cdn.sanity.io/images/{projectId}/{dataset}/{ref}?w=400&fm=webp
  cdn.sanity.io/images/{projectId}/{dataset}/{ref}?w=800&fm=webp
  cdn.sanity.io/images/{projectId}/{dataset}/{ref}?w=1200&fm=webp
  ```
- **Bỏ** `data/assets-opt/`, `data/assets/`, script `optimize-images.mjs` sau khi xác nhận CDN hoạt động

#### 6d — Data migration (seed JSON → Sanity)

- ✅ `scripts/migrate-to-sanity.mjs` reads `data/seed/*.json`, resolves legacy asset URLs through `data/seed/asset-manifest.json`, uploads optimized local images from `data/assets-opt/`, uploads membership PDFs, and upserts schema-valid documents with `.createOrReplace()`.
- ✅ `scripts/export-sanity-ndjson.mjs` generates `kbit-migration.ndjson` for manual dataset import without assets.
- ✅ `docs/sanity-setup.md` documents the remaining manual setup and migration flow.
- ⏳ Run the live migration after `.env.local` contains the real `SANITY_PROJECT_ID`, `SANITY_DATASET`, and `SANITY_TOKEN`.

Migration order:
```
experts → partners → centers → events → news → settings → homeHero → pages → membership
```

#### 6e — Frontend wiring

- ✅ `src/lib/sanity.ts` centralizes client + GROQ queries.
- ✅ Events runtime sync implemented for Home event teaser, Events listing, Event Detail, Event Gallery, and Event Program Library via Sanity CDN with seed fallback.
- ✅ Membership page can read the live `membershipProgram` singleton from Sanity with seed fallback.
- ✅ KAT 2025 local program library images migrated to Sanity `event-12.libraryItems[]` after WebP optimization: 55.91 MB → 1.29 MB before upload.
- ✅ Site **settings**, **home hero**, and **partners** wired (`src/lib/content/site.ts`, `partners.ts`): Footer/Contact/About text, hero slides, and the partners strip read Sanity with seed fallback. Sanity client is dynamic-imported so it stays out of the global shared chunk.
- ✅ **Centers** page wired (`src/lib/content/centers.ts`): address localized in loader, images render through `ContentImg` (Sanity ref or local seed).
- ⏳ Remaining cutover (each gated on a schema/page change, not a blind wiring) — see `context/audits/sanity-cutover-status.md`: Experts (gap-state UI vs `expert` docs), News (missing `localizedSlugs` + inline-image rewrite), Page bodies (thin `page` schema).
- Fetch strategy: React `useEffect` runtime reads from Sanity CDN; local seed remains fallback when Sanity is disabled/unavailable.

---

### Phase 7 — Content Translation

**Mục tiêu:** Điền đầy đủ `vi` và `ko` cho toàn bộ content đang có `[NEEDS_TRANSLATION:xx]` hoặc trống.

#### Tình trạng hiện tại

Updated 2026-06-18. UI-priority strings filled via `scripts/apply-ui-translations.mjs`
(settings + page titles/intros/labels). Remaining gaps are long-form body and genuine
content gaps. Total missing dropped 216 → 147.

| Content type | EN | VI | KO |
|---|---|---|---|
| homeHero (heading, sub) | ✅ | ✅ done | ✅ done |
| Settings (offices, meta, org) | ✅ | ✅ done | ✅ done |
| Pages — titles / intros / labels | ✅ | ✅ done | ✅ done |
| Pages — body (mission/vision/sections) | ✅ | ⚠️ pending | ⚠️ pending |
| Events (title, location) | ✅ | ✅ already | ✅ already |
| Events (image captions, desc) | ✅ | ⚠️ pending | ⚠️ pending |
| News (title) | ✅ per-locale docs | ✅ per-locale docs | ✅ per-locale docs |
| News (excerpt) | ❌ empty in source — **content gap, not translation** | ❌ | ❌ |
| Partners (description) | ❌ `[GAP]` in source — **content gap** | ❌ | ❌ |

> Note: News is stored as **separate per-language documents** (not one i18n doc), so titles
> are already localized; excerpts are empty even in English (write content first). Partner
> descriptions are `[GAP]` in all locales — a content task, not a translation task.

#### Workflow dịch thuật

**Bước 1 — Export strings cần dịch**
```
scripts/export-missing-translations.mjs
→ output: translations-needed.csv (locale, content_type, field, key, source_en)
```

**Bước 2 — Dịch theo 2 kênh song song:**

| Kênh | Nội dung | Ưu tiên |
|---|---|---|
| Dịch máy (DeepL/GPT) | Body text, descriptions, page sections | Nhanh, review sau |
| Dịch người | Title, headline, CTA, SEO meta | Chính xác, brand voice |

**Bước 3 — Import lại Sanity**
- Upload translations đã dịch qua Sanity Studio (thủ công) hoặc import script
- Sanity Studio hỗ trợ editor edit trực tiếp từng locale field

**Bước 4 — QA**
- Check từng trang ở `/vi/` và `/ko/`
- Flag các field vẫn còn `[NEEDS_TRANSLATION]` bằng visual indicator (chỉ trong dev mode)

#### Ưu tiên dịch

```
1. homeHero (visible ngay trang chủ)
2. Events title + location (listing page)
3. News title + excerpt (listing page)
4. Settings: contact + offices
5. Pages: membership CTA, about mission
6. Long-form: event description, news body content
```

---

## Phase 8 — Membership Platform (Supabase)

**Status: planned — implementation plan below. Owner sign-off needed before 8a.**

Adds real member accounts, a tier-gated document library, and a **separate standalone
admin app**. This is the capability that lets KBIT claim "admin/content operations" per
CONTEXT.md (no such claim is valid until auth + backend + admin ship).

### Architecture decisions (ADR)

- **Backend:** Supabase — Auth + Postgres + Storage + Row Level Security. (MCP already
  connected; no custom server to operate.)
- **Sanity stays** the source of truth for **public marketing content** (events, news,
  pages). Supabase owns **member identity + private documents only**. The two never share
  data; the membership tier *ids* defined in Sanity `membershipProgram` are mirrored as a
  `tiers` lookup in Supabase.
- **Admin = separate standalone app** (`admin/`, its own Vite React TS project + Vercel
  deploy), so admin code, auth surface, and bundle never ship to the public site. Shares
  the Supabase project and a small `packages/`-style copy of tier/types contracts.
- **Document gating = by membership tier.** Each document declares a minimum tier; a member
  sees a document when their tier is ≥ required AND their membership is active (not expired).
- **Files are private.** Stored in a private Supabase Storage bucket and served only via
  short-lived signed URLs. RLS enforces access server-side — UI gating is never the only
  guard.

### Repository layout

```
/            (existing public React+Vite site — adds only "Member login" / "Apply" CTAs + /account portal)
/studio      (existing Sanity Studio — unchanged)
/admin       (NEW: standalone Vite React TS admin app, separate package.json + vercel project)
/supabase    (NEW: migrations/*.sql, seed.sql, config.toml — schema + RLS as code)
```

### Data model (Supabase Postgres)

| Table | Key columns | Notes |
|---|---|---|
| `profiles` | `id`(=auth.users.id), `role`(`member`\|`admin`), `full_name`, `created_at` | 1:1 with auth user; `role` drives admin access |
| `tiers` | `id`(text, e.g. `standard`/`professional`), `name`, `rank`(int) | mirrors Sanity `membershipProgram` tier ids; `rank` enables "≥ tier" checks |
| `members` | `profile_id`, `tier_id`, `status`(`pending`\|`active`\|`suspended`\|`expired`), `joined_at`, `expires_at` | the membership record |
| `membership_applications` | `id`, `applicant_email`, `tier_id`, `payload`(jsonb), `status`, `submitted_at`, `reviewed_by` | digitizes the current static PDF forms |
| `documents` | `id`, `title`, `description`, `category`, `required_tier_id`, `storage_path`, `published`, `published_at`, `created_by` | metadata; file lives in Storage |
| `document_downloads` | `document_id`, `member_id`, `downloaded_at` | optional analytics/audit |
| `audit_log` | `id`, `actor_id`, `action`, `target`, `meta`(jsonb), `at` | admin action trail |

### RLS policy intent (enforced in SQL migrations)

- `profiles`: a user reads/updates only their own row; admins read all.
- `members`: a member reads only their own row; admins read/write all.
- `documents`: a member can `select` a row only when `published = true` AND
  `required_tier.rank <= their active member tier.rank` AND their `members.status = 'active'`
  AND `expires_at > now()`; admins full access.
- Storage `member-documents` bucket: **private**; download only through an edge function /
  RPC that re-checks the same predicate and returns a signed URL (≤ 60s TTL).
- `membership_applications`: anon can `insert` (apply); only admins can `select`/`update`.
- Admin writes use a server-side service role (in the admin app's serverless functions),
  never the anon key.

### Sub-phases

#### 8a — Foundation
- Create Supabase project; capture `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (public
  site + admin) and `SUPABASE_SERVICE_ROLE_KEY` (admin server only) in env examples.
- `supabase/migrations/`: tables above + RLS policies + `tiers` seed matching Sanity ids.
- Private Storage bucket `member-documents` + signed-URL RPC/edge function.
- Install `@supabase/supabase-js`; add `src/lib/supabase.ts` (public client) and an
  `AuthProvider` + `useAuth()` hook.

#### 8b — Member portal (in the public app)
- Routes `/:locale/login`, `/:locale/account` (lazy, code-split so the public bundle is
  untouched for anonymous visitors).
- Login (email/password + magic link), profile view, membership status + expiry, renewal CTA.
- **Document library**: lists documents the member is entitled to; download via signed-URL
  RPC. Empty/locked states for pending/expired members.
- Membership marketing page gains "Member login" + "Apply" CTAs (replaces PDF download CTA).

#### 8c — Admin app (`admin/`)
- New Vite React TS project; Supabase auth gate requiring `profiles.role = 'admin'`.
- Screens: Members (approve / suspend / change tier / set expiry), Applications inbox
  (review → approve provisions a `members` row + sends email), Document manager (upload to
  private bucket, set title/category/required tier, publish/unpublish), lightweight metrics.
- Separate Vercel project + its own env; never imported by the public site.

#### 8d — Application flow
- Replace static PDF registration forms with an online form writing to
  `membership_applications` (anon insert via RLS).
- Admin approval creates the auth user (invite email) + `members` row + `profiles` row.

#### 8e — Hardening & release
- RLS test matrix (member-of-wrong-tier, expired, suspended, anon) — automated where possible.
- Audit log on all admin mutations; rate-limit auth + apply endpoints.
- Email templates (welcome, approval, renewal reminder).
- GDPR delete path (member → cascade), backup/restore doc, rollback notes.
- Pre-production gate items from AGENTS.md: preview/canary validation + restore-path verify.

### Security gates (must hold before production)
- No private document is ever reachable by public URL — signed URLs only, short TTL.
- Every access predicate exists in RLS, not just in the UI.
- Admin role checked server-side (service role isolated to admin serverless functions).
- Anon key is the only Supabase key shipped to browsers.

---

## Bundle budget (to enforce at Phase 5)

| Asset type | Budget (gzipped) |
|---|---|
| Initial JS bundle | < 200 KB |
| Per-route chunk | < 80 KB |
| CSS total | < 30 KB |
| Webfont subset (WOFF2) | < 60 KB total |
| Hero image (WebP, 1600w) | < 200 KB |
| Card thumbnail (WebP, 400w) | < 40 KB |
