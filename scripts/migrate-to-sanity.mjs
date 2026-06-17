/**
 * Migration script: seed JSON → Sanity CMS
 *
 * Setup:
 *   1. Copy .env.example → .env.local and fill SANITY_PROJECT_ID, SANITY_TOKEN
 *   2. npm install @sanity/client dotenv (in root or run: node --env-file=.env.local scripts/migrate-to-sanity.mjs)
 *   3. Run: node --env-file=.env.local scripts/migrate-to-sanity.mjs
 *
 * Order: experts → partners → centers → events → news → settings → homeHero → pages → membership
 */

import { createClient } from '@sanity/client'
import { createReadStream, existsSync } from 'fs'
import { readFile } from 'fs/promises'
import { resolve, basename } from 'path'
import { fileURLToPath } from 'url'
import { createHash, randomUUID } from 'crypto'

const __dir = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dir, '..')

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET ?? 'production'
const token = process.env.SANITY_TOKEN

if (!projectId || !token) {
  console.error('❌ Missing Sanity credentials. Set SANITY_PROJECT_ID and SANITY_TOKEN in .env.local.')
  console.error('   Example: cp .env.example .env.local && npm run migrate-sanity')
  process.exit(1)
}

const assetManifestRaw = JSON.parse(await readFile(resolve(ROOT, 'data/seed/asset-manifest.json'), 'utf8'))
const optimizedManifestRaw = JSON.parse(await readFile(resolve(ROOT, 'data/assets-opt/manifest.json'), 'utf8'))
const assetByOriginalUrl = new Map((assetManifestRaw.assets ?? []).map((a) => [a.originalUrl, a.localPath]))
const uploadedImages = new Map()

const client = createClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: '2024-01-01',
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function readSeed(name) {
  const raw = await readFile(resolve(ROOT, `data/seed/${name}.json`), 'utf8')
  return JSON.parse(raw)
}

