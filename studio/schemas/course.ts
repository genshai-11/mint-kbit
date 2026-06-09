import { defineType, defineField, defineArrayMember } from 'sanity'
import { i18nString } from './i18n'

export default defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  fields: [
    defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title.en' }, validation: r => r.required() }),
    i18nString('title', 'Title'),
    i18nString('description', 'Description'),
    defineField({ name: 'coverImage', type: 'image', title: 'Cover Image', options: { hotspot: true } }),
    defineField({
      name: 'accessTiers',
      title: 'Access — Membership Tiers',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { list: [
        { title: 'Standard',    value: 'standard' },
        { title: 'Professional', value: 'professional' },
        { title: 'Strategic',   value: 'strategic' },
      ]},
      validation: r => r.required().min(1),
    }),
    defineField({
      name: 'lessons',
      title: 'Lessons',
      type: 'array',
      of: [defineArrayMember({ type: 'lesson' })],
    }),
    defineField({ name: 'sortOrder', type: 'number', title: 'Sort Order', initialValue: 99 }),
    defineField({ name: 'isPublished', type: 'boolean', title: 'Published', initialValue: false }),
  ],
  preview: {
    select: { title: 'title.en', media: 'coverImage', tiers: 'accessTiers' },
    prepare: ({ title, media, tiers }) => ({
      title: title ?? 'Untitled Course',
      subtitle: (tiers ?? []).join(', '),
      media,
    }),
  },
})
