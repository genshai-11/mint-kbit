# Membership, Centers, Experts Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build three production-quality Phase 4b pages — Membership, Centers, Experts — using the Seoul Prestige design system and all established code patterns from About/Contact/News pages.

**Architecture:** Each page is a standalone route component (`src/pages/PageName.tsx`) with a co-located CSS Module (`src/pages/PageName.module.css`). Data comes from `@/lib/data` (already imported). The `PageHero` component, `Img` component, `Nav`, `Footer`, and global motion classes (`.reveal`, `.reveal-soft`, `.motion-surface`) are used everywhere. Locale is parsed from URL via `useLocation()`.

**Tech Stack:** React 18, Vite, TypeScript, CSS Modules, `@phosphor-icons/react`, `react-router-dom`, seed JSON via `@/lib/data`

---

## File map

| File | Action | Responsibility |
|---|---|---|
| `src/pages/Membership.tsx` | Replace stub | Full membership page component |
| `src/pages/Membership.module.css` | Create | Scoped styles for membership page |
| `src/pages/Centers.tsx` | Replace stub | Full centers page component |
| `src/pages/Centers.module.css` | Create | Scoped styles for centers page |
| `src/pages/Experts.tsx` | Replace stub | Full experts page with gap state |
| `src/pages/Experts.module.css` | Create | Scoped styles for experts page |

---

## Task 1: Membership page

**Files:**
- Replace: `src/pages/Membership.tsx`
- Create: `src/pages/Membership.module.css`

**Data contract:**
- `pages.membership` → title, intro, pillars (icon/title/desc × 3)
- `membership.tiers` → name, durationMonths, isPopular, isActive, sortOrder
- `settings.contact.email`, `settings.contact.phoneVn`

- [ ] **Step 1.1: Replace `src/pages/Membership.tsx`**

```tsx
import { useLocation } from 'react-router-dom'
import { ArrowRight, Heart, TrendUp, UsersThree } from '@phosphor-icons/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PageHero from '@/components/PageHero'
import { membership, pages, settings, t as translate } from '@/lib/data'
import { isLocale, type Locale } from '@/lib/locale'
import s from './Membership.module.css'

function getPillarIcon(icon: string) {
  switch (icon) {
    case 'heart': return Heart
    case 'users': return UsersThree
    case 'trending-up': return TrendUp
    default: return Heart
  }
}

export default function Membership() {
  const location = useLocation()
  const segments = location.pathname.split('/')
  const locale: Locale = isLocale(segments[1]) ? segments[1] : 'en'

  const page = pages.membership as {
    title: { en: string; vi?: string; ko?: string }
    intro: { en: string; vi?: string; ko?: string }
    pillars: Array<{
      icon: string
      title: { en: string; vi?: string; ko?: string }
      desc: { en: string; vi?: string; ko?: string }
    }>
  }

  const tiers = (membership.tiers as Array<{
    name: { en: string; vi?: string; ko?: string }
    durationMonths: number
    isPopular: boolean
    isActive: boolean
    sortOrder: number
  }>)
    .filter(t => t.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <>
      <Nav />

      <PageHero
        watermark="MEMBER"
        overline="Professional Excellence Program"
        title={translate(page.title, locale)}
        desc={translate(page.intro, locale)}
      />

      <main>
        {/* ── Pillars ── */}
        <section className={`${s.pillarsSection} section`}>
          <div className="container">
            <div className={s.sectionHeader}>
              <div>
                <div className="section-divider" />
                <span className="overline">Why join KBIT</span>
                <h2 className="headline-display">Exclusive membership benefits</h2>
              </div>
            </div>
            <div className={s.pillarsGrid}>
              {page.pillars.map((pillar, index) => {
                const Icon = getPillarIcon(pillar.icon)
                return (
                  <article
                    key={index}
                    className={`${s.pillarCard} motion-surface reveal`}
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <div className={s.pillarIconWrap} aria-hidden="true">
                      <Icon size={28} weight="bold" className={s.pillarIcon} />
                    </div>
                    <h3>{translate(pillar.title, locale)}</h3>
                    <p>{translate(pillar.desc, locale)}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Tiers ── */}
        <section className={`${s.tiersSection} section`}>
          <div className="container">
            <div className={s.sectionHeader}>
              <div>
                <div className="section-divider" />
                <span className="overline">Membership tiers</span>
                <h2 className="headline-display">Choose your level</h2>
              </div>
              <p className={s.sectionNote}>
                Pricing details available upon inquiry — contact us to learn about each tier.
              </p>
            </div>
            <div className={s.tiersGrid}>
              {tiers.map((tier, index) => {
                const name = translate(tier.name, locale)
                return (
                  <article
                    key={tier.name.en}
                    className={`${s.tierCard} ${tier.isPopular ? s.tierCardPopular : ''} reveal`}
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    {tier.isPopular && (
                      <div className={s.popularBadge}>Most Popular</div>
                    )}
                    <div className={s.tierHeader}>
                      <h3>{name}</h3>
                      <p className={s.tierDuration}>{tier.durationMonths}-month membership</p>
                    </div>
                    <div className={s.tierPrice}>Contact for pricing</div>
                    <a
                      href={`mailto:${settings.contact.email}?subject=Membership Inquiry — ${name}`}
                      className={`${s.tierCta} ${tier.isPopular ? s.tierCtaPopular : ''}`}
                    >
                      Inquire about {name} <ArrowRight size={15} weight="bold" aria-hidden="true" />
                    </a>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── CTA Band ── */}
        <section className={s.ctaBand}>
          <div className="container">
            <div className={s.ctaInner}>
              <div>
                <div className="section-divider" />
                <h2>Ready to join KBIT?</h2>
                <p>
                  Connect with our team to start your membership journey and access Korea's
                  leading aesthetic medical network.
                </p>
              </div>
              <div className={s.ctaActions}>
                <a
                  href={`mailto:${settings.contact.email}?subject=Membership Inquiry`}
                  className={s.ctaPrimary}
                >
                  Email us <ArrowRight size={16} weight="bold" aria-hidden="true" />
                </a>
                <a href={`tel:${settings.contact.phoneVn}`} className={s.ctaSecondary}>
                  Call Vietnam office
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
```

