import { useEffect, useState } from 'react'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

import expertsSeed from '../../../data/seed/experts.json'
import { localize } from '@/lib/i18n'
import type { Locale } from '@/lib/locale'

const sanityEnabled = Boolean(import.meta.env.VITE_SANITY_PROJECT_ID)

export type ExpertCertification = { name: string; issuer: string; year?: number }

export type Expert = {
  slug: string
  name: string
  title: string
  bio: string
  region: string
  specialties: string[]
  certifications: ExpertCertification[]
  avatarSanity: SanityImageSource | null
}

type SanityRecord = Record<string, unknown>

// Seed `data` is intentionally empty (content gap) — the page falls back to its
// gap state until real expert documents exist in Sanity.
const seedExperts: Expert[] = ((expertsSeed as { data?: unknown[] }).data ?? []) as Expert[]

function asRecord(value: unknown): SanityRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as SanityRecord) : {}
}

function slugCurrent(value: unknown): string {
  if (typeof value === 'string') return value
  return (asRecord(value).current as string) ?? ''
}

function mapExpert(doc: SanityRecord, locale: Locale): Expert {
  const certifications = (Array.isArray(doc.certifications) ? doc.certifications : []).map((raw) => {
    const c = asRecord(raw)
    return {
      name: localize(c.name, locale),
      issuer: (c.issuer as string) ?? '',
      year: c.year as number | undefined,
    }
  })

  return {
    slug: slugCurrent(doc.slug) || ((doc._id as string) ?? ''),
    name: (doc.name as string) ?? '',
    title: localize(doc.title, locale),
    bio: localize(doc.bio, locale),
    region: (doc.region as string) ?? '',
    specialties: Array.isArray(doc.specialties) ? (doc.specialties as string[]) : [],
    certifications,
    avatarSanity: doc.avatar ? (doc.avatar as SanityImageSource) : null,
  }
}

async function loadExperts(locale: Locale): Promise<Expert[]> {
  if (!sanityEnabled) return seedExperts

  try {
    const { fetchExperts } = await import('@/lib/sanity')
    const docs = (await fetchExperts()) as SanityRecord[]
    if (!Array.isArray(docs) || docs.length === 0) return seedExperts
    return docs.map((doc) => mapExpert(doc, locale)).filter((e) => e.name)
  } catch (error) {
    console.warn('Sanity experts unavailable; using local seed fallback.', error)
    return seedExperts
  }
}

export function useExperts(locale: Locale): Expert[] {
  const [experts, setExperts] = useState<Expert[]>(seedExperts)

  useEffect(() => {
    let active = true
    loadExperts(locale).then((loaded) => {
      if (active) setExperts(loaded)
    })
    return () => { active = false }
  }, [locale])

  return experts
}
