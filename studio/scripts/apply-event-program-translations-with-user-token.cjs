const { getCliClient } = require('@sanity/cli')
const { readFileSync } = require('node:fs')

const DEFAULT_SLUG = 'kat-2025-1st-korea-vietnam-k-beauty-advanced-skill-training-2025'
const slug = process.argv[2] || DEFAULT_SLUG
const translationsPath = process.env.PROGRAM_TRANSLATIONS_PATH || process.argv[3]
if (!translationsPath) throw new Error('Set PROGRAM_TRANSLATIONS_PATH or pass translations JSON path as the second argument.')
const { translations } = JSON.parse(readFileSync(translationsPath, 'utf8'))
if (!Array.isArray(translations)) throw new Error('translations must be an array')

const client = getCliClient({ apiVersion: '2024-01-01' })

function applyPath(root, path, value) {
  const parts = []
  for (const match of path.matchAll(/([^.[\]]+)|\[(\d+)\]/g)) {
    parts.push(match[1] ?? Number(match[2]))
  }
  let cur = root
  for (let i = 0; i < parts.length - 1; i += 1) {
    cur = cur?.[parts[i]]
    if (cur == null) throw new Error(`Path not found: ${path}`)
  }
  const key = parts.at(-1)
  if (cur == null || key == null) throw new Error(`Path not found: ${path}`)
  cur[key] = value
}

async function main() {
  console.log(`Applying ${translations.length} event program translations for ${slug}`)
  const docs = await client.fetch('*[_type == "event" && slug.current == $slug]{_id, programSections}', { slug })
  if (!Array.isArray(docs) || docs.length === 0) throw new Error(`Sanity event not found for slug: ${slug}`)

  for (const doc of docs) {
    const programSections = structuredClone(doc.programSections || [])
    for (const item of translations) applyPath({ programSections }, item.path, item.value)
    await client.patch(doc._id).set({ programSections }).commit()
    console.log(`✅ Patched ${doc._id}`)
  }
}

main().catch((error) => {
  console.error('❌ Failed to apply event program translations:', error)
  process.exit(1)
})
