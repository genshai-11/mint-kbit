import type { Locale } from './locale'

export type LocalizedString = { en: string; vi: string; ko: string } | string

/**
 * Resolve a localized value for the active locale.
 * Falls back to English when the requested locale is missing or still holds an
 * untranslated `[NEEDS_TRANSLATION:xx]` marker.
 */
export function localize(val: unknown, locale: Locale): string {
  if (!val) return ''
  if (typeof val === 'string') return val
  const record = val as Record<string, string | undefined>
  const raw = record[locale] ?? record.en ?? ''
  if (typeof raw === 'string' && raw.startsWith('[')) return record.en ?? ''
  return raw ?? ''
}

export { localize as t }
