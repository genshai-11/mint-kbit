import { useEffect, useState } from 'react'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

import settingsSeed from '../../../data/seed/settings.json'
import { localize } from '@/lib/i18n'
import type { Locale } from '@/lib/locale'

export type SiteSettings = typeof settingsSeed

type SanityRecord = Record<string, unknown>

// `Footer` (and thus this module) renders on every page. Gate on the env flag
// and dynamic-import the Sanity client so its bundle never lands in the global
// shared chunk — it loads only when a real project id is configured.
const sanityEnabled = Boolean(import.meta.env.VITE_SANITY_PROJECT_ID)

function asObject(value: unknown): SanityRecord | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as SanityRecord) : undefined
}

const LEGACY_PUBLIC_DOMAIN = /(?:^|@|\/\/)kbitassociation\.com/i

function safePublicContact(value: unknown): unknown {
  return typeof value === 'string' && LEGACY_PUBLIC_DOMAIN.test(value) ? 'Use contact form' : value
}

function safePublicSettings(settings: SiteSettings): SiteSettings {
  return {
    ...settings,
    contact: {
      ...settings.contact,
      email: safePublicContact(settings.contact.email) as string,
    },
    offices: settings.offices.map((office) => ({
      ...office,
      email: safePublicContact(office.email) as string,
    })),
  }
}

/**
 * Overlay the Sanity `settings` document on top of the local seed.
 * Sanity wins for any field it provides; the seed fills everything Sanity does
 * not carry (brand logos and the home hero live only in the seed / a separate
 * `homeHero` document). i18n objects are passed through untouched so components
 * keep localizing them with `localize()`.
 */
function mapSettings(doc: SanityRecord): SiteSettings {
  const base = settingsSeed as SiteSettings
  const offices = Array.isArray(doc.offices) && doc.offices.length ? doc.offices : base.offices
  return safePublicSettings({
    ...base,
    siteMeta: { ...base.siteMeta, ...(asObject(doc.siteMeta) ?? {}) },
    stats: { ...base.stats, ...(asObject(doc.stats) ?? {}) },
    social: { ...base.social, ...(asObject(doc.social) ?? {}) },
    org: { ...base.org, ...(asObject(doc.org) ?? {}) },
    contact: { ...base.contact, ...(asObject(doc.contact) ?? {}) },
    offices,
  } as SiteSettings)
}

async function loadSettings(): Promise<SiteSettings> {
  const seedFallback = safePublicSettings(settingsSeed)
  if (!sanityEnabled) return seedFallback

  try {
    const { fetchSettings } = await import('@/lib/sanity')
    const doc = (await fetchSettings()) as SanityRecord | null
    return doc ? mapSettings(doc) : seedFallback
  } catch (error) {
    console.warn('Sanity settings unavailable; using local seed fallback.', error)
    return seedFallback
  }
}

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(() => safePublicSettings(settingsSeed))

  useEffect(() => {
    let active = true
    loadSettings().then((loaded) => {
      if (active) setSettings(loaded)
    })
    return () => { active = false }
  }, [])

  return settings
}

// ─── Home hero ───────────────────────────────────────────────────────────────

export type HeroSlide = {
  imageKey: string
  sanityImage: SanityImageSource | null
  heading: string
  sub: string
}

function seedHeroSlides(locale: Locale): HeroSlide[] {
  const slides = (settingsSeed as { homeHero?: SanityRecord[] }).homeHero ?? []
  return slides.map((h) => ({
    imageKey: typeof h.image === 'string' ? h.image : '',
    sanityImage: null,
    heading: localize(h.heading, locale),
    sub: localize(h.sub, locale),
  }))
}

async function loadHomeHero(locale: Locale): Promise<HeroSlide[]> {
  try {
    const { fetchHomeHero } = await import('@/lib/sanity')
    const doc = (await fetchHomeHero()) as { slides?: SanityRecord[] } | null
    const slides = Array.isArray(doc?.slides) ? (doc!.slides as SanityRecord[]) : []
    if (!slides.length) return seedHeroSlides(locale)
    return [...slides]
      .sort((a, b) => ((a.sortOrder as number) ?? 0) - ((b.sortOrder as number) ?? 0))
      .map((raw) => {
        const slide = asObject(raw) ?? {}
        return {
          imageKey: '',
          sanityImage: slide.image ? (slide.image as SanityImageSource) : null,
          heading: localize(slide.heading, locale),
          sub: localize(slide.sub, locale),
        }
      })
  } catch (error) {
    console.warn('Sanity home hero unavailable; using local seed fallback.', error)
    return seedHeroSlides(locale)
  }
}

export function useHomeHero(locale: Locale): HeroSlide[] {
  const [override, setOverride] = useState<HeroSlide[] | null>(null)

  useEffect(() => {
    if (!sanityEnabled) return
    let active = true
    loadHomeHero(locale).then((slides) => {
      if (active) setOverride(slides)
    })
    return () => { active = false }
  }, [locale])

  // Seed render is always locale-correct and flash-free; Sanity overrides once loaded.
  return override ?? seedHeroSlides(locale)
}
