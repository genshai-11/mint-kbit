# 07 — UI System

Status: **Active — Design system defined; React source scaffolded; public rollout in progress**

---

## Aesthetic Direction

**"Seoul Prestige"** — Premium Korean medical-aesthetic authority.

KBIT speaks to doctors, clinic owners, and medical professionals across Korea, Vietnam, and beyond.
The design must communicate:
- Clinical credibility (precision, restraint, structure)
- Korean luxury heritage (editorial weight, refined gold accents)
- International reach (language-neutral layouts, generous whitespace)

**Tone**: Luxury-refined with editorial authority. Not cold. Not corporate-generic.
The one thing visitors remember: _a beautifully weighted dark navy + warm ivory palette with gold that never shouts_.

---

## Public Site Boundary

The legacy `kbitassociation.com` site is a migration/reference source only. Public UI must keep users inside the current React/Vite site.

- Never render buttons, links, download URLs, image sources, iframe sources, or form actions that point to `kbitassociation.com` or `api.kbitassociation.com`.
- Legacy `sourceUrl`, `sourceId`, crawl inventory, and original asset URLs are allowed only inside seed/reference files for traceability.
- All visible content, images, PDFs, registration forms, and downloads must be migrated into this project and served locally.
- If a legacy file is not migrated yet, use an on-site contact/request flow rather than an outbound legacy-domain link.
- Favicon and app icons are served locally from `public/favicon.png` and `public/apple-icon.png`.
- Membership registration forms are served locally from `public/forms/`; do not use legacy form URLs.

---

## Color Tokens

```css
/* === Brand Core === */
--clr-midnight:   #0A1525;   /* navbar, footer, hero dark sections */
--clr-navy:       #162040;   /* primary headings on light, CTA fills */
--clr-navy-mid:   #1E2E50;   /* card bg on dark sections */
--clr-navy-soft:  #2A3F68;   /* hover states, borders on dark */

/* === Gold Accent (single accent — use sparingly) === */
--clr-gold:       #C9A96E;   /* badges, icons, active indicators, dividers */
--clr-gold-light: #E8D5A3;   /* subtle gold on dark bg */
--clr-gold-dark:  #8C6D38;   /* gold on light bg text */

/* === Backgrounds === */
--clr-ivory:      #F7F4EE;   /* primary light background */
--clr-cream:      #FDFBF7;   /* card, form, content surface */
--clr-white:      #FFFFFF;   /* pure white sections */
--clr-section-alt:#F0EDE6;   /* alternate section background */

/* === Neutral Text & Border === */
--clr-ash:        #E2DFD8;   /* light borders, dividers on ivory */
--clr-stone:      #8A8478;   /* secondary text on light */
--clr-mist:       #6B7589;   /* secondary text on dark */
--clr-charcoal:   #2E2C28;   /* body text on light */

/* === Semantic === */
--clr-error:      #C0392B;
--clr-success:    #2E7D5E;
--clr-warning:    #C9933A;
```

**Palette usage rules:**
- Dark sections (nav, footer, hero, CTA band): `--clr-midnight` bg + `--clr-white` / `--clr-gold-light` text
- Light sections (most page content): `--clr-ivory` bg + `--clr-navy` headings + `--clr-charcoal` body
- Cards: `--clr-cream` bg + `--clr-ash` border + `shadow-card`
- Gold is accent only — one element per viewport at a time (badge, underline, icon fill, horizontal rule)

---

## Typography

### Typefaces

| Role | Family | Source |
|---|---|---|
| Display headings | **Cormorant Garamond** | Google Fonts |
| Body / UI | **DM Sans** | Google Fonts |
| Numbers / stats | **DM Mono** | Google Fonts |
| Korean locale | **Noto Sans KR** | Google Fonts |

