import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Certificate,
  GlobeHemisphereEast,
  GraduationCap,
  SealCheck,
  Shield,
  Sparkle,
  Stethoscope,
  UsersThree,
} from '@phosphor-icons/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PageHero from '@/components/PageHero'
import Img from '@/components/Img'
import { pages, settings } from '@/lib/data'
import { isLocale, type Locale } from '@/lib/locale'
import s from './Experts.module.css'

const COLLABORATE_ICONS = [Stethoscope, GlobeHemisphereEast, Certificate, UsersThree]

const SPECIALTIES = [
  'Thread Lifting',
  'Rhinoplasty',
  'Laser Therapy',
  'Dermal Fillers',
  'Anti-Aging Protocols',
  'PRP Therapy',
  'Stem Cell Treatment',
  'Body Contouring',
  'Skin Rejuvenation',
  'Eyelid Surgery',
  'Botulinum Toxin',
  'Hyaluronic Acid',
  'Microneedling',
  'Ultherapy',
]

const PLACEHOLDER_PROFILES = [
  { initials: 'KJ', region: 'Seoul · Korea', specialties: ['Thread Lifting', 'Rhinoplasty', 'Brow Contouring'] },
  { initials: 'PY', region: 'Busan · Korea', specialties: ['Laser Therapy', 'Skin Rejuvenation', 'PRP'] },
  { initials: 'CM', region: 'Seoul · Korea', specialties: ['Dermal Fillers', 'Anti-Aging', 'Botulinum'] },
  { initials: 'LH', region: 'Incheon · Korea', specialties: ['Stem Cell', 'Regenerative Medicine', 'Body Contouring'] },
]

const VETTING_STEPS = [
  {
    icon: Shield,
    title: 'Credential review',
    body: 'Qualifications, board certifications, and clinical scope are independently verified before a profile is published.',
  },
  {
    icon: GraduationCap,
    title: 'Specialty structuring',
    body: 'Specialties, teaching roles, and regional reach are mapped so members can browse by focus area and training scope.',
  },
  {
    icon: UsersThree,
    title: 'Network integration',
    body: 'Verified doctors are connected to KBIT events, training programs, and member collaboration opportunities across Asia.',
  },
]