- [ ] **Step 1.2: Create `src/pages/Membership.module.css`**

```css
/* ── Shared header ── */
.sectionHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--sp-6);
  margin-bottom: var(--sp-8);
}

.sectionNote {
  max-width: 300px;
  font-size: var(--type-sm);
  color: var(--clr-stone);
  text-align: right;
  line-height: 1.65;
}

/* ── Pillars ── */
.pillarsSection {
  background: var(--clr-ivory);
}

.pillarsGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-5);
}

.pillarCard {
  background: var(--clr-cream);
  border: 1px solid var(--clr-ash);
  border-radius: var(--radius-lg);
  padding: var(--sp-6);
  box-shadow: var(--shadow-card);
}

.pillarIconWrap {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  background: rgba(201, 169, 110, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--sp-5);
}

.pillarIcon {
  color: var(--clr-gold-dark);
}

.pillarCard h3 {
  font-family: var(--font-display);
  font-size: var(--type-d3);
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--clr-navy);
  margin-bottom: var(--sp-3);
}

.pillarCard p {
  font-size: var(--type-body);
  color: var(--clr-stone);
  line-height: 1.75;
}

/* ── Tiers ── */
.tiersSection {
  background: var(--clr-section-alt);
}

.tiersGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-5);
}

.tierCard {
  position: relative;
  background: var(--clr-cream);
  border: 1px solid var(--clr-ash);
  border-radius: var(--radius-lg);
  padding: var(--sp-6);
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
}

.tierCardPopular {
  border-color: var(--clr-gold);
  box-shadow: var(--shadow-card), var(--shadow-gold);
}

.popularBadge {
  position: absolute;
  top: -1px;
  right: var(--sp-5);
  background: var(--clr-gold);
  color: var(--clr-navy);
  font-size: var(--type-xs);
  font-weight: 700;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
}

.tierHeader h3 {
  font-family: var(--font-display);
  font-size: var(--type-d3);
  font-weight: 400;
  letter-spacing: -0.02em;
  color: var(--clr-navy);
  margin-bottom: var(--sp-2);
}

.tierDuration {
  font-size: var(--type-sm);
  color: var(--clr-stone);
}

.tierPrice {
  font-family: var(--font-mono);
  font-size: var(--type-h2);
  color: var(--clr-gold-dark);
  font-weight: 500;
}

.tierCta {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  margin-top: auto;
  background: var(--clr-navy);
  color: var(--clr-white);
  font-size: var(--type-sm);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 12px var(--sp-5);
  border-radius: var(--radius-md);
  transition: var(--transition-base);
}

.tierCta:hover {
  background: var(--clr-navy-soft);
}

.tierCtaPopular {
  background: var(--clr-gold);
  color: var(--clr-navy);
}

.tierCtaPopular:hover {
  background: var(--clr-gold-dark);
  color: var(--clr-white);
}

/* ── CTA Band ── */
.ctaBand {
  background: var(--clr-midnight);
  padding-block: var(--section-py);
}

.ctaInner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--sp-8);
}

.ctaBand h2 {
  font-family: var(--font-display);
  font-size: var(--type-d2);
  font-weight: 300;
  letter-spacing: -0.02em;
  color: var(--clr-white);
  margin-block: var(--sp-4);
}

.ctaBand p {
  font-size: var(--type-body);
  color: var(--clr-mist);
  max-width: 520px;
  line-height: 1.75;
}

.ctaActions {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  flex-shrink: 0;
}

.ctaPrimary {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  background: var(--clr-gold);
  color: var(--clr-navy);
  font-size: var(--type-sm);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 12px 28px;
  border-radius: var(--radius-md);
  transition: var(--transition-base);
}

.ctaPrimary:hover {
  background: var(--clr-gold-light);
}

.ctaSecondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--clr-mist);
  font-size: var(--type-sm);
  font-weight: 500;
  padding: 12px 28px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-md);
  transition: var(--transition-base);
}

.ctaSecondary:hover {
  color: var(--clr-white);
  border-color: rgba(255, 255, 255, 0.35);
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .pillarsGrid,
  .tiersGrid {
    grid-template-columns: 1fr 1fr;
  }

  .ctaInner {
    flex-direction: column;
    align-items: flex-start;
  }

  .ctaActions {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .sectionHeader {
    flex-direction: column;
    align-items: flex-start;
  }

  .sectionNote {
    text-align: left;
    max-width: none;
  }
}

@media (max-width: 640px) {
  .pillarsGrid,
  .tiersGrid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 1.3: Verify dev server renders the page**

Run: `npm run dev` in `kbit-new-project/`
Navigate to `http://localhost:5173/en/membership`

