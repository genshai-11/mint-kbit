import { defineType, defineField } from 'sanity'
import { i18nString, i18nHtml } from './i18n'

export default defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'object',
  fields: [
    defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title.en' }, validation: r => r.required() }),
    i18nString('title', 'Title'),
    defineField({
      name: 'type',
      title: 'Lesson Type',
      type: 'string',
      options: { list: [
        { title: 'Video (YouTube/Vimeo embed)', value: 'video' },
        { title: 'Document / PDF',              value: 'document' },
        { title: 'Text / Article',              value: 'text' },
      ]},
      initialValue: 'video',
    }),
    defineField({ name: 'videoUrl', title: 'Video URL (YouTube / Vimeo)', type: 'url',
      hidden: ({ parent }) => parent?.type !== 'video' }),
    defineField({ name: 'file', title: 'File (PDF, DOCX, PPTX…)', type: 'file',
      hidden: ({ parent }) => parent?.type !== 'document' }),
    i18nHtml('content', 'Content'),
    defineField({ name: 'duration', title: 'Duration (minutes)', type: 'number' }),
    defineField({ name: 'sortOrder', type: 'number', title: 'Sort Order', initialValue: 99 }),
  ],
  preview: {
    select: { title: 'title.en', type: 'type' },
    prepare: ({ title, type }) => ({ title: title ?? 'Untitled Lesson', subtitle: type }),
  },
})
