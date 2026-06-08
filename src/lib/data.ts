import type { Locale } from './locale'

import settingsRaw from '../../data/seed/settings.json'
import eventsRaw from '../../data/seed/events.json'
import newsRaw from '../../data/seed/news.json'
import partnersRaw from '../../data/seed/partners.json'
import membershipRaw from '../../data/seed/membership.json'
import pagesRaw from '../../data/seed/pages.json'
import centersRaw from '../../data/seed/centers.json'
import expertsRaw from '../../data/seed/experts.json'

export type LocalizedString = { en: string; vi: string; ko: string } | string

export function t(val: LocalizedString | undefined, locale: Locale): string {
  if (!val) return ''
  if (typeof val === 'string') return val
  const raw = val[locale] ?? val['en'] ?? ''
  if (typeof raw === 'string' && raw.startsWith('[')) return val['en'] ?? ''
  return raw
}

export const settings = settingsRaw
export const events = eventsRaw
export const news = newsRaw
export const partners = partnersRaw
export const membership = membershipRaw
export const pages = pagesRaw
export const centers = centersRaw
export const experts = expertsRaw