**Import (production — split by weight):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Noto+Sans+KR:wght@300;400;500&display=swap" rel="stylesheet">
```

**Why Cormorant + DM Sans:**
- Cormorant Garamond has the editorial weight and subtle Korean luxury feel (used by premium Korean fashion/beauty brands); the italic variant is especially distinctive for pull quotes and hero subheadings
- DM Sans is crisp, highly legible at small sizes, and reads cleanly in Vietnamese/Korean diacritics — unlike Inter which is overused everywhere

### Type Scale (CSS tokens)

```css
/* === Display === */
--type-d1: clamp(56px, 7vw, 96px);   /* hero headline — Cormorant, weight 300 */
--type-d2: clamp(40px, 5vw, 64px);   /* section headline — Cormorant, weight 400 */
--type-d3: clamp(28px, 3.5vw, 44px); /* sub-headline — Cormorant, weight 500 */

/* === Body === */
--type-h1: clamp(22px, 2.5vw, 32px); /* page title — DM Sans 600 */
--type-h2: clamp(18px, 2vw, 24px);   /* section title — DM Sans 600 */
--type-h3: clamp(15px, 1.5vw, 18px); /* card title — DM Sans 500 */
--type-body-lg: 17px;                 /* lead paragraph — DM Sans 300 */
--type-body:    15px;                 /* standard body — DM Sans 400 */
--type-sm:      13px;                 /* meta, captions — DM Sans 400 */
--type-xs:      11px;                 /* legal, labels — DM Sans 500 uppercase */

/* === Stats === */
--type-stat: clamp(36px, 4vw, 56px); /* DM Mono 500 — for counters */
```

### Type Rules
- Display headings: `font-family: 'Cormorant Garamond', Georgia, serif; letter-spacing: -0.02em; line-height: 1.1`
- Section on dark bg: Cormorant `font-weight: 300` (lighter weight is more luxurious on dark)
- Section on light bg: Cormorant `font-weight: 400–500`
- Body: `font-family: 'DM Sans', system-ui, sans-serif; line-height: 1.65`
- Stats: `font-family: 'DM Mono', monospace; font-variant-numeric: tabular-nums`
- All-caps labels/tags: `font-size: var(--type-xs); font-family: 'DM Sans'; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase`

---

## Spacing Scale

```css
--sp-1:  4px;
--sp-2:  8px;
--sp-3:  12px;
--sp-4:  16px;
--sp-5:  24px;
--sp-6:  32px;
--sp-7:  48px;
--sp-8:  64px;
--sp-9:  96px;
--sp-10: 128px;
--sp-11: 192px;

