import { defineArrayMember, defineField, defineType } from 'sanity'
import { i18nString, i18nText } from './i18n'

export const localizedListItem = defineType({
  name: 'localizedListItem',
  title: 'Localized List Item',
  type: 'object',
  fields: [i18nString('text', 'Text')],
  preview: { select: { title: 'text.en' } },
})

export const membershipType = defineType({
  name: 'membershipType',
  title: 'Membership Type',
  type: 'object',
  fields: [
    defineField({ name: 'id', title: 'ID', type: 'string', validation: (R) => R.required() }),
    i18nString('title', 'Title'),
    i18nString('subtitle', 'Subtitle'),
    i18nText('description', 'Description'),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [defineArrayMember({ type: 'localizedListItem' })],
    }),
  ],
  preview: { select: { title: 'title.en', subtitle: 'subtitle.en' } },
})

export const membershipBenefitGroup = defineType({
  name: 'membershipBenefitGroup',
  title: 'Membership Benefit Group',
  type: 'object',
  fields: [
    defineField({ name: 'id', title: 'ID', type: 'string', validation: (R) => R.required() }),
    i18nString('title', 'Title'),
    defineField({
      name: 'items',
      title: 'Benefit Items',
      type: 'array',
      of: [defineArrayMember({ type: 'localizedListItem' })],
    }),
  ],
  preview: { select: { title: 'title.en' } },
})

export const membershipRequirementItem = defineType({
  name: 'membershipRequirementItem',
  title: 'Membership Requirement Item',
  type: 'object',
  fields: [
    i18nString('title', 'Title'),
    defineField({
      name: 'points',
      title: 'Points',
      type: 'array',
      of: [defineArrayMember({ type: 'localizedListItem' })],
    }),
  ],
  preview: { select: { title: 'title.en' } },
})

export const membershipSpecificRequirement = defineType({
  name: 'membershipSpecificRequirement',
  title: 'Specific Membership Requirement',
  type: 'object',
  fields: [
    i18nString('name', 'Membership Name'),
    defineField({
      name: 'points',
      title: 'Points',
      type: 'array',
      of: [defineArrayMember({ type: 'localizedListItem' })],
    }),
  ],
  preview: { select: { title: 'name.en' } },
})

export const membershipPackage = defineType({
  name: 'membershipPackage',
  title: 'Membership Package',
  type: 'object',
  fields: [
    i18nString('duration', 'Duration'),
    defineField({ name: 'price', title: 'Price', type: 'string' }),
  ],
  preview: { select: { title: 'duration.en', subtitle: 'price' } },
})

export const membershipFeeTier = defineType({
  name: 'membershipFeeTier',
  title: 'Membership Fee Tier',
  type: 'object',
  fields: [
    defineField({ name: 'id', title: 'ID', type: 'string', validation: (R) => R.required() }),
    i18nString('name', 'Name'),
    i18nText('audience', 'Audience'),
    defineField({
      name: 'packages',
      title: 'Packages',
      type: 'array',
      of: [defineArrayMember({ type: 'membershipPackage' })],
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'array',
      of: [defineArrayMember({ type: 'localizedListItem' })],
    }),
    defineField({
      name: 'lifeBenefits',
      title: 'Life Benefits',
      type: 'array',
      of: [defineArrayMember({ type: 'localizedListItem' })],
    }),
  ],
  preview: { select: { title: 'name.en', subtitle: 'id' } },
})

export const membershipRegistrationForm = defineType({
  name: 'membershipRegistrationForm',
  title: 'Membership Registration Form',
  type: 'object',
  fields: [
    defineField({ name: 'id', title: 'ID', type: 'string', validation: (R) => R.required() }),
    i18nString('title', 'Title'),
    defineField({ name: 'filePath', title: 'Local Fallback Path', type: 'string' }),
    defineField({ name: 'file', title: 'Sanity File', type: 'file' }),
  ],
  preview: { select: { title: 'title.en', subtitle: 'filePath' } },
})

export const membershipProgram = defineType({
  name: 'membershipProgram',
  title: 'Membership Program',
  type: 'document',
  groups: [
    { name: 'structure', title: 'Structure' },
    { name: 'benefits', title: 'Benefits' },
    { name: 'requirements', title: 'Requirements' },
    { name: 'fees', title: 'Fees' },
    { name: 'forms', title: 'Forms' },
  ],
  fields: [
    defineField({
      name: 'membershipInfo',
      title: 'Membership Structure',
      type: 'object',
      group: 'structure',
      fields: [
        i18nString('tab', 'Tab Label'),
        i18nString('title', 'Title'),
        defineField({
          name: 'types',
          title: 'Types',
          type: 'array',
          of: [defineArrayMember({ type: 'membershipType' })],
          validation: (R) => R.min(1),
        }),
      ],
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'object',
      group: 'benefits',
      fields: [
        i18nString('title', 'Title'),
        defineField({
          name: 'groups',
          title: 'Groups',
          type: 'array',
          of: [defineArrayMember({ type: 'membershipBenefitGroup' })],
        }),
      ],
    }),
    defineField({
      name: 'requirements',
      title: 'Requirements',
      type: 'object',
      group: 'requirements',
      fields: [
        i18nString('tab', 'Tab Label'),
        defineField({
          name: 'general',
          title: 'General Requirements',
          type: 'object',
          fields: [
            i18nString('title', 'Title'),
            i18nText('intro', 'Intro'),
            defineField({
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [defineArrayMember({ type: 'membershipRequirementItem' })],
            }),
          ],
        }),
        defineField({
          name: 'specific',
          title: 'Specific Requirements',
          type: 'array',
          of: [defineArrayMember({ type: 'membershipSpecificRequirement' })],
        }),
        defineField({
          name: 'steps',
          title: 'Registration Steps',
          type: 'array',
          of: [defineArrayMember({ type: 'localizedListItem' })],
        }),
      ],
    }),
    defineField({
      name: 'fees',
      title: 'Fees',
      type: 'object',
      group: 'fees',
      fields: [
        i18nString('tab', 'Tab Label'),
        i18nString('title', 'Title'),
        defineField({
          name: 'tiers',
          title: 'Tiers',
          type: 'array',
          of: [defineArrayMember({ type: 'membershipFeeTier' })],
        }),
        defineField({
          name: 'limitPolicy',
          title: 'Lifetime Package Limitation Policy',
          type: 'object',
          fields: [
            i18nString('title', 'Title'),
            defineField({
              name: 'releases',
              title: 'Releases',
              type: 'array',
              of: [defineArrayMember({ type: 'localizedListItem' })],
            }),
            i18nText('note', 'Note'),
          ],
        }),
      ],
    }),
    defineField({
      name: 'registrationForms',
      title: 'Registration Forms',
      type: 'object',
      group: 'forms',
      fields: [
        i18nString('tab', 'Tab Label'),
        i18nString('title', 'Title'),
        i18nText('description', 'Description'),
        defineField({
          name: 'forms',
          title: 'Forms',
          type: 'array',
          of: [defineArrayMember({ type: 'membershipRegistrationForm' })],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Membership Program', subtitle: 'Public membership content and registration forms' }
    },
  },
})
