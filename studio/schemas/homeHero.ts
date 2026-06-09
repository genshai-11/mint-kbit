import { defineArrayMember, defineField, defineType } from 'sanity'
import { i18nString } from './i18n'

const heroSlide = defineType({
  name: 'heroSlide',
  title: 'Hero Slide',
  type: 'object',
  fields: [
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: (R) => R.required() }),
    i18nString('heading', 'Heading'),
    i18nString('sub', 'Subheading'),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number' }),
  ],
  preview: {
    select: { media: 'image', title: 'heading.en' },
  },
})

export const homeHero = defineType({
  name: 'homeHero',
  title: 'Home Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      of: [defineArrayMember({ type: 'heroSlide' })],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Hero Slides' }
    },
  },
})

export { heroSlide }
