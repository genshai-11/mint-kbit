/**
 * Export seed JSON → Sanity NDJSON (importable format)
 *
 * Usage:
 *   node scripts/export-sanity-ndjson.mjs
 *   → output: kbit-migration.ndjson
 *
 * Then import on your local machine:
 *   cd studio
 *   npx sanity dataset import ../kbit-migration.ndjson production --replace
 */

import { readFile, writeFile } from 'fs/promises'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { createHash } from 'crypto'

const __dir = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dir, '..')
const docs = []

async function readSeed(name) {
  const raw = await readFile(resolve(ROOT, `data/seed/${name}.json`), 'utf8')
  return JSON.parse(raw)
}

function cleanI18n(obj) {
  if (!obj || typeof obj !== 'object') return { en: '', vi: '', ko: '' }
  const out = {}
  for (const locale of ['en', 'vi', 'ko']) {
    const v = obj[locale] ?? ''
    out[locale] = typeof v === 'string' && v.startsWith('[') ? '' : (v ?? '')
  }
  return out
}

function slug(current) {
  return { _type: 'slug', current }
}

// ─── Partners ─────────────────────────────────────────────────────────────────
async function exportPartners() {
  const { data } = await readSeed('partners')
  if (!data?.length) return
  for (const p of data) {
    docs.push({
      _id: `partner-${p.sourceId ?? p.slug ?? (p.name ?? 'unknown').toLowerCase().replace(/\s+/g, '-')}`,
      _type: 'partner',
      name: p.name,
      url: p.url ?? p.website ?? '',
      tier: p.tier ?? 'general',
      sortOrder: p.sortOrder ?? 99,
      isActive: true,
    })
  }
  console.log(`  ✓ Partners: ${data.length}`)
}

