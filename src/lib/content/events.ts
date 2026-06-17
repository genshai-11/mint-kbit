import { useEffect, useState } from 'react'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

import eventsSeed from '../../../data/seed/events.json'
import { fetchEvents as fetchSanityEvents, sanityEnabled, sanityImageSrc } from '@/lib/sanity'

export type LocalizedString = { en: string; vi: string; ko: string } | string

export type EventImage = {
  imageUrl: string
  thumbnailUrl?: string
  caption?: LocalizedString
  altText?: string
  sortOrder: number
  isCover?: boolean
  sanityImage?: SanityImageSource | null
}

export type EventLibraryItem = {
  kind: string
  title: LocalizedString
  description: LocalizedString
  altText?: string
  sortOrder: number
  sanityImage?: SanityImageSource | null
  imageUrl?: string
  fileUrl?: string
  fileName?: string
}

export type EventProgramEntry = {
  startTime: string
  endTime: string
  title: LocalizedString
  speaker: LocalizedString
  details: LocalizedString
  sortOrder: number
}

export type EventProgramSection = {
  title: LocalizedString
  intro: LocalizedString
  sortOrder: number
  entries: EventProgramEntry[]
}

export type EventItem = {
  sourceId?: number
  slug: string
  title: LocalizedString
  description: LocalizedString
  type: string
  coverImage: string
  coverSanityImage?: SanityImageSource | null
  startAt: string
  endAt: string
  additionalDates: string[]
  location: LocalizedString
  capacity: number
  seatsLeft: number
  status: 'upcoming' | 'past' | string
  isFeatured: boolean
  registrationOpen: boolean
  fee: unknown
  language: string
  targetAudience: string
  speakerSlugs: string[]
  programSections: EventProgramSection[]
  images: EventImage[]
  libraryItems: EventLibraryItem[]
}

type SanityEventDoc = Record<string, unknown>

const seedEvents = (((eventsSeed as unknown) as { data?: Omit<EventItem, 'libraryItems' | 'programSections'>[] }).data ?? []).map((event) => ({
  ...event,
  images: (event.images ?? []).map((image) => ({ ...image, sanityImage: null })),
  programSections: [],
  libraryItems: [],
  coverSanityImage: null,
}))

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

function asLocalized(value: unknown): LocalizedString {
  if (typeof value === 'string') return value
  const record = asRecord(value)
  return {
    en: asString(record.en),
    vi: asString(record.vi),
    ko: asString(record.ko),
  }
}

function slugCurrent(value: unknown): string {
  if (typeof value === 'string') return value
  const record = asRecord(value)
  return asString(record.current)
}

function asSanityImage(value: unknown): SanityImageSource | null {
  const record = asRecord(value)
  return record.asset ? value as SanityImageSource : null
}