/* Section vertical rhythm */
--section-py: 40px;
/* Container max width */
--container-max: 1280px;
--container-px:  40px;
```

---

## Elevation & Shadows

```css
--shadow-sm:   0 1px 3px rgba(10,21,37,0.07);
--shadow-card: 0 4px 20px rgba(10,21,37,0.08), 0 1px 4px rgba(10,21,37,0.04);
--shadow-lg:   0 16px 48px rgba(10,21,37,0.12), 0 4px 12px rgba(10,21,37,0.06);
--shadow-gold: 0 0 0 1px rgba(201,169,110,0.35);
--shadow-nav:  0 1px 0 var(--clr-ash);
```

---

## Border Radius

```css
--radius-none: 0;
--radius-sm:   2px;   /* tags, badges */
--radius-md:   4px;   /* buttons, inputs */
--radius-lg:   8px;   /* cards */
--radius-pill: 100px; /* locale switcher, small chips */
```

Design rule: **prefer sharp edges (`--radius-none` or `--radius-sm`) for headers and CTAs**. This signals precision and authority. Reserve rounder corners for secondary UI elements.

---

## Motion

### Principles
- **One orchestrated entrance** per page load: hero copy, about copy, event cards, partners, and CTA all reveal with a short stagger
- **Hero motion stays subtle**: image crossfade + slight scale settle, never a hard jump
- **Scroll reveals**: about/events/CTA fade in on intersection; keep reveal timing short and editorial, not theatrical
- **Stats motion**: the hero-anchored stats panel counts up on load and settles into place as one frame
- **Hover states**: border/shadow transitions only, `200ms ease`; no scale transforms on content cards
- **Gold underline grow**: CTA links get a `::after` pseudo with gold bg, `width: 0 → 100%` on hover, `300ms ease`
- **Partner strip**: continuous marquee motion is allowed only for branding/supporting logos; no hover pause or grayscale filter
- **Ambient loop rule**: any decorative loop must stay slow, small, and have a reduced-motion fallback
- No parallax on mobile, no scroll-jacking

### Base CSS transitions
```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-soft:     cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-gold:     cubic-bezier(0.65, 0, 0.35, 1);
--duration-instant: 120ms;
--duration-fast:    180ms;
--duration-base:    240ms;
--duration-slow:    520ms;
--duration-page:    700ms;
--transition-fast:   150ms ease;
--transition-base:   200ms ease;
--transition-slow:   400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
--transition-reveal: 600ms cubic-bezier(0.16, 1, 0.3, 1);
```

### Shared motion utilities

Defined in `src/styles/global.css`. Use these before creating page-specific animation:

| Class | Use |
|---|---|
| `.page-transition` | Route-level page enter animation; applied in `src/App.tsx` |
| `.reveal` | Standard reveal-up entrance |
| `.reveal-soft` | Softer reveal with tiny scale + blur settle, for bars/surfaces |
| `.reveal-clip` | Editorial masked reveal, for feature panels and framed modules |
| `.reveal--delay-1` to `.reveal--delay-6` | 80ms stagger steps |
| `.motion-surface` | Shared hover lift + shadow + border transition for interactive surfaces |
| `.motion-underline` | Gold underline grow for text links |
| `.motion-hairline` | Gold/neutral hairline sweep |
| `.ambient-drift` | Slow decorative drift for watermark/seal elements |

### Route motion layer

`src/lib/useSiteMotion.ts` runs on every route change and applies `data-motion="pending|visible"` plus `data-motion-kind` to public page sections, cards, panels, feature blocks, forms, and footer columns. `src/styles/global.css` owns the animation behavior.

Use this layer as the default motion baseline across all pages:
- Sections and feature panels reveal on scroll with a short stagger.
- Cards, panels, and list items settle in with a slightly smaller scale.
- Image wraps get a restrained hover zoom/saturation settle.
- Buttons and text-action links get a short glint/lift micro-interaction.
- Watermarks and seal/icon ornaments can breathe slowly as ambient motion.

**Implementation rules:**
- Prefer these global classes for repeated patterns across pages.
- Page-specific CSS Modules may define custom motion only for unique compositions (Home hero stats, footer seal, marquee).
- All motion must respect `prefers-reduced-motion: reduce`.
- Never animate layout-critical dimensions on hover; use opacity, transform, clip-path, or filter.
- Primary public pages should include at least one visible motion layer beyond route enter: route motion reveal, subtle watermark drift, surface hover, gallery/image settle, or hairline sweep.
- Home stats use frame reveal + sheen + icon pulse; Home about visual uses watermark drift + hover image settle.
- Do not add heavy parallax, scroll-jacking, fast loops, or large bouncing transforms. KBIT motion should feel premium, clinical, and editorial.

---

## Layout System

### Grid
- 12-column grid, `gap: var(--sp-5)` on desktop, 4-column on tablet, 1-column on mobile
- Max-width container: `var(--container-max)` centered with `var(--container-px)` padding

### Section anatomy
```
┌─────────────────────────────────────────────────┐
│ [overline label — gold, xs, uppercase]          │
│ [Headline — Cormorant, d2]                      │
│ [Lead text — DM Sans, body-lg, stone color]     │
│                                                  │
│ [Content grid / cards]                           │
│                                                  │
│ [Optional CTA link or button]                   │
└─────────────────────────────────────────────────┘
```

### Layered hero pattern (homepage)
- Full-bleed midnight hero with a layered image crossfade and dark editorial overlay
- Left editorial panel: tag, headline, subcopy, CTAs, all inside the grid container
- Right-side note: slim vertical metadata stack on desktop only
- Stats panel: anchored inside the hero near the bottom, not as a separate band
- Gold accents are used as hairlines / dividers, not as filled blocks

---

## Component Registry

### Navigation
- Sticky top, `background: var(--clr-cream)`, `box-shadow: var(--shadow-nav)`
- Logo left, nav links center, locale switcher + CTA button right
- Mobile: hamburger → slide-in drawer from right
- Active link: gold `border-bottom: 2px solid var(--clr-gold)` on scroll-spy

### Buttons

```
Primary:   bg=--clr-navy,    text=white,      border=none,         radius=--radius-md
Outline:   bg=transparent,   text=--clr-navy, border=1px --navy,   radius=--radius-md
Ghost:     bg=transparent,   text=--clr-navy, border=none,         underline on hover
Gold:      bg=--clr-gold,    text=--clr-navy, border=none,         radius=--radius-md
Dark:      bg=--clr-midnight,text=white,      border=none          (for dark-bg sections)
```
Size: `padding: 12px 28px; font-size: var(--type-sm); font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase`

### Cards

```
Content card:
  bg: --clr-cream
  border: 1px solid var(--clr-ash)
  border-radius: var(--radius-lg)
  padding: var(--sp-6)
  box-shadow: var(--shadow-card)
  hover: box-shadow var(--shadow-lg); border-color var(--clr-gold); transition: var(--transition-slow)

