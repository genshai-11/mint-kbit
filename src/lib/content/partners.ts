import { useEffect, useState } from 'react'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

import partnersSeed from '../../../data/seed/partners.json'

const sanityEnabled = Boolean(import.meta.env.VITE_SANITY_PROJECT_ID)

export type Partner = {
  name: string
  logoUrl: string
  sanityImage: SanityImageSource | null
  website: string | null
  sortOrder: number
}

type SanityRecord = Record<string, unknown>

const seedPartners: Partner[] = ((partnersSeed as { data?: SanityRecord[] }).data ?? []).map((p, i) => ({
  name: (p.name as string) ?? '',
  logoUrl: (p.logoUrl as string) ?? '',
  sanityImage: null,
  website: (p.website as string) ?? null,
  sortOrder: (p.sortOrder as number) ?? i + 1,
}))

function mapPartner(doc: SanityRecord, i: number): Partner {
  return {
    name: (doc.name as string) ?? '',
    logoUrl: '',
    sanityImage: doc.logo ? (doc.logo as SanityImageSource) : null,
    website: (doc.url as string) ?? null,
    sortOrder: (doc.sortOrder as number) ?? i + 1,
  }
}

async function loadPartners(): Promise<Partner[]> {
  if (!sanityEnabled) return seedPartners

  try {
    const { fetchPartners } = await import('@/lib/sanity')
    const docs = (await fetchPartners()) as SanityRecord[]
    if (!Array.isArray(docs) || docs.length === 0) return seedPartners
    return docs.map(mapPartner)
  } catch (error) {
    console.warn('Sanity partners unavailable; using local seed fallback.', error)
    return seedPartners
  }
}

export function usePartners(): Partner[] {
  const [partners, setPartners] = useState<Partner[]>(seedPartners)

  useEffect(() => {
    let active = true
    loadPartners().then((loaded) => {
      if (active) setPartners(loaded)
    })
    return () => { active = false }
  }, [])

  return partners
}
