import { defineArrayMember, defineField, defineType } from 'sanity'
import { i18nString, i18nText } from './i18n'

export const eventImage = defineType({
  name: 'eventImage',
  title: 'Event Image',
  type: 'object',
  fields: [
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    i18nString('caption', 'Caption'),
    defineField({ name: 'altText', title: 'Alt Text', type: 'string' }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number' }),
    defineField({ name: 'isCover', title: 'Is Cover', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { media: 'image', title: 'altText' },
  },
})

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'details', title: 'Details' },
    { name: 'media', title: 'Media' },
    { name: 'seo', title: 'SEO' },
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
    i18nText('description', 'Description'),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
    }),
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({ type: 'eventImage' })],
    }),
    defineField({
      name: 'startAt',
      title: 'Start Date & Time',
      type: 'datetime',
      group: 'details',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'endAt',
      title: 'End Date & Time',
      type: 'datetime',
      group: 'details',
    }),
    defineField({
      name: 'additionalDates',
      title: 'Additional Dates',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'datetime' })],
    }),
    i18nString('location', 'Location'),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'details',
      options: { list: ['upcoming', 'past'], layout: 'radio' },
      initialValue: 'upcoming',
      validation: (R) => R.required(),
    }),
    defineField({ name: 'isFeatured', title: 'Featured', type: 'boolean', group: 'details', initialValue: false }),
    defineField({ name: 'registrationOpen', title: 'Registration Open', type: 'boolean', group: 'details', initialValue: false }),
    defineField({ name: 'fee', title: 'Fee (USD)', type: 'number', group: 'details' }),
    defineField({ name: 'capacity', title: 'Capacity', type: 'number', group: 'details' }),
    defineField({ name: 'seatsLeft', title: 'Seats Left', type: 'number', group: 'details' }),
    defineField({ name: 'language', title: 'Language', type: 'string', group: 'details' }),
    defineField({ name: 'targetAudience', title: 'Target Audience', type: 'string', group: 'details' }),
    defineField({
      name: 'speakerSlugs',
      title: 'Speaker Slugs',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({ name: 'sourceId', title: 'Source ID (legacy)', type: 'number', group: 'seo', readOnly: true }),
  ],
  preview: {
    select: { title: 'title.en', subtitle: 'status', media: 'coverImage' },
    prepare({ title, subtitle, media }) {
      return { title: title ?? 'Untitled', subtitle, media }
    },
  },
  orderings: [
    { title: 'Start Date (newest)', name: 'startAtDesc', by: [{ field: 'startAt', direction: 'desc' }] },
  ],
})
