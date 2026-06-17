import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
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
    `Bring Korea's newest rejuvenation technology and training standards within reach of every member clinic — so your patients always benefit from proven, current techniques.`
  )
  const vision = fallback(
    aboutPage.vision,
    'One trusted bridge between Korean clinical innovation and aesthetic practitioners across Vietnam, Asia, and beyond.'
  )
  const history = fallback(
    aboutPage.history,
    'From symposiums in Seoul to MOU signings in Ho Chi Minh City, KBIT grew out of working partnerships between hospitals, clinics, and educators on both sides.'
  )
  const leader = aboutPage.leadership?.[0]
  const leaderName = leader?.name || settings.org.vicePresident
  const leaderRole = localize(leader?.role ?? { en: 'Vice President' }, locale)
  const leadDescription = localize(settings.siteMeta.description, locale)

  const signals = [
    { icon: Sparkle, label: 'Latest techniques', value: 'Direct from Seoul' },
    { icon: GlobeHemisphereEast, label: 'Cross-border', value: 'Korea · Vietnam · Asia' },
    { icon: UsersThree, label: 'Member network', value: 'Clinics + doctors' },
  ]

  const manifesto = [
    {
      icon: Sparkle,
      label: 'Mission',
      title: 'Advancing your practice',
      body: mission,
      chips: ['Training programs', 'Clinical standards', 'Certification'],
    },
    {
      icon: GlobeHemisphereEast,
      label: 'Vision',
      title: 'A bridge between two worlds',
      body: vision,
      chips: ['Korea', 'Vietnam', 'Asia'],
    },
    {
      icon: SealCheck,
      label: 'Our story',
      title: 'Born from real exchange',
      body: history,
      chips: ['Symposiums', 'Partnerships', 'Education centers'],
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
        image="home/banner4-b978e3ea.jpg"
        imageAlt="KBIT clinical training session"
      />

      <main className={s.pageShell}>
        <section className={`${s.intro} section`}>
          <div className="container">
            <div className={s.introGrid}>
              <article className={`${s.storyCard} motion-surface reveal-soft`} style={{ animationDelay: '40ms' }}>
                <div className="section-divider" />
                <span className="overline">Who we are</span>
                <h2>Korean aesthetic medicine, shared across borders</h2>
                <p>
                  KBIT brings Korea's leading aesthetic doctors, training centers, and clinics
                  together with practitioners across Vietnam and Asia.
                </p>

                <figure className={s.storyMedia}>
                  <Img
                    src="news/news-kat-2025-elevating-korea-vietnam-medical-aesthetic-collaboration-inline-2-eb299842.jpg"
                    alt="KBIT delegates at the KAT 2025 Korea-Vietnam medical aesthetic collaboration"
                    className={s.storyImage}
                    loading="lazy"
                    sizes="(max-width: 1040px) 100vw, 50vw"
                    width={840}
                    height={470}
                  />
                  <figcaption>KAT 2025 — Korea · Vietnam clinical exchange</figcaption>
                </figure>

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
                  <Link to={`/${locale}/contact`} className={s.primaryLink}>
                    Contact team <ArrowRight size={16} weight="bold" aria-hidden="true" />
                  </Link>
                  <a href={`/${locale}/events`} className={s.secondaryLink}>
                    Programs
                  </a>
                </div>
              </article>

              <aside className={`${s.statsCard} motion-surface reveal-clip`} style={{ animationDelay: '140ms' }}>
                <div className={s.statsHeader}>
                  <div>
                    <div className={s.statsLabel}>Our network</div>
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
                <p className={s.statsNote}>Education, events, and exchange — one connected community.</p>
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
                <h2 className="headline-display">What we stand for</h2>
              </div>
            </div>

            <div className={s.manifestoGrid}>
              <article className={`${s.manifestoFeature} ${s.manifestoFeaturePhoto} motion-surface reveal-clip`} style={{ animationDelay: '60ms' }}>
                <div className={s.featureBackdrop} aria-hidden="true">
                  <Img
                    src="news/news-kat-2025-elevating-korea-vietnam-medical-aesthetic-collaboration-inline-4-a08a737e.jpg"
                    alt=""
                    className={s.featureBackdropImg}
                    loading="lazy"
                    sizes="(max-width: 1040px) 100vw, 55vw"
                    width={960}
                    height={640}
                  />
                </div>
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

        <section className={`${s.gallerySection} section`} aria-label="Network in motion">
          <div className="container">
            <div className={s.sectionHeader}>
              <div>
                <div className="section-divider" />
                <span className="overline">Network in motion</span>
                <h2 className="headline-display">Moments from the field</h2>
              </div>
            </div>
            <div className={s.galleryGrid}>
              <figure className={`${s.galleryItem} ${s.galleryWide} motion-surface reveal-clip`}>
                <Img
                  src="news/news-le-van-thinh-hospital-korea-beauty-technology-association-kbit-sign-mou-for-beauty-te-2f9512d4.jpg"
                  alt="MOU signing ceremony between Le Van Thinh Hospital and KBIT"
                  className={s.galleryImg}
                  loading="lazy"
                  sizes="(max-width: 1040px) 100vw, 58vw"
                  width={960}
                  height={640}
                />
                <figcaption>MOU signing — Le Van Thinh Hospital × KBIT, 2024</figcaption>
              </figure>
              <figure className={`${s.galleryItem} motion-surface reveal`} style={{ animationDelay: '120ms' }}>
                <Img
                  src="news/news-kat-2025-elevating-korea-vietnam-medical-aesthetic-collaboration-inline-1-6841cdc8.jpg"
                  alt="Audience and speaker at a KAT 2025 specialist seminar"
                  className={s.galleryImg}
                  loading="lazy"
                  sizes="(max-width: 1040px) 100vw, 42vw"
                  width={720}
                  height={450}
                />
                <figcaption>Specialist seminar — KAT 2025</figcaption>
              </figure>
              <figure className={`${s.galleryItem} motion-surface reveal`} style={{ animationDelay: '220ms' }}>
                <Img
                  src="news/news-kat-2025-nang-tam-hop-tac-y-hoc-tham-my-han-viet-inline-3-5cce493f.jpg"
                  alt="KAT 2025 conference session in Vietnam"
                  className={s.galleryImg}
                  loading="lazy"
                  sizes="(max-width: 1040px) 100vw, 42vw"
                  width={720}
                  height={450}
                />
                <figcaption>KAT 2025 — conference session</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className={`${s.leadershipSection} section`}>
          <div className="container">
            <div className={s.sectionHeader}>
              <div>
                <div className="section-divider" />
                <span className="overline">Leadership</span>
                <h2 className="headline-display">The people and places behind KBIT</h2>
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
                    <span><SealCheck size={16} weight="bold" aria-hidden="true" /> Clinical standards</span>
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
