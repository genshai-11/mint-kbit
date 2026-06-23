const { getCliClient } = require('@sanity/cli')
const { readFile } = require('node:fs/promises')
const { resolve } = require('node:path')

const STUDIO_ROOT = resolve(__dirname, '..')
const ROOT = resolve(STUDIO_ROOT, '..')
const client = getCliClient({ apiVersion: '2024-01-01' })

function cleanI18n(obj) {
  const out = {}
  for (const locale of ['en', 'vi', 'ko']) out[locale] = typeof obj?.[locale] === 'string' ? obj[locale] : ''
  return out
}

async function main() {
  console.log('🚀 Syncing KBIT news i18n text with Sanity CLI user token')
  const seed = JSON.parse(await readFile(resolve(ROOT, 'data/seed/news.json'), 'utf8'))
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
    console.log(`  ✓ ${id}: ${item.slug}`)
  }
  console.log('✅ News i18n text sync complete.')
}

main().catch((error) => {
  console.error('❌ News i18n sync failed:', error)
  process.exit(1)
})
