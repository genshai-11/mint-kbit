---
name: membership-centers-experts-pages
description: Design spec for Membership, Centers, and Experts pages — Phase 4b continuation
metadata:
  type: project
---

# Phase 4b Pages: Membership, Centers, Experts

Date: 2026-06-08  
Status: Approved — proceed to implementation

## Scope

Build 3 pages in this order:
1. **Membership** (`/:locale/membership`)
2. **Centers** (`/:locale/centers`)
3. **Experts** (`/:locale/experts`)

Partners page deferred (logos only, no descriptions — insufficient for a full page).

---

## Data audit (confirmed from live site + seed)

### Membership
- `pages.membership`: title (EN/VI/KO), intro, heroImage URL, 3 pillars with icon/title/desc
- `membership.tiers`: 3 tiers (Basic/Professional/Premium) — **prices and benefits are [GAP]**
- Registration form: **does not exist** on live site or in seed
- FAQ: `[GAP]` — skip
- Live site headings confirmed: "KBIT Official Membership Program", "Exclusive Benefits", "Professional Network", "Industry Growth"

### Centers
- `pages.centers`: title, intro, 3 highlights (Modern Facilities, Professional Team, Safety Commitment)
- `centers.data`: 1 real center (KBIT 1, 46 Yen The, phone, hours, 1 image in data/assets/centers)
- Hero image: placeholder PNG (uses Img component with getImgKey)

### Experts
- `pages.experts`: title, intro, 3 stats (50+, International Certification, Global Collaboration), 4 collaborate items
- `experts.data`: empty array — no profiles
- Live site confirmed: "No experts found" — gap state is the correct display

---

## Page designs

### 1. Membership

Sections:
1. **PageHero** — watermark=`MEMBER`, overline="Professional Excellence", title from `pages.membership.title`, desc from `pages.membership.intro`
2. **Pillars** (ivory bg) — 3 cards with Phosphor icon + title + desc from `pages.membership.pillars`. Icons: Heart → `Heart`, Users → `UsersThree`, TrendingUp → `TrendUp`
3. **Tiers** (cream bg, section-alt) — 3 tier cards (Basic / Professional / Premium). Professional card gets `isPopular` highlight (gold border + "Most Popular" badge). Price row: "Contact for details" with mailto CTA since pricing is [GAP]. No benefit list (data is [GAP]).
4. **CTA band** (midnight bg) — "Ready to join KBIT?" → email CTA + phone

No FAQ section (zero data).

### 2. Centers

Sections:
1. **PageHero** — watermark=`CENTERS`, overline="Center Network", title from `pages.centers.title`
2. **Highlights** (ivory bg) — 3 feature cards from `pages.centers.highlights` with Phosphor icons
3. **Center grid** (cream bg) — cards from `centers.data`. Each card: center image (Img component), name, address, phone, hours. Designed to scale as more centers are added.
4. **Contact CTA** — "Visit or inquire" → link to contact page

### 3. Experts

Sections:
1. **PageHero** — watermark=`EXPERTS`, overline="Key Doctors & Specialists", title from `pages.experts.title`
2. **Stats row** (midnight bg) — 3 stat panels from `pages.experts.stats` (value + label + desc)
3. **Collaborate** (ivory bg) — 4 cards from `pages.experts.collaborate`
4. **Gap notice** (cream bg) — editorial "Expert profiles are being compiled" notice + link to contact for collaboration inquiries

---

## Code conventions (match existing pages)

- File structure: `src/pages/PageName.tsx` + `src/pages/PageName.module.css`
- Locale: `useLocation()` → parse `segments[1]` → `isLocale()` → fallback `'en'`
- Data: import from `@/lib/data`, use `t()` for i18n strings
- Images: `getImgKey(path)` helper, `<Img>` component
- Motion: `.reveal`, `.reveal-soft`, `.reveal-clip`, `.motion-surface` global classes
- Structure: `<Nav />` → `<PageHero />` → `<main>` sections → `<Footer />`
- Each section: `<section className={`${s.xxx} section`}><div className="container">...`
- Headings in light sections: `<div className="section-divider" />` before Cormorant h2

---

## Out of scope

- Registration forms (no data source)
- FAQ (data gap)
- Partners page (insufficient content)
- Tier pricing (client must provide)
- Expert profiles (client must provide)