Expected:
- PageHero with watermark "MEMBER"
- 3 pillar cards (Exclusive Benefits / Professional Network / Industry Growth) with gold icon boxes
- 3 tier cards — Professional card has gold border + "Most Popular" badge
- Each tier card shows "Contact for pricing" + "Inquire about [Name]" button
- Dark CTA band at bottom with gold "Email us" button
- No console errors

---

## Task 2: Centers page

**Files:**
- Replace: `src/pages/Centers.tsx`
- Create: `src/pages/Centers.module.css`

**Data contract:**
- `pages.centers` → title, intro, highlights (icon/title/desc × 3)
- `centers.data` → array of `{ sourceId, name, address, phone, hours, images: [{ imageUrl, altText }] }`
- Images live in `data/assets/centers/` — accessed via `getImgKey()` + `<Img>` component

- [ ] **Step 2.1: Replace `src/pages/Centers.tsx`**

```tsx
import { useLocation } from 'react-router-dom'
import { ArrowRight, Buildings, Clock, Phone, Shield, UsersThree } from '@phosphor-icons/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Img from '@/components/Img'
import PageHero from '@/components/PageHero'
import { centers, pages, t as translate } from '@/lib/data'
import { isLocale, type Locale } from '@/lib/locale'
import s from './Centers.module.css'

function getImgKey(path: string): string {
  return path.replace(/^(\.\/)?data\/assets\//, '')
}

function getHighlightIcon(name: string) {
  switch (name) {
    case 'building': return Buildings
    case 'users': return UsersThree
    case 'shield': return Shield
    default: return Buildings
  }
}

export default function Centers() {
  const location = useLocation()
  const segments = location.pathname.split('/')
  const locale: Locale = isLocale(segments[1]) ? segments[1] : 'en'

  const page = pages.centers as {
    title: { en: string; vi?: string; ko?: string }
    intro: { en: string; vi?: string; ko?: string }
    highlights: Array<{
      icon: string
      title: { en: string; vi?: string; ko?: string }
      desc: { en: string; vi?: string; ko?: string }
    }>
  }

  const centerList = centers.data as Array<{
    sourceId: number
    name: string
    address: string
    phone: string
    hours: string
    images: Array<{ imageUrl: string; altText: string }>
  }>

  return (
    <>
      <Nav />

      <PageHero
        watermark="CENTERS"
        overline="Center Network"
        title={translate(page.title, locale)}
        desc={translate(page.intro, locale)}
      />

      <main>
        {/* ── Highlights ── */}
        <section className={`${s.highlightsSection} section`}>
          <div className="container">
            <div className={s.sectionHeader}>
              <div>
                <div className="section-divider" />
                <span className="overline">What to expect</span>
                <h2 className="headline-display">Korean-standard excellence</h2>
              </div>
            </div>
            <div className={s.highlightsGrid}>
              {page.highlights.map((item, index) => {
                const Icon = getHighlightIcon(item.icon)
                return (
                  <article
                    key={index}
                    className={`${s.highlightCard} motion-surface reveal`}
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <div className={s.highlightIconWrap} aria-hidden="true">
                      <Icon size={28} weight="bold" className={s.highlightIcon} />
                    </div>
                    <h3>{translate(item.title, locale)}</h3>
                    <p>{translate(item.desc, locale)}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Center cards ── */}
        <section className={`${s.centersSection} section`}>
          <div className="container">
            <div className={s.sectionHeader}>
              <div>
                <div className="section-divider" />
                <span className="overline">Our centers</span>
                <h2 className="headline-display">Find a KBIT center</h2>
              </div>
            </div>
            <div className={s.centersGrid}>
              {centerList.map((center, index) => {
                const image = center.images?.[0]
                return (
                  <article
                    key={center.sourceId}
                    className={`${s.centerCard} reveal`}
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className={s.centerImageWrap}>
                      {image ? (
                        <Img
                          src={getImgKey(image.imageUrl)}
                          alt={center.name}
                          className={s.centerImage}
                          loading="lazy"
                          width={720}
                          height={480}
                        />
                      ) : (
                        <div className={s.centerImageFallback} aria-hidden="true">KBIT</div>
                      )}
                    </div>
                    <div className={s.centerBody}>
                      <div className={s.centerTag}>Education Center</div>
                      <h3>{center.name}</h3>
                      <ul className={s.centerMeta}>
                        <li><Buildings size={14} weight="bold" aria-hidden="true" />{center.address}</li>
                        <li><Phone size={14} weight="bold" aria-hidden="true" />{center.phone}</li>
                        <li><Clock size={14} weight="bold" aria-hidden="true" />{center.hours}</li>
                      </ul>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className={s.ctaBand}>
          <div className="container">
            <div className={s.ctaInner}>
              <div>
                <div className="section-divider" />
                <h2>Visit or inquire about our centers</h2>
                <p>
                  Reach us directly to get directions, schedule a visit, or learn more about
                  what each KBIT center offers.
                </p>
              </div>
              <a href={`/${locale}/contact`} className={s.ctaPrimary}>
                Contact us <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
```

