import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dir = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dir, '..')
const LOCALES = ['en', 'vi', 'ko']
const SEED_FILES = ['events', 'news', 'settings', 'pages', 'membership', 'partners', 'experts', 'centers']

const rows = [['file', 'id', 'path', 'locale', 'status', 'detail', 'sample']]

function hasHangul(text) { return /[\uac00-\ud7af]/.test(text) }
function hasVietnameseMarks(text) { return /[ăâêôơưđĂÂÊÔƠƯĐàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/.test(text) }
function isMissing(value) { return typeof value !== 'string' || value.trim() === '' || value.startsWith('[NEEDS_TRANSLATION') || value.startsWith('[GAP') }
function wordCount(value) { return String(value || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length }
function sample(value) { return String(value ?? '').replace(/\s+/g, ' ').slice(0, 180) }

function checkI18nObject(obj, path, ctx) {
  if (LOCALES.every((locale) => isMissing(obj?.[locale]))) return
  for (const locale of LOCALES) {
    const value = obj?.[locale]
    if (isMissing(value)) rows.push([ctx.file, ctx.id, path, locale, 'missing', 'empty or placeholder', sample(value)])
  }

  const en = String(obj?.en ?? '')
  const vi = String(obj?.vi ?? '')
  const ko = String(obj?.ko ?? '')
  if (!isMissing(en) && hasHangul(en)) rows.push([ctx.file, ctx.id, path, 'en', 'wrong_language_suspected', 'English field contains Hangul', sample(en)])
  if (!isMissing(en) && hasVietnameseMarks(en) && !/Lê|Văn|Thịnh|Hàn|Việt/.test(en)) rows.push([ctx.file, ctx.id, path, 'en', 'wrong_language_suspected', 'English field contains Vietnamese diacritics', sample(en)])
  if (!isMissing(ko) && !hasHangul(ko) && wordCount(ko) > 12) rows.push([ctx.file, ctx.id, path, 'ko', 'wrong_language_suspected', 'Korean field has no Hangul', sample(ko)])

  const counts = { en: wordCount(en), vi: wordCount(vi), ko: wordCount(ko) }
  const max = Math.max(counts.en, counts.vi, counts.ko)
  for (const locale of LOCALES) {
    if (max >= 80 && counts[locale] > 0 && counts[locale] < Math.max(25, max * 0.25)) {
      rows.push([ctx.file, ctx.id, path, locale, 'too_short_suspected', `word count ${counts[locale]} vs max ${max}`, sample(obj[locale])])
    }
  }
}

function walk(value, path, ctx) {
  if (!value || typeof value !== 'object') return
  if (path.endsWith('localizedSlugs') || path.includes('.localizedSlugs')) return
  if (LOCALES.some((loc) => Object.prototype.hasOwnProperty.call(value, loc))) {
    checkI18nObject(value, path, ctx)
    return
  }
  if (Array.isArray(value)) return value.forEach((item, index) => walk(item, `${path}[${index}]`, ctx))
  for (const [key, child] of Object.entries(value)) {
    if (key.startsWith('_')) continue
    walk(child, path ? `${path}.${key}` : key, ctx)
  }
}

async function processFile(name) {
  const raw = await readFile(resolve(ROOT, `data/seed/${name}.json`), 'utf8')
  const parsed = JSON.parse(raw)
  const items = Array.isArray(parsed.data) ? parsed.data : [parsed]
  for (const item of items) {
    const ctx = { file: name, id: item.slug ?? item.key ?? item.sourceId ?? item.name ?? 'root' }
    walk(item, '', ctx)
  }
}

for (const file of SEED_FILES) await processFile(file)

const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n')
await writeFile(resolve(ROOT, 'i18n-deep-audit.csv'), csv, 'utf8')
const issues = rows.length - 1
console.log(`Deep i18n audit: ${issues} issue(s). Output: i18n-deep-audit.csv`)
if (issues) {
  for (const row of rows.slice(1, 30)) console.log(row.join(' | '))
  process.exitCode = 1
}
