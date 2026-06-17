const { getCliClient } = require('@sanity/cli')
const { createReadStream, existsSync } = require('node:fs')
const { readFile } = require('node:fs/promises')
const { basename, resolve } = require('node:path')
const { randomUUID } = require('node:crypto')

const STUDIO_ROOT = resolve(__dirname, '..')
const ROOT = resolve(STUDIO_ROOT, '..')

const client = getCliClient({ apiVersion: '2024-01-01' })
const translations = require('./membership-translations.json')

function cleanI18n(obj) {
  if (!obj || typeof obj !== 'object') return { en: '', vi: '', ko: '' }
  const cleaned = {}
  for (const locale of ['en', 'vi', 'ko']) {
    const v = obj[locale] ?? ''
    cleaned[locale] = typeof v === 'string' && v.startsWith('[') ? '' : v
  }
  return cleaned
}

function i18nFromValue(value, path) {
  const base = value && typeof value === 'object'
    ? cleanI18n(value)
    : typeof value === 'string' && !value.startsWith('[')
      ? { en: value, vi: '', ko: '' }
      : { en: '', vi: '', ko: '' }

  const translated = path ? translations[path] : null
  if (translated) {
    base.vi = translated.vi
    base.ko = translated.ko
  }

  return base
}

function localizedList(items, basePath) {
  return Array.isArray(items) ? items.map((item, index) => ({
    _key: randomUUID(),
    _type: 'localizedListItem',
    text: i18nFromValue(item, `${basePath}[${index}]`),
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

  const asset = await client.assets.upload('file', createReadStream(fullPath), {
    filename: basename(fullPath),
  })
  console.log(`  ✓ Uploaded file: ${basename(fullPath)}`)
  return { _type: 'file', asset: { _type: 'reference', _ref: asset._id } }
}

async function main() {
  console.log('🚀 Migrating KBIT membership program with Sanity CLI user token')

  const raw = JSON.parse(await readFile(resolve(ROOT, 'data/seed/membership.json'), 'utf8'))
  const forms = []

  for (const form of raw.registrationForms?.forms ?? []) {
    const file = await uploadFile(form.filePath)
    forms.push({
      _key: form.id ?? randomUUID(),
      _type: 'membershipRegistrationForm',
      id: form.id ?? '',
      title: i18nFromValue(form.title, `registrationForms.forms[${raw.registrationForms.forms.indexOf(form)}].title`),
      filePath: form.filePath ?? '',
      file: file ?? undefined,
    })
  }

  await client.createOrReplace({
    _id: 'membershipProgram',
    _type: 'membershipProgram',
    membershipInfo: {
      tab: i18nFromValue(raw.membershipInfo?.tab, 'membershipInfo.tab'),
      title: i18nFromValue(raw.membershipInfo?.title, 'membershipInfo.title'),
      types: (raw.membershipInfo?.types ?? []).map((type) => ({
        _key: type.id ?? randomUUID(),
        _type: 'membershipType',
        id: type.id ?? '',
        title: i18nFromValue(type.title, `membershipInfo.types[${raw.membershipInfo.types.indexOf(type)}].title`),
        subtitle: i18nFromValue(type.subtitle, `membershipInfo.types[${raw.membershipInfo.types.indexOf(type)}].subtitle`),
        description: i18nFromValue(type.description, `membershipInfo.types[${raw.membershipInfo.types.indexOf(type)}].description`),
        highlights: localizedList(type.highlights, `membershipInfo.types[${raw.membershipInfo.types.indexOf(type)}].highlights`),
      })),
    },
    benefits: {
      title: i18nFromValue(raw.benefits?.title, 'benefits.title'),
      groups: (raw.benefits?.groups ?? []).map((group) => ({
        _key: group.id ?? randomUUID(),
        _type: 'membershipBenefitGroup',
        id: group.id ?? '',
        title: i18nFromValue(group.title, `benefits.groups[${raw.benefits.groups.indexOf(group)}].title`),
        items: localizedList(group.items, `benefits.groups[${raw.benefits.groups.indexOf(group)}].items`),
      })),
    },
    requirements: {
      tab: i18nFromValue(raw.requirements?.tab, 'requirements.tab'),
      general: {
        title: i18nFromValue(raw.requirements?.general?.title, 'requirements.general.title'),
        intro: i18nFromValue(raw.requirements?.general?.intro, 'requirements.general.intro'),
        items: (raw.requirements?.general?.items ?? []).map((item) => ({
          _key: randomUUID(),
          _type: 'membershipRequirementItem',
          title: i18nFromValue(item.title, `requirements.general.items[${raw.requirements.general.items.indexOf(item)}].title`),
          points: localizedList(item.points, `requirements.general.items[${raw.requirements.general.items.indexOf(item)}].points`),
        })),
      },
      specific: (raw.requirements?.specific ?? []).map((item) => ({
        _key: randomUUID(),
        _type: 'membershipSpecificRequirement',
        name: i18nFromValue(item.name, `requirements.specific[${raw.requirements.specific.indexOf(item)}].name`),
        points: localizedList(item.points, `requirements.specific[${raw.requirements.specific.indexOf(item)}].points`),
      })),
      steps: localizedList(raw.requirements?.steps, 'requirements.steps'),
    },
    fees: {
      tab: i18nFromValue(raw.fees?.tab, 'fees.tab'),
      title: i18nFromValue(raw.fees?.title, 'fees.title'),
      tiers: (raw.fees?.tiers ?? []).map((tier) => ({
        _key: tier.id ?? randomUUID(),
        _type: 'membershipFeeTier',
        id: tier.id ?? '',
        name: i18nFromValue(tier.name, `fees.tiers[${raw.fees.tiers.indexOf(tier)}].name`),
        audience: i18nFromValue(tier.audience, `fees.tiers[${raw.fees.tiers.indexOf(tier)}].audience`),
        packages: (tier.packages ?? []).map((pkg) => ({
          _key: randomUUID(),
          _type: 'membershipPackage',
          duration: i18nFromValue(pkg.duration, `fees.tiers[${raw.fees.tiers.indexOf(tier)}].packages[${tier.packages.indexOf(pkg)}].duration`),
          price: pkg.price ?? '',
        })),
        notes: localizedList(tier.notes, `fees.tiers[${raw.fees.tiers.indexOf(tier)}].notes`),
        lifeBenefits: localizedList(tier.lifeBenefits, `fees.tiers[${raw.fees.tiers.indexOf(tier)}].lifeBenefits`),
      })),
      limitPolicy: {
        title: i18nFromValue(raw.fees?.limitPolicy?.title, 'fees.limitPolicy.title'),
        releases: localizedList(raw.fees?.limitPolicy?.releases, 'fees.limitPolicy.releases'),
        note: i18nFromValue(raw.fees?.limitPolicy?.note, 'fees.limitPolicy.note'),
      },
    },
    registrationForms: {
      tab: i18nFromValue(raw.registrationForms?.tab, 'registrationForms.tab'),
      title: i18nFromValue(raw.registrationForms?.title, 'registrationForms.title'),
      description: i18nFromValue(raw.registrationForms?.description, 'registrationForms.description'),
      forms,
    },
  })

  console.log('✅ Membership Program migrated.')
}

main().catch((error) => {
  console.error('❌ Membership migration failed:', error)
  process.exit(1)
})
