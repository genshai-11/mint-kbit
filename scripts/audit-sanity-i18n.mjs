import { createClient } from '@sanity/client'

const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'q9mwbl6e'
const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || 'production'
const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: false, perspective: 'published' })
const docs = await client.fetch(`*[_type in ["event", "news", "settings", "homeHero", "page", "membershipProgram", "expert", "partner", "center"]]`)

const locales = ['en', 'vi', 'ko']
const issues = []
function hasHangul(text) { return /[\uac00-\ud7af]/.test(text) }
function hasVietnameseMarks(text) { return /[ăâêôơưđĂÂÊÔƠƯĐàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/.test(text) }
function missing(value) { return typeof value !== 'string' || value.trim() === '' || value.startsWith('[NEEDS_TRANSLATION') || value.startsWith('[GAP') }
function words(value) { return String(value || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length }
function sample(value) { return String(value ?? '').replace(/\s+/g, ' ').slice(0, 120) }
function check(doc, path, obj) {
  if (locales.every((locale) => missing(obj?.[locale]))) return
  for (const locale of locales) if (missing(obj?.[locale])) issues.push({ id: doc._id, type: doc._type, path, locale, status: 'missing', sample: sample(obj?.[locale]) })
  const en = String(obj?.en ?? '')
  const ko = String(obj?.ko ?? '')
  if (!missing(en) && hasHangul(en)) issues.push({ id: doc._id, type: doc._type, path, locale: 'en', status: 'contains Hangul', sample: sample(en) })
  if (!missing(en) && hasVietnameseMarks(en) && !/Lê|Văn|Thịnh|Hàn|Việt|Việt Nam|Hàn Quốc/.test(en)) issues.push({ id: doc._id, type: doc._type, path, locale: 'en', status: 'contains Vietnamese diacritics', sample: sample(en) })
  if (!missing(ko) && !hasHangul(ko) && words(ko) > 12) issues.push({ id: doc._id, type: doc._type, path, locale: 'ko', status: 'no Hangul', sample: sample(ko) })
}
function walk(doc, value, path = '') {
  if (!value || typeof value !== 'object') return
  if (path.endsWith('localizedSlugs') || path.includes('.localizedSlugs')) return
  if (locales.some((locale) => Object.prototype.hasOwnProperty.call(value, locale))) {
    check(doc, path, value)
    return
  }
  if (Array.isArray(value)) return value.forEach((item, index) => walk(doc, item, `${path}[${index}]`))
  for (const [key, child] of Object.entries(value)) {
    if (key.startsWith('_') || key === 'slug' || key === 'file' || key === 'image' || key === 'asset') continue
    walk(doc, child, path ? `${path}.${key}` : key)
  }
}
for (const doc of docs) walk(doc, doc)
console.log(`Sanity full i18n audit: ${issues.length} issue(s) across ${docs.length} docs.`)
for (const issue of issues.slice(0, 80)) console.log(`${issue.type} | ${issue.id} | ${issue.path} | ${issue.locale} | ${issue.status} | ${issue.sample}`)
if (issues.length > 80) console.log(`...${issues.length - 80} more`)
if (issues.length) process.exitCode = 1
