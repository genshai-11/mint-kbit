import { Link, useLocation, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CalendarBlank, GlobeHemisphereEast, MapPin, Users } from '@phosphor-icons/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ContentImg from '@/components/ContentImg'
import { t as translate } from '@/lib/data'
import { eventImageLocalPath, sortEventsByStartDesc, useEventBySlug, type EventItem } from '@/lib/content/events'
import { isLocale, type Locale } from '@/lib/locale'
import s from './EventDetail.module.css'

type ProgramEntry = {
  time: string
  title: string
  details: string[]
}

type ProgramSection = {
  heading: string
  preamble: string[]
  entries: ProgramEntry[]
}

type ProgramOutline = {
  intro: string[]
  sections: ProgramSection[]
}

function localeCode(locale: Locale): string {
  if (locale === 'ko') return 'ko-KR'
  if (locale === 'vi') return 'vi-VN'
  return 'en-US'
}

function formatDate(iso: string, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(localeCode(locale), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso.slice(0, 10)
  }
}

function formatRange(event: EventItem, locale: Locale): string {
  const start = formatDate(event.startAt, locale)
  const end = formatDate(event.endAt, locale)
  return start === end ? start : `${start} - ${end}`
}

function textBlocks(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map(block => block.trim())
    .filter(Boolean)
}

function normalizeLine(line: string): string {
  return line.replace(/^[•·\-–—]+\s*/, '').trim()
}

function isSectionHeading(line: string): boolean {
  return /^(PART\s+[IVXLC]+|PHẦN\s+[IVXLC]+|DAY\s+\d+|ROOM\s+\d+|PHÒNG\s+\d+)/i.test(line)
}

function localizedBlocks(value: EventItem['description'], locale: Locale): string[] {
  return textBlocks(translate(value, locale))
}

function structuredProgramOutline(event: EventItem, locale: Locale): ProgramOutline | null {
  const programSections = [...event.programSections]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .filter((section) => section.entries.length > 0 || translate(section.title, locale) || translate(section.intro, locale))

  if (!programSections.length) return null

  return {
    intro: [],
    sections: programSections.map((section, sectionIndex) => ({
      heading: translate(section.title, locale) || `Agenda ${sectionIndex + 1}`,
      preamble: localizedBlocks(section.intro, locale),
      entries: [...section.entries]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((entry) => {
          const time = [entry.startTime, entry.endTime].filter(Boolean).join(' – ')
          const speaker = translate(entry.speaker, locale)
          return {
            time,
            title: translate(entry.title, locale),
            details: [
              ...(speaker ? [`Speaker: ${speaker}`] : []),
              ...localizedBlocks(entry.details, locale),
            ],
          }
        })
        .filter((entry) => entry.title || entry.time || entry.details.length > 0),
    })),
  }
}

function parseProgramOutline(description: string): ProgramOutline {
  const intro: string[] = []
  const sections: ProgramSection[] = []
  let currentSection: ProgramSection | null = null
  let currentEntry: ProgramEntry | null = null

  const flushEntry = () => {
    if (currentSection && currentEntry) {
      currentSection.entries.push({
        time: currentEntry.time,
        title: currentEntry.title,
        details: currentEntry.details.filter(Boolean),
      })
    }
    currentEntry = null
  }

  const flushSection = () => {
    flushEntry()
    if (currentSection) {
      sections.push(currentSection)
    }
    currentSection = null
  }

  for (const rawLine of description.split(/\r?\n/)) {
    const line = normalizeLine(rawLine)
    if (!line) continue

    if (isSectionHeading(line)) {
      flushSection()
      currentSection = { heading: line, preamble: [], entries: [] }
      continue
    }

    const timeMatch = line.match(/^((?:\d{2}:\d{2})(?:\s*[–-]\s*\d{2}:\d{2})?)\s*[:：]\s*(.+)$/)
    if (timeMatch) {
      if (!currentSection) {
        currentSection = { heading: 'Agenda', preamble: [], entries: [] }
      }
      flushEntry()
      currentEntry = {
        time: timeMatch[1].replace(/\s*[–-]\s*/g, ' – '),
        title: timeMatch[2].trim(),
        details: [],
      }
      continue
    }

    if (currentEntry) {
      currentEntry.details.push(line)
      continue
    }

    if (currentSection) {
      currentSection.preamble.push(line)
      continue
    }

    intro.push(line)
  }

  flushSection()
  return { intro, sections }
}

