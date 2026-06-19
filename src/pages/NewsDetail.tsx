import { Link, useLocation, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarBlank, Eye, Tag } from '@phosphor-icons/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Img from '@/components/Img'
import { isLocale, type Locale } from '@/lib/locale'
import {
  firstParagraphFrom,
  formatDate,
  getImgKey,
  useNewsArticle,
  localize,
  newsLead,
  readingTimeFrom,
  resolveNewsSlug,
  rewriteNewsHtml,
} from '@/lib/news'
import { tr } from '@/lib/ui'
import s from './NewsDetail.module.css'

export default function NewsDetail() {
  const { slug } = useParams()
  const location = useLocation()
  const segments = location.pathname.split('/')
  const locale: Locale = isLocale(segments[1]) ? segments[1] : 'en'

  const { item, allNews, loading } = useNewsArticle(slug)

  if (loading) {
    return (
      <>
        <Nav />
        <main className={s.notFound}>
          <div className="container">
            <span className="overline">{tr('Loading story…', locale)}</span>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!item) {
    return (
      <>
        <Nav />
        <main className={s.notFound}>
          <div className="container">
            <span className="overline">{tr('News not found', locale)}</span>
            <h1>{tr('We could not find this story.', locale)}</h1>
            <Link to={`/${locale}/news`} className={s.backLink}>
              <ArrowLeft size={16} weight="bold" aria-hidden="true" />
              {tr('Back to News', locale)}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const title = localize(item.title, locale)
  const lead = newsLead(item, locale)
  const readingTime = readingTimeFrom(item, locale)
  const coverImage = item.coverImage ? getImgKey(item.coverImage) : ''
  const related = allNews.filter(entry => entry.slug !== item.slug).slice(0, 3)
  const bodyHtml = rewriteNewsHtml(item, locale)
  const gallery = [...(item.images || [])]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .filter(img => !img.isCover)
    .slice(0, 4)
  const pullQuote = firstParagraphFrom(item, locale) || lead

  const heroFacts = [
    { icon: CalendarBlank, label: 'Published', value: formatDate(item.publishedAt, locale) },
    { icon: Eye, label: 'Reading time', value: `${readingTime} ${tr('min', locale)}` },
    { icon: Tag, label: 'Edition', value: item.category },
  ]

  return (
    <>
      <Nav />

      <main className={s.pageShell}>
        <section className={`${s.heroSection} section`}>
          <div className="container">
            <Link to={`/${locale}/news`} className={`${s.backLink} reveal-soft`}>
              <ArrowLeft size={16} weight="bold" aria-hidden="true" />
              Back to News
            </Link>

            <div className={s.heroGrid}>
              <article className={`${s.heroCopy} reveal-soft`}>
                <div className="section-divider" />
                <span className="overline">{tr('News story', locale)}</span>
                <h1>{title}</h1>
                <p className={s.heroLead}>{lead}</p>

                <div className={s.heroMeta}>
                  {heroFacts.map(({ icon: Icon, label, value }) => (
                    <span key={label}><Icon size={15} weight="bold" aria-hidden="true" />{value}</span>
                  ))}
                </div>

                <div className={s.tagRow}>
                  {(item.tags || []).map((tag: string) => <span key={tag}>{tag}</span>)}
                </div>
              </article>

              <aside className={`${s.heroVisual} reveal-clip`}>
                <div className={s.heroImageWrap}>
                  <Img
                    src={coverImage}
                    alt={title}
                    className={s.heroImage}
                    loading="eager"
                    sizes="(max-width: 980px) 100vw, 40vw"
                    width={1200}
                    height={900}
                  />
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className={`${s.articleSection} section`}>
          <div className="container">
            <div className={s.articleGrid}>
              <article className={`${s.articleBody} reveal-soft`}>
                <div className={s.issueLabel}>{tr('KBIT NEWS ARCHIVE', locale)}</div>
                <h2>{title}</h2>

                <div className={s.articleDeck}>
                  <blockquote>
                    <p>{pullQuote}</p>
                  </blockquote>
                </div>

                <div className={s.articleHtml} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
              </article>

              <aside className={s.articleRail}>
                <article className={`${s.sideCard} motion-surface reveal`}>
                  <div className={s.sideTag}>{tr('Story info', locale)}</div>
                  <div className={s.noteGrid}>
                    <div>
                      <span>{tr('Published', locale)}</span>
                      <strong>{formatDate(item.publishedAt, locale)}</strong>
                    </div>
                    <div>
                      <span>{tr('Reading time', locale)}</span>
                      <strong>{readingTime} {tr('min', locale)}</strong>
                    </div>
                  </div>
                </article>

                {gallery.length > 0 && (
                  <article className={`${s.sideCard} motion-surface reveal`}>
                    <div className={s.sideTag}>{tr('Selected frames', locale)}</div>
                    <div className={s.galleryGrid}>
                      {gallery.map((img, index) => (
                        <figure key={`${img.localPath}-${index}`} className={s.galleryItem}>
                          <Img
                            src={getImgKey(img.localPath)}
                            alt={`${title} frame ${index + 1}`}
                            className={s.galleryImage}
                            loading="lazy"
                            sizes="(max-width: 980px) 50vw, 18vw"
                            width={560}
                            height={420}
                          />
                        </figure>
                      ))}
                    </div>
                  </article>
                )}

                <article className={`${s.sideCard} motion-surface reveal`}>
                  <div className={s.sideTag}>{tr('Related stories', locale)}</div>
                  <div className={s.relatedList}>
                    {related.map(story => (
                      <Link key={story.slug} to={`/${locale}/news/${resolveNewsSlug(story, locale)}`} className={s.relatedItem}>
                        <span>{formatDate(story.publishedAt, locale)}</span>
                        <strong>{localize(story.title, locale)}</strong>
                      </Link>
                    ))}
                  </div>
                </article>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
