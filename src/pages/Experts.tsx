import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Certificate, GlobeHemisphereEast, SealCheck, Stethoscope, UsersThree } from '@phosphor-icons/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PageHero from '@/components/PageHero'
import { pages, settings } from '@/lib/data'
import { isLocale, type Locale } from '@/lib/locale'
import { localize } from '@/lib/news'
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

  const vettingSteps = [
    'Credentials and clinical scope are reviewed before a profile is published.',
    'Specialties, teaching roles, and regional availability are structured for browsing.',
    'Verified doctors can be connected to events, training programs, and member benefits.',
  ]

  return (
    <>
      <Nav />

      <PageHero
        watermark="EXPERTS"
        overline="Key Doctors & Specialists"
        title={localize(page.title, locale)}
        desc={localize(page.intro, locale)}
      />

      <main className={s.pageShell}>
        <section className={s.statsSection}>
          <div className={`container ${s.statsGrid}`}>
            {(page.stats ?? []).map((stat, index) => (
              <article key={index} className={`${s.statItem} reveal-soft`} style={{ animationDelay: `${index * 100}ms` }}>
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
            <div className={s.directoryGrid}>
              <article className={`${s.directoryCard} motion-surface reveal-clip`}>
                <SealCheck className={s.directorySeal} size={180} weight="thin" aria-hidden="true" />
                <div className="section-divider" />
                <span className="overline">Expert directory</span>
                <h2>Verified clinical profiles are being prepared</h2>
                <p>
                  KBIT is organizing doctor profiles around credentials, specialty focus, training role,
                  and international collaboration readiness. Until every profile is verified, the public page
                  presents the qualification framework rather than placeholder biographies.
                </p>
                <Link to={`/${locale}/contact`} className={s.primaryLink}>
                  Request expert connection <ArrowRight size={16} weight="bold" aria-hidden="true" />
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
          </div>
        </section>

        <section className={`${s.collaborateSection} section`}>
          <div className="container">
            <div className={s.sectionHeader}>
              <div>
                <div className="section-divider" />
                <span className="overline">Collaborate with KBIT</span>
                <h2 className="headline-display">Join our expert network</h2>
              </div>
              <a href={`mailto:${settings.contact.email}?subject=Expert Collaboration Inquiry`} className={s.textLink}>
                Submit credentials
              </a>
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