function mapSanityEvent(doc: SanityEventDoc): EventItem {
  const imageDocs = Array.isArray(doc.images) ? doc.images : []
  const images = imageDocs.map((raw, index): EventImage => {
    const image = asRecord(raw)
    return {
      imageUrl: '',
      caption: asLocalized(image.caption),
      altText: asString(image.altText),
      sortOrder: asNumber(image.sortOrder, index),
      isCover: asBoolean(image.isCover),
      sanityImage: asSanityImage(image.image),
    }
  })

  const programSectionDocs = Array.isArray(doc.programSections) ? doc.programSections : []
  const programSections = programSectionDocs.map((raw, index): EventProgramSection => {
    const section = asRecord(raw)
    const entryDocs = Array.isArray(section.entries) ? section.entries : []
    return {
      title: asLocalized(section.title),
      intro: asLocalized(section.intro),
      sortOrder: asNumber(section.sortOrder, index),
      entries: entryDocs.map((entryRaw, entryIndex): EventProgramEntry => {
        const entry = asRecord(entryRaw)
        return {
          startTime: asString(entry.startTime),
          endTime: asString(entry.endTime),
          title: asLocalized(entry.title),
          speaker: asLocalized(entry.speaker),
          details: asLocalized(entry.details),
          sortOrder: asNumber(entry.sortOrder, entryIndex),
        }
      }),
    }
  })

  const libraryDocs = Array.isArray(doc.libraryItems) ? doc.libraryItems : []
  const libraryItems = libraryDocs.map((raw, index): EventLibraryItem => {
    const item = asRecord(raw)
    const file = asRecord(item.file)
    const asset = asRecord(file.asset)
    const sanityImage = asSanityImage(item.image)
    return {
      kind: asString(item.kind, 'photo'),
      title: asLocalized(item.title),
      description: asLocalized(item.description),
      altText: asString(item.altText),
      sortOrder: asNumber(item.sortOrder, index),
      sanityImage,
      imageUrl: sanityImage ? sanityImageSrc(sanityImage, 1600) : '',
      fileUrl: asString(asset.url),
      fileName: asString(asset.originalFilename),
    }
  })

  const slug = slugCurrent(doc.slug)
  const sourceId = asNumber(doc.sourceId, 0)

  return {
    sourceId: sourceId || undefined,
    slug,
    title: asLocalized(doc.title),
    description: asLocalized(doc.description),
    type: asString(doc.type, 'event'),
    coverImage: '',
    coverSanityImage: asSanityImage(doc.coverImage),
    startAt: asString(doc.startAt),
    endAt: asString(doc.endAt, asString(doc.startAt)),
    additionalDates: asStringArray(doc.additionalDates),
    location: asLocalized(doc.location),
    capacity: asNumber(doc.capacity),
    seatsLeft: asNumber(doc.seatsLeft),
    status: asString(doc.status, 'upcoming'),
    isFeatured: asBoolean(doc.isFeatured),
    registrationOpen: asBoolean(doc.registrationOpen),
    fee: doc.fee ?? null,
    language: asString(doc.language),
    targetAudience: asString(doc.targetAudience),
    speakerSlugs: asStringArray(doc.speakerSlugs),
    programSections,
    images,
    libraryItems,
  }
}

export function eventImageLocalPath(path: string): string {
  return path.replace(/^(\.\/)?data\/assets\//, '')
}

export async function loadEvents(): Promise<EventItem[]> {
  if (!sanityEnabled) return seedEvents

  try {
    const docs = await fetchSanityEvents() as SanityEventDoc[]
    if (!Array.isArray(docs) || docs.length === 0) return seedEvents
    return docs.map(mapSanityEvent).filter((event) => event.slug)
  } catch (error) {
    console.warn('Sanity events unavailable; using local seed fallback.', error)
    return seedEvents
  }
}

export function sortEventsByStartDesc(events: EventItem[]): EventItem[] {
  return events.slice().sort(
    (a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime(),
  )
}

export function useEvents(): EventItem[] {
  const [events, setEvents] = useState<EventItem[]>(seedEvents)

  useEffect(() => {
    let active = true
    loadEvents().then((loaded) => {
      if (active) setEvents(loaded)
    })
    return () => { active = false }
  }, [])

  return events
}

export function useEventBySlug(slug: string | undefined): { event: EventItem | undefined; allEvents: EventItem[]; loading: boolean } {
  const initial = slug ? seedEvents.find((event) => event.slug === slug) : undefined
  const [allEvents, setAllEvents] = useState<EventItem[]>(seedEvents)
  const [event, setEvent] = useState<EventItem | undefined>(initial)
  const [loading, setLoading] = useState(Boolean(sanityEnabled && slug && !initial))

  useEffect(() => {
    let active = true
    setLoading(Boolean(sanityEnabled && slug && !initial))

    loadEvents().then((loaded) => {
      if (!active) return
      setAllEvents(loaded)
      setEvent(slug ? loaded.find((item) => item.slug === slug) : undefined)
      setLoading(false)
    })

    return () => { active = false }
  }, [initial, slug])

  return { event, allEvents, loading }
}