- [ ] **Step 2.2: Create `src/pages/Centers.module.css`**

```css
/* ── Shared ── */
.sectionHeader {
  margin-bottom: var(--sp-8);
}

/* ── Highlights ── */
.highlightsSection {
  background: var(--clr-ivory);
}

.highlightsGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-5);
}

.highlightCard {
  background: var(--clr-cream);
  border: 1px solid var(--clr-ash);
  border-radius: var(--radius-lg);
  padding: var(--sp-6);
  box-shadow: var(--shadow-card);
}

.highlightIconWrap {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  background: rgba(201, 169, 110, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--sp-5);
}

.highlightIcon {
  color: var(--clr-gold-dark);
}

.highlightCard h3 {
  font-family: var(--font-display);
  font-size: var(--type-d3);
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--clr-navy);
  margin-bottom: var(--sp-3);
}

.highlightCard p {
  font-size: var(--type-body);
  color: var(--clr-stone);
  line-height: 1.75;
}

/* ── Centers ── */
.centersSection {
  background: var(--clr-section-alt);
}

.centersGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--sp-6);
}

.centerCard {
  background: var(--clr-cream);
  border: 1px solid var(--clr-ash);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: box-shadow var(--transition-slow), border-color var(--transition-slow);
}

.centerCard:hover {
  box-shadow: var(--shadow-lg);
  border-color: var(--clr-gold);
}

.centerCard:hover .centerImage {
  transform: scale(1.04);
}

.centerImageWrap {
  position: relative;
  aspect-ratio: 3 / 2;
  background: var(--clr-midnight);
  overflow: hidden;
}

.centerImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 700ms var(--ease-out-expo);
}

.centerImageFallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: rgba(255, 255, 255, 0.12);
}

.centerBody {
  padding: var(--sp-5) var(--sp-6) var(--sp-6);
}

.centerTag {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  background: rgba(201, 169, 110, 0.12);
  border: 1px solid rgba(201, 169, 110, 0.24);
  color: var(--clr-gold-dark);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: var(--sp-3);
}

.centerBody h3 {
  font-family: var(--font-display);
  font-size: var(--type-h1);
  font-weight: 400;
  letter-spacing: -0.02em;
  color: var(--clr-navy);
  margin-bottom: var(--sp-4);
}

.centerMeta {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.centerMeta li {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--type-sm);
  color: var(--clr-stone);
}

/* ── CTA ── */
.ctaBand {
  background: var(--clr-midnight);
  padding-block: var(--section-py);
}

.ctaInner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--sp-8);
}

.ctaBand h2 {
  font-family: var(--font-display);
  font-size: var(--type-d2);
  font-weight: 300;
  letter-spacing: -0.02em;
  color: var(--clr-white);
  margin-block: var(--sp-4);
}

.ctaBand p {
  font-size: var(--type-body);
  color: var(--clr-mist);
  max-width: 520px;
  line-height: 1.75;
}

.ctaPrimary {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  flex-shrink: 0;
  background: var(--clr-gold);
  color: var(--clr-navy);
  font-size: var(--type-sm);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 12px 28px;
  border-radius: var(--radius-md);
  transition: var(--transition-base);
}

.ctaPrimary:hover {
  background: var(--clr-gold-light);
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .highlightsGrid {
    grid-template-columns: 1fr 1fr;
  }

  .ctaInner {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 640px) {
  .highlightsGrid,
  .centersGrid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2.3: Verify dev server renders the page**

Navigate to `http://localhost:5173/en/centers`

