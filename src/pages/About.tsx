import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowRight, Buildings, GlobeHemisphereEast, MapPinLine, SealCheck, Sparkle, UsersThree } from '@phosphor-icons/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Img from '@/components/Img'
import PageHero from '@/components/PageHero'
import { centers, pages, settings } from '@/lib/data'
import { isLocale, type Locale } from '@/lib/locale'
import s from './About.module.css'

function getImgKey(path: string): string {
  return path.replace(/^(\.\/)?data\/assets\//, '')
}

function localize(val: any, locale: Locale): string {
  if (!val) return ''
  if (typeof val === 'string') return val
  const raw = val[locale] ?? val.en ?? ''
  if (typeof raw === 'string' && raw.startsWith('[')) return val.en ?? ''
  return raw
}

function fallback(text: string, replacement: string): string {
  const trimmed = (text || '').trim()
  return trimmed && !trimmed.startsWith('[GAP]') ? trimmed : replacement
}

export default function About() {
  const location = useLocation()
  const segments = location.pathname.split('/')
  const locale: Locale = isLocale(segments[1]) ? segments[1] : 'en'

  const aboutPage = pages.about as {
    title: { en: string; vi?: string; ko?: string }
    mission: string
    vision: string
    history: string
    leadership: Array<{ name: string; role: { en: string; vi?: string; ko?: string } }>
    educationCenters: string
  }

  const centerList = (centers.data as Array<Record<string, any>>).slice(0, 1)
  const stats = [
    { value: 16, suffix: '+', label: 'Education centers' },
    { value: 50, suffix: '+', label: 'Expert doctors' },
    { value: 8, suffix: '+', label: 'Countries reached' },
    { value: 500, suffix: '+', label: 'Members connected' },
  ]
  const [animatedStats, setAnimatedStats] = useState(stats.map(() => 0))

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setAnimatedStats(stats.map(item => item.value))
      return
    }

    let frame = 0
    const duration = 1100
    const startedAt = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedStats(stats.map(item => Math.round(item.value * eased)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  const mission = fallback(
    aboutPage.mission,
    `Keep members updated with Korea's newest rejuvenation technology and training standards.`
  )
  const vision = fallback(
    aboutPage.vision,
    'Shape a trusted route for education, clinics, and cross-border exchange.'
  )
  const history = fallback(
    aboutPage.history,
    'The live platform now carries events, news, centers, and membership signals from the source data.'
  )
  const leader = aboutPage.leadership?.[0]
  const leaderName = leader?.name || settings.org.vicePresident
  const leaderRole = localize(leader?.role ?? { en: 'Vice President' }, locale)
  const leadDescription = localize(settings.siteMeta.description, locale)

  const signals = [
    { icon: Sparkle, label: 'Editorial calm', value: 'Curated updates' },
    { icon: GlobeHemisphereEast, label: 'Cross-border', value: 'Korea · Vietnam · Asia' },
    { icon: UsersThree, label: 'Member network', value: 'Clinics + doctors' },
  ]

  const manifesto = [
    {
      icon: Sparkle,
      label: 'Mission',
      title: 'Keep the network current',
      body: mission,
      chips: ['Programs', 'Standards', 'Education'],
    },
    {
      icon: GlobeHemisphereEast,
      label: 'Vision',
      title: 'One elegant route',
      body: vision,
      chips: ['Korea', 'Vietnam', 'Asia'],
    },
    {
      icon: SealCheck,
      label: 'History',
      title: 'What is live now',
      body: history,
      chips: ['Events', 'News', 'Centers'],
    },
  ]

  return (
    <>
      <Nav />

      <PageHero
        watermark="ABOUT"
        overline="Network / Standards / Exchange"
        title={localize(aboutPage.title, locale)}
        desc={leadDescription}
      />

      <main className={s.pageShell}>
        <section className={`${s.intro} section`}>
          <div className="container">
            <div className={s.introGrid}>
              <article className={`${s.storyCard} motion-surface reveal-soft`} style={{ animationDelay: '40ms' }}>
                <div className="section-divider" />
                <span className="overline">Live operating story</span>
                <h2>What KBIT is right now</h2>
                <p>
                  A premium clinical network, presented with more silence than copy.
                </p>

                <div className={s.signalGrid}>
                  {signals.map((signal, index) => {
                    const Icon = signal.icon
                    return (
                      <div key={signal.label} className={`${s.signalItem} reveal`} style={{ animationDelay: `${130 + index * 90}ms` }}>
                        <Icon size={18} weight="bold" className={s.signalIcon} aria-hidden="true" />
                        <div>
                          <strong>{signal.label}</strong>
                          <span>{signal.value}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className={s.storyActions}>
                  <a href={`mailto:${settings.contact.email}`} className={s.primaryLink}>
                    Contact team <ArrowRight size={16} weight="bold" aria-hidden="true" />
                  </a>
                  <a href={`/${locale}/events`} className={s.secondaryLink}>
                    Programs
                  </a>
                </div>
              </article>

              <aside className={`${s.statsCard} motion-surface reveal-clip`} style={{ animationDelay: '140ms' }}>
                <div className={s.statsHeader}>
                  <div>
                    <div className={s.statsLabel}>Operating snapshot</div>
                    <h3>Network scale</h3>
                  </div>
                  <SealCheck size={48} weight="thin" className={`${s.statsIcon} ambient-drift`} aria-hidden="true" />
                </div>
                <div className={s.statsGrid}>
                  {stats.map((stat, index) => (
                    <div key={stat.label} className={`${s.statItem} reveal`} style={{ animationDelay: `${180 + index * 110}ms` }}>
                      <strong>
                        {animatedStats[index]}
                        <span>{stat.suffix}</span>
                      </strong>
                      <span>{stat.label}</span>
                    </div>
                  ))}
                </div>
                <p className={s.statsNote}>Education, events, and exchange — all in one system.</p>
              </aside>
            </div>
          </div>
        </section>

        <section className={`${s.cardsSection} section`}>
          <div className="container">
            <div className={s.sectionHeader}>
              <div>
                <div className="section-divider" />
                <span className="overline">Mission / Vision / History</span>
                <h2 className="headline-display">Three editorial statements</h2>
              </div>
              <span className={s.gapPill}>client copy pending</span>
            </div>

            <div className={s.manifestoGrid}>
              <article className={`${s.manifestoFeature} motion-surface reveal-clip`} style={{ animationDelay: '60ms' }}>
                <div className={s.manifestoHead}>
                  <Sparkle size={22} weight="bold" className={s.manifestoIcon} aria-hidden="true" />
                  <div>
                    <span className={s.cardLabel}>Mission</span>
                    <h3>{manifesto[0].title}</h3>
                  </div>
                </div>
                <p>{manifesto[0].body}</p>
                <div className={s.chipRow}>
                  {manifesto[0].chips.map(chip => <span key={chip}>{chip}</span>)}
                </div>
              </article>

              <div className={s.manifestoStack}>
                {manifesto.slice(1).map((item, index) => {
                  const Icon = item.icon
                  return (
                    <article key={item.label} className={`${s.manifestoCard} motion-surface reveal`} style={{ animationDelay: `${120 + index * 100}ms` }}>
                      <div className={s.manifestoHead}>
                        <Icon size={20} weight="bold" className={s.manifestoIcon} aria-hidden="true" />
                        <div>
                          <span className={s.cardLabel}>{item.label}</span>
                          <h3>{item.title}</h3>
                        </div>
                      </div>
                      <p>{item.body}</p>
                      <div className={s.chipRow}>
                        {item.chips.map(chip => <span key={chip}>{chip}</span>)}
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className={`${s.leadershipSection} section`}>
          <div className="container">
            <div className={s.sectionHeader}>
              <div>
                <div className="section-divider" />
                <span className="overline">Leadership</span>
                <h2 className="headline-display">Operational leadership and center network</h2>
              </div>
            </div>

            <div className={s.leadershipGrid}>
              <article className={`${s.leaderCard} motion-surface reveal-soft`} style={{ animationDelay: '80ms' }}>
                <div className={`${s.leaderMonogram} ambient-drift`} aria-hidden="true">
                  {leaderName.split(' ').map(word => word[0]).join('').slice(0, 3)}
                </div>
                <div className={s.leaderCopy}>
                  <span className={s.cardKicker}>Lead executive</span>
                  <h3>{leaderName}</h3>
                  <p>{leaderRole}</p>
                  <div className={s.leaderMeta}>
                    <span><UsersThree size={16} weight="bold" aria-hidden="true" /> Network liaison</span>
                    <span><GlobeHemisphereEast size={16} weight="bold" aria-hidden="true" /> Korea / Vietnam / Asia</span>
                    <span><SealCheck size={16} weight="bold" aria-hidden="true" /> Editorial quality</span>
                  </div>
                </div>
              </article>

              {centerList.map(center => {
                const image = center.images?.[0]
                return (
                  <article key={center.sourceId} className={`${s.centerCard} motion-surface reveal-clip`} style={{ animationDelay: '180ms' }}>
                    <div className={s.centerImageWrap}>
                      {image ? (
                        <Img
                          src={getImgKey(image.imageUrl)}
                          alt={center.name}
                          className={s.centerImage}
                          loading="lazy"
                          width={720}
                          height={540}
                        />
                      ) : (
                        <div className={s.centerFallback}>KBIT</div>
                      )}
                      <div className={s.centerOverlay}>
                        <span>Network anchor</span>
                        <strong>{center.name}</strong>
                      </div>
                    </div>
                    <div className={s.centerBody}>
                      <p>{center.address}</p>
                      <div className={s.centerMeta}>
                        <span><MapPinLine size={16} weight="bold" aria-hidden="true" /> {center.address}</span>
                        <span><Buildings size={16} weight="bold" aria-hidden="true" /> {center.hours}</span>
                      </div>
                    </div>
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
