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

### Phase 6 — Admin/content path
Design after public content baseline is stable. Out of scope for current build.

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
