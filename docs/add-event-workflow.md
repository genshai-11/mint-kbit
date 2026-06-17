# Add Event Workflow — Sanity Studio → Website Auto-Sync

## Goal

Publish an event in Sanity Studio and have it appear on the website automatically after refresh, without editing `data/seed/*.json`.

## Before adding events

Confirm these commands pass locally:

```bash
npm run build
npm run studio:build
npm run sanity:smoke
```

Confirm Sanity CORS includes the frontend origin:

- `http://localhost:5173`
- Vercel preview domain
- production domain

## Image rules

For migrated seed assets, run:

```bash
npm run optimize-images
npm run migrate-sanity
```

The migration uploads optimized WebP files from `data/assets-opt/` before raw assets.

For new manual Studio uploads:

- Prefer compressed JPG/WebP under 2 MB when possible.
- Use landscape cover images for event cards and hero.
- Add alt text for every gallery image.
- Sanity CDN will generate responsive WebP URLs for the public site.

## Create or edit an event

1. Open Sanity Studio:

   ```bash
   npm run studio
   ```

2. Go to **Event**.
3. Create a new event or edit an existing event.
4. Fill required fields:
   - Slug
   - Title: EN, VI, KO
   - Description: EN, VI, KO
   - Start date/time
   - Location: EN, VI, KO
   - Status: upcoming or past
   - Cover image
5. Add gallery images in **Gallery Images**:
   - Image
   - Alt text
   - Sort order
   - Mark only cover image as `isCover` if needed
6. Publish.

## Verify website sync

Run local website:

```bash
npm run dev
```

Check:

- `/en/events`
- `/vi/events`
- `/ko/events`
- `/en/events/{slug}`
- `/vi/events/{slug}`
- `/ko/events/{slug}`

Expected behavior:

- New event appears in Events list.
- Event detail loads by slug.
- Event Gallery renders from Sanity `images[]`.
- Cover/gallery images load from `cdn.sanity.io`.
- No `[NEEDS_TRANSLATION]` appears.

## Program Agenda

Event Detail now supports structured Sanity `programSections[]` through the **Program Agenda** tab in Studio.

Use this tab for:

- day/part/room sections
- start and end times
- localized session titles
- speakers/tutors
- session details

The website renders `programSections[]` first. If an event has no structured agenda yet, it falls back to parsing the localized Description text.

For the KAT 2025 event, the existing Description agenda was migrated into structured Program Agenda fields:

- 6 sections
- 73 entries
- migrated into both `drafts.event-12` and `event-12`

To migrate another event from Description into Program Agenda:

```bash
cd studio
npx sanity exec scripts/migrate-event-program-with-user-token.cjs --with-user-token -- event-slug
```

## Scenes / event resources

Event Detail renders Sanity `libraryItems[]` inside the existing **Scenes from the program** section. There is no separate Program Library text/card section, so resources show as clean image tiles.

Use this for:

- post-event photo libraries
- program material screenshots
- downloadable program files
- agenda/reference assets

For the KAT 2025 local folder migration, run:

```bash
npm run migrate-event-library:cli
```

This optimizes images from:

```text
library/kat-2025-1st-korea-vietnam-k-beauty-advanced-skill-training-2025
```

before upload. The first KAT run reduced 8 raw images from **55.91 MB → 1.29 MB** before uploading to Sanity.

To migrate another event library folder, pass slug and relative folder path through Sanity CLI args:

```bash
cd studio
npx sanity exec scripts/migrate-event-library-with-user-token.cjs --with-user-token -- event-slug ../library/event-slug
```

## Smoke test

After publishing, run:

```bash
npm run sanity:smoke
```

For strict membership and a specific event library:

```bash
SANITY_REQUIRE_MEMBERSHIP=true \
SANITY_EXPECT_EVENT_LIBRARY_SLUG=kat-2025-1st-korea-vietnam-k-beauty-advanced-skill-training-2025 \
SANITY_EXPECT_EVENT_PROGRAM_SLUG=kat-2025-1st-korea-vietnam-k-beauty-advanced-skill-training-2025 \
npm run sanity:smoke
```

The smoke test fails on missing event basics, missing i18n markers, or expected event scene/library assets. It warns when gallery/library alt text is missing.

## Rollback

If a bad event was published:

1. Unpublish or fix the event in Sanity Studio.
2. Refresh the website after Sanity CDN cache delay.
3. If frontend code caused the issue, revert to the previous git tag/commit and redeploy preview first.

Do not delete local seed/assets until Sanity CDN and frontend sync are verified in production.
