import { useEffect, useState } from 'react'
import { assetSrc } from './assets'
import { news, localize } from './data'
import type { Locale } from './locale'

export type NewsItem = (typeof news.data)[number]

export { localize }

const sanityEnabled = Boolean(import.meta.env.VITE_SANITY_PROJECT_ID)
type SanityRecord = Record<string, unknown>

const seedNews = news.data as NewsItem[]

export function getImgKey(path: string): string {
  return path.replace(/^(\.\/)?data\/assets\//, '')
}

export function localeCode(locale: Locale): string {
  if (locale === 'ko') return 'ko-KR'
  if (locale === 'vi') return 'vi-VN'
  return 'en-US'
}

export function formatDate(iso: string, locale: Locale): string {
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

export function sortNews(items: NewsItem[]): NewsItem[] {
  return items.slice().sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function resolveNewsSlug(item: NewsItem, locale: Locale): string {
  return item.localizedSlugs?.[locale] ?? item.slug
}

export function findNewsBySlug(items: NewsItem[], slug: string): NewsItem | undefined {
  return sortNews(items).find(item =>
    item.slug === slug || Object.values(item.localizedSlugs || {}).includes(slug)
  )
}

export function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function readingTimeFrom(item: NewsItem, locale: Locale): number {
  const words = stripHtml(localize(item.content, locale)).split(/\s+/).filter(Boolean).length
  return Math.max(2, Math.round(words / 180))
}

export function firstParagraphFrom(item: NewsItem, locale: Locale): string {
  const html = localize(item.content, locale)
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
  const text = stripHtml(match?.[1] ?? '')
  return text
}

export function excerptFrom(item: NewsItem, locale: Locale): string {
  const candidate = localize(item.excerpt, locale)
  if (candidate && !candidate.startsWith('[')) return candidate
  const content = localize(item.content, locale)
  const clean = stripHtml(content)
  return clean.length > 230 ? `${clean.slice(0, 230).trim()}…` : clean
}

function resolveInlineNewsImageSrc(src: string): string {
  if (/^(https?:|data:|blob:|\/\/)/i.test(src)) return src

  const normalized = src.replace(/^\/+/, '')
  const optimized = assetSrc(normalized) || assetSrc(normalized.replace(/^(\.\/)?data\/assets\//, ''))
  return optimized || src
}

export function rewriteNewsHtml(item: NewsItem, locale: Locale): string {
  const html = localize(item.content, locale)
  const imageMap = new Map<string, string>()

  for (const image of item.images || []) {
    const originalUrl = (image as { originalUrl?: string }).originalUrl
    if (originalUrl && image.localPath) {
      const src = assetSrc(image.localPath) || resolveInlineNewsImageSrc(image.localPath)
      imageMap.set(originalUrl, src)
    }
  }

  let output = html
  imageMap.forEach((src, originalUrl) => {
    output = output.split(originalUrl).join(src)
  })

  output = output
    .replace(/(<img\b[^>]*?\ssrc\s*=\s*)(["'])([^"']+)\2/gi, (_match, prefix: string, quote: string, src: string) => {
      return `${prefix}${quote}${resolveInlineNewsImageSrc(src)}${quote}`
    })
    .replace(/\sstyle="[^"]*"/gi, '')
    .replace(/\sstyle='[^']*'/gi, '')

  return output
}

export function newsLead(item: NewsItem, locale: Locale): string {
  return firstParagraphFrom(item, locale) || excerptFrom(item, locale)
}

export function localeLabel(locale: Locale): string {
  if (locale === 'ko') return 'Korean'
  if (locale === 'vi') return 'Vietnamese'
  return 'English'
}

// ─── Sanity-backed loading (seed fallback) ───────────────────────────────────
// Sanity images are resolved to CDN URL strings and placed in the same string
// fields the pages already read (coverImage, images[].localPath). The <Img>
// component treats http(s) sources as external, so the page render is unchanged.

function slugCurrent(value: unknown): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') return ((value as SanityRecord).current as string) ?? ''
  return ''
}

function mapNewsDoc(doc: SanityRecord, toUrl: (s: any, w?: number) => string): NewsItem {
  const images = Array.isArray(doc.images)
    ? (doc.images as SanityRecord[]).map((raw, i) => ({
        localPath: raw.image ? toUrl(raw.image, 1600) : '',
        originalUrl: '',
        role: (raw.role as string) ?? 'gallery',
        isCover: Boolean(raw.isCover),
        sortOrder: (raw.sortOrder as number) ?? i,
      }))
    : []
  return {
    slug: slugCurrent(doc.slug),
    localizedSlugs: (doc.localizedSlugs as Record<string, string>) ?? undefined,
    title: doc.title ?? { en: '', vi: '', ko: '' },
    excerpt: doc.excerpt ?? { en: '', vi: '', ko: '' },
    content: doc.content ?? { en: '', vi: '', ko: '' },
    coverImage: doc.coverImage ? toUrl(doc.coverImage, 1200) : '',
    images,
    category: (doc.category as string) ?? 'News',
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    publishedAt: (doc.publishedAt as string) ?? '',
    viewCount: (doc.viewCount as number) ?? 0,
    seoMeta: doc.seoMeta,
  } as unknown as NewsItem
}

async function loadNewsList(): Promise<NewsItem[]> {
  if (!sanityEnabled) return seedNews
  try {
    const { fetchNews, sanityImageSrc } = await import('./sanity')
    const docs = (await fetchNews()) as SanityRecord[]
    if (!Array.isArray(docs) || docs.length === 0) return seedNews
    return docs.map((doc) => mapNewsDoc(doc, sanityImageSrc))
  } catch (error) {
    console.warn('Sanity news unavailable; using local seed fallback.', error)
    return seedNews
  }
}

async function loadNewsArticle(slug: string): Promise<NewsItem | undefined> {
  if (!sanityEnabled) return findNewsBySlug(seedNews, slug)
  try {
    const { fetchNewsArticle, sanityImageSrc } = await import('./sanity')
    const doc = (await fetchNewsArticle(slug)) as SanityRecord | null
    return doc ? mapNewsDoc(doc, sanityImageSrc) : findNewsBySlug(seedNews, slug)
  } catch (error) {
    console.warn('Sanity news article unavailable; using local seed fallback.', error)
    return findNewsBySlug(seedNews, slug)
  }
}

export function useNewsList(): NewsItem[] {
  const [items, setItems] = useState<NewsItem[]>(() => sortNews(seedNews))

  useEffect(() => {
    let active = true
    loadNewsList().then((loaded) => { if (active) setItems(sortNews(loaded)) })
    return () => { active = false }
  }, [])

  return items
}

export function useNewsArticle(slug: string | undefined): {
  item: NewsItem | undefined
  allNews: NewsItem[]
  loading: boolean
} {
  const seedItem = slug ? findNewsBySlug(seedNews, slug) : undefined
  const [allNews, setAllNews] = useState<NewsItem[]>(() => sortNews(seedNews))
  const [item, setItem] = useState<NewsItem | undefined>(seedItem)
  const [loading, setLoading] = useState(Boolean(sanityEnabled && slug && !seedItem))

  useEffect(() => {
    let active = true
    setLoading(Boolean(sanityEnabled && slug && !seedItem))
    loadNewsList().then((loaded) => { if (active) setAllNews(sortNews(loaded)) })
    if (slug) {
      loadNewsArticle(slug).then((found) => {
        if (!active) return
        setItem(found)
        setLoading(false)
      })
    } else {
      setItem(undefined)
      setLoading(false)
    }
    return () => { active = false }
  }, [slug, seedItem])

  return { item, allNews, loading }
}
