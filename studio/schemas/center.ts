import { defineArrayMember, defineField, defineType } from 'sanity'
import { i18nString } from './i18n'

const centerImage = defineType({
  name: 'centerImage',
  title: 'Center Image',
  type: 'object',
  fields: [
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'altText', title: 'Alt Text', type: 'string' }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number' }),
  ],
  preview: {
    select: { media: 'image', title: 'altText' },
  },
})

export const center = defineType({
  name: 'center',
  title: 'Center',
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
    i18nString('address', 'Address'),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'hours', title: 'Business Hours', type: 'string' }),
    defineField({ name: 'lat', title: 'Latitude', type: 'number' }),
    defineField({ name: 'lng', title: 'Longitude', type: 'number' }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [defineArrayMember({ type: 'centerImage' })],
    }),
    defineField({
      name: 'facilities',
      title: 'Facilities',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({ name: 'isActive', title: 'Active', type: 'boolean', initialValue: true }),
    defineField({ name: 'sourceId', title: 'Source ID (legacy)', type: 'number', readOnly: true }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'address.en', media: 'images.0.image' },
  },
})

export { centerImage }
