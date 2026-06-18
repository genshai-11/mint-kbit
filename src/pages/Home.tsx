import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { GlobeHemisphereEast, GraduationCap, SealCheck, Stethoscope, UsersThree } from '@phosphor-icons/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Img from '@/components/Img'
import ContentImg from '@/components/ContentImg'
import { localize as t } from '@/lib/data'
import { eventImageLocalPath, sortEventsByStartDesc, useEvents } from '@/lib/content/events'
import { useHomeHero } from '@/lib/content/site'
import { usePartners } from '@/lib/content/partners'
import { isLocale, type Locale } from '@/lib/locale'
import s from './Home.module.css'

const STAT_TARGETS = [16, 50, 8, 500]
const STAT_ITEMS = [
  { label: 'Education Centers', shortLabel: 'Centers', Icon: GraduationCap },
  { label: 'Expert Doctors', shortLabel: 'Doctors', Icon: Stethoscope, suffix: '+' },
  { label: 'Countries', shortLabel: 'Countries', Icon: GlobeHemisphereEast, suffix: '+' },
  { label: 'Members', shortLabel: 'Members', Icon: UsersThree, suffix: '+' },
]

function formatDate(iso: string, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : locale === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    }).format(new Date(iso))
  } catch {
    return iso.slice(0, 10)
  }
}

function useOnceVisible<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, visible] as const
}

