/**
 * Phase 7 — Export missing translations to CSV
 *
 * Scans all seed JSON files for fields where vi or ko is empty
 * or contains [NEEDS_TRANSLATION:xx].
 *
 * Usage:
 *   node scripts/export-missing-translations.mjs
 *   → output: translations-needed.csv
 */

import { readFile, writeFile } from 'fs/promises'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dir = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dir, '..')
const LOCALES = ['vi', 'ko']

const SEED_FILES = [
  'events',
  'news',
  'settings',
  'pages',
  'membership',
  'partners',
  'experts',
  'centers',
]

const rows = [['file', 'content_type', 'id', 'field_path', 'locale', 'status', 'source_en']]

function isMissing(val) {
  if (!val) return true
  if (typeof val === 'string' && (val.startsWith('[NEEDS_TRANSLATION') || val.startsWith('[GAP') || val.trim() === '')) return true
  return false
}

function walk(obj, path, context) {
  if (!obj || typeof obj !== 'object') return

  // Detect LocalizedString pattern: { en: string, vi: string, ko: string }
  if (typeof obj.en === 'string' || obj.en === null) {
    for (const locale of LOCALES) {
      if (isMissing(obj[locale])) {
        const sourceEn = (obj.en ?? '').slice(0, 200).replace(/\n/g, ' ').replace(/,/g, ';')
        rows.push([
          context.file,
          context.type,
          context.id,
          path,
          locale,
          obj[locale] === undefined ? 'missing' : 'needs_translation',
          sourceEn,
        ])
      }
    }
    return
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, i) => walk(item, `${path}[${i}]`, context))
    return
  }

  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('_')) continue
    walk(val, path ? `${path}.${key}` : key, context)
  }
}

async function processFile(name) {
  const raw = await readFile(resolve(ROOT, `data/seed/${name}.json`), 'utf8')
  const parsed = JSON.parse(raw)

  if (Array.isArray(parsed.data)) {
    for (const item of parsed.data) {
      const ctx = { file: name, type: name.replace(/s$/, ''), id: item.slug ?? item.sourceId ?? item.name ?? '?' }
      walk(item, '', ctx)
    }
  } else {
    // Flat object (settings, pages, membership)
    const ctx = { file: name, type: name, id: 'root' }
    walk(parsed, '', ctx)
  }
}

async function main() {
  console.log('🔍 Scanning for missing translations...\n')

  for (const name of SEED_FILES) {
    try {
      await processFile(name)
      console.log(`  ✓ ${name}`)
    } catch (err) {
      console.warn(`  ⚠ ${name}: ${err.message}`)
    }
  }

  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const outPath = resolve(ROOT, 'translations-needed.csv')
  await writeFile(outPath, csv, 'utf8')

  const missing = rows.length - 1
  console.log(`\n✅ Done. Found ${missing} missing translation fields.`)
  console.log(`   Output: translations-needed.csv`)
  console.log('\nColumns: file, content_type, id, field_path, locale, status, source_en')
  console.log('Priority order: homeHero → events title/location → news title/excerpt → settings → pages → content body')
}

main().catch((err) => {
  console.error('❌ Error:', err)
  process.exit(1)
})
