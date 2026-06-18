import { useLocation } from 'react-router-dom'
import { ArrowRight, Buildings, Clock, Phone, Shield, UsersThree } from '@phosphor-icons/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Img from '@/components/Img'
import PageHero from '@/components/PageHero'
import { centers, localize, pages } from '@/lib/data'
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

  const centerList = (centers.data ?? []) as Array<{
    sourceId: number
    name: string
    address: string
    phone: string
    hours: string
    images: Array<{ imageUrl: string; altText: string }>
  }>
  const heroImage = centerList[0]?.images?.[0]?.imageUrl
    ? getImgKey(centerList[0].images[0].imageUrl)
    : 'centers/center-31-1-71612daa.jpg'

  if (!page?.highlights?.length) {
    return (
      <>
        <Nav />
        <div className="container section" style={{ minHeight: '60vh' }}>
          <h1>Centers</h1>
          <p>Content coming soon.</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Nav />

      <PageHero
        watermark="CENTERS"
        overline="Center Network"
        title={localize(page.title, locale)}
        desc={localize(page.intro, locale)}
        image={heroImage}
        imageAlt="KBIT education center and clinical training space"
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
                    <h3>{localize(item.title, locale)}</h3>
                    <p>{localize(item.desc, locale)}</p>
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
                    className={`${s.centerCard} motion-surface reveal`}
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
        <section className={`${s.ctaBand} section`}>
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
