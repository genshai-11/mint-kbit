import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, CalendarBlank, Eye, Tag, Sparkle, ListMagnifyingGlass } from '@phosphor-icons/react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Img from '@/components/Img'
import PageHero from '@/components/PageHero'
import { pages } from '@/lib/data'
import { isLocale, type Locale } from '@/lib/locale'
import { excerptFrom, formatDate, getImgKey, getSortedNews, localize, resolveNewsSlug, newsLead } from '@/lib/news'
import s from './News.module.css'

export default function News() {
  const location = useLocation()
  const segments = location.pathname.split('/')
  const locale: Locale = isLocale(segments[1]) ? segments[1] : 'en'

  const page = pages.news as { title: { en: string; vi?: string; ko?: string }; intro: { en: string; vi?: string; ko?: string } }
  const allNews = getSortedNews()
  const featured = allNews[0]
  const archive = allNews.slice(1)
  const featuredSlug = featured ? resolveNewsSlug(featured, locale) : ''
  const featuredImage = featured?.coverImage ? getImgKey(featured.coverImage) : ''
  const spotlight = allNews.slice(0, 3)

  return (
    <>
      <Nav />

      <PageHero
        watermark="NEWS"
        overline="News / Stories / Archive"
        title={localize(page.title, locale)}
        desc={localize(page.intro, locale)}
        image={featuredImage || 'news/news-kat-2025-elevating-korea-vietnam-medical-aesthetic-collaboration-thumb-6ee67691.png'}
        imageAlt="KBIT medical aesthetic collaboration news coverage"
      />

      <main id="news-archive" className={s.pageShell}>
        <section className={`${s.magazineHero} section`}>
          <div className="container">
            <div className={s.heroGrid}>
              {featured && (
                <article className={`${s.featureCard} reveal-clip`}>
                  <div className={s.featureImageWrap}>
                    <Img
                      src={featuredImage}
                      alt={localize(featured.title, locale)}
                      className={s.featureImage}
                      loading="eager"
                      sizes="(max-width: 980px) 100vw, 64vw"
                      width={1200}
                      height={820}
                    />
                  </div>
                  <div className={s.featureBody}>
                    <div className={s.cardMetaRow}>
                      <span className={s.metaChip}><Sparkle size={14} weight="bold" aria-hidden="true" />Featured</span>
                      <span className={s.metaChip}><CalendarBlank size={14} weight="bold" aria-hidden="true" />{formatDate(featured.publishedAt, locale)}</span>
                      <span className={s.metaChip}><Eye size={14} weight="bold" aria-hidden="true" />{featured.viewCount} views</span>
                    </div>
                    <h2>{localize(featured.title, locale)}</h2>
                    <p>{newsLead(featured, locale)}</p>
                    <div className={s.tagRow}>
                      {(featured.tags || []).slice(0, 4).map((tag: string) => <span key={tag}>{tag}</span>)}
                    </div>
                    <Link to={`/${locale}/news/${featuredSlug}`} className={s.primaryLink}>
                      Read story <ArrowRight size={16} weight="bold" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              )}

              <aside className={`${s.heroRail} reveal-soft`}>
                <article className={s.railCard}>
                  <div className={s.railTag}><ListMagnifyingGlass size={16} weight="bold" aria-hidden="true" />Spotlight index</div>
                  <div className={s.spotlightList}>
                    {spotlight.map(item => (
                      <Link key={item.slug} to={`/${locale}/news/${resolveNewsSlug(item, locale)}`} className={s.spotlightItem}>
                        <span>{formatDate(item.publishedAt, locale)}</span>
                        <strong>{localize(item.title, locale)}</strong>
                      </Link>
                    ))}
                  </div>
                </article>

                <article className={s.railCard}>
                  <div className={s.railTag}><Tag size={16} weight="bold" aria-hidden="true" />Archive count</div>
                  <div className={s.railStats}>
                    <div>
                      <strong>{allNews.length}</strong>
                      <span>stories</span>
                    </div>
                    <div>
                      <strong>{archive.length}</strong>
                      <span>more below</span>
                    </div>
                  </div>
                </article>
              </aside>
            </div>
          </div>
        </section>

        <section className={`${s.archiveSection} section`}>
          <div className="container">
            <div className={s.sectionHeader}>
              <div>
                <div className="section-divider" />
                <span className="overline">Latest archive</span>
                <h2 className="headline-display">More articles</h2>
              </div>
            </div>

            <div className={s.archiveGrid}>
              {archive.map((item, index) => {
                const image = item.coverImage ? getImgKey(item.coverImage) : ''
                const slug = resolveNewsSlug(item, locale)
                return (
                  <article key={item.slug} className={`${s.archiveCard} motion-surface reveal`} style={{ animationDelay: `${index * 100}ms` }}>
                    <Link to={`/${locale}/news/${slug}`} className={s.archiveLink}>
                      <div className={s.archiveImageWrap}>
                        <Img
                          src={image}
                          alt={localize(item.title, locale)}
                          className={s.archiveImage}
                          loading="lazy"
                          sizes="(max-width: 800px) 100vw, 33vw"
                          width={720}
                          height={520}
                        />
                      </div>
                      <div className={s.archiveBody}>
                        <div className={s.archiveMeta}>
                          <span>{formatDate(item.publishedAt, locale)}</span>
                          <span>{item.viewCount} views</span>
                        </div>
                        <h3>{localize(item.title, locale)}</h3>
                        <p>{excerptFrom(item, locale)}</p>
                        <div className={s.newsTagRow}>
                          {(item.tags || []).slice(0, 3).map((tag: string) => <span key={tag}>{tag}</span>)}
                        </div>
                        <div className={s.readMore}>
                          Read story <ArrowRight size={15} weight="bold" aria-hidden="true" />
                        </div>
                      </div>
                    </Link>
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
