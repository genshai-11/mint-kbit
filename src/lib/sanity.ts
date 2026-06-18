import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined
const dataset = (import.meta.env.VITE_SANITY_DATASET as string | undefined) ?? 'production'

export const sanityEnabled = Boolean(projectId)

export const client = createClient({
  projectId: projectId ?? 'not-configured',
  dataset,
  useCdn: true,
  apiVersion: '2024-01-01',
  perspective: 'published',
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export function sanityImageSrcSet(source: SanityImageSource | null | undefined): string {
  if (!source) return ''
  const widths = [400, 800, 1200, 1600] as const
  return widths
    .map((w) => `${urlFor(source).width(w).format('webp').quality(82).url()} ${w}w`)
    .join(', ')
}

export function sanityImageSrc(source: SanityImageSource | null | undefined, width = 800): string {
  if (!source) return ''
  return urlFor(source).width(width).format('webp').quality(82).url()
}

// ─── GROQ Queries ────────────────────────────────────────────────────────────

export async function fetchEvents() {
  return client.fetch(`
    *[_type == "event"] | order(startAt desc) {
      _id, slug, title, description, coverImage, startAt, endAt,
      additionalDates, location, status, isFeatured, registrationOpen,
      fee, capacity, seatsLeft, language, targetAudience, speakerSlugs,
      programSections[]{ title, intro, sortOrder, entries[]{ startTime, endTime, title, speaker, details, sortOrder } },
      images[]{ image, caption, altText, sortOrder, isCover },
      libraryItems[]{ kind, title, description, image, file{ asset->{ url, originalFilename } }, altText, sortOrder }
    }
  `)
}

export async function fetchEvent(slug: string) {
  return client.fetch(`
    *[_type == "event" && slug.current == $slug][0] {
      _id, slug, title, description, coverImage, startAt, endAt,
      additionalDates, location, status, isFeatured, registrationOpen,
      fee, capacity, seatsLeft, language, targetAudience, speakerSlugs,
      programSections[]{ title, intro, sortOrder, entries[]{ startTime, endTime, title, speaker, details, sortOrder } },
      images[]{ image, caption, altText, sortOrder, isCover },
      libraryItems[]{ kind, title, description, image, file{ asset->{ url, originalFilename } }, altText, sortOrder }
    }
  `, { slug })
}

export async function fetchNews() {
  return client.fetch(`
    *[_type == "news" && status == "published"] | order(publishedAt desc) {
      _id, slug, localizedSlugs, title, excerpt, coverImage, category, tags,
      publishedAt, viewCount, seoMeta
    }
  `)
}

export async function fetchNewsArticle(slug: string) {
  return client.fetch(`
    *[_type == "news" && (
      slug.current == $slug ||
      localizedSlugs.en == $slug || localizedSlugs.vi == $slug || localizedSlugs.ko == $slug
    )][0] {
      _id, slug, localizedSlugs, title, excerpt, content, coverImage,
      images[]{ image, role, isCover, sortOrder },
      category, tags, publishedAt, viewCount, seoMeta
    }
  `, { slug })
}

export async function fetchSettings() {
  return client.fetch(`*[_type == "settings" && _id == "siteSettings"][0]`)
}

export async function fetchHomeHero() {
  return client.fetch(`
    *[_type == "homeHero" && _id == "homeHero"][0] {
      slides[]{ image, heading, sub, sortOrder }
    }
  `)
}

export async function fetchExperts() {
  return client.fetch(`
    *[_type == "expert" && isActive == true] | order(sortOrder asc) {
      _id, slug, name, title, avatar, bio, specialties, certifications, region
    }
  `)
}

export async function fetchPartners() {
  return client.fetch(`
    *[_type == "partner" && isActive == true] | order(sortOrder asc) {
      _id, name, logo, url, tier
    }
  `)
}

export async function fetchCenters() {
  return client.fetch(`
    *[_type == "center" && isActive == true] {
      _id, slug, name, address, phone, hours, lat, lng,
      images[]{ image, altText, sortOrder }, facilities
    }
  `)
}

export async function fetchPage(key: string) {
  return client.fetch(`
    *[_type == "page" && key == $key][0] {
      key, heroImage, title, intro, pillars, faq
    }
  `, { key })
}

export async function fetchMembershipProgram() {
  return client.fetch(`
    *[_type == "membershipProgram" && _id == "membershipProgram"][0] {
      membershipInfo,
      benefits,
      requirements,
      fees,
      registrationForms {
        tab,
        title,
        description,
        forms[]{
          id,
          title,
          filePath,
          file{ asset->{url, originalFilename} }
        }
      }
    }
  `)
}
