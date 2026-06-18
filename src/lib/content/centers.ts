import { useEffect, useState } from 'react'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

import centersSeed from '../../../data/seed/centers.json'
import { fetchCenters, sanityEnabled } from '@/lib/sanity'
import { localize } from '@/lib/i18n'
import type { Locale } from '@/lib/locale'

export type CenterImage = {
  imageUrl: string
  altText: string
  sortOrder?: number
  sanityImage?: SanityImageSource | null
}

export type Center = {
  sourceId: number | string
  name: string
  address: string
  phone: string
  hours: string
  lat?: number | null
  lng?: number | null
  facilities: string[]
  images: CenterImage[]
}

type SanityRecord = Record<string, unknown>

const seedCenters: Center[] = ((centersSeed as { data?: SanityRecord[] }).data ?? []).map((c) => ({
  sourceId: (c.sourceId as number) ?? (c.name as string),
  name: (c.name as string) ?? '',
  address: typeof c.address === 'string' ? c.address : '',
  phone: (c.phone as string) ?? '',
  hours: (c.hours as string) ?? '',
  lat: (c.lat as number) ?? null,
  lng: (c.lng as number) ?? null,
  facilities: Array.isArray(c.facilities) ? (c.facilities as string[]) : [],
  images: (Array.isArray(c.images) ? (c.images as SanityRecord[]) : []).map((im) => ({
    imageUrl: (im.imageUrl as string) ?? '',
    altText: (im.altText as string) ?? '',
    sortOrder: im.sortOrder as number | undefined,
    sanityImage: null,
  })),
}))

function asRecord(value: unknown): SanityRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as SanityRecord) : {}
}

function mapCenter(doc: SanityRecord, locale: Locale, index: number): Center {
  const images = (Array.isArray(doc.images) ? (doc.images as SanityRecord[]) : []).map((raw, i) => {
    const im = asRecord(raw)
    return {
      imageUrl: '',
      altText: (im.altText as string) ?? '',
      sortOrder: (im.sortOrder as number) ?? i,
      sanityImage: im.image ? (im.image as SanityImageSource) : null,
    }
  })

  return {
    sourceId: (doc.sourceId as number) ?? (doc._id as string) ?? index,
    name: (doc.name as string) ?? '',
    address: localize(doc.address, locale),
    phone: (doc.phone as string) ?? '',
    hours: (doc.hours as string) ?? '',
    lat: (doc.lat as number) ?? null,
    lng: (doc.lng as number) ?? null,
    facilities: Array.isArray(doc.facilities) ? (doc.facilities as string[]) : [],
    images,
  }
}

async function loadCenters(locale: Locale): Promise<Center[]> {
  if (!sanityEnabled) return seedCenters

  try {
    const docs = (await fetchCenters()) as SanityRecord[]
    if (!Array.isArray(docs) || docs.length === 0) return seedCenters
    return docs.map((doc, i) => mapCenter(doc, locale, i))
  } catch (error) {
    console.warn('Sanity centers unavailable; using local seed fallback.', error)
    return seedCenters
  }
}

export function useCenters(locale: Locale): Center[] {
  const [centers, setCenters] = useState<Center[]>(seedCenters)

  useEffect(() => {
    let active = true
    loadCenters(locale).then((loaded) => {
      if (active) setCenters(loaded)
    })
    return () => { active = false }
  }, [locale])

  return centers
}
