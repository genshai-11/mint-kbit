/**
 * Image optimization pipeline: data/assets/ → data/assets-opt/
 * Converts all JPG/PNG to WebP at 400w, 800w, 1200w, 1600w.
 * Generates data/assets-opt/manifest.json mapping original → variants.
 * See context/07-ui-system.md and context/03-build-plan.md Phase 3.
 */

import { createRequire } from 'module'
import { readdir, mkdir, writeFile } from 'fs/promises'
import { join, dirname, relative, extname, basename } from 'path'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const sharp = require('sharp')

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC_DIR = join(ROOT, 'data', 'assets')
const OUT_DIR = join(ROOT, 'data', 'assets-opt')
const WIDTHS = [400, 800, 1200, 1600]
const QUALITY = 82
const VALID_EXTS = new Set(['.jpg', '.jpeg', '.png'])

async function getImageFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true })
  return entries
    .filter(e => e.isFile() && VALID_EXTS.has(extname(e.name).toLowerCase()))
    .map(e => join(e.parentPath ?? e.path, e.name))
}

async function processImage(srcPath, manifest) {
  const relPath = relative(SRC_DIR, srcPath)
  const ext = extname(srcPath)
  const stem = basename(srcPath, ext)
  const subdir = dirname(relPath)
  const outSubdir = join(OUT_DIR, subdir)

  await mkdir(outSubdir, { recursive: true })

  const meta = await sharp(srcPath).metadata()
  const srcWidth = meta.width ?? 9999

  const variants = {}
  for (const w of WIDTHS) {
    if (w > srcWidth) continue
    const outName = `${stem}-${w}w.webp`
    const outPath = join(outSubdir, outName)
    await sharp(srcPath)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outPath)
    variants[`${w}w`] = relative(OUT_DIR, outPath).replace(/\\/g, '/')
  }

  // Also write the largest available size as the default (no suffix)
  const defaultWidth = WIDTHS.filter(w => w <= srcWidth).at(-1) ?? srcWidth
  const defaultName = `${stem}.webp`
  const defaultPath = join(outSubdir, defaultName)
  await sharp(srcPath)
    .resize({ width: defaultWidth, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(defaultPath)
  variants['default'] = relative(OUT_DIR, defaultPath).replace(/\\/g, '/')

  const key = relPath.replace(/\\/g, '/')
  manifest[key] = { src: key, variants, originalWidth: srcWidth }
  return { path: relPath, variants: Object.keys(variants).length }
}

async function run() {
  console.log('🖼  KBIT image optimization pipeline starting…')
  console.log(`   Source: ${SRC_DIR}`)
  console.log(`   Output: ${OUT_DIR}`)
  console.log(`   Widths: ${WIDTHS.join(', ')}w | Quality: ${QUALITY}`)
  console.log('')

  await mkdir(OUT_DIR, { recursive: true })

  const files = await getImageFiles(SRC_DIR)
  console.log(`   Found ${files.length} images to process`)
  console.log('')

  const manifest = {}
  let done = 0
  let errors = 0

  for (const file of files) {
    try {
      const result = await processImage(file, manifest)
      done++
      console.log(`   ✓ [${done}/${files.length}] ${result.path} → ${result.variants} WebP variants`)
    } catch (err) {
      errors++
      console.error(`   ✗ FAILED: ${relative(SRC_DIR, file)} — ${err.message}`)
    }
  }

  const manifestPath = join(OUT_DIR, 'manifest.json')
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8')

  console.log('')
  console.log(`✅  Done: ${done} processed, ${errors} errors`)
  console.log(`   Manifest written to ${manifestPath}`)
}

run().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