export default function EventDetail() {
  const { slug } = useParams()
  const location = useLocation()
  const segments = location.pathname.split('/')
  const locale: Locale = isLocale(segments[1]) ? segments[1] : 'en'

  const { event, allEvents: syncedEvents, loading } = useEventBySlug(slug)
  const allEvents = sortEventsByStartDesc(syncedEvents)

  if (loading && !event) {
    return (
      <>
        <Nav />
        <main className={s.notFound}>
          <div className="container">
            <span className="overline">Loading program</span>
            <h1>Fetching the latest Sanity event content.</h1>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!event) {
    return (
      <>
        <Nav />
        <main className={s.notFound}>
          <div className="container">
            <span className="overline">Event not found</span>
            <h1>We could not find this program.</h1>
            <Link to={`/${locale}/events`} className={s.backLink}>
              <ArrowLeft size={16} weight="bold" aria-hidden="true" />
              Back to Events
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const title = translate(event.title, locale)
  const description = translate(event.description, locale)
  const locationLabel = translate(event.location, locale)
  const gallery = [...event.images]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .filter(img => !img.isCover)
    .slice(0, 6)
  const libraryImages = [...event.libraryItems]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .filter(item => item.sanityImage)
  const scenes = libraryImages.length > 0
    ? libraryImages.map((item, index) => ({
      key: item.imageUrl || item.altText || `library-${index}`,
      localSrc: '',
      sanityImage: item.sanityImage,
      alt: item.altText || translate(item.title, locale) || title,
    }))
    : gallery.map((img, index) => ({
      key: img.imageUrl || img.altText || `gallery-${index}`,
      localSrc: eventImageLocalPath(img.imageUrl),
      sanityImage: img.sanityImage,
      alt: img.altText || title,
    }))
  const related = allEvents.filter(item => item.slug !== event.slug).slice(0, 3)
  const outline = structuredProgramOutline(event, locale) ?? parseProgramOutline(description)

  const facts = [
    { label: 'Date', value: formatRange(event, locale), Icon: CalendarBlank },
    { label: 'Location', value: locationLabel, Icon: MapPin },
    { label: 'Language', value: event.language || 'Multilingual', Icon: GlobeHemisphereEast },
    { label: 'Audience', value: event.targetAudience || 'Medical professionals', Icon: Users },
  ]

  return (
    <>
      <Nav />

      <main>
        <section className={s.hero} aria-labelledby="event-title">
          <ContentImg
            localSrc={eventImageLocalPath(event.coverImage)}
            sanityImage={event.coverSanityImage}
            alt={title}
            className={s.heroImg}
            loading="eager"
            sizes="100vw"
            width={1600}
            height={820}
          />
          <div className={s.heroOverlay} />
          <div className={`container ${s.heroInner}`}>
            <Link to={`/${locale}/events`} className={`${s.backLink} reveal-soft`}>
              <ArrowLeft size={16} weight="bold" aria-hidden="true" />
              Back to Events
            </Link>
            <div className={s.heroGrid}>
              <div className={s.heroCopy}>
                <span className={`${s.status} ${event.status === 'past' ? s.statusPast : s.statusUpcoming}`}>
                  {event.status === 'past' ? 'Past Program' : 'Upcoming Program'}
                </span>
                <h1 id="event-title" className={`${s.title} reveal reveal--delay-1`}>{title}</h1>
                <p className={`${s.lead} reveal reveal--delay-2`}>{description.split('\n\n')[0]}</p>
              </div>
              <aside className={`${s.factPanel} reveal-clip reveal--delay-3`} aria-label="Event facts">
                {facts.map(({ label, value, Icon }) => (
                  <div className={s.fact} key={label}>
                    <Icon size={20} weight="bold" aria-hidden="true" />
                    <div>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  </div>
                ))}
                <Link to={`/${locale}/contact`} className={s.primaryCta}>
                  Request program info <ArrowRight size={15} weight="bold" aria-hidden="true" />
                </Link>
              </aside>
            </div>
          </div>
        </section>

        <section className={s.bodySection}>
          <div className={`container ${s.bodyGrid}`}>
            <article className={`${s.content} reveal-soft`}>
              <div className={s.programKicker}>PROGRAM DETAILS</div>
              <div className="section-divider" />
              <span className="overline">Clinical agenda and event notes</span>
              <h2>Clinical agenda and event notes</h2>

              {outline.intro.length > 0 && (
                <div className={s.programIntro}>
                  {outline.intro.map((block, index) => (
                    <p key={index}>{block}</p>
                  ))}
                </div>
              )}

              {outline.sections.length > 0 ? (
                <div className={s.programTimeline}>
                  {outline.sections.map((section, sectionIndex) => (
                    <div key={`${section.heading}-${sectionIndex}`} className={s.programSection} data-motion-skip="true">
                      <div className={s.programSectionHead}>
                        <span className={s.programSectionTag}>{section.heading}</span>
                      </div>
                      {section.preamble.length > 0 && (
                        <div className={s.programPreamble}>
                          {section.preamble.map((line, index) => <p key={index}>{line}</p>)}
                        </div>
                      )}
                      <div className={s.timelineList}>
                        {section.entries.map((entry, index) => (
                          <div className={s.timelineItem} key={`${section.heading}-${entry.time}-${index}`}>
                            <div className={s.timelineRail} aria-hidden="true"><span /></div>
                            <div className={s.timelineBody}>
                              <div className={s.timelineHead}>
                                <span className={s.timelineTime}>{entry.time}</span>
                                <span className={s.timelineIndex}>{String(index + 1).padStart(2, '0')}</span>
                              </div>
                              <h3 className={s.timelineTitle}>{entry.title}</h3>
                              {entry.details.length > 0 && (
                                <ul className={s.timelineDetails}>
                                  {entry.details.map((detail, detailIndex) => (
                                    <li key={detailIndex}>{detail}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={s.contentText}>
                  {textBlocks(description).map((block, index) => (
                    <p key={index}>{block}</p>
                  ))}
                </div>
              )}
            </article>

            <aside className={`${s.sideCard} motion-surface`}>
              <span className={s.sideLabel}>Participation</span>
              <dl>
                <div>
                  <dt>Capacity</dt>
                  <dd>{event.capacity > 0 ? `${event.capacity} seats` : 'Contact organizer'}</dd>
                </div>
                <div>
                  <dt>Seats left</dt>
                  <dd>{event.seatsLeft > 0 ? event.seatsLeft : 'By confirmation'}</dd>
                </div>
                <div>
                  <dt>Registration</dt>
                  <dd>{event.registrationOpen ? 'Open' : 'Closed'}</dd>
                </div>
                <div>
                  <dt>Format</dt>
                  <dd>{event.type}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        {scenes.length > 0 && (
          <section className={s.gallerySection}>
            <div className="container">
              <div className={s.sectionHeader}>
                <div>
                  <div className="section-divider" />
                  <span className="overline">Event Gallery</span>
                  <h2>Scenes from the program</h2>
                </div>
              </div>
              <div className={s.galleryGrid}>
                {scenes.map((scene, index) => (
                  <figure className={`${s.galleryItem} reveal`} style={{ animationDelay: `${index * 90}ms` }} key={`${scene.key}-${index}`}>
                    <ContentImg
                      localSrc={scene.localSrc}
                      sanityImage={scene.sanityImage}
                      alt={scene.alt}
                      className={s.galleryImg}
                      sizes="(max-width: 700px) 100vw, 33vw"
                      width={560}
                      height={380}
                    />
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className={s.relatedSection}>
            <div className="container">
              <div className={s.sectionHeader}>
                <div>
                  <div className="section-divider" />
                  <span className="overline">More Programs</span>
                  <h2>Continue exploring</h2>
                </div>
                <Link to={`/${locale}/events`} className={s.textLink}>All events</Link>
              </div>
              <div className={s.relatedGrid}>
                {related.map(item => (
                  <Link to={`/${locale}/events/${item.slug}`} className={s.relatedCard} key={item.slug}>
                    <ContentImg
                      localSrc={eventImageLocalPath(item.coverImage)}
                      sanityImage={item.coverSanityImage}
                      alt={translate(item.title, locale)}
                      className={s.relatedImg}
                      sizes="(max-width: 700px) 100vw, 33vw"
                      width={480}
                      height={300}
                    />
                    <div>
                      <span>{formatDate(item.startAt, locale)}</span>
                      <h3>{translate(item.title, locale)}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}
