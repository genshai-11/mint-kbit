import { createClient } from '@sanity/client'

const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'q9mwbl6e'
const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || 'production'
const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: false, perspective: 'published' })
const docs = await client.fetch(`*[_type == "news" && status == "published"] | order(publishedAt desc) {_id, slug, title, excerpt, content, seoMeta}`)

const locales = ['en', 'vi', 'ko']
const issues = []
function hasHangul(text) { return /[\uac00-\ud7af]/.test(text) }
function hasVietnameseMarks(text) { return /[ăâêôơưđĂÂÊÔƠƯĐàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/.test(text) }
function missing(value) { return typeof value !== 'string' || value.trim() === '' || value.startsWith('[NEEDS_TRANSLATION') || value.startsWith('[GAP') }
function words(value) { return String(value || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length }
function check(doc, path, obj) {
  for (const locale of locales) if (missing(obj?.[locale])) issues.push([doc._id, path, locale, 'missing'])
  const en = String(obj?.en ?? '')
  const ko = String(obj?.ko ?? '')
  if (!missing(en) && hasHangul(en)) issues.push([doc._id, path, 'en', 'contains Hangul'])
  if (!missing(en) && hasVietnameseMarks(en) && !/Lê|Văn|Thịnh|Hàn|Việt/.test(en)) issues.push([doc._id, path, 'en', 'contains Vietnamese diacritics'])
  if (!missing(ko) && !hasHangul(ko) && words(ko) > 12) issues.push([doc._id, path, 'ko', 'no Hangul'])
}
for (const doc of docs) {
  check(doc, 'title', doc.title)
  check(doc, 'excerpt', doc.excerpt)
  check(doc, 'content', doc.content)
  check(doc, 'seoMeta.title', doc.seoMeta?.title)
  check(doc, 'seoMeta.description', doc.seoMeta?.description)
}
console.log(`Sanity news i18n audit: ${issues.length} issue(s) across ${docs.length} published docs.`)
for (const issue of issues) console.log(issue.join(' | '))
if (issues.length) process.exitCode = 1
