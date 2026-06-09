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
After all pages render (including Event Detail):

- Route-level lazy loading (`React.lazy` + `Suspense`)
- JSON split by entity (no single giant import)
- Bundle report: target < 200 KB initial JS (gzipped)
- Image audit: confirm all images in production serve WebP via `srcset`
- Font audit: confirm `font-display: swap` active, no render-blocking
- Core Web Vitals baseline recorded (LCP, CLS, FID targets)

### Phase 6 — Sanity CMS + Content Management
**Status: planned — begins after Phase 5 performance pass.**

#### 6a — Sanity project setup

1. Tạo Sanity project:
   ```bash
   npm create sanity@latest -- --project kbit --dataset production --template clean
   ```
2. Cài dependencies frontend:
   ```bash
   npm install @sanity/client @sanity/image-url
   ```
3. Cấu hình `.env`:
   ```
   VITE_SANITY_PROJECT_ID=xxx
   VITE_SANITY_DATASET=production
   ```

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

Tất cả `i18n` fields dùng pattern:
```js
{ en: string, vi: string, ko: string }
```

#### 6c — Image migration (assets → Sanity CDN)

- Upload toàn bộ `data/assets-opt/` lên Sanity Asset API bằng migration script
- Sau khi upload: mọi image reference dùng `@sanity/image-url` builder
- Frontend `<Img>` component tạo `srcset` từ Sanity CDN URL:
  ```
  cdn.sanity.io/images/{projectId}/{dataset}/{ref}?w=400&fm=webp
  cdn.sanity.io/images/{projectId}/{dataset}/{ref}?w=800&fm=webp
  cdn.sanity.io/images/{projectId}/{dataset}/{ref}?w=1200&fm=webp
  ```
- **Bỏ** `data/assets-opt/`, `data/assets/`, script `optimize-images.mjs` sau khi xác nhận CDN hoạt động

#### 6d — Data migration (seed JSON → Sanity)

Tạo script `scripts/migrate-to-sanity.mjs`:
1. Đọc `data/seed/events.json`, `news.json`, `settings.json`, v.v.
2. Map sang Sanity document format
3. Upload qua Sanity client `.createOrReplace()`
4. Log kết quả, report lỗi

Thứ tự migration:
```
experts → partners → centers → events → news → pages → settings → homeHero
```

#### 6e — Frontend wiring

- Thay tất cả `import * from 'data/seed/*.json'` → GROQ query qua `@sanity/client`
- Tạo `src/lib/sanity.ts` — centralized client + typed queries
- Giữ nguyên route structure, chỉ thay data source
- Fetch strategy: `useSWR` hoặc `useEffect` + cache headers từ Sanity CDN

---

### Phase 7 — Content Translation

**Mục tiêu:** Điền đầy đủ `vi` và `ko` cho toàn bộ content đang có `[NEEDS_TRANSLATION:xx]` hoặc trống.

#### Tình trạng hiện tại

| Content type | EN | VI | KO |
|---|---|---|---|
| Events (title, desc, location) | ✅ đầy đủ | ⚠️ thiếu một số | ❌ phần lớn trống |
| News (title, excerpt, content) | ✅ đầy đủ | ⚠️ thiếu | ❌ trống |
| Settings (offices, org info) | ✅ | ⚠️ | ❌ |
| Pages (membership, about) | ✅ | ⚠️ | ❌ |
| homeHero (heading, sub) | ✅ | ⚠️ | ❌ |

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

## Bundle budget (to enforce at Phase 5)

| Asset type | Budget (gzipped) |
|---|---|
| Initial JS bundle | < 200 KB |
| Per-route chunk | < 80 KB |
| CSS total | < 30 KB |
| Webfont subset (WOFF2) | < 60 KB total |
| Hero image (WebP, 1600w) | < 200 KB |
| Card thumbnail (WebP, 400w) | < 40 KB |