function localize(val: any, locale: Locale): string {
  if (!val) return ''
  if (typeof val === 'string') return val
  const raw = val[locale] ?? val.en ?? ''
  if (typeof raw === 'string' && raw.startsWith('[')) return val.en ?? ''
  return raw
}

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

  const featureStat = (page.stats ?? [])[0]
  const featureValue = featureStat?.value?.replace('+', '') ?? '50'
  const allSpecialties = [...SPECIALTIES, ...SPECIALTIES]

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

        {/* ── Cinematic stats band ── */}
        <section className={s.statsSection}>
          <div className={s.statsWatermark} aria-hidden="true">DOCTORS</div>
          <div className={`container ${s.statsLayout}`}>

            <div className={`${s.statFeature} reveal-soft`}>
              <span className={s.statFeatureNum}>
                {featureValue}<span className={s.statSup}>+</span>
              </span>
              <div className={s.statFeatureMeta}>
                <span className={s.statFeatureLabel}>
                  {localize(featureStat?.label, locale) || 'Verified experts'}
                </span>
                <p>
                  {localize(featureStat?.desc, locale) ||
                    "Korea's leading aesthetic doctors, training faculty, and clinical researchers — curated for the KBIT network."}
                </p>
              </div>
            </div>

            <div className={s.statsDivider} aria-hidden="true" />

            <div className={s.statsSecondary}>
              {(page.stats ?? []).slice(1).map((stat, i) => (
                <article
                  key={i}
                  className={`${s.statCard} reveal`}
                  style={{ animationDelay: `${(i + 1) * 120}ms` }}
                >
                  <span className={s.statCardIndex}>0{i + 2}</span>
                  <h3>{localize(stat.label, locale)}</h3>
                  <p>{localize(stat.desc, locale)}</p>
                </article>
              ))}
            </div>

          </div>
        </section>

        {/* ── Specialty marquee ── */}
        <div className={s.marqueeSection} aria-hidden="true">
          <div className={s.marqueeTrack}>
            {allSpecialties.map((sp, i) => (
              <span key={i} className={s.marqueeTag}>
                <Sparkle size={10} weight="fill" aria-hidden="true" />
                {sp}
              </span>
            ))}
          </div>
        </div>

        {/* ── Expert directory ── */}
        <section className={`${s.directorySection} section`}>
          <div className="container">
            <div className={s.directoryLayout}>

              <div className={s.directoryCopy}>
                <div className="section-divider" />
                <span className="overline">Expert directory</span>
                <h2 className={s.directoryHeadline}>
                  Profiles curated<br />
                  <em>for clinical trust</em>
                </h2>
                <p>
                  KBIT organises expert profiles around credentials, specialty
                  focus, teaching role, and international collaboration
                  readiness. Each doctor is individually reviewed before
                  appearing on the network.
                </p>
                <Link to={`/${locale}/contact`} className={s.primaryLink}>
                  Request an expert connection
                  <ArrowRight size={14} weight="bold" aria-hidden="true" />
                </Link>
                <div className={s.credentialBadge}>
                  <SealCheck size={15} weight="fill" className={s.credentialIcon} aria-hidden="true" />
                  <span>All credentials independently verified</span>
                </div>
              </div>

              <div className={s.profileGrid}>
                {PLACEHOLDER_PROFILES.map((profile, index) => (
                  <article
                    key={index}
                    className={`${s.profileCard} motion-surface reveal-soft`}
                    style={{ animationDelay: `${60 + index * 90}ms` }}
                  >
                    <div className={s.profileAvatar}>
                      <span className={s.profileInitials} aria-hidden="true">{profile.initials}</span>
                      <div className={s.profileShimmer} aria-hidden="true" />
                    </div>
                    <div className={s.profileBody}>
                      <div className={s.profileMeta}>
                        <span className={s.verifyBadge}>
                          <SealCheck size={9} weight="fill" aria-hidden="true" />
                          Verifying
                        </span>
                        <span className={s.profileRegion}>{profile.region}</span>
                      </div>
                      <div className={s.profileNameLines} aria-hidden="true">
                        <span />
                        <span className={s.nameLineShort} />
                      </div>
                      <div className={s.profileChips}>
                        {profile.specialties.map((sp) => (
                          <span key={sp} className={s.profileChip}>{sp}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── Vetting process ── */}
        <section className={`${s.processSection} section`}>
          <div className="container">
            <div className={s.processLayout}>

              <div className={s.processLeft}>
                <div className="section-divider" />
                <span className="overline">Verification process</span>
                <h2 className="headline-display">
                  How we build<br />the network
                </h2>
                <p>
                  Every specialist passes a structured review before their
                  profile enters the KBIT directory. No placeholder data is
                  ever published.
                </p>
              </div>

              <div className={s.processSteps}>
                {VETTING_STEPS.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div
                      key={index}
                      className={`${s.processStep} reveal`}
                      style={{ animationDelay: `${index * 140}ms` }}
                    >
                      <div className={s.processNum} aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <article className={`${s.processCard} motion-surface`}>
                        <div className={s.processIconWrap} aria-hidden="true">
                          <Icon size={22} weight="bold" className={s.processIcon} />
                        </div>
                        <h3>{step.title}</h3>
                        <p>{step.body}</p>
                      </article>
                    </div>
                  )
                })}
              </div>

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
              <a
                href={`mailto:${settings.contact.email}?subject=Expert Collaboration Inquiry`}
                className={s.textLink}
              >
                Submit credentials
                <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
              </a>
            </div>

            <div className={s.collaborateGrid}>
              {/* Feature card — photo backdrop */}
              <article
                className={`${s.collaborateFeature} motion-surface reveal-clip`}
                style={{ animationDelay: '40ms' }}
              >
                <div className={s.collaborateBackdrop} aria-hidden="true">
                  <Img
                    src="news/news-kat-2025-elevating-korea-vietnam-medical-aesthetic-collaboration-inline-1-6841cdc8.jpg"
                    alt=""
                    className={s.collaborateBackdropImg}
                    loading="lazy"
                    sizes="(max-width: 900px) 100vw, 56vw"
                    width={900}
                  />
                </div>
                <div className={s.collaborateFeatureBody}>
                  <div className={s.collaborateIconWrapDark} aria-hidden="true">
                    <Stethoscope size={24} weight="bold" className={s.collaborateIconLight} />
                  </div>
                  <h3>{localize((page.collaborate ?? [])[0]?.title, locale) || 'Training Opportunities'}</h3>
                  <p>{localize((page.collaborate ?? [])[0]?.desc, locale) || 'Participate in intensive training programs and international workshops, sharing expertise with the next generation of practitioners.'}</p>
                </div>
              </article>

              {/* Stack of smaller cards */}
              <div className={s.collaborateStack}>
                {(page.collaborate ?? []).slice(1).map((item, index) => {
                  const Icon = COLLABORATE_ICONS[(index + 1) % COLLABORATE_ICONS.length]
                  return (
                    <article
                      key={index}
                      className={`${s.collaborateCard} motion-surface reveal`}
                      style={{ animationDelay: `${(index + 1) * 100}ms` }}
                    >
                      <div className={s.collaborateIconWrap} aria-hidden="true">
                        <Icon size={18} weight="bold" className={s.collaborateIcon} />
                      </div>
                      <h3>{localize(item.title, locale)}</h3>
                      <p>{localize(item.desc, locale)}</p>
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Invite CTA ── */}
        <section className={s.ctaSection}>
          <div className={s.ctaWatermark} aria-hidden="true">KBIT</div>
          <div className={`container ${s.ctaLayout}`}>
            <div className={`${s.ctaCopy} reveal-soft`}>
              <span className={s.ctaOverline}>An invitation</span>
              <h2 className={s.ctaHeadline}>
                Are you a Korean<br />aesthetic specialist?
              </h2>
              <p>
                KBIT connects verified Korean doctors with clinics and
                practitioners across Vietnam and Asia. If you hold board
                certifications and are open to cross-border training or
                collaboration, we want to hear from you.
              </p>
            </div>
            <div className={`${s.ctaActions} reveal`} style={{ animationDelay: '120ms' }}>
              <a
                href={`mailto:${settings.contact.email}?subject=Expert Collaboration Inquiry`}
                className={s.ctaBtn}
              >
                Submit your credentials
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </a>
              <Link to={`/${locale}/contact`} className={s.ctaGhost}>
                Contact KBIT
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
