import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID!
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production'

export default defineConfig({
  name: 'kbit-studio',
  title: 'KBIT CMS',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('KBIT Content')
          .items([
            S.listItem()
              .title('Events')
              .child(S.documentTypeList('event').title('Events')),
            S.listItem()
              .title('News')
              .child(S.documentTypeList('news').title('News')),
            S.divider(),
            S.listItem()
              .title('Home Hero')
              .child(S.document().schemaType('homeHero').documentId('homeHero').title('Home Hero')),
            S.listItem()
              .title('Site Settings')
              .child(S.document().schemaType('settings').documentId('siteSettings').title('Site Settings')),
            S.divider(),
            S.listItem()
              .title('Pages')
              .child(S.documentTypeList('page').title('Pages')),
            S.listItem()
              .title('Experts')
              .child(S.documentTypeList('expert').title('Experts')),
            S.listItem()
              .title('Partners')
              .child(S.documentTypeList('partner').title('Partners')),
            S.listItem()
              .title('Centers')
              .child(S.documentTypeList('center').title('Centers')),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
})