Expected:
- PageHero with watermark "CENTERS"
- 3 highlight cards (Modern Facilities / Professional Team / Safety Commitment) with gold icon boxes
- Center card for "KBIT 1" with its real photo from `data/assets/centers/`, address "46 Yen The", phone, hours
- Dark CTA band with "Contact us" link to `/en/contact`
- No broken images — the center photo should render (check `Img` component path resolution)

---

## Task 3: Experts page (gap state)

**Files:**
- Replace: `src/pages/Experts.tsx`
- Create: `src/pages/Experts.module.css`

**Data contract:**
- `pages.experts` → title, intro, stats (value/label/desc × 3), collaborate (title/desc × 4)
- `experts.data` is an empty array — **do not render any profile cards**
- `settings.contact.email` for the gap CTA

- [ ] **Step 3.1: Replace `src/pages/Experts.tsx`**

```tsx
import { useLocation } from 'react-router-dom'
import { ArrowRight, Certificate, GlobeHemisphereEast, Stethoscope, UsersThree } from '@phosphor-icons/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PageHero from '@/components/PageHero'
import { pages, settings, t as translate } from '@/lib/data'
import { isLocale, type Locale } from '@/lib/locale'
import s from './Experts.module.css'

const COLLABORATE_ICONS = [Stethoscope, GlobeHemisphereEast, Certificate, UsersThree]

export default function Experts() {
  const location = useLocation()
  const segments = location.pathname.split('/')
  const locale: Locale = isLocale(segments[1]) ? segments[1] : 'en'

  const page = pages.experts as {
    title: { en: string; vi?: string; ko?: string }
    intro: { en: string; vi?: string; ko?: string }
    stats: Array<{
      value: string | null
      label: { en: string; vi?: string; ko?: string }
      desc: { en: string; vi?: string; ko?: string }
    }>
    collaborate: Array<{
      title: { en: string; vi?: string; ko?: string }
      desc: { en: string; vi?: string; ko?: string }
    }>
  }

  return (
    <>
      <Nav />

      <PageHero
        watermark="EXPERTS"
        overline="Key Doctors & Specialists"
        title={translate(page.title, locale)}
        desc={translate(page.intro, locale)}
      />

      <main>
        {/* ── Stats band ── */}
        <section className={s.statsSection}>
          <div className="container">
            <div className={s.statsGrid}>
              {page.stats.map((stat, index) => (
                <div key={index} className={s.statItem}>
                  {stat.value && (
                    <strong className={s.statValue}>{stat.value}</strong>
                  )}
                  <span className={s.statLabel}>{translate(stat.label, locale)}</span>
                  <p className={s.statDesc}>{translate(stat.desc, locale)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Collaborate ── */}
        <section className={`${s.collaborateSection} section`}>
          <div className="container">
            <div className={s.sectionHeader}>
              <div>
                <div className="section-divider" />
                <span className="overline">Collaborate with KBIT</span>
                <h2 className="headline-display">Join our expert network</h2>
              </div>
            </div>
            <div className={s.collaborateGrid}>
              {page.collaborate.map((item, index) => {
                const Icon = COLLABORATE_ICONS[index % COLLABORATE_ICONS.length]
                return (
                  <article
                    key={index}
                    className={`${s.collaborateCard} motion-surface reveal`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={s.collaborateIconWrap} aria-hidden="true">
                      <Icon size={26} weight="bold" className={s.collaborateIcon} />
                    </div>
                    <h3>{translate(item.title, locale)}</h3>
                    <p>{translate(item.desc, locale)}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Gap notice ── */}
        <section className={`${s.gapSection} section`}>
          <div className="container">
            <div className={s.gapCard}>
              <div className={s.gapInner}>
                <span className="overline">Expert directory</span>
                <h2>Expert profiles are being compiled</h2>
                <p>
                  KBIT's network of 50+ Korean aesthetic specialists is being documented.
                  Full profiles — credentials, specialties, and regions — will appear here
                  once verified and submitted by each expert.
                </p>
                <a
                  href={`mailto:${settings.contact.email}?subject=Expert Collaboration Inquiry`}
                  className={s.gapCta}
                >
                  Inquire about joining the expert network
                  <ArrowRight size={15} weight="bold" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
```

