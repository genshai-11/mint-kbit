import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dir = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dir, '..')
const newsPath = resolve(ROOT, 'data/seed/news.json')
const seed = JSON.parse(await readFile(newsPath, 'utf8'))
const items = seed.data ?? []
const bySource = new Map(items.map((item) => [item.sourceId, item]))

const katEnglish = bySource.get(15)
const mouEnglish = bySource.get(12)
if (!katEnglish || !mouEnglish) throw new Error('Expected sourceId 15 and 12 news records')

const englishExcerpts = {
  15: 'K.A.T 2025 advances Korea–Vietnam medical aesthetic collaboration through training standardization and advanced technology transfer with Le Van Thinh Hospital and Korean partners.',
  13: 'K.A.T 2025 marks a new stage in Korea–Vietnam aesthetic medicine cooperation through training standardization, advanced technology transfer, and long-term institutional partnership.',
  16: 'K.A.T 2025 creates a long-term platform for Korea–Vietnam cooperation in aesthetic medicine education, technology transfer, and professional training models.',
  12: 'Le Van Thinh Hospital and KBIT signed an MOU in Seoul to expand cooperation in advanced beauty technology, professional training, and modern medical aesthetics.',
  11: 'The MOU signing ceremony between Le Van Thinh Hospital and KBIT in Seoul marked a new step in Vietnam–Korea cooperation in beauty technology and medical aesthetics.',
  14: 'The MOU between Le Van Thinh Hospital and KBIT confirmed a shared direction for training, research, and safe modern aesthetic technology development.',
}

const englishSeoDescriptions = {
  15: 'K.A.T 2025 highlights Korea–Vietnam medical aesthetic collaboration through professional training, protocol standardization, and advanced technology transfer.',
  13: 'K.A.T 2025 strengthens Korea–Vietnam collaboration in aesthetic medicine through specialized training and advanced technology transfer.',
  16: 'K.A.T 2025 builds a foundation for long-term Korea–Vietnam cooperation in aesthetic medicine education, technology transfer, and professional development.',
  12: 'Le Van Thinh Hospital and KBIT signed an MOU in Seoul to strengthen cooperation in advanced beauty technology, training, and medical aesthetics.',
  11: 'Le Van Thinh Hospital and KBIT signed an MOU in Seoul to expand cooperation in advanced beauty technology, training, and medical aesthetics.',
  14: 'Le Van Thinh Hospital and KBIT confirmed a cooperation framework for training, research, and safe modern aesthetic technology development.',
}

const englishTitles = {
  13: 'K.A.T 2025: Elevating Korea–Vietnam Medical Aesthetic Collaboration',
  16: 'K.A.T 2025: A New Leap in Korea–Vietnam Aesthetic Medicine Cooperation',
  11: 'MOU Signing Ceremony Between Le Van Thinh Hospital and KBIT Successfully Held in Korea',
  14: 'Le Van Thinh Hospital and KBIT MOU Signing Ceremony Successfully Held in Korea',
}

function ensureSeo(item) {
  item.seoMeta ??= {}
  item.seoMeta.title ??= { en: '', vi: '', ko: '' }
  item.seoMeta.description ??= { en: '', vi: '', ko: '' }
}

for (const item of items) {
  const id = item.sourceId
  if (englishExcerpts[id]) item.excerpt.en = englishExcerpts[id]
  ensureSeo(item)
  if (englishSeoDescriptions[id]) item.seoMeta.description.en = englishSeoDescriptions[id]
}

for (const id of [13, 16]) {
  const item = bySource.get(id)
  item.title.en = englishTitles[id]
  item.content.en = katEnglish.content.en
  item.seoMeta.title.en = englishTitles[id]
}

for (const id of [11, 14]) {
  const item = bySource.get(id)
  item.title.en = englishTitles[id]
  item.content.en = mouEnglish.content.en
  item.seoMeta.title.en = englishTitles[id]
}

await writeFile(newsPath, `${JSON.stringify(seed, null, 2)}\n`, 'utf8')
console.log('Fixed news EN excerpts, SEO descriptions, and EN content/title variants.')