// ─── Centers ──────────────────────────────────────────────────────────────────
async function exportCenters() {
  const { data } = await readSeed('centers')
  if (!data?.length) return
  for (const c of data) {
    docs.push({
      _id: `center-${c.sourceId}`,
      _type: 'center',
      slug: slug(c.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')),
      name: c.name,
      address: typeof c.address === 'string' ? { en: c.address, vi: '', ko: '' } : cleanI18n(c.address),
      phone: c.phone ?? '',
      hours: c.hours ?? '',
      lat: c.lat ?? null,
      lng: c.lng ?? null,
      facilities: c.facilities ?? [],
      isActive: true,
      sourceId: c.sourceId,
    })
  }
  console.log(`  ✓ Centers: ${data.length}`)
}

// ─── Events ───────────────────────────────────────────────────────────────────
async function exportEvents() {
  const { data } = await readSeed('events')
  if (!data?.length) return
  for (const e of data) {
    docs.push({
      _id: `event-${e.sourceId}`,
      _type: 'event',
      slug: slug(e.slug),
      title: cleanI18n(e.title),
      description: cleanI18n(e.description),
      startAt: e.startAt,
      endAt: e.endAt ?? null,
      additionalDates: e.additionalDates ?? [],
      location: cleanI18n(e.location),
      status: e.status ?? 'upcoming',
      isFeatured: e.isFeatured ?? false,
      registrationOpen: e.registrationOpen ?? false,
      fee: e.fee ?? null,
      capacity: e.capacity ?? 0,
      seatsLeft: e.seatsLeft ?? 0,
      language: e.language ?? '',
      targetAudience: e.targetAudience ?? '',
      speakerSlugs: e.speakerSlugs ?? [],
      sourceId: e.sourceId,
    })
  }
  console.log(`  ✓ Events: ${data.length}`)
}

// ─── News ─────────────────────────────────────────────────────────────────────
async function exportNews() {
  const { data } = await readSeed('news')
  if (!data?.length) return
  for (const n of data) {
    docs.push({
      _id: `news-${n.sourceId}`,
      _type: 'news',
      slug: slug(n.slug),
      title: cleanI18n(n.title),
      excerpt: cleanI18n(n.excerpt),
      content: cleanI18n(n.content),
      category: n.category ?? 'News',
      tags: n.tags ?? [],
      status: n.status ?? 'published',
      publishedAt: n.publishedAt ?? null,
      viewCount: n.viewCount ?? 0,
      sourceId: n.sourceId,
    })
  }
  console.log(`  ✓ News: ${data.length}`)
}

// ─── Settings ─────────────────────────────────────────────────────────────────
async function exportSettings() {
  const s = await readSeed('settings')
  docs.push({
    _id: 'siteSettings',
    _type: 'settings',
    siteMeta: {
      title: cleanI18n(s.siteMeta?.title),
      description: cleanI18n(s.siteMeta?.description),
    },
    stats: {
      educationCenters: typeof s.stats?.educationCenters === 'number' ? s.stats.educationCenters : 16,
      doctors: typeof s.stats?.doctors === 'number' ? s.stats.doctors : 50,
      countries: typeof s.stats?.countries === 'number' ? s.stats.countries : 0,
      members: typeof s.stats?.members === 'number' ? s.stats.members : 0,
    },
    contact: {
      email: s.contact?.email ?? '',
      phoneKr: s.contact?.phoneKr ?? '',
      phoneVn: s.contact?.phoneVn ?? '',
    },
    social: {
      facebook: s.social?.facebook ?? '',
      zalo: s.social?.zalo ?? '',
    },
    org: {
      vicePresident: s.org?.vicePresident ?? '',
      businessReg: s.org?.businessReg ?? '',
      copyright: cleanI18n(s.org?.copyright),
    },
    offices: (s.offices ?? []).map((o) => ({
      _key: createHash('md5').update(o.phone ?? o.label?.en ?? o.email ?? String(Math.random())).digest('hex').slice(0, 8),
      label: cleanI18n(o.label),
      address: cleanI18n(o.address),
      hours: cleanI18n(o.hours),
      phone: o.phone ?? '',
      email: o.email ?? '',
      mapLat: o.mapLat ?? null,
      mapLng: o.mapLng ?? null,
      contactPerson: o.contactPerson ?? '',
    })),
  })
  console.log('  ✓ Settings')
}

// ─── Home Hero ────────────────────────────────────────────────────────────────
async function exportHomeHero() {
  const s = await readSeed('settings')
  const slides = (s.homeHero ?? []).map((slide, i) => ({
    _key: `slide-${i}`,
    heading: cleanI18n(slide.heading),
    sub: cleanI18n(slide.sub),
    sortOrder: i,
  }))
  docs.push({
    _id: 'homeHero',
    _type: 'homeHero',
    slides,
  })
  console.log(`  ✓ Home Hero: ${slides.length} slides`)
}

// ─── Pages ────────────────────────────────────────────────────────────────────
async function exportPages() {
  const raw = await readSeed('pages')
  let count = 0
  for (const [key, data] of Object.entries(raw)) {
    if (key.startsWith('_') || !data || typeof data !== 'object') continue
    docs.push({
      _id: `page-${key}`,
      _type: 'page',
      key,
      title: cleanI18n(data.title),
      intro: cleanI18n(data.intro),
      pillars: Array.isArray(data.pillars) ? data.pillars.map((p, i) => ({
        _key: `pillar-${i}`,
        icon: p.icon ?? '',
        title: cleanI18n(p.title),
        desc: cleanI18n(p.desc),
      })) : [],
      faq: Array.isArray(data.faq) ? data.faq.map((f, i) => ({
        _key: `faq-${i}`,
        question: cleanI18n(f.question),
        answer: cleanI18n(f.answer),
      })) : [],
    })
    count++
  }
  console.log(`  ✓ Pages: ${count}`)
}

// ─── Run ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('📦 Generating Sanity NDJSON export...\n')

  await exportPartners()
  await exportCenters()
  await exportEvents()
  await exportNews()
  await exportSettings()
  await exportHomeHero()
  await exportPages()

  const ndjson = docs.map((d) => JSON.stringify(d)).join('\n')
  const outPath = resolve(ROOT, 'kbit-migration.ndjson')
  await writeFile(outPath, ndjson, 'utf8')

  console.log(`\n✅ Done. ${docs.length} documents → kbit-migration.ndjson`)
  console.log('\nImport on your local machine:')
  console.log('  cd studio')
  console.log('  npx sanity dataset import ../kbit-migration.ndjson production --replace')
}

main().catch((err) => {
  console.error('❌ Error:', err)
  process.exit(1)
})