- [ ] **Step 3.2: Create `src/pages/Experts.module.css`**

```css
/* ── Stats band ── */
.statsSection {
  background: var(--clr-midnight);
  padding-block: var(--sp-9);
}

.statsGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-6);
}

.statItem {
  padding: var(--sp-6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.04);
}

.statValue {
  display: block;
  font-family: var(--font-mono);
  font-size: var(--type-stat);
  color: var(--clr-gold);
  line-height: 1;
  margin-bottom: var(--sp-3);
}

.statLabel {
  display: block;
  font-size: var(--type-xs);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--clr-white);
  margin-bottom: var(--sp-2);
}

.statDesc {
  font-size: var(--type-sm);
  color: var(--clr-mist);
  line-height: 1.65;
}

/* ── Shared header ── */
.sectionHeader {
  margin-bottom: var(--sp-8);
}

/* ── Collaborate ── */
.collaborateSection {
  background: var(--clr-ivory);
}

.collaborateGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--sp-5);
}

.collaborateCard {
  background: var(--clr-cream);
  border: 1px solid var(--clr-ash);
  border-radius: var(--radius-lg);
  padding: var(--sp-6);
  box-shadow: var(--shadow-card);
}

.collaborateIconWrap {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  background: rgba(201, 169, 110, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--sp-5);
}

.collaborateIcon {
  color: var(--clr-gold-dark);
}

.collaborateCard h3 {
  font-family: var(--font-display);
  font-size: var(--type-d3);
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--clr-navy);
  margin-bottom: var(--sp-3);
}

.collaborateCard p {
  font-size: var(--type-body);
  color: var(--clr-stone);
  line-height: 1.75;
}

/* ── Gap notice ── */
.gapSection {
  background: var(--clr-section-alt);
}

.gapCard {
  border: 1px solid var(--clr-ash);
  border-radius: var(--radius-lg);
  background: var(--clr-cream);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.gapInner {
  padding: var(--sp-9) var(--sp-8);
  max-width: 680px;
}

.gapInner h2 {
  font-family: var(--font-display);
  font-size: var(--type-d2);
  font-weight: 400;
  letter-spacing: -0.02em;
  color: var(--clr-navy);
  margin-block: var(--sp-4);
}

.gapInner p {
  font-size: var(--type-body-lg);
  color: var(--clr-stone);
  line-height: 1.8;
  margin-bottom: var(--sp-6);
}

.gapCta {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  background: var(--clr-navy);
  color: var(--clr-white);
  font-size: var(--type-sm);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 12px 28px;
  border-radius: var(--radius-md);
  transition: var(--transition-base);
}

.gapCta:hover {
  background: var(--clr-navy-soft);
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .statsGrid {
    grid-template-columns: 1fr;
    gap: var(--sp-4);
  }

  .collaborateGrid {
    grid-template-columns: 1fr;
  }

  .gapInner {
    padding: var(--sp-7) var(--sp-5);
  }
}

@media (max-width: 640px) {
  .statsGrid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3.3: Verify dev server renders the page**

Navigate to `http://localhost:5173/en/experts`