Event card:
  image top (16:9, object-fit: cover), tag badge overlay bottom-left
  title: Cormorant --type-h2
  meta row: date + location — DM Sans --type-sm --clr-stone
  motion: gentle reveal-up on scroll, subtle hover lift only

News card:
  thumbnail left (1:1 square on mobile, 40% on desktop), content right
  category badge: DM Sans xs uppercase gold
  title: DM Sans h3
  excerpt: body --clr-stone, 2-line clamp

Partner strip item:
  logo centered in a marquee lane, original color preserved
  no grayscale filter, no hover pause
  height: 72px, contain mode

Stats panel:
  dark glass frame anchored inside the hero
  numbers use DM Mono; count-up runs on load
```

### Badges / Tags
```
  background: var(--clr-gold) at 15% opacity
  color: var(--clr-gold-dark)
  font-size: var(--type-xs)
  letter-spacing: 0.10em
  text-transform: uppercase
  padding: 3px 10px
  border-radius: var(--radius-sm)
```

### Section Divider (gold hairline)
```css
.section-divider {
  width: 40px;
  height: 2px;
  background: var(--clr-gold);
  margin-bottom: var(--sp-4);
}
```
Use before every Cormorant headline in light sections.

### Locale Switcher
- Pill shape, `DM Sans 500`, three options: `EN | VI | KO`
- Active: `bg: --clr-navy; color: white`
- Inactive: `bg: transparent; color: --clr-stone; border: 1px solid --clr-ash`

### Stats Panel
- Hero-anchored dark glass panel with a 4-column grid on desktop, 2x2 on mobile
- Number: `DM Mono --type-stat --clr-gold`
- Label: `DM Sans xs uppercase --clr-mist`
- Motion: frame reveal + count-up; the panel settles into place instead of sliding in as a band

### Hero Carousel
- Full-width, min-height: `clamp(680px, calc(100vh - 68px), 920px)`
- Overlay: layered midnight gradient with editorial left-to-right falloff
- Motion: image crossfade + slight scale settle on slide changes
- Composition: left editorial panel + right metadata note + bottom-anchored dots
- Navigation: minimal dots only (no arrows on mobile)
- Auto-advance: 5s, no hover pause

### PageHero — Inner Page Banner

**Component:** `src/components/PageHero.tsx` | **CSS:** `src/components/PageHero.module.css`

All inner pages (not Home) use `<PageHero>` for consistent banner sections. **Never** hard-code page hero HTML directly in a page file.

```tsx
<PageHero
  watermark="EVENTS"                   // ALL CAPS → large ghost text anchored right
  overline="Programs & Education"
  title={<>Global Workshops &amp;<br />Clinical Summits</>}
  desc="Optional subtitle."
  variant="dark"                       // 'dark' (default) | 'light'
