import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, CalendarBlank, MapPin, Users } from '@phosphor-icons/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ContentImg from '@/components/ContentImg'
import PageHero from '@/components/PageHero'
import { eventImageLocalPath, sortEventsByStartDesc, useEvents } from '@/lib/content/events'
import { isLocale, type Locale } from '@/lib/locale'
import { tr } from '@/lib/ui'
import s from './Events.module.css'

type Filter = 'all' | 'upcoming' | 'past'

function t(val: Record<string, string> | string, locale: Locale): string {
  if (typeof val === 'string') return val
  const raw = val[locale] ?? val['en'] ?? ''
  if (raw.startsWith('[')) return val['en'] ?? ''
  return raw
}

function formatDate(iso: string, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : locale === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    }).format(new Date(iso))
  } catch {
    return iso.slice(0, 10)
  }
}

export default function Events() {
  const location = useLocation()
  const segments = location.pathname.split('/')
  const locale: Locale = isLocale(segments[1]) ? segments[1] : 'en'

  const [filter, setFilter] = useState<Filter>('all')

  const syncedEvents = useEvents()
  const allEvents = sortEventsByStartDesc(syncedEvents)

  const featured = allEvents.find(e => e.isFeatured) ?? allEvents[0]

  const filtered = allEvents.filter(ev => {
    if (filter === 'upcoming') return ev.status !== 'past'
    if (filter === 'past') return ev.status === 'past'
    return true
  })

  const gridEvents = filtered.filter(ev => ev.slug !== featured?.slug)

  const tabs: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All Events' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past Events' },
  ]
  const summaryLabel = filter === 'all'
    ? tr('Programs listed', locale)
    : tr(filter === 'upcoming' ? 'Upcoming programs' : 'Past programs', locale)

  return (
    <>
      <Nav />

      <PageHero
        watermark="EVENTS"
        overline={tr('Programs & Education', locale)}
        title={tr('Global Workshops & Clinical Summits', locale)}
        desc={tr("Join Korea's leading clinicians at international events bridging evidence-based aesthetics and hands-on training.", locale)}
        image="events/event-12-bannerimageurl-ade6047b.png"
        imageAlt="KBIT international clinical workshop audience"
      />

      <div className={`${s.filterBar} reveal-soft reveal--delay-1`}>
        <div className={`container ${s.filterInner}`}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${s.filterTab} ${filter === tab.id ? s.filterTabActive : ''}`}
              onClick={() => setFilter(tab.id)}
            >
              {tr(tab.label, locale)}
            </button>
          ))}
        </div>
      </div>

      {featured && (filter === 'all' || filter === featured.status as Filter) && (
        <section className={s.featured}>
          <div className="container">
            <div className="section-divider" />
            <span className="overline" style={{ marginBottom: 'var(--sp-5)', display: 'block' }}>{tr('Featured Event', locale)}</span>
            <article className={`${s.featuredCard} reveal-clip reveal--delay-2`}>
              <div className={s.featuredImgWrap}>
                <ContentImg
                  localSrc={eventImageLocalPath(featured.coverImage)}
                  sanityImage={featured.coverSanityImage}
                  alt={t(featured.title, locale)}
                  className={s.featuredImg}
                  loading="eager"
                  sizes="(max-width: 900px) 100vw, 50vw"
                  width={800}
                  height={600}
                />
              </div>
              <div className={s.featuredBody}>
                <span className={s.featuredBadge}>{featured.status === 'past' ? tr('Past Event', locale) : tr('Upcoming', locale)}</span>
                <h2 className={s.featuredTitle}>{t(featured.title, locale)}</h2>
                <div className={s.featuredMeta}>
                  <div className={s.metaItem}>
                    <CalendarBlank size={16} weight="bold" className={s.metaIcon} aria-hidden="true" />
                    <span>{formatDate(featured.startAt, locale)}</span>
                  </div>
                  <div className={s.metaItem}>
                    <MapPin size={16} weight="bold" className={s.metaIcon} aria-hidden="true" />
                    <span>{t(featured.location, locale)}</span>
                  </div>
                  {featured.language && (
                    <div className={s.metaItem}>
                      <Users size={16} weight="bold" className={s.metaIcon} aria-hidden="true" />
                      <span>{featured.language}</span>
                    </div>
                  )}
                </div>
                <p className={s.featuredDesc}>{t(featured.description, locale)}</p>
                <div className={s.featuredActions}>
                  <Link to={`/${locale}/events/${featured.slug}`} className={s.btnPrimary}>
                    {tr('View detail', locale)} <ArrowRight size={15} weight="bold" aria-hidden="true" />
                  </Link>
                  <Link to={`/${locale}/contact`} className={s.btnGhost}>
                    {tr('Request program info', locale)}
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      <section className={s.grid}>
        <div className="container">
          <div className={`${s.gridHeader} reveal-soft`}>
            <div>
              <div className="section-divider" />
              <span className="overline">{tr('Program Index', locale)}</span>
              <h2 className={s.gridTitle}>{tr('Explore KBIT clinical programs', locale)}</h2>
            </div>
            <div className={s.gridSummary}>
              <span>{gridEvents.length}</span>
              <p>{summaryLabel}</p>
            </div>
          </div>

          {gridEvents.length > 0 ? (
            <div className={s.eventsGrid}>
              {gridEvents.map((ev, index) => (
                <Link
                  key={ev.slug}
                  to={`/${locale}/events/${ev.slug}`}
                  className={`${s.card} reveal`}
                  style={{ animationDelay: `${index * 80}ms` }}
                  aria-label={`View details for ${t(ev.title, locale)}`}
                >
                  <div className={s.cardImgWrap}>
                    <ContentImg
                      localSrc={eventImageLocalPath(ev.coverImage)}
                      sanityImage={ev.coverSanityImage}
                      alt={t(ev.title, locale)}
                      className={s.cardImg}
                      sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                      width={640}
                      height={360}
                    />
                    <span className={`${s.statusBadge} ${ev.status === 'past' ? s.statusPast : s.statusUpcoming}`}>
                      {ev.status === 'past' ? tr('Past', locale) : tr('Upcoming', locale)}
                    </span>
                  </div>
                  <div className={s.cardBody}>
                    <div className={s.cardType}>{ev.type}</div>
                    <div className={s.cardMeta}>
                      <span className={s.cardDate}>
                        <CalendarBlank size={14} weight="bold" aria-hidden="true" />
                        {formatDate(ev.startAt, locale)}
                      </span>
                      <span className={s.cardLoc}>
                        <MapPin size={14} weight="bold" aria-hidden="true" />
                        {t(ev.location, locale)}
                      </span>
                    </div>
                    <h3 className={s.cardTitle}>{t(ev.title, locale)}</h3>
                    <div className={s.cardFooter}>
                      <span>{ev.language || tr('Multilingual', locale)}</span>
                      <ArrowRight size={16} weight="bold" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={s.eventsGrid}>
              <div className={s.emptyState}>
                <div className={s.emptyIcon}>.</div>
                <p className={s.emptyText}>{tr(filter === 'upcoming' ? 'No upcoming events found.' : 'No past events found.', locale)}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
