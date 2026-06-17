# Sanity Setup — KBIT

This project has a Sanity Studio in `studio/`, frontend Sanity helpers in `src/lib/sanity.ts`, runtime content loaders for Events/Membership, and two migration paths:

- `npm run migrate-sanity` — uploads seed data plus optimized local image assets to Sanity using a write token.
- `npm run export-sanity` — creates `kbit-migration.ndjson` for manual dataset import without image uploads.
- `npm run sanity:smoke` — read-only check for event/gallery/library/i18n readiness and singleton presence.
- `npm run migrate-event-library:cli` — optimizes and uploads a local event library folder through the logged-in Sanity CLI account.

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

Preferred full migration with optimized image uploads:

```bash
npm run optimize-images
npm run migrate-sanity
```

This reads `data/seed/*.json`, resolves legacy KBIT image URLs through `data/seed/asset-manifest.json`, prefers optimized WebP files from `data/assets-opt/manifest.json`, uploads images/files to Sanity assets, and upserts documents.

To retry only selected steps without re-uploading everything, set `SANITY_MIGRATE_ONLY` to a comma-separated list:

```bash
SANITY_MIGRATE_ONLY=pages npm run migrate-sanity
```

Available steps: `experts`, `partners`, `centers`, `events`, `news`, `settings`, `homeHero`, `pages`, `membership`.

To migrate only membership content and registration PDFs with `SANITY_TOKEN`:

```bash
SANITY_MIGRATE_ONLY=membership npm run migrate-sanity
```

If the Sanity CLI is already logged in with a writable account, use the safer CLI-user-token path instead. This does not require storing `SANITY_TOKEN` in `.env.local`:

```bash
npm run migrate-membership:cli
```

This path also applies `studio/scripts/membership-translations.json` so the membership singleton has EN/VI/KO content.

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

`src/lib/sanity.ts` contains the centralized client and GROQ queries.

Currently wired to Sanity runtime fetch with seed fallback:

- Home event teaser
- Events listing
- Event Detail
- Event Gallery
- Membership page body, once `membershipProgram` exists

Still local-seed-first unless later cut over:

- News
- About
- Contact
- Centers
- Experts
- Footer/Nav settings

Run the smoke test after migration:

```bash
npm run sanity:smoke
```

For strict membership verification:

```bash
SANITY_REQUIRE_MEMBERSHIP=true npm run sanity:smoke
```

For event library verification:

```bash
SANITY_EXPECT_EVENT_LIBRARY_SLUG=kat-2025-1st-korea-vietnam-k-beauty-advanced-skill-training-2025 npm run sanity:smoke
```

## Event scenes/library migration

Event `libraryItems[]` are rendered on the website inside **Scenes from the program** as image-only tiles. The KAT 2025 event library folder was migrated with:

```bash
npm run migrate-event-library:cli
```

Result from first run:

- Source folder: `library/kat-2025-1st-korea-vietnam-k-beauty-advanced-skill-training-2025`
- Raw images: 8 files, 55.91 MB total
- Optimized before upload: 1.29 MB total
- Reduction: 98%
- Sanity target: `event-12.libraryItems[]`
- Website target: Event Detail `Scenes from the program`

The optimizer writes temporary WebP files under `.tmp/sanity-library-opt/`, which is git-ignored.

## Rollback / safety

- Do not delete local `data/seed/`, `data/assets/`, `data/assets-opt/`, or `library/` until Sanity CDN content and frontend wiring are verified.
- If event library migration goes wrong, rerun `npm run migrate-event-library:cli` after fixing the local folder, or remove/replace `libraryItems[]` in Sanity Studio.
- If migration goes wrong, restore by re-running `npm run migrate-sanity` from the committed seed data, or import an exported Sanity dataset backup.