/>
```

**Anatomy:**

- Giant ghost Cormorant text (weight 700, clamp 96–196px) anchored right, partially cropped — adds depth texture without noise
- `opacity: 0.62` on dark, `opacity: 0.95` (ash color) on light
- Gold hairline separator at bottom (`::after`)
- Content layer sits above watermark via `z-index: 1`
- Motion: content reveals up on mount, watermark drifts slowly, hairline sweeps in; all disabled under reduced motion

**dark variant:** midnight bg, white heading, gold overline, mist desc  
**light variant:** ivory bg, navy heading, gold-dark overline, stone desc

**Watermark keywords per page:**

| Page | `watermark` | `variant` |
|---|---|---|
| Events | `EVENTS` | dark |
| News | `NEWS` | dark |
| About | `ABOUT` | dark |
| Membership | `MEMBER` | dark |
| Experts | `EXPERTS` | dark |
| Centers | `CENTERS` | dark |
| Partners | `PARTNERS` | dark |
| Contact | `CONTACT` | dark |

### Event Detail Surface
- Back link from Events → event title
- Full-bleed cover hero with status badge, title, lead copy, and glass fact panel
- `PROGRAM DETAILS` label is an accent pill; `PART I / PART II` section headers are rendered as clear timeline blocks
- Program detail column preserves the seeded descriptions but breaks them into readable intro + timeline sections
- Participation side card for capacity, seats, registration, and format
- Static gallery grid from seeded event images; lightbox + keyboard navigation are allowed on the detail page
- Related events rail at the bottom for continued browsing
- Motion stays subtle: reveal-up, hero image settle, card hover lift, and gallery image zoom

---

## Iconography

Use **Phosphor Icons** (React package `@phosphor-icons/react`).
- Reasons: clean, consistent weight, large library, tree-shakeable
- Weight: `regular` for UI, `bold` for CTA/features, `fill` for active states
- Size: 20px (inline body), 24px (cards), 32px (feature blocks)
- Color: inherit from parent (use `currentColor`)

Do NOT use Heroicons or Material Icons — they lack the editorial quality needed.

---

## Image Strategy

### Responsive image contract

Every `<img>` in the app must:
1. Have a `srcset` with at minimum `400w`, `800w`, and `1200w` variants in WebP
2. Use `loading="lazy"` (except hero above-the-fold images which use `loading="eager"`)
3. Have an explicit `width` and `height` attribute (aspect-ratio CLS prevention)
4. Have a meaningful `alt` attribute (never empty except purely decorative)
5. Use `object-fit: cover` in a fixed-aspect container (never free-scaling)

### Optimization plan (pre-scaffold task)

All assets in `data/assets/` must be processed before they enter any image component.

**Problem — current sizes (top offenders):**
| File | Current | Target WebP | Saving |
|---|---|---|---|
| event-12-detail-1 | 22.9 MB JPG | ~350 KB | ~98% |
| event-12-detail-2 | 10.9 MB PNG | ~280 KB | ~97% |
| event-12-bannerimageurl | 10.4 MB PNG | ~260 KB | ~97% |
| inline news images (×9) | 3.8–9 MB each | ~150–250 KB each | ~95% |
| event banner PNGs (×8) | 2.7–6.4 MB each | ~100–200 KB each | ~96% |

**Tool: sharp (local Node.js dev dependency)**
```bash
npm install -D sharp
# Run the optimization script (see context/03-build-plan.md Phase 3)
node scripts/optimize-images.mjs
```
Use local `sharp` as a dev dependency — not global `sharp-cli`. The script `scripts/optimize-images.mjs` handles all resizing, WebP conversion, and manifest generation.

**Responsive size variants to generate per image:**
```
{name}-400w.webp   — max-width: 400px (mobile thumb, partner logo)
{name}-800w.webp   — max-width: 800px (tablet, card image)
{name}-1200w.webp  — max-width: 1200px (desktop content, hero)
{name}-1600w.webp  — max-width: 1600px (hero banner only)
```

**Output location:** `data/assets-opt/` (same subfolder structure as `data/assets/`)

**Vite plugin at build time:** Use `vite-imagetools` to apply the same pipeline at build, allowing `import img from './foo.jpg?w=800&format=webp'` syntax in components.

**Quality targets:**
- WebP quality: **82** (imperceptible loss, ~70–80% smaller than original JPG/PNG)
- Minimum dimension: never upscale above source
- LQIP (Low Quality Image Placeholder): 20px blurred WebP, inline as base64 in component until full image loads

---

## Page Registry

| Page | Route | Key sections |
|---|---|---|
| Home | `/` | Hero carousel + editorial panel, hero stats panel, About intro, Events teaser, Partners strip, CTA band |
| About | `/about` | Live operating story, narrative gaps, leadership, center snapshot |
| Events | `/events` | Featured event, Upcoming grid, Past archive |
| Event Detail | `/events/:slug` | Cover hero, fact panel, program brief, participation card, gallery, related events |
| News | `/news` | Featured article, magazine archive, internal article detail (public metadata only) |
| Experts | `/experts` | Expert network stats, verification framework, collaboration cards, contact CTA |
| Membership | `/membership` | Hero, local section index, membership structure, benefits, requirements, fees, local registration forms |
| Partners | `/partners` | Redirects to `/experts` until a dedicated partner page is approved |
| Centers | `/centers` | Map + center list |
| Contact | `/contact` | Inquiry form, support highlights, office cards |

All top-level routes exist at `/:locale/route` e.g. `/en/events`, `/vi/about`.
Event detail routes use `/:locale/events/:slug`.
News detail routes use `/:locale/news/:slug` and stay on-site (no outbound redirect to source domains). Public news detail must not render admin-only fields such as sourceId, sourceUrl, or raw localized slug data; avoid filler editorial copy unless it comes from the article or data seed.
Partner routes use `/:locale/partners` as an on-site redirect to `/:locale/experts`.

---

## Load-time Rules (UI-level)

- Fonts: `font-display: swap` — body text renders immediately in system font
- Hero images: `loading="eager"`, preloaded via `<link rel="preload">` for first hero only
- All below-fold images: `loading="lazy"`
- CSS custom properties defined in `:root` — no runtime JS theming
- No CSS-in-JS runtime — all styles as `.css` files or CSS Modules
- Animation: route enter uses `.page-transition`; repeated page motion uses global utilities (`.reveal`, `.reveal-soft`, `.reveal-clip`, `.motion-surface`, `.motion-underline`); Home uses CSS crossfade/scale, marquee, and hero stats-count motion; Event detail uses hero image settle, fact-panel reveal, gallery reveal, and related-card hover motion; News detail uses magazine-style hero, article flow, and related story cards; JS `IntersectionObserver` triggers about/events/partners/CTA reveals where needed
- No Tailwind CDN (generates unused CSS)

---

## Visual QA Checklist (pre-launch)

- [ ] All headings render in Cormorant Garamond (not fallback Georgia)
- [ ] Gold accent appears at most once in primary viewport at any scroll position
- [ ] Nav active locale is visible at all breakpoints
- [ ] All images display via `srcset` WebP; PNG/JPG fallback confirmed in Firefox
- [ ] No image without `width`/`height` attributes (CLS check)
- [ ] Dark sections: white text contrast ≥ 4.5:1 (WCAG AA)
- [ ] Light sections: navy text contrast ≥ 4.5:1
- [ ] Hover states on cards and buttons: confirmed keyboard-accessible via `:focus-visible`
- [ ] Home motion (hero, stats, reveal, marquee): confirmed reduced-motion fallback works and content stays readable
- [ ] Event detail back link / fact panel / gallery / related cards: confirmed keyboard and mobile behavior
- [ ] Mobile nav drawer: confirmed no scroll-lock issues
- [ ] Locale switch: confirmed URL prefix changes and content re-renders

---

## Do Not

- Do not paste Stitch HTML into React components
- Do not import Tailwind CDN
- Do not use Inter, Roboto, or Arial as primary fonts
- Do not use purple gradients or generic AI-slop gradients
- Do not use drop shadows that are too heavy (Material Design default levels)
- Do not add a second accent color — gold is the only accent
- Do not claim UI complete before all items in the Visual QA checklist pass


