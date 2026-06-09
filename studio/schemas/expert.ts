import { defineArrayMember, defineField, defineType } from 'sanity'
import { i18nString, i18nText } from './i18n'

const certification = defineType({
  name: 'certification',
  title: 'Certification',
  type: 'object',
  fields: [
    i18nString('name', 'Name'),
    defineField({ name: 'issuer', title: 'Issuer', type: 'string' }),
    defineField({ name: 'year', title: 'Year', type: 'number' }),
  ],
})

export const expert = defineType({
  name: 'expert',
  title: 'Expert',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 80 },
      validation: (R) => R.required(),
    }),
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (R) => R.required() }),
    i18nString('title', 'Title / Role'),
    defineField({ name: 'avatar', title: 'Avatar', type: 'image', options: { hotspot: true } }),
    i18nText('bio', 'Bio'),
    defineField({
      name: 'specialties',
      title: 'Specialties',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      of: [defineArrayMember({ type: 'certification' })],
    }),
    defineField({ name: 'region', title: 'Region / City', type: 'string' }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number', initialValue: 99 }),
    defineField({ name: 'isActive', title: 'Active', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'title.en', media: 'avatar' },
  },
  orderings: [
    { title: 'Sort Order', name: 'sortOrderAsc', by: [{ field: 'sortOrder', direction: 'asc' }] },
  ],
})

export { certification }
