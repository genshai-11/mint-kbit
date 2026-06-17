const { getCliClient } = require('@sanity/cli')
const { randomUUID } = require('node:crypto')

const DEFAULT_SLUG = 'kat-2025-1st-korea-vietnam-k-beauty-advanced-skill-training-2025'
const slug = process.argv[2] || DEFAULT_SLUG
const client = getCliClient({ apiVersion: '2024-01-01' })
const LOCALES = ['en', 'vi', 'ko']

function localized(value) {
  if (value && typeof value === 'object') {
    return {
      en: typeof value.en === 'string' ? value.en : '',
      vi: typeof value.vi === 'string' ? value.vi : '',
      ko: typeof value.ko === 'string' ? value.ko : '',
    }
  }
  return { en: typeof value === 'string' ? value : '', vi: '', ko: '' }
}

function normalizeLine(line) {
  return String(line ?? '').replace(/^[•·\-–—]+\s*/, '').trim()
}

function isSectionHeading(line) {
  return /^(PART\s+[IVXLC]+|PHẦN\s+[IVXLC]+|DAY\s+\d+|ROOM\s+\d+|PHÒNG\s+\d+)/i.test(line)
}

function splitTime(raw) {
  const parts = String(raw ?? '').replace(/\s*[–-]\s*/g, ' – ').split(' – ').map((part) => part.trim())
  return { startTime: parts[0] || '', endTime: parts[1] || '' }
}

function parseDescription(description) {
  const sections = []
  let currentSection = null
  let currentEntry = null

  const flushEntry = () => {
    if (currentSection && currentEntry) currentSection.entries.push(currentEntry)
    currentEntry = null
  }

  const flushSection = () => {
    flushEntry()
    if (currentSection) sections.push(currentSection)
    currentSection = null
  }

  for (const rawLine of String(description ?? '').split(/\r?\n/)) {
    const line = normalizeLine(rawLine)
    if (!line) continue

    if (isSectionHeading(line)) {
      flushSection()
      currentSection = { title: line, intro: [], entries: [] }
      continue
    }

    const timeMatch = line.match(/^((?:\d{2}:\d{2})(?:\s*[–-]\s*\d{2}:\d{2})?)\s*[:：]\s*(.+)$/)
    if (timeMatch) {
      if (!currentSection) currentSection = { title: 'Agenda', intro: [], entries: [] }
      flushEntry()
      currentEntry = { ...splitTime(timeMatch[1]), title: timeMatch[2].trim(), details: [] }
      continue
    }

    if (currentEntry) {
      currentEntry.details.push(line)
      continue
    }

    if (currentSection) {
      currentSection.intro.push(line)
    }
  }

  flushSection()
  return sections
}

function emptyI18n() {
  return { en: '', vi: '', ko: '' }
}

function fillMissingLocales(value) {
  for (const locale of ['vi', 'ko']) {
    if (!value[locale]) value[locale] = value.en || ''
  }
  return value
}

function mergeLocaleParses(description) {
  const byLocale = Object.fromEntries(LOCALES.map((locale) => [locale, parseDescription(description[locale])]))
  const sectionCount = Math.max(...LOCALES.map((locale) => byLocale[locale].length), 0)

  return Array.from({ length: sectionCount }, (_, sectionIndex) => {
    const sectionTitle = emptyI18n()
    const sectionIntro = emptyI18n()
    const entryCount = Math.max(...LOCALES.map((locale) => byLocale[locale][sectionIndex]?.entries?.length ?? 0), 0)

    for (const locale of LOCALES) {
      const section = byLocale[locale][sectionIndex]
      if (!section) continue
      sectionTitle[locale] = section.title || ''
      sectionIntro[locale] = section.intro.join('\n')
    }

    return {
      _key: randomUUID(),
      _type: 'eventProgramSection',
      title: fillMissingLocales(sectionTitle),
      intro: fillMissingLocales(sectionIntro),
      sortOrder: sectionIndex,
      entries: Array.from({ length: entryCount }, (_, entryIndex) => {
        const title = emptyI18n()
        const details = emptyI18n()
        let startTime = ''
        let endTime = ''

        for (const locale of LOCALES) {
          const entry = byLocale[locale][sectionIndex]?.entries?.[entryIndex]
          if (!entry) continue
          title[locale] = entry.title || ''
          details[locale] = entry.details.join('\n')
          if (!startTime && entry.startTime) startTime = entry.startTime
          if (!endTime && entry.endTime) endTime = entry.endTime
        }

        return {
          _key: randomUUID(),
          _type: 'eventProgramEntry',
          startTime,
          endTime,
          title: fillMissingLocales(title),
          speaker: emptyI18n(),
          details: fillMissingLocales(details),
          sortOrder: entryIndex,
        }
      }),
    }
  })
}

async function main() {
  console.log('🚀 Migrating event Program Agenda')
  console.log(`   Event slug: ${slug}`)

  const docs = await client.fetch('*[_type == "event" && slug.current == $slug]{_id, title, description, programSections}', { slug })
  if (!Array.isArray(docs) || docs.length === 0) throw new Error(`Sanity event not found for slug: ${slug}`)

  const source = docs.find((doc) => doc._id.startsWith('drafts.')) ?? docs[0]
  const description = localized(source.description)
  const programSections = mergeLocaleParses(description)
  if (!programSections.length) throw new Error('No agenda sections could be parsed from description.')

  const targetIds = new Set(docs.map((doc) => doc._id))
  const publishedId = source._id.replace(/^drafts\./, '')
  targetIds.add(publishedId)

  for (const id of targetIds) {
    await client.patch(id).set({ programSections }).commit()
  }

  const entryCount = programSections.reduce((sum, section) => sum + (section.entries?.length ?? 0), 0)
  console.log(`✅ Updated ${[...targetIds].join(', ')} with ${programSections.length} program sections and ${entryCount} entries.`)
}

main().catch((error) => {
  console.error('❌ Event Program Agenda migration failed:', error)
  process.exit(1)
})