Expected:
- PageHero with watermark "EXPERTS"
- Dark stats band: "50+" value in gold DM Mono, plus "International Certification" and "Global Collaboration" (no value, label + desc only)
- 2×2 grid of collaborate cards with gold icon boxes
- Gap notice card: cream background, editorial text "Expert profiles are being compiled", navy "Inquire" CTA button
- No profile grid, no "No experts found" error message
- No console errors

---

## Task 4: Final check — all three pages

- [ ] **Step 4.1: Run through all three pages in browser**

With dev server running, visit in order:
1. `http://localhost:5173/en/membership`
2. `http://localhost:5173/en/centers`
3. `http://localhost:5173/en/experts`

Check on each page:
- [ ] PageHero watermark renders in Cormorant Garamond (not Georgia fallback)
- [ ] Gold accent appears at most once in primary viewport
- [ ] Nav active state shows "Membership" / "Centers" / "Experts" respectively
- [ ] No broken images (Centers: check center photo renders from `data/assets-opt/` or `data/assets/`)
- [ ] Hover states on cards work (border shifts to gold, shadow deepens)
- [ ] No console errors or TypeScript warnings in Vite output

- [ ] **Step 4.2: Check mobile layout (resize to 375px)**

Resize browser to 375px width and verify:
- Membership: pillars stack to 1 column, tiers stack to 1 column, CTA band wraps correctly
- Centers: highlights stack to 1 column, center card fills full width
- Experts: stats stack to 1 column, collaborate cards stack to 1 column

- [ ] **Step 4.3: Update `context/03-build-plan.md`**

In `context/03-build-plan.md`, under Phase 4b, mark Membership, Centers, and Experts as done:

```markdown
4. **News** — Featured article, News grid, category filter ✓
5. **Membership** ✓
6. **About** — Mission/Vision, Leadership, Map ✓
7. **Partners** — Logo grid (deferred)
8. **Contact** — Form + Office cards ✓
9. **Experts** — Gap state ✓
10. **Centers** — Center cards ✓
```

- [ ] **Step 4.4: Update `context/04-operating-state.md`** (Hermes board)

Mark the three page tasks as complete in the Kanban board snapshot.
