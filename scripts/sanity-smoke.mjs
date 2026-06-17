import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || 'production'
const requireMembership = process.env.SANITY_REQUIRE_MEMBERSHIP === 'true'
const expectEventLibrarySlug = process.env.SANITY_EXPECT_EVENT_LIBRARY_SLUG
const expectEventProgramSlug = process.env.SANITY_EXPECT_EVENT_PROGRAM_SLUG

if (!projectId) {
  console.error('❌ Missing SANITY_PROJECT_ID or VITE_SANITY_PROJECT_ID.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
})

function hasMissingI18n(value) {
  if (!value || typeof value !== 'object') return false
  if (Array.isArray(value)) return value.some(hasMissingI18n)

  const obj = value
  if ('en' in obj && ('vi' in obj || 'ko' in obj)) {
    const source = obj.en
    const hasSourceContent = typeof source === 'string'
      ? source.trim() !== '' && !source.startsWith('[NEEDS_TRANSLATION')
      : Boolean(source)
    if (!hasSourceContent) return false
    return ['vi', 'ko'].some((locale) => {
      const raw = obj[locale]
      return raw == null || raw === '' || (typeof raw === 'string' && raw.startsWith('[NEEDS_TRANSLATION'))
    })
  }

  return Object.entries(obj)
    .filter(([key]) => !key.startsWith('_'))
    .some(([, child]) => hasMissingI18n(child))
}

const result = await client.fetch(`{
  "events": *[_type == "event"] | order(startAt desc) {
    _id, slug, title, description, startAt, location, coverImage,
    programSections[]{ title, intro, sortOrder, entries[]{ startTime, endTime, title, speaker, details, sortOrder } },
    images[]{ image, altText, sortOrder, isCover },
    libraryItems[]{ image, file, title, altText, sortOrder, kind }
  },
  "news": *[_type == "news" && status == "published"]{ _id, slug, title, excerpt, content, coverImage },
  "pages": *[_type == "page"]{ _id, key, title, intro, pillars, faq },
  "settings": *[_type == "settings" && _id == "siteSettings"][0],
  "homeHero": *[_type == "homeHero" && _id == "homeHero"][0],
  "membershipProgram": *[_type == "membershipProgram" && _id == "membershipProgram"][0]
}`)

const failures = []
const warnings = []

if (!Array.isArray(result.events) || result.events.length === 0) {
  failures.push('No Sanity events found.')
}

for (const event of result.events ?? []) {
  const label = event.slug?.current || event._id
  if (!event.slug?.current) failures.push(`${label}: missing slug.current`)
  if (!event.title?.en) failures.push(`${label}: missing English title`)
  if (!event.startAt) failures.push(`${label}: missing startAt`)
  if (!event.coverImage?.asset?._ref) failures.push(`${label}: missing coverImage asset`)
  if (!Array.isArray(event.images) || event.images.length === 0) failures.push(`${label}: missing gallery images[]`)
  for (const [index, image] of (event.images ?? []).entries()) {
    if (!image.image?.asset?._ref) failures.push(`${label}: gallery image ${index + 1} missing asset ref`)
    if (!image.altText) warnings.push(`${label}: gallery image ${index + 1} missing alt text`)
  }
  for (const [index, item] of (event.libraryItems ?? []).entries()) {
    if (!item.image?.asset?._ref && !item.file?.asset?._ref) failures.push(`${label}: library item ${index + 1} missing image/file asset ref`)
    if (item.image?.asset?._ref && !item.altText) warnings.push(`${label}: library item ${index + 1} missing alt text`)
  }
}

if (expectEventLibrarySlug) {
  const event = (result.events ?? []).find((item) => item.slug?.current === expectEventLibrarySlug)
  if (!event) failures.push(`Expected library event not found: ${expectEventLibrarySlug}`)
  else if (!Array.isArray(event.libraryItems) || event.libraryItems.length === 0) failures.push(`${expectEventLibrarySlug}: expected libraryItems but found none`)
}

if (expectEventProgramSlug) {
  const event = (result.events ?? []).find((item) => item.slug?.current === expectEventProgramSlug)
  if (!event) failures.push(`Expected program event not found: ${expectEventProgramSlug}`)
  else if (!Array.isArray(event.programSections) || event.programSections.length === 0) failures.push(`${expectEventProgramSlug}: expected programSections but found none`)
  else if (!event.programSections.some((section) => Array.isArray(section.entries) && section.entries.length > 0)) failures.push(`${expectEventProgramSlug}: expected programSections entries but found none`)
}

const i18nDocs = [
  ...(result.events ?? []),
  ...(result.news ?? []),
  ...(result.pages ?? []),
  result.settings,
  result.homeHero,
  result.membershipProgram,
].filter(Boolean)

for (const doc of i18nDocs) {
  if (hasMissingI18n(doc)) failures.push(`${doc._id ?? doc.key ?? 'document'}: missing or placeholder VI/KO localized content`)
}

if (!result.settings) failures.push('Missing siteSettings singleton.')
if (!result.homeHero) failures.push('Missing homeHero singleton.')

if (!result.membershipProgram) {
  const message = 'Missing membershipProgram singleton. Run SANITY_MIGRATE_ONLY=membership npm run migrate-sanity after SANITY_TOKEN is configured.'
  if (requireMembership) failures.push(message)
  else warnings.push(message)
}

console.log('Sanity smoke summary')
console.log(`- Project: ${projectId}`)
console.log(`- Dataset: ${dataset}`)
console.log(`- Events: ${result.events?.length ?? 0}`)
console.log(`- News: ${result.news?.length ?? 0}`)
console.log(`- Pages: ${result.pages?.length ?? 0}`)
console.log(`- Membership Program: ${result.membershipProgram ? 'yes' : 'no'}`)
if (expectEventLibrarySlug) {
  const event = (result.events ?? []).find((item) => item.slug?.current === expectEventLibrarySlug)
  console.log(`- Expected Event Library (${expectEventLibrarySlug}): ${event?.libraryItems?.length ?? 0} items`)
}
if (expectEventProgramSlug) {
  const event = (result.events ?? []).find((item) => item.slug?.current === expectEventProgramSlug)
  const entryCount = (event?.programSections ?? []).reduce((sum, section) => sum + (section.entries?.length ?? 0), 0)
  console.log(`- Expected Event Program (${expectEventProgramSlug}): ${event?.programSections?.length ?? 0} sections, ${entryCount} entries`)
}

if (warnings.length) {
  console.log('\nWarnings:')
  for (const warning of warnings) console.log(`- ${warning}`)
}

if (failures.length) {
  console.error('\n❌ Sanity smoke failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('\n✅ Sanity smoke passed.')
