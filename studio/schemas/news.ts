import { defineArrayMember, defineField, defineType } from 'sanity'
import { i18nHtml, i18nString, i18nText } from './i18n'

export const newsImage = defineType({
  name: 'newsImage',
  title: 'News Image',
  type: 'object',
  fields: [
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'role', title: 'Role', type: 'string', options: { list: ['cover', 'inline-en', 'inline-vi', 'inline-ko', 'gallery'] } }),
    defineField({ name: 'isCover', title: 'Is Cover', type: 'boolean', initialValue: false }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number' }),
  ],
  preview: {
    select: { media: 'image', title: 'role' },
  },
})

export const news = defineType({
  name: 'news',
  title: 'News',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'meta', title: 'Meta' },
    { name: 'media', title: 'Media' },
  ],
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title.en', maxLength: 120 },
      validation: (R) => R.required(),
    }),
    i18nString('title', 'Title'),
    i18nText('excerpt', 'Excerpt'),
    i18nHtml('content', 'Content (HTML)'),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({ type: 'newsImage' })],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'meta',
      initialValue: 'News',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'meta',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'meta',
      options: { list: ['published', 'draft'], layout: 'radio' },
      initialValue: 'draft',
      validation: (R) => R.required(),
    }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime', group: 'meta' }),
    defineField({ name: 'viewCount', title: 'View Count', type: 'number', group: 'meta', initialValue: 0 }),
    defineField({
      name: 'seoMeta',
      title: 'SEO Meta',
      type: 'object',
      group: 'meta',
      options: { collapsible: true, collapsed: true },
      fields: [
        i18nString('title', 'SEO Title'),
        i18nText('description', 'SEO Description'),
      ],
    }),
    defineField({ name: 'sourceId', title: 'Source ID (legacy)', type: 'number', group: 'meta', readOnly: true }),
  ],
  preview: {
    select: { title: 'title.en', subtitle: 'status', media: 'coverImage' },
    prepare({ title, subtitle, media }) {
      return { title: title ?? 'Untitled', subtitle, media }
    },
  },
  orderings: [
    { title: 'Published (newest)', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
})
