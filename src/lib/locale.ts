export const LOCALES = ['en', 'vi', 'ko'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'

export function isLocale(s: string): s is Locale {
  return (LOCALES as readonly string[]).includes(s)
}

export function useLocale(): Locale {
  const seg = window.location.pathname.split('/')[1]
  return isLocale(seg) ? seg : DEFAULT_LOCALE
}
