import { defineType, defineField, defineArrayMember } from 'sanity'
import { i18nString } from './i18n'

export default defineType({
  name: 'resource',
  title: 'Resource / Document',
  type: 'document',
  fields: [
    i18nString('title', 'Title'),
    i18nString('description', 'Description'),
    defineField({ name: 'file', title: 'File', type: 'file', validation: r => r.required() }),
    defineField({ name: 'thumbnail', title: 'Thumbnail', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: { list: [
        { title: 'Course Material',   value: 'course_material' },
        { title: 'Clinical Protocol', value: 'clinical_protocol' },
        { title: 'Certificate',       value: 'certificate' },
        { title: 'Template / Form',   value: 'template' },
        { title: 'Other',             value: 'other' },
      ]},
      initialValue: 'other',
    }),
    defineField({
      name: 'accessTiers',
      title: 'Access — Membership Tiers',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { list: [
        { title: 'Standard',     value: 'standard' },
        { title: 'Professional', value: 'professional' },
        { title: 'Strategic',    value: 'strategic' },
      ]},
      validation: r => r.required().min(1),
    }),
    defineField({ name: 'sortOrder', type: 'number', title: 'Sort Order', initialValue: 99 }),
    defineField({ name: 'isPublished', type: 'boolean', title: 'Published', initialValue: false }),
  ],
  preview: {
    select: { title: 'title.en', media: 'thumbnail', cat: 'category' },
    prepare: ({ title, media, cat }) => ({ title: title ?? 'Untitled', subtitle: cat, media }),
  },
})
