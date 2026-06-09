import { defineField } from 'sanity'

const LOCALES = [
  { name: 'en', title: 'English' },
  { name: 'vi', title: 'Tiếng Việt' },
  { name: 'ko', title: '한국어' },
]

export function i18nString(fieldName: string, title: string) {
  return defineField({
    name: fieldName,
    title,
    type: 'object',
    options: { collapsible: true, collapsed: false },
    fields: LOCALES.map(({ name, title: localeTitle }) =>
      defineField({ name, title: localeTitle, type: 'string' })
    ),
  })
}

export function i18nText(fieldName: string, title: string) {
  return defineField({
    name: fieldName,
    title,
    type: 'object',
    options: { collapsible: true, collapsed: true },
    fields: LOCALES.map(({ name, title: localeTitle }) =>
      defineField({ name, title: localeTitle, type: 'text', rows: 5 })
    ),
  })
}

export function i18nHtml(fieldName: string, title: string) {
  return defineField({
    name: fieldName,
    title,
    type: 'object',
    options: { collapsible: true, collapsed: true },
    fields: LOCALES.map(({ name, title: localeTitle }) =>
      defineField({ name, title: localeTitle, type: 'text', rows: 12 })
    ),
  })
}
