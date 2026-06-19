import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Certificate, GlobeHemisphereEast, Stethoscope, UsersThree } from '@phosphor-icons/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PageHero from '@/components/PageHero'
import ContentImg from '@/components/ContentImg'
import { localize, pages } from '@/lib/data'
import { useExperts } from '@/lib/content/experts'
import { isLocale, type Locale } from '@/lib/locale'
import { tr } from '@/lib/ui'
import s from './Experts.module.css'

const COLLABORATE_ICONS = [Stethoscope, GlobeHemisphereEast, Certificate, UsersThree]

export default function Experts() {
  const location = useLocation()
  const segments = location.pathname.split('/')
  const locale: Locale = isLocale(segments[1]) ? segments[1] : 'en'
  const experts = useExperts(locale)

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

  const vettingSteps = [
    tr('Credentials and clinical scope are reviewed before a profile is published.', locale),
    tr('Specialties, teaching roles, and regional availability are structured for browsing.', locale),
    tr('Verified doctors can be connected to events, training programs, and member benefits.', locale),
  ]

  return (
    <>
      <Nav />

      <PageHero
        watermark="EXPERTS"
        overline={tr('Key Doctors & Specialists', locale)}
        title={localize(page.title, locale)}
        desc={localize(page.intro, locale)}
        image="news/news-kat-2025-elevating-korea-vietnam-medical-aesthetic-collaboration-inline-1-6841cdc8.jpg"
        imageAlt="KBIT specialists and delegates at KAT 2025"
      />

      <main className={s.pageShell}>
        <section className={s.statsSection}>
          <div className={`container ${s.statsGrid}`}>
            {(page.stats ?? []).map((stat, index) => (
              <article key={index} className={s.statItem}>
                <span className={s.statIndex}>0{index + 1}</span>
                {stat.value && <strong className={s.statValue}>{stat.value}</strong>}
                <h2>{localize(stat.label, locale)}</h2>
                <p>{localize(stat.desc, locale)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${s.directorySection} section`}>
          <div className="container">
            {experts.length > 0 ? (
              <>
                <div className={s.sectionHeader}>
                  <div>
                    <div className="section-divider" />
                    <span className="overline">{tr('Expert directory', locale)}</span>
                    <h2 className="headline-display">{tr('Verified clinical profiles', locale)}</h2>
                  </div>
                </div>
                <div className={s.expertGrid}>
                  {experts.map((expert) => (
                    <article key={expert.slug} className={`${s.expertCard} motion-surface reveal`}>
                      <div className={s.expertAvatarWrap}>
                        {expert.avatarSanity ? (
                          <ContentImg
                            sanityImage={expert.avatarSanity}
                            alt={expert.name}
                            className={s.expertAvatar}
                            sizes="120px"
                            width={240}
                            height={240}
                          />
                        ) : (
                          <div className={s.expertAvatarFallback} aria-hidden="true">
                            {expert.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className={s.expertBody}>
                        <h3>{expert.name}</h3>
                        {expert.title && <p className={s.expertTitle}>{expert.title}</p>}
                        {expert.region && <p className={s.expertRegion}>{expert.region}</p>}
                        {expert.specialties.length > 0 && (
                          <ul className={s.expertTags}>
                            {expert.specialties.map((sp) => (
                              <li key={sp} className={s.expertTag}>{sp}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className={s.directoryGrid}>
                <article className={`${s.directoryCard} motion-surface reveal-clip`}>
                  <div className="section-divider" />
                  <span className="overline">{tr('Expert directory', locale)}</span>
                  <h2>{tr('Verified clinical profiles are being prepared', locale)}</h2>
                  <p>
                    {tr('KBIT is organizing doctor profiles around credentials, specialty focus, training role, and international collaboration readiness. Until every profile is verified, the public page presents the qualification framework rather than placeholder biographies.', locale)}
                  </p>
                  <Link to={`/${locale}/contact`} className={s.primaryLink}>
                    {tr('Request expert connection', locale)} <ArrowRight size={16} weight="bold" aria-hidden="true" />
                  </Link>
                </article>

                <aside className={s.vettingRail}>
                  {vettingSteps.map((step, index) => (
                    <div className={`${s.vettingStep} reveal`} style={{ animationDelay: `${120 + index * 100}ms` }} key={step}>
                      <span>{index + 1}</span>
                      <p>{step}</p>
                    </div>
                  ))}
                </aside>
              </div>
            )}
          </div>
        </section>

        <section className={`${s.collaborateSection} section`}>
          <div className="container">
            <div className={s.sectionHeader}>
              <div>
                <div className="section-divider" />
                <span className="overline">{tr('Collaborate with KBIT', locale)}</span>
                <h2 className="headline-display">{tr('Join our expert network', locale)}</h2>
              </div>
              <Link to={`/${locale}/contact`} className={s.textLink}>
                {tr('Submit credentials', locale)}
              </Link>
            </div>
            <div className={s.collaborateGrid}>
              {(page.collaborate ?? []).map((item, index) => {
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
                    <h3>{localize(item.title, locale)}</h3>
                    <p>{localize(item.desc, locale)}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
