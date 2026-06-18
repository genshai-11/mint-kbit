import { useEffect, useState } from 'react'

import settingsSeed from '../../../data/seed/settings.json'
import { fetchSettings, sanityEnabled } from '@/lib/sanity'

export type SiteSettings = typeof settingsSeed

type SanityRecord = Record<string, unknown>

function asObject(value: unknown): SanityRecord | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as SanityRecord) : undefined
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
  return {
    ...base,
    siteMeta: { ...base.siteMeta, ...(asObject(doc.siteMeta) ?? {}) },
    stats: { ...base.stats, ...(asObject(doc.stats) ?? {}) },
    social: { ...base.social, ...(asObject(doc.social) ?? {}) },
    org: { ...base.org, ...(asObject(doc.org) ?? {}) },
    contact: { ...base.contact, ...(asObject(doc.contact) ?? {}) },
    offices,
  } as SiteSettings
}

async function loadSettings(): Promise<SiteSettings> {
  if (!sanityEnabled) return settingsSeed

  try {
    const doc = (await fetchSettings()) as SanityRecord | null
    return doc ? mapSettings(doc) : settingsSeed
  } catch (error) {
    console.warn('Sanity settings unavailable; using local seed fallback.', error)
    return settingsSeed
  }
}

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(settingsSeed)

  useEffect(() => {
    let active = true
    loadSettings().then((loaded) => {
      if (active) setSettings(loaded)
    })
    return () => { active = false }
  }, [])

  return settings
}
