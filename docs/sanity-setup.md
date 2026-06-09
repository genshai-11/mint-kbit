# Sanity Setup — KBIT

This project has a Sanity Studio in `studio/`, frontend Sanity helpers in `src/lib/sanity.ts`, and two migration paths:

- `npm run migrate-sanity` — uploads seed data plus local image assets to Sanity using a write token.
- `npm run export-sanity` — creates `kbit-migration.ndjson` for manual dataset import without image uploads.

## 1. Create / confirm Sanity project

In Sanity Manage, create or select the KBIT project and dataset:

- Project: `Kbit`
- Project ID: `q9mwbl6e`
- Dataset: `production`
- API token: Editor/write token for migration only

## 2. Configure environment files

Copy root env example:

```bash
cp .env.example .env.local
```

Fill:

```env
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_TOKEN=your_write_token
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
```

Copy Studio env example too:

```bash
cp studio/.env.example studio/.env.local
```

Fill:

```env
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
```

## 3. Configure CORS in Sanity Manage

Add the frontend origins that will query Sanity from the browser:

- `http://localhost:5173` for Vite dev
- Vercel preview/production domains when available

Allow credentials only if you later use authenticated browser requests. Current public reads use the CDN client and do not need credentials.

## 4. Run migration

Preferred full migration with image uploads:

```bash
npm run migrate-sanity
```

This reads `data/seed/*.json`, resolves legacy KBIT image URLs through `data/seed/asset-manifest.json`, uploads images to Sanity assets, and upserts documents.

To retry only selected steps without re-uploading everything, set `SANITY_MIGRATE_ONLY` to a comma-separated list:

```bash
SANITY_MIGRATE_ONLY=pages npm run migrate-sanity
```

Available steps: `experts`, `partners`, `centers`, `events`, `news`, `settings`, `homeHero`, `pages`.

Alternative local NDJSON import without image uploads:

```bash
npm run export-sanity
cd studio
npx sanity dataset import ../kbit-migration.ndjson production --replace
```

## 5. Run Studio

```bash
npm run studio
```

Build Studio locally:

```bash
npm run studio:build
```

Deploy Studio after confirming project/hostname:

```bash
npm run studio:deploy
```

## 6. Frontend notes

`src/lib/sanity.ts` contains the centralized client and GROQ queries. The current app can continue using local seed data while Sanity content is populated. Switch pages from local seed data to Sanity queries only after migration data is verified in Studio.

## Rollback / safety

- Do not delete local `data/seed/`, `data/assets/`, or `data/assets-opt/` until Sanity CDN content and frontend wiring are verified.
- If migration goes wrong, restore by re-running `npm run migrate-sanity` from the committed seed data, or import an exported Sanity dataset backup.
