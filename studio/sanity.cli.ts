import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? 'q9mwbl6e'
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: 'kbit',
})
