import { useLocation } from 'react-router-dom'
import { ArrowRight, Buildings, Clock, Phone, Shield, UsersThree } from '@phosphor-icons/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ContentImg from '@/components/ContentImg'
import PageHero from '@/components/PageHero'
import { localize, pages } from '@/lib/data'
import { useCenters } from '@/lib/content/centers'
import { isLocale, type Locale } from '@/lib/locale'
import { tr } from '@/lib/ui'
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

  const centerList = useCenters(locale)
  const heroImage = centerList[0]?.images?.[0]?.imageUrl
    ? getImgKey(centerList[0].images[0].imageUrl)
    : 'centers/center-31-1-71612daa.jpg'

  if (!page?.highlights?.length) {
    return (
      <>
        <Nav />
        <div className="container section" style={{ minHeight: '60vh' }}>
          <h1>{tr('Centers', locale)}</h1>
          <p>{tr('Content coming soon.', locale)}</p>
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
        overline={tr('Center Network', locale)}
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
                <span className="overline">{tr('What to expect', locale)}</span>
                <h2 className="headline-display">{tr('Korean-standard excellence', locale)}</h2>
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
                <span className="overline">{tr('Our centers', locale)}</span>
                <h2 className="headline-display">{tr('Find a KBIT center', locale)}</h2>
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
                        <ContentImg
                          localSrc={image.imageUrl}
                          sanityImage={image.sanityImage}
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
                      <div className={s.centerTag}>{tr('Education Center', locale)}</div>
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
                <h2>{tr('Visit or inquire about our centers', locale)}</h2>
                <p>
                  {tr('Reach us directly to get directions, schedule a visit, or learn more about what each KBIT center offers.', locale)}
                </p>
              </div>
              <a href={`/${locale}/contact`} className={s.ctaPrimary}>
                {tr('Contact us', locale)} <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
