import { assetSrc } from './assets'
import { news, t } from './data'
import type { Locale } from './locale'

export type NewsItem = (typeof news.data)[number]

export function localize(val: any, locale: Locale): string {
  return t(val, locale)
}

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

export function getSortedNews(): NewsItem[] {
  return (news.data as NewsItem[]).slice().sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function resolveNewsSlug(item: NewsItem, locale: Locale): string {
  return item.localizedSlugs?.[locale] ?? item.slug
}

export function findNewsBySlug(slug: string): NewsItem | undefined {
  return getSortedNews().find(item =>
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

export function rewriteNewsHtml(item: NewsItem, locale: Locale): string {
  const html = localize(item.content, locale)
  const imageMap = new Map<string, string>()

  for (const image of item.images || []) {
    if (image.originalUrl && image.localPath) {
      const src = assetSrc(image.localPath) || `/${image.localPath.replace(/^\/+/, '')}`
      imageMap.set(image.originalUrl, src)
    }
  }

  let output = html
  imageMap.forEach((src, originalUrl) => {
    output = output.split(originalUrl).join(src)
  })

  output = output.replace(/\sstyle=(?:"[^"]*"|'[^']*')/gi, '')

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
