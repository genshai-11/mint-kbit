import { useEffect, useState } from 'react'

import membershipSeed from '../../../data/seed/membership.json'
import { fetchMembershipProgram, sanityEnabled } from '@/lib/sanity'
import type { Locale } from '@/lib/locale'

type Localized = { en?: string; vi?: string; ko?: string }
type SanityRecord = Record<string, any>

function localize(value: unknown, locale: Locale): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  const record = value as Localized
  const raw = record[locale] ?? record.en ?? ''
  return typeof raw === 'string' && raw.startsWith('[') ? record.en ?? '' : raw
}

function localizeList(items: unknown, locale: Locale): string[] {
  if (!Array.isArray(items)) return []
  return items
    .map((item) => {
      if (typeof item === 'string') return item
      return localize((item as SanityRecord).text, locale)
    })
    .filter(Boolean)
}

function mapMembershipProgram(doc: SanityRecord, locale: Locale): SanityRecord {
  return {
    membershipInfo: {
      tab: localize(doc.membershipInfo?.tab, locale),
      title: localize(doc.membershipInfo?.title, locale),
      types: (doc.membershipInfo?.types ?? []).map((type: SanityRecord) => ({
        id: type.id,
        title: localize(type.title, locale),
        subtitle: localize(type.subtitle, locale),
        description: localize(type.description, locale),
        highlights: localizeList(type.highlights, locale),
      })),
    },
    benefits: {
      title: localize(doc.benefits?.title, locale),
      groups: (doc.benefits?.groups ?? []).map((group: SanityRecord) => ({
        id: group.id,
        title: localize(group.title, locale),
        items: localizeList(group.items, locale),
      })),
    },
    requirements: {
      tab: localize(doc.requirements?.tab, locale),
      general: {
        title: localize(doc.requirements?.general?.title, locale),
        intro: localize(doc.requirements?.general?.intro, locale),
        items: (doc.requirements?.general?.items ?? []).map((item: SanityRecord) => ({
          title: localize(item.title, locale),
          points: localizeList(item.points, locale),
        })),
      },
      specific: (doc.requirements?.specific ?? []).map((item: SanityRecord) => ({
        name: localize(item.name, locale),
        points: localizeList(item.points, locale),
      })),
      steps: localizeList(doc.requirements?.steps, locale),
    },
    fees: {
      tab: localize(doc.fees?.tab, locale),
      title: localize(doc.fees?.title, locale),
      tiers: (doc.fees?.tiers ?? []).map((tier: SanityRecord) => ({
        id: tier.id,
        name: localize(tier.name, locale),
        audience: localize(tier.audience, locale),
        packages: (tier.packages ?? []).map((pkg: SanityRecord) => ({
          duration: localize(pkg.duration, locale),
          price: pkg.price,
        })),
        notes: localizeList(tier.notes, locale),
        lifeBenefits: localizeList(tier.lifeBenefits, locale),
      })),
      limitPolicy: {
        title: localize(doc.fees?.limitPolicy?.title, locale),
        releases: localizeList(doc.fees?.limitPolicy?.releases, locale),
        note: localize(doc.fees?.limitPolicy?.note, locale),
      },
    },
    registrationForms: {
      tab: localize(doc.registrationForms?.tab, locale),
      title: localize(doc.registrationForms?.title, locale),
      description: localize(doc.registrationForms?.description, locale),
      forms: (doc.registrationForms?.forms ?? []).map((form: SanityRecord) => ({
        id: form.id,
        title: localize(form.title, locale),
        filePath: form.file?.asset?.url ?? form.filePath,
      })),
    },
  }
}

async function loadMembershipProgram(locale: Locale): Promise<SanityRecord> {
  if (!sanityEnabled) return membershipSeed

  try {
    const doc = await fetchMembershipProgram() as SanityRecord | null
    return doc ? mapMembershipProgram(doc, locale) : membershipSeed
  } catch (error) {
    console.warn('Sanity membership program unavailable; using local seed fallback.', error)
    return membershipSeed
  }
}

export function useMembershipProgram(locale: Locale): SanityRecord {
  const [program, setProgram] = useState<SanityRecord>(membershipSeed)

  useEffect(() => {
    let active = true
    loadMembershipProgram(locale).then((loaded) => {
      if (active) setProgram(loaded)
    })
    return () => { active = false }
  }, [locale])

  return program
}
