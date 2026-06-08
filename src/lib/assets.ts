import manifestRaw from '../../data/assets-opt/manifest.json'

type Manifest = Record<string, {
  src: string
  variants: Record<string, string>
  originalWidth: number
}>

const manifest = manifestRaw as Manifest

function toKey(path: string): string {
  return path.replace(/^(\.\/)?data\/assets\//, '').replace(/\\/g, '/')
}

export function assetSrcSet(path: string): string {
  const entry = manifest[toKey(path)]
  if (!entry) return ''
  const pairs = Object.entries(entry.variants)
    .filter(([k]) => k !== 'default' && k.endsWith('w'))
    .map(([w, p]) => `/data/assets-opt/${p} ${w}`)
  return pairs.join(', ')
}

export function assetSrc(path: string, width: '400w' | '800w' | '1200w' | '1600w' | 'default' = 'default'): string {
  const entry = manifest[toKey(path)]
  if (!entry) return ''
  const variant = entry.variants[width] ?? entry.variants['default']
  return variant ? `/data/assets-opt/${variant}` : ''
}