function toAssetKey(path) {
  return path.replace(/^(\.\/)?data\/assets\//, '').replace(/\\/g, '/')
}

function resolveLocalImagePath(input) {
  if (!input || typeof input !== 'string' || input.startsWith('[')) return null
  if (/^https?:\/\//.test(input)) return assetByOriginalUrl.get(input) ?? null
  return input
}

function resolveOptimizedImagePath(localPath) {
  const key = toAssetKey(localPath)
  const entry = optimizedManifestRaw[key]
  const variant = entry?.variants?.['1600w']
    ?? entry?.variants?.['1200w']
    ?? entry?.variants?.['800w']
    ?? entry?.variants?.default
    ?? entry?.variants?.['400w']

  return variant ? `data/assets-opt/${variant}` : localPath
}

function numberOrNull(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function stringOrEmpty(value) {
  if (typeof value === 'string') return value.startsWith('[') ? '' : value
  if (value && typeof value === 'object') return value.en ?? value.vi ?? value.ko ?? ''
  return ''
}

async function uploadImage(localPath) {
  const resolvedPath = resolveLocalImagePath(localPath)
  if (!resolvedPath) return null

  const uploadPath = resolveOptimizedImagePath(resolvedPath)
  if (uploadedImages.has(uploadPath)) return uploadedImages.get(uploadPath)

  const fullPath = resolve(ROOT, uploadPath)
  if (!existsSync(fullPath)) {
    console.warn(`  ⚠ Image not found: ${localPath} → ${uploadPath}`)
    return null
  }
  try {
    const asset = await client.assets.upload('image', createReadStream(fullPath), {
      filename: basename(fullPath),
    })
    const image = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
    uploadedImages.set(uploadPath, image)
    const sourceNote = uploadPath !== resolvedPath ? ` optimized from ${basename(resolvedPath)}` : ''
    console.log(`  ✓ Uploaded: ${basename(fullPath)}${sourceNote}`)
    return image
  } catch (err) {
    console.error(`  ✗ Upload failed: ${localPath}`, err.message)
    return null
  }
}

function cleanI18n(obj) {
  if (!obj || typeof obj !== 'object') return { en: '', vi: '', ko: '' }
  const cleaned = {}
  for (const locale of ['en', 'vi', 'ko']) {
    const v = obj[locale] ?? ''
    cleaned[locale] = typeof v === 'string' && v.startsWith('[') ? '' : v
  }
  return cleaned
}

function i18nFromValue(value) {
  if (value && typeof value === 'object') return cleanI18n(value)
  if (typeof value === 'string' && !value.startsWith('[')) return { en: value, vi: '', ko: '' }
  return { en: '', vi: '', ko: '' }
}

function localizedList(items) {
  return Array.isArray(items) ? items.map((item) => ({
    _key: randomUUID(),
    _type: 'localizedListItem',
    text: i18nFromValue(item),
  })) : []
}

async function uploadFile(filePath) {
  if (!filePath || typeof filePath !== 'string') return null
  const relativePath = filePath.startsWith('/') ? `public${filePath}` : filePath
  const fullPath = resolve(ROOT, relativePath)
  if (!existsSync(fullPath)) {
    console.warn(`  ⚠ File not found: ${filePath}`)
    return null
  }

  try {
    const asset = await client.assets.upload('file', createReadStream(fullPath), {
      filename: basename(fullPath),
    })
    console.log(`  ✓ Uploaded file: ${basename(fullPath)}`)
    return { _type: 'file', asset: { _type: 'reference', _ref: asset._id } }
  } catch (err) {
    console.error(`  ✗ File upload failed: ${filePath}`, err.message)
    return null
  }
}

function officeKey(o) {
  const src = o.phone ?? o.label?.en ?? o.email ?? String(Math.random())
  return createHash('md5').update(src).digest('hex').slice(0, 8)
}

async function upsert(doc) {
  return client.createOrReplace(doc)
}

// ─── Migrations ───────────────────────────────────────────────────────────────

async function migrateExperts() {
  console.log('\n── Experts ──')
  const { _sample } = await readSeed('experts')
  if (!_sample) { console.log('  (no sample data, skipping)'); return }
  console.log('  (experts data empty — skipping, add real expert docs via Studio)')
}

async function migratePartners() {
  console.log('\n── Partners ──')
  const { data } = await readSeed('partners')
  if (!data?.length) { console.log('  (no data)'); return }
  for (const p of data) {
    const logo = await uploadImage(p.logo || p.logoPath)
    await upsert({
      _id: `partner-${p.sourceId ?? p.slug ?? p.name.replace(/\s+/g, '-').toLowerCase()}`,
      _type: 'partner',
      name: p.name,
      logo: logo ?? undefined,
      url: p.url ?? p.website,
      tier: p.tier ?? 'general',
      sortOrder: p.sortOrder ?? 99,
      isActive: true,
    })
    console.log(`  ✓ Partner: ${p.name}`)
  }
}

async function migrateCenters() {
  console.log('\n── Centers ──')
  const { data } = await readSeed('centers')
  if (!data?.length) { console.log('  (no data)'); return }
  for (const c of data) {
    const images = []
    for (const img of (c.images ?? [])) {
      const uploaded = await uploadImage(img.imageUrl || img.localPath)
      if (uploaded) images.push({ _key: randomUUID(), _type: 'centerImage', image: uploaded, altText: img.altText, sortOrder: img.sortOrder })
    }
    await upsert({
      _id: `center-${c.sourceId}`,
      _type: 'center',
      slug: { _type: 'slug', current: c.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
      name: c.name,
      address: typeof c.address === 'string' ? { en: c.address, vi: '', ko: '' } : cleanI18n(c.address),
      phone: c.phone,
      hours: c.hours,
      lat: c.lat,
      lng: c.lng,
      images,
      facilities: c.facilities ?? [],
      isActive: true,
      sourceId: c.sourceId,
    })
    console.log(`  ✓ Center: ${c.name}`)
  }
}

async function migrateEvents() {
  console.log('\n── Events ──')
  const { data } = await readSeed('events')
  if (!data?.length) { console.log('  (no data)'); return }
  for (const e of data) {
    const coverImage = await uploadImage(e.coverImage)
    const images = []
    for (const img of (e.images ?? [])) {
      const uploaded = await uploadImage(img.imageUrl || img.localPath)
      if (uploaded) {
        images.push({
          _key: randomUUID(),
          _type: 'eventImage',
          image: uploaded,
          caption: cleanI18n(img.caption),
          altText: img.altText,
          sortOrder: img.sortOrder,
          isCover: img.isCover ?? false,
        })
      }
    }
    await upsert({
      _id: `event-${e.sourceId}`,
      _type: 'event',
      slug: { _type: 'slug', current: e.slug },
      title: cleanI18n(e.title),
      description: cleanI18n(e.description),
      coverImage: coverImage ?? undefined,
      images,
      startAt: e.startAt,
      endAt: e.endAt,
      additionalDates: e.additionalDates ?? [],
      location: cleanI18n(e.location),
      status: e.status ?? 'upcoming',
      isFeatured: e.isFeatured ?? false,
      registrationOpen: e.registrationOpen ?? false,
      fee: e.fee,
      capacity: e.capacity,
      seatsLeft: e.seatsLeft,
      language: e.language,
      targetAudience: e.targetAudience,
      speakerSlugs: e.speakerSlugs ?? [],
      sourceId: e.sourceId,
    })
    console.log(`  ✓ Event: ${e.slug}`)
  }
}

async function migrateNews() {
  console.log('\n── News ──')
  const { data } = await readSeed('news')
  if (!data?.length) { console.log('  (no data)'); return }
  for (const n of data) {
    const coverImage = await uploadImage(n.coverImage)
    const images = []
    for (const img of (n.images ?? [])) {
      const uploaded = await uploadImage(img.localPath || img.imageUrl)
      if (uploaded) {
        images.push({
          _key: randomUUID(),
          _type: 'newsImage',
          image: uploaded,
          role: img.role,
          isCover: img.isCover ?? false,
          sortOrder: img.sortOrder,
        })
      }
    }
    await upsert({
      _id: `news-${n.sourceId}`,
      _type: 'news',
      slug: { _type: 'slug', current: n.slug },
      title: cleanI18n(n.title),
      excerpt: cleanI18n(n.excerpt),
      content: cleanI18n(n.content),
      coverImage: coverImage ?? undefined,
      images,
      category: n.category ?? 'News',
      tags: n.tags ?? [],
      status: n.status ?? 'published',
      publishedAt: n.publishedAt,
      viewCount: n.viewCount ?? 0,
      seoMeta: n.seoMeta ? {
        title: cleanI18n(n.seoMeta.title),
        description: cleanI18n(n.seoMeta.description),
      } : undefined,
      sourceId: n.sourceId,
    })
    console.log(`  ✓ News: ${n.slug}`)
  }
}

async function migrateSettings() {
  console.log('\n── Settings ──')
  const s = await readSeed('settings')
  const logoLight = await uploadImage(s.brand?.logoLight)
  const logoDark = await uploadImage(s.brand?.logoDark)
  const favicon = await uploadImage(s.brand?.favicon)
  const ogImage = await uploadImage(s.siteMeta?.ogImage)

  await upsert({
    _id: 'siteSettings',
    _type: 'settings',
    logoLight: logoLight ?? undefined,
    logoDark: logoDark ?? undefined,
    favicon: favicon ?? undefined,
    siteMeta: {
      title: cleanI18n(s.siteMeta?.title),
      description: cleanI18n(s.siteMeta?.description),
      ogImage: ogImage ?? undefined,
    },
    stats: {
      educationCenters: typeof s.stats?.educationCenters === 'number' ? s.stats.educationCenters : 16,
      doctors: typeof s.stats?.doctors === 'number' ? s.stats.doctors : 50,
      countries: typeof s.stats?.countries === 'number' ? s.stats.countries : 0,
      members: typeof s.stats?.members === 'number' ? s.stats.members : 0,
    },
    contact: s.contact,
    social: s.social,
    org: {
      vicePresident: s.org?.vicePresident,
      businessReg: s.org?.businessReg,
      copyright: cleanI18n(s.org?.copyright),
    },
    offices: (s.offices ?? []).map((o) => ({
      _key: officeKey(o),
      _type: 'office',
      label: cleanI18n(o.label),
      address: cleanI18n(o.address),
      hours: cleanI18n(o.hours),
      phone: o.phone ?? '',
      email: o.email ?? '',
      mapLat: numberOrNull(o.mapLat),
      mapLng: numberOrNull(o.mapLng),
      contactPerson: stringOrEmpty(o.contactPerson),
    })),
  })
  console.log('  ✓ Settings')
}

async function migrateHomeHero() {
  console.log('\n── Home Hero ──')
  const s = await readSeed('settings')
  const rawSlides = s.homeHero ?? []
  const slides = []
  for (const [i, slide] of rawSlides.entries()) {
    const image = await uploadImage(slide.image)
    slides.push({
      _key: `slide-${i}`,
      _type: 'heroSlide',
      image: image ?? undefined,
      heading: cleanI18n(slide.heading),
      sub: cleanI18n(slide.sub),
      sortOrder: i,
    })
  }
  await upsert({
    _id: 'homeHero',
    _type: 'homeHero',
    slides,
  })
  console.log(`  ✓ Home Hero (${slides.length} slides)`)
}

async function migratePages() {
  console.log('\n── Pages ──')
  const raw = await readSeed('pages')
  for (const [key, data] of Object.entries(raw)) {
    if (key.startsWith('_')) continue
    const heroImage = await uploadImage(data.heroImage)
    await upsert({
      _id: `page-${key}`,
      _type: 'page',
      key,
      heroImage: heroImage ?? undefined,
      title: cleanI18n(data.title),
      intro: cleanI18n(data.intro),
      pillars: Array.isArray(data.pillars) ? data.pillars.map((p, i) => ({
        _key: `pillar-${i}`,
        _type: 'pagePillar',
        icon: p.icon,
        title: cleanI18n(p.title),
        desc: cleanI18n(p.desc),
      })) : [],
      faq: Array.isArray(data.faq) ? data.faq.map((f, i) => ({
        _key: `faq-${i}`,
        _type: 'pageFaq',
        question: cleanI18n(f.question),
        answer: cleanI18n(f.answer),
      })) : [],
    })
    console.log(`  ✓ Page: ${key}`)
  }
}

async function migrateMembership() {
  console.log('\n── Membership Program ──')
  const raw = await readSeed('membership')
  const forms = []

  for (const form of raw.registrationForms?.forms ?? []) {
    const file = await uploadFile(form.filePath)
    forms.push({
      _key: form.id ?? randomUUID(),
      _type: 'membershipRegistrationForm',
      id: form.id ?? '',
      title: i18nFromValue(form.title),
      filePath: form.filePath ?? '',
      file: file ?? undefined,
    })
  }

  await upsert({
    _id: 'membershipProgram',
    _type: 'membershipProgram',
    membershipInfo: {
      tab: i18nFromValue(raw.membershipInfo?.tab),
      title: i18nFromValue(raw.membershipInfo?.title),
      types: (raw.membershipInfo?.types ?? []).map((type) => ({
        _key: type.id ?? randomUUID(),
        _type: 'membershipType',
        id: type.id ?? '',
        title: i18nFromValue(type.title),
        subtitle: i18nFromValue(type.subtitle),
        description: i18nFromValue(type.description),
        highlights: localizedList(type.highlights),
      })),
    },
    benefits: {
      title: i18nFromValue(raw.benefits?.title),
      groups: (raw.benefits?.groups ?? []).map((group) => ({
        _key: group.id ?? randomUUID(),
        _type: 'membershipBenefitGroup',
        id: group.id ?? '',
        title: i18nFromValue(group.title),
        items: localizedList(group.items),
      })),
    },
    requirements: {
      tab: i18nFromValue(raw.requirements?.tab),
      general: {
        title: i18nFromValue(raw.requirements?.general?.title),
        intro: i18nFromValue(raw.requirements?.general?.intro),
        items: (raw.requirements?.general?.items ?? []).map((item) => ({
          _key: randomUUID(),
          _type: 'membershipRequirementItem',
          title: i18nFromValue(item.title),
          points: localizedList(item.points),
        })),
      },
      specific: (raw.requirements?.specific ?? []).map((item) => ({
        _key: randomUUID(),
        _type: 'membershipSpecificRequirement',
        name: i18nFromValue(item.name),
        points: localizedList(item.points),
      })),
      steps: localizedList(raw.requirements?.steps),
    },
    fees: {
      tab: i18nFromValue(raw.fees?.tab),
      title: i18nFromValue(raw.fees?.title),
      tiers: (raw.fees?.tiers ?? []).map((tier) => ({
        _key: tier.id ?? randomUUID(),
        _type: 'membershipFeeTier',
        id: tier.id ?? '',
        name: i18nFromValue(tier.name),
        audience: i18nFromValue(tier.audience),
        packages: (tier.packages ?? []).map((pkg) => ({
          _key: randomUUID(),
          _type: 'membershipPackage',
          duration: i18nFromValue(pkg.duration),
          price: pkg.price ?? '',
        })),
        notes: localizedList(tier.notes),
        lifeBenefits: localizedList(tier.lifeBenefits),
      })),
      limitPolicy: {
        title: i18nFromValue(raw.fees?.limitPolicy?.title),
        releases: localizedList(raw.fees?.limitPolicy?.releases),
        note: i18nFromValue(raw.fees?.limitPolicy?.note),
      },
    },
    registrationForms: {
      tab: i18nFromValue(raw.registrationForms?.tab),
      title: i18nFromValue(raw.registrationForms?.title),
      description: i18nFromValue(raw.registrationForms?.description),
      forms,
    },
  })

  console.log('  ✓ Membership Program')
}

// ─── Run ─────────────────────────────────────────────────────────────────────

const migrations = {
  experts: migrateExperts,
  partners: migratePartners,
  centers: migrateCenters,
  events: migrateEvents,
  news: migrateNews,
  settings: migrateSettings,
  homeHero: migrateHomeHero,
  pages: migratePages,
  membership: migrateMembership,
}

async function main() {
  console.log('🚀 KBIT → Sanity Migration')
  console.log(`   Project: ${projectId}`)
  console.log(`   Dataset: ${dataset}`)

  const selected = (process.env.SANITY_MIGRATE_ONLY ?? '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)

  const steps = selected.length ? selected : ['experts', 'partners', 'centers', 'events', 'news', 'settings', 'homeHero', 'pages', 'membership']

  for (const step of steps) {
    const run = migrations[step]
    if (!run) throw new Error(`Unknown migration step: ${step}`)
    await run()
  }

  console.log('\n✅ Migration complete.')
}

main().catch((err) => {
  console.error('\n❌ Migration failed:', err)
  process.exit(1)
})
