import { defineField, defineType } from 'sanity'

export const partner = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: false } }),
    defineField({ name: 'url', title: 'Website URL', type: 'url' }),
    defineField({
      name: 'tier',
      title: 'Tier',
      type: 'string',
      options: { list: ['platinum', 'gold', 'silver', 'general'], layout: 'radio' },
      initialValue: 'general',
    }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number', initialValue: 99 }),
    defineField({ name: 'isActive', title: 'Active', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'tier', media: 'logo' },
  },
  orderings: [
    { title: 'Sort Order', name: 'sortOrderAsc', by: [{ field: 'sortOrder', direction: 'asc' }] },
  ],
})
