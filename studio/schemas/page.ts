import { defineArrayMember, defineField, defineType } from 'sanity'
import { i18nString, i18nText } from './i18n'

const pagePillar = defineType({
  name: 'pagePillar',
  title: 'Pillar / Feature Item',
  type: 'object',
  fields: [
    defineField({ name: 'icon', title: 'Icon (Phosphor name)', type: 'string' }),
    i18nString('title', 'Title'),
    i18nText('desc', 'Description'),
  ],
})

const pageFaq = defineType({
  name: 'pageFaq',
  title: 'FAQ Item',
  type: 'object',
  fields: [
    i18nString('question', 'Question'),
    i18nText('answer', 'Answer'),
  ],
})

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'Page Key',
      type: 'string',
      description: 'Unique identifier e.g. membership, about, events, contact',
      options: { list: ['membership', 'about', 'events', 'contact', 'news', 'experts', 'centers', 'partners'] },
      validation: (R) => R.required(),
    }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    i18nString('title', 'Page Title'),
    i18nText('intro', 'Intro Text'),
    defineField({
      name: 'pillars',
      title: 'Pillars / Features',
      type: 'array',
      of: [defineArrayMember({ type: 'pagePillar' })],
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      of: [defineArrayMember({ type: 'pageFaq' })],
    }),
  ],
  preview: {
    select: { title: 'key', subtitle: 'title.en', media: 'heroImage' },
    prepare({ title, subtitle, media }) {
      return { title: `Page: ${title}`, subtitle, media }
    },
  },
})

export { pagePillar, pageFaq }
