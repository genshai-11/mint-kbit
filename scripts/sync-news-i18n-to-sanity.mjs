import { createClient } from '@sanity/client'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dir = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dir, '..')
const projectId = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_TOKEN

if (!projectId || !token) {
  console.error('Missing SANITY_PROJECT_ID/SANITY_TOKEN for Sanity write sync.')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, useCdn: false, apiVersion: '2024-01-01' })
const seed = JSON.parse(await readFile(resolve(ROOT, 'data/seed/news.json'), 'utf8'))

function cleanI18n(obj) {
  const out = {}
  for (const locale of ['en', 'vi', 'ko']) out[locale] = typeof obj?.[locale] === 'string' ? obj[locale] : ''
  return out
}

for (const item of seed.data ?? []) {
  const id = `news-${item.sourceId}`
  await client
    .patch(id)
    .set({
      title: cleanI18n(item.title),
      excerpt: cleanI18n(item.excerpt),
      content: cleanI18n(item.content),
      localizedSlugs: item.localizedSlugs ?? {},
      seoMeta: item.seoMeta ? {
        title: cleanI18n(item.seoMeta.title),
        description: cleanI18n(item.seoMeta.description),
      } : undefined,
    })
    .commit()
  console.log(`✓ Synced text i18n: ${id} ${item.slug}`)
}

console.log('✅ News i18n text sync complete.')