export default function Home() {
  const location = useLocation()
  const segments = location.pathname.split('/')
  const locale: Locale = isLocale(segments[1]) ? segments[1] : 'en'

  const [slide, setSlide] = useState(0)
  const statsActive = true
  const [statsVals, setStatsVals] = useState([0, 0, 0, 0])
  const [aboutRef, aboutVisible] = useOnceVisible<HTMLElement>(0.25)
  const [eventsRef, eventsVisible] = useOnceVisible<HTMLElement>(0.25)
  const [partnersRef, partnersVisible] = useOnceVisible<HTMLElement>(0.2)
  const [ctaRef, ctaVisible] = useOnceVisible<HTMLElement>(0.25)

  const heroSlides = useHomeHero(locale)
  const slideCount = heroSlides.length || 1
  const advance = useCallback(() => setSlide(s => (s + 1) % slideCount), [slideCount])

  useEffect(() => {
    const id = setInterval(advance, 5000)
    return () => clearInterval(id)
  }, [advance])

  useEffect(() => {
    if (!statsActive) return
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const p = Math.min(elapsed / 1800, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setStatsVals(STAT_TARGETS.map(t => Math.round(eased * t)))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [statsActive])

  const syncedEvents = useEvents()
  const featuredEvents = sortEventsByStartDesc(syncedEvents).slice(0, 3)

  const partnerList = usePartners()

  return (
    <>
      <Nav />

      {/* ===== Hero ===== */}
      <section className={s.hero} aria-label="Hero">
        {heroSlides.map((slide_, i) => (
          <div key={i} className={`${s.heroSlide} ${i === slide ? s.active : ''}`}>
            <ContentImg
              localSrc={slide_.imageKey}
              sanityImage={slide_.sanityImage}
              sizes="100vw"
              alt=""
              className={s.heroImg}
              loading={i === 0 ? 'eager' : 'lazy'}
              width={1600}
              height={720}
            />
          </div>
        ))}
        <div className={s.heroOverlay} />
        <div className={s.heroContent}>
          <div className="container">
            <div className={s.heroInner}>
              <div className={s.heroPanel}>
                <span className={`${s.heroTag} reveal reveal--delay-1`}>KBIT Association</span>
                <h1 className={`${s.heroHeading} reveal reveal--delay-2`}>{heroSlides[slide]?.heading}</h1>
                <p className={`${s.heroSub} reveal reveal--delay-3`}>{heroSlides[slide]?.sub}</p>
                <div className={`${s.heroCtas} reveal reveal--delay-4`}>
                  <Link to={`/${locale}/events`} className={s.btnPrimary}>Upcoming Events</Link>
                  <Link to={`/${locale}/about`} className={s.btnOutline}>Learn More</Link>
                </div>
              </div>
              <div className={`${s.heroSideNote} reveal reveal--delay-4`} aria-hidden="true">
                <span>Clinical</span>
                <strong>Exchange</strong>
                <span>Korea / Asia</span>
              </div>
            </div>
          </div>
        </div>
        <section className={`${s.stats} ${statsActive ? s.statsActive : ''}`} aria-label="Association statistics">
          <div className="container">
            <div className={s.statsGrid}>
              {STAT_ITEMS.map(({ label, shortLabel, Icon, suffix = '' }, i) => (
                <div className={s.statItem} key={label}>
                  <Icon className={s.statIcon} size={24} weight="regular" aria-hidden="true" />
                  <div>
                    <div className={s.statNumber}>{statsVals[i]}{suffix}</div>
                    <div className={s.statLabel}>
                      <span className={s.labelFull}>{label}</span>
                      <span className={s.labelShort}>{shortLabel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <div className={s.heroDots}>
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`${s.dot} ${i === slide ? s.dotActive : ''}`}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ===== About Teaser ===== */}
      <section ref={aboutRef} className={`${s.about} section`} aria-labelledby="about-heading">
        <div className="container">
          <div className={s.aboutGrid}>
            <div className={`${s.aboutText} ${aboutVisible ? 'reveal reveal--delay-1' : ''}`}>
              <div className="section-divider" />
              <span className="overline">About KBIT</span>
              <h2 id="about-heading" className={s.aboutHeading}>
                Advancing Korean Beauty &amp; Medical Technology
              </h2>
              <p className={s.aboutLead}>
                KBIT connects Korea's foremost clinical experts with medical professionals and institutions across Asia and beyond.
                Through rigorous training, international events, and curated partnerships, we drive the future of aesthetic medicine.
              </p>
              <Link to={`/${locale}/about`} className={s.btnNavy}>About KBIT</Link>
            </div>
            <div className={`${s.aboutVisual} ${aboutVisible ? 'reveal reveal--delay-2' : ''}`}>
              <Img
                src="misc/mrterry-2f1c33d5.jpg"
                alt="KBIT clinical expertise"
                className={s.aboutImg}
                sizes="(max-width: 1024px) 100vw, 50vw"
                width={640}
                height={480}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Events Teaser ===== */}
      <section ref={eventsRef} className={`${s.events} section`} aria-labelledby="events-heading">
        <div className="container">
          <div className={s.sectionHeader}>
            <div className={s.sectionMeta}>
              <div className="section-divider" />
              <span className="overline">Events &amp; Workshops</span>
              <h2 id="events-heading" className={s.sectionTitle}>Upcoming Programs</h2>
            </div>
            <Link to={`/${locale}/events`} className={s.btnGhost}>View all events →</Link>
          </div>

          <div className={s.eventsGrid}>
            {featuredEvents.map((ev, i) => (
              <Link
                key={ev.slug}
                to={`/${locale}/events/${ev.slug}`}
                className={`${s.eventCard} ${eventsVisible ? 'reveal' : ''}`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className={s.eventImgWrap}>
                  <ContentImg
                    localSrc={eventImageLocalPath(ev.coverImage)}
                    sanityImage={ev.coverSanityImage}
                    alt={t(ev.title, locale)}
                    className={s.eventImg}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    width={640}
                    height={360}
                  />
                  <span className={s.eventBadge}>{ev.status === 'past' ? 'Past' : 'Upcoming'}</span>
                </div>
                <div className={s.eventBody}>
                  <div className={s.eventMeta}>
                    <span className={s.eventDate}>{formatDate(ev.startAt, locale)}</span>
                    <span className={s.eventLoc}>{t(ev.location, locale)}</span>
                  </div>
                  <h3 className={s.eventTitle}>{t(ev.title, locale)}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Partners Strip ===== */}
      <section ref={partnersRef} className={s.partners} aria-label="Scientific partners">
        <div className="container">
          <p className={`${s.partnersTitle} ${partnersVisible ? 'reveal' : ''}`}>Scientific &amp; Industry Partners</p>
        </div>
        <div className={`${s.partnersInner} ${partnersVisible ? s.partnersInnerVisible : ''}`}>
          <div className={s.partnersTrack} aria-hidden="true">
            {[...partnerList, ...partnerList].map((p, i) => {
              const hasLogo = Boolean(p.sanityImage || p.logoUrl)
              return hasLogo ? (
                <div key={i} className={s.partnerItem} title={p.name}>
                  <ContentImg
                    localSrc={p.logoUrl}
                    sanityImage={p.sanityImage}
                    alt={p.name}
                    sizes="120px"
                    className={s.partnerLogo}
                    width={120}
                    height={48}
                    loading="lazy"
                  />
                </div>
              ) : (
                <div key={i} className={s.partnerItem}>
                  <span style={{ fontSize: 'var(--type-sm)', fontWeight: 600, color: 'var(--clr-stone)' }}>{p.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA Band ===== */}
      <section ref={ctaRef} className={s.cta} aria-labelledby="cta-heading">
        <div className="container">
          <div className={s.ctaFrame}>
            <span className={s.ctaWatermark} aria-hidden="true">KBIT</span>
            <SealCheck className={s.ctaSeal} size={220} weight="thin" aria-hidden="true" />
            <span className={`${s.ctaOverline} ${ctaVisible ? 'reveal' : ''}`}>Ready to Elevate Your Practice?</span>
            <h2 id="cta-heading" className={`${s.ctaHeading} ${ctaVisible ? 'reveal reveal--delay-1' : ''}`}>
              Join the Vanguard of Korean Clinical Excellence
            </h2>
            <p className={`${s.ctaSub} ${ctaVisible ? 'reveal reveal--delay-2' : ''}`}>
              Access world-class training, global networks, and Korea's most advanced aesthetic protocols.
            </p>
            <div className={`${s.ctaBtns} ${ctaVisible ? 'reveal reveal--delay-3' : ''}`}>
              <Link to={`/${locale}/membership`} className={s.btnPrimary}>Apply for Membership</Link>
              <Link to={`/${locale}/contact`} className={s.btnOutline}>Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
