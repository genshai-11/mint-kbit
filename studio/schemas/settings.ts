import { defineArrayMember, defineField, defineType } from 'sanity'
import { i18nString, i18nText } from './i18n'

const office = defineType({
  name: 'office',
  title: 'Office',
  type: 'object',
  fields: [
    i18nString('label', 'Label'),
    i18nString('address', 'Address'),
    i18nString('hours', 'Business Hours'),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'mapLat', title: 'Map Latitude', type: 'number' }),
    defineField({ name: 'mapLng', title: 'Map Longitude', type: 'number' }),
    defineField({ name: 'contactPerson', title: 'Contact Person', type: 'string' }),
  ],
  preview: {
    select: { title: 'label.en' },
  },
})

export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'brand', title: 'Brand' },
    { name: 'seo', title: 'SEO & Meta' },
    { name: 'stats', title: 'Stats' },
    { name: 'contact', title: 'Contact & Offices' },
    { name: 'social', title: 'Social' },
    { name: 'org', title: 'Organisation' },
  ],
  fields: [
    // Brand
    defineField({ name: 'logoLight', title: 'Logo (Light BG)', type: 'image', group: 'brand', options: { hotspot: false } }),
    defineField({ name: 'logoDark', title: 'Logo (Dark BG)', type: 'image', group: 'brand', options: { hotspot: false } }),
    defineField({ name: 'favicon', title: 'Favicon', type: 'image', group: 'brand' }),

    // SEO
    defineField({
      name: 'siteMeta',
      title: 'Site Meta',
      type: 'object',
      group: 'seo',
      fields: [
        i18nString('title', 'Site Title'),
        i18nText('description', 'Meta Description'),
        defineField({ name: 'ogImage', title: 'OG Image (1200×630)', type: 'image' }),
      ],
    }),

    // Stats
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'object',
      group: 'stats',
      fields: [
        defineField({ name: 'educationCenters', title: 'Education Centers', type: 'number' }),
        defineField({ name: 'doctors', title: 'Doctors', type: 'number' }),
        defineField({ name: 'countries', title: 'Countries', type: 'number' }),
        defineField({ name: 'members', title: 'Members', type: 'number' }),
      ],
    }),

    // Contact
    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'email', title: 'Email', type: 'string' }),
        defineField({ name: 'phoneKr', title: 'Phone (Korea)', type: 'string' }),
        defineField({ name: 'phoneVn', title: 'Phone (Vietnam)', type: 'string' }),
      ],
    }),
    defineField({
      name: 'offices',
      title: 'Offices',
      type: 'array',
      group: 'contact',
      of: [defineArrayMember({ type: 'office' })],
    }),

    // Social
    defineField({
      name: 'social',
      title: 'Social Links',
      type: 'object',
      group: 'social',
      fields: [
        defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
        defineField({ name: 'zalo', title: 'Zalo URL', type: 'url' }),
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'youtube', title: 'YouTube URL', type: 'url' }),
      ],
    }),

    // Org
    defineField({
      name: 'org',
      title: 'Organisation',
      type: 'object',
      group: 'org',
      fields: [
        defineField({ name: 'vicePresident', title: 'Vice President', type: 'string' }),
        defineField({ name: 'businessReg', title: 'Business Registration No.', type: 'string' }),
        i18nString('copyright', 'Copyright Text'),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})

export { office }
