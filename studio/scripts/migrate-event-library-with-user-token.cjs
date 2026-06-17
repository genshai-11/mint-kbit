const { getCliClient } = require('@sanity/cli')
const { createReadStream, existsSync } = require('node:fs')
const { mkdir, readdir, stat } = require('node:fs/promises')
const { basename, extname, join, resolve } = require('node:path')
const { randomUUID } = require('node:crypto')
const sharp = require('sharp')

const STUDIO_ROOT = resolve(__dirname, '..')
const ROOT = resolve(STUDIO_ROOT, '..')
const DEFAULT_SLUG = 'kat-2025-1st-korea-vietnam-k-beauty-advanced-skill-training-2025'

const slug = process.argv[2] || DEFAULT_SLUG
const sourceFolder = process.argv[3]
  ? resolve(ROOT, process.argv[3])
  : resolve(ROOT, 'library', slug)
const outputFolder = resolve(ROOT, '.tmp', 'sanity-library-opt', slug)

const client = getCliClient({ apiVersion: '2024-01-01' })

function safeName(file) {
  return file
    .replace(extname(file), '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function titleFromFile(file, index) {
  const n = index + 1
  return {
    en: `KAT 2025 program library photo ${n}`,
    vi: `Ảnh thư viện chương trình KAT 2025 số ${n}`,
    ko: `KAT 2025 프로그램 라이브러리 사진 ${n}`,
  }
}

async function getImages(folder) {
  const entries = await readdir(folder)
  return entries
    .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

async function optimizeImage(inputPath, outputPath) {
  const before = (await stat(inputPath)).size
  await sharp(inputPath)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(outputPath)
  const after = (await stat(outputPath)).size
  return { before, after }
}

async function uploadImage(filePath, originalName) {
  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename: basename(filePath),
    source: { name: 'kbit-event-library', id: originalName },
  })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

async function main() {
  if (!existsSync(sourceFolder)) {
    throw new Error(`Library folder not found: ${sourceFolder}`)
  }

  await mkdir(outputFolder, { recursive: true })
  const files = await getImages(sourceFolder)
  if (!files.length) throw new Error(`No images found in ${sourceFolder}`)

  console.log('🚀 Migrating event library')
  console.log(`   Event slug: ${slug}`)
  console.log(`   Source: ${sourceFolder}`)
  console.log(`   Images: ${files.length}`)

  const event = await client.fetch('*[_type == "event" && slug.current == $slug][0]{_id, title}', { slug })
  if (!event?._id) throw new Error(`Sanity event not found for slug: ${slug}`)

  const libraryItems = []
  let totalBefore = 0
  let totalAfter = 0

  for (const [index, file] of files.entries()) {
    const inputPath = join(sourceFolder, file)
    const outputPath = join(outputFolder, `${String(index + 1).padStart(2, '0')}-${safeName(file)}.webp`)
    const { before, after } = await optimizeImage(inputPath, outputPath)
    totalBefore += before
    totalAfter += after

    const image = await uploadImage(outputPath, file)
    const title = titleFromFile(file, index)

    libraryItems.push({
      _key: randomUUID(),
      _type: 'eventLibraryItem',
      kind: 'photo',
      title,
      description: {
        en: 'Post-event program library image migrated from the local KBIT library folder.',
        vi: 'Ảnh thư viện sau chương trình được migrate từ thư mục KBIT library cục bộ.',
        ko: '로컬 KBIT 라이브러리 폴더에서 마이그레이션한 행사 후 프로그램 라이브러리 이미지입니다.',
      },
      image,
      altText: title.en,
      sortOrder: index,
    })

    const pct = before > 0 ? Math.round((1 - after / before) * 100) : 0
    console.log(`  ✓ ${file}: ${(before / 1024 / 1024).toFixed(2)}MB → ${(after / 1024 / 1024).toFixed(2)}MB (${pct}% smaller)`)
  }

  await client.patch(event._id).set({ libraryItems }).commit()
  const totalPct = totalBefore > 0 ? Math.round((1 - totalAfter / totalBefore) * 100) : 0
  console.log(`✅ Updated ${event._id} with ${libraryItems.length} library items.`)
  console.log(`   Total: ${(totalBefore / 1024 / 1024).toFixed(2)}MB → ${(totalAfter / 1024 / 1024).toFixed(2)}MB (${totalPct}% smaller before upload)`)
}

main().catch((error) => {
  console.error('❌ Event library migration failed:', error)
  process.exit(1)
})
