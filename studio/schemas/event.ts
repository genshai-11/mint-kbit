import { defineArrayMember, defineField, defineType } from 'sanity'
import { i18nString, i18nText } from './i18n'

export const eventProgramEntry = defineType({
  name: 'eventProgramEntry',
  title: 'Program Entry',
  type: 'object',
  fields: [
    defineField({ name: 'startTime', title: 'Start Time', type: 'string', description: 'Use HH:MM, e.g. 09:30.' }),
    defineField({ name: 'endTime', title: 'End Time', type: 'string', description: 'Optional HH:MM, e.g. 10:15.' }),
    i18nString('title', 'Session Title'),
    i18nString('speaker', 'Speaker / Tutor'),
    i18nText('details', 'Details'),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number' }),
  ],
  preview: {
    select: { title: 'title.en', startTime: 'startTime', endTime: 'endTime', speaker: 'speaker.en' },
    prepare({ title, startTime, endTime, speaker }) {
      const time = [startTime, endTime].filter(Boolean).join(' – ')
      return { title: title ?? 'Program entry', subtitle: [time, speaker].filter(Boolean).join(' · ') }
    },
  },
})

export const eventProgramSection = defineType({
  name: 'eventProgramSection',
  title: 'Program Section',
  type: 'object',
  fields: [
    i18nString('title', 'Section Title'),
    i18nText('intro', 'Section Notes'),
    defineField({
      name: 'entries',
      title: 'Agenda Entries',
      type: 'array',
      of: [defineArrayMember({ type: 'eventProgramEntry' })],
    }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number' }),
  ],
  preview: {
    select: { title: 'title.en', entries: 'entries' },
    prepare({ title, entries }) {
      const count = Array.isArray(entries) ? entries.length : 0
      return { title: title ?? 'Program section', subtitle: `${count} agenda entries` }
    },
  },
})

export const eventLibraryItem = defineType({
  name: 'eventLibraryItem',
  title: 'Event Library Item',
  type: 'object',
  fields: [
    defineField({ name: 'kind', title: 'Kind', type: 'string', options: { list: ['program', 'photo', 'material', 'document'], layout: 'radio' }, initialValue: 'photo' }),
    i18nString('title', 'Title'),
    i18nText('description', 'Description'),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'file', title: 'File', type: 'file' }),
    defineField({ name: 'altText', title: 'Alt Text', type: 'string' }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number' }),
  ],
  preview: {
    select: { media: 'image', title: 'title.en', subtitle: 'kind' },
    prepare({ title, subtitle, media }) {
      return { title: title ?? 'Library item', subtitle, media }
    },
  },
})

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
    { name: 'program', title: 'Program Agenda' },
    { name: 'library', title: 'Scenes / Library' },
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
    i18nString('title', 'Title', 'content'),
    i18nText('description', 'Description / intro', 'content'),
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
    i18nString('location', 'Location', 'details'),
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
    defineField({
      name: 'programSections',
      title: 'Program Agenda',
      type: 'array',
      group: 'program',
      description: 'Structured agenda shown in the Clinical agenda and event notes section. Use Description only as a short intro/fallback.',
      of: [defineArrayMember({ type: 'eventProgramSection' })],
    }),
    defineField({
      name: 'libraryItems',
      title: 'Scenes / Program Photos',
      type: 'array',
      group: 'library',
      description: 'Program photos shown as image-only tiles in the Scenes from the program section.',
      of: [defineArrayMember({ type: 'eventLibraryItem' })],
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
